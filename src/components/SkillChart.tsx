import React, { useEffect, useMemo, useState, useId } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area
} from 'recharts';
import { Filter, TrendingUp, TrendingDown, Heart, Zap, Clock, Activity } from 'lucide-react';
import type { Player } from '../services/dataService';
import { dataService } from '../services/dataService';

interface SkillChartProps {
  player: Player;               // <-- pass the whole player (from players.json)
  playerName?: string;          // optional label; defaults to player.name
}

type MetricLabel = 'Ball Control' | 'Passing' | 'Shooting' | 'Dribbling' | 'Defending';

const LABEL_TO_JSON_KEY: Record<MetricLabel, string> = {
  'Ball Control': 'Ball Control',
  'Passing': 'passing',
  'Shooting': 'shooting',
  'Dribbling': 'Running with Ball', // map to JSON
  'Defending': '1v1',               // map to JSON
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

const TABS: Array<{
  name: MetricLabel;
  icon: React.ReactNode;
  color: string;
  teamColor: string;
  iconBgColor: string;
}> = [
  { name: 'Ball Control', icon: <TrendingUp size={16} />, color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#283630' },
  { name: 'Passing',      icon: <Heart size={16} />,      color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#283630' },
  { name: 'Shooting',     icon: <Zap size={16} />,        color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#283630' },
  { name: 'Dribbling',    icon: <Clock size={16} />,      color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#283630' },
  { name: 'Defending',    icon: <Activity size={16} />,   color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#283630' },
];

const TITLE_MAP: Record<MetricLabel, { title: string; subtitle: string }> = {
  'Ball Control': { title: 'Ball Control Mastery',     subtitle: 'Technical ball handling and control skills' },
  'Passing':      { title: 'Passing Accuracy',         subtitle: 'Precision and timing in ball distribution' },
  'Shooting':     { title: 'Shooting Precision',       subtitle: 'Accuracy and power in goal scoring' },
  'Dribbling':    { title: 'Dribbling Skills',         subtitle: 'Ball control while moving at speed' },
  'Defending':    { title: 'Defensive Mastery',        subtitle: 'Tackling, positioning, and defensive awareness' },
};

type Row = { month: string; ahmed: number; team: number };

function avg(nums: number[]): number {
  const v = nums.filter((n) => Number.isFinite(n));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}

function normalizeTo4to10(all: number[]): (v: number) => number {
  const vals = all.filter((x) => Number.isFinite(x));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (!isFinite(min) || !isFinite(max) || max === min) return () => 7;
  return (v: number) => 4 + 6 * ((v - min) / (max - min));
}

function trend(values: number[]): 'Improving' | 'Declining' | 'Stable' {
  const vals = values.filter((x) => Number.isFinite(x));
  if (vals.length < 3) return 'Stable';
  const last3 = vals.slice(-3);
  const slope = (last3[2] - last3[0]) / 2;
  if (slope > 0.05) return 'Improving';
  if (slope < -0.05) return 'Declining';
  return 'Stable';
}

const SkillChart: React.FC<SkillChartProps> = ({ player, playerName }) => {
  const [selectedSkill, setSelectedSkill] = useState<MetricLabel>('Ball Control');
  const [teamMonthly, setTeamMonthly] = useState<Record<string, Record<string, number>>>({}); // jsonKey -> month -> avg

  const uid = useId();
  const gradientId = useMemo(() => `skillAreaGradient-${uid}`, [uid]);

  // Preload team monthly averages per skill key
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mates = await dataService.getPlayersByTeam(player.teamId);
        const byKey: Record<string, Record<string, number>> = {};
        Object.values(LABEL_TO_JSON_KEY).forEach((jsonKey) => {
          const monthMap: Record<string, number> = {};
          MONTHS.forEach((m) => {
            const vals: number[] = [];
            mates.forEach((pl) => {
              const skillPerf = (pl as any)['Skill Performance'];
              const series = skillPerf?.[jsonKey];
              const v = series?.[m];
              if (typeof v === 'number') vals.push(v);
            });
            monthMap[m] = vals.length ? avg(vals) : NaN;
          });
          byKey[jsonKey] = monthMap;
        });
        if (mounted) setTeamMonthly(byKey);
      } catch {
        // ignore: chart will still render player line
      }
    })();
    return () => { mounted = false; };
  }, [player.teamId]);

  // Build chart rows for the selected skill (player + team) and normalize to 4..10
  const chartData: Row[] = useMemo(() => {
    const jsonKey = LABEL_TO_JSON_KEY[selectedSkill];
    const skillPerf = (player as any)['Skill Performance'] as Record<string, Record<string, number>> | undefined;
    const playerSeries = skillPerf?.[jsonKey] || {};

    const months = MONTHS.filter((m) => playerSeries[m] != null || teamMonthly[jsonKey]?.[m] != null);
    const last7 = months.slice(-7);

    const allRaw: number[] = [];
    last7.forEach((m) => {
      const pv = playerSeries[m];
      const tv = teamMonthly[jsonKey]?.[m];
      if (typeof pv === 'number') allRaw.push(pv);
      if (typeof tv === 'number') allRaw.push(tv);
    });

    const norm = normalizeTo4to10(allRaw.length ? allRaw : [0, 1]);

    return last7.map((m) => ({
      month: m,
      ahmed: playerSeries[m] != null ? Number(norm(playerSeries[m]).toFixed(2)) : NaN,
      team:  teamMonthly[jsonKey]?.[m] != null ? Number(norm(teamMonthly[jsonKey][m]).toFixed(2)) : NaN,
    }));
  }, [player, selectedSkill, teamMonthly]);

  const yourAvg = useMemo(() => {
    const vals = chartData.map((r) => r.ahmed).filter((v) => Number.isFinite(v));
    return vals.length ? Number(avg(vals).toFixed(2)) : 0;
  }, [chartData]);

  const teamAvg = useMemo(() => {
    const vals = chartData.map((r) => r.team).filter((v) => Number.isFinite(v));
    return vals.length ? Number(avg(vals).toFixed(2)) : 0;
  }, [chartData]);

  const yourProgressPct = Math.max(0, Math.min(100, Math.round((yourAvg / 10) * 100)));
  const teamProgressPct = Math.max(0, Math.min(100, Math.round((teamAvg / 10) * 100)));

  const improvement = useMemo(() => trend(chartData.map((r) => r.ahmed)), [chartData]);
  const improving = improvement === 'Improving';
  const declining = improvement === 'Declining';

  const tab = TABS.find((t) => t.name === selectedSkill) || TABS[0];
  const title = TITLE_MAP[selectedSkill];

  return (
    <div className="skill-analytics">
      <div className="skill-analytics-section">
        <div className="skill-assessment-section">
          <div className="assessment-header">
            <div className="assessment-title-section">
              <h3 className="assessment-title">Skill Assessment</h3>
              <p className="assessment-description">
                Track progress across technical skill performance indicators.
              </p>
            </div>
            <div className="selected-metric" style={{ color: 'var(--db-text)' }}>
              <div style={{ color: tab.color }}>{tab.icon}</div>
              <span>{title.title}</span>
            </div>
          </div>

          <div className="assessment-metrics">
            {TABS.map((skill) => (
              <button
                key={skill.name}
                className={`assessment-metric-btn ${selectedSkill === skill.name ? 'active' : ''}`}
                onClick={() => setSelectedSkill(skill.name)}
              >
                {skill.icon}
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="skill-chart">
        <div className="chart-header">
          <div className="chart-title-container">
            <div
              className="chart-icon"
              style={{ color: tab.color, backgroundColor: tab.iconBgColor }}
            >
              {tab.icon}
            </div>
            <div className="chart-title-content">
              <div className="chart-title-text">{title.title}</div>
              <div className="chart-subtitle">{title.subtitle}</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color ball-control" style={{ backgroundColor: tab.color }}></div>
              <span>{playerName || player.name}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color passing" style={{ backgroundColor: tab.teamColor }}></div>
              <span>Team</span>
            </div>
          </div>
        </div>

        <div className="metrics-summary">
          <div className="metric-card">
            <div className="metric-value" style={{ color: tab.color }}>
              {yourAvg.toFixed(2)}
            </div>
            <div className="metric-label">Your Average</div>
            <div className="progress-bar">
              <div
                className="progress-fill your-average"
                style={{ width: `${yourProgressPct}%`, backgroundColor: tab.color }}
              />
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value" style={{ color: tab.teamColor }}>
              {teamAvg.toFixed(2)}
            </div>
            <div className="metric-label">Team Average</div>
            <div className="progress-bar">
              <div
                className="progress-fill team-average"
                style={{ width: `${teamProgressPct}%`, backgroundColor: tab.teamColor }}
              />
            </div>
          </div>
        </div>

        <div className="improvement-indicator-container" style={{ textAlign: 'right', marginBottom: '16px' }}>
          <div className={`improvement-indicator ${declining ? 'declining' : improving ? 'improving' : ''}`}>
            {declining ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
            <span>{improvement}</span>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#666' }} />
              <YAxis stroke="#666" tick={{ fill: '#666' }} domain={[4, 10]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--db-card)', border: '1px solid var(--db-border)', borderRadius: '8px', color: 'var(--db-text)' }}
              />
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={tab.color} stopOpacity={0.3} />
                  <stop offset="70%" stopColor={tab.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              {/* Keep your visuals: area for player, line for team */}
              <Area type="monotone" dataKey="ahmed" stroke="none" fill={`url(#${gradientId})`} stackId="1" />
              <Line type="monotone" dataKey="ahmed" stroke={tab.color} strokeWidth={2} dot={{ fill: tab.color, strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="team"  stroke={tab.teamColor} strokeWidth={2} dot={{ fill: tab.teamColor, strokeWidth: 2, r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SkillChart;
