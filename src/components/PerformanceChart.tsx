import React, { useEffect, useMemo, useState, useId } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area
} from 'recharts';
import {
  Filter, TrendingUp, TrendingDown, Heart, Zap, Clock, Activity
} from 'lucide-react';
import type { Player } from '../services/dataService';
import { dataService } from '../services/dataService';

interface Props {
  player: Player;                 // <-- now driven by the player JSON
  playerName?: string;            // optional label (defaults to player.name)
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

/** Map the button labels to JSON keys in "Physical Performance" */
const KEY_MAP: Record<string, string> = {
  'Vertical Jump': 'Vertical Jump',
  'Broad Jump': 'Broad Jump',
  '10m Run': '10 Meter Run',
  '5-10-5': 'Five Ten Five',
  'T-Agility': 'T-Agility',
};

type MetricName = keyof typeof KEY_MAP;

const metricButtons: Array<{
  name: MetricName;
  icon: React.ReactNode;
  color: string;
  teamColor: string;
  iconBgColor: string;
}> = [
  { name: 'Vertical Jump', icon: <TrendingUp size={16} />, color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#7bffba1a' },
  { name: 'Broad Jump',    icon: <Heart size={16} />,      color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#7bffba1a' },
  { name: '10m Run',       icon: <Zap size={16} />,        color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#7bffba1a' },
  { name: '5-10-5',        icon: <Clock size={16} />,      color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#7bffba1a' },
  { name: 'T-Agility',     icon: <Activity size={16} />,   color: '#7BFFBA', teamColor: '#6728f5', iconBgColor: '#7bffba1a' },
];

type ChartRow = { month: string; ahmed: number; team: number };

function normalizeTo4to10(allValues: number[]): (v: number) => number {
  const vals = allValues.filter((v) => Number.isFinite(v));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (!isFinite(min) || !isFinite(max) || max === min) {
    return () => 7; // neutral mid if no spread
  }
  return (v: number) => 4 + 6 * ((v - min) / (max - min));
}

function avg(nums: number[]): number {
  const vals = nums.filter((n) => Number.isFinite(n));
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function trendLabel(values: number[]): 'Improving' | 'Declining' | 'Stable' {
  if (values.length < 3) return 'Stable';
  const last3 = values.slice(-3);
  const slope = (last3[2] - last3[0]) / 2;
  if (slope > 0.05) return 'Improving';
  if (slope < -0.05) return 'Declining';
  return 'Stable';
}

const TITLE_MAP: Record<MetricName, { title: string; subtitle: string }> = {
  'Vertical Jump': { title: 'Vertical Jump Height', subtitle: 'Explosive leg power and jumping ability' },
  'Broad Jump':    { title: 'Broad Jump Distance',  subtitle: 'Horizontal power and leg strength' },
  '10m Run':       { title: '10 Meter Sprint',      subtitle: 'Acceleration and explosive speed' },
  '5-10-5':        { title: 'Five Ten Five Drill',  subtitle: 'Agility and change of direction speed' },
  'T-Agility':     { title: 'T-Agility Test',       subtitle: 'Lateral movement and coordination' },
};

const PerformanceChart: React.FC<Props> = ({ player, playerName }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricName>('Vertical Jump');
  const [teamMonthly, setTeamMonthly] = useState<Record<string, Record<string, number>>>({}); // metricKey -> month -> avg

  const uid = useId();
  const gradientId = useMemo(() => `areaGradient-${uid}`, [uid]);

  // Load team monthly averages once (by metric name + month)
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const mates = await dataService.getPlayersByTeam(player.teamId);
        // Build team monthly averages for each metric we use
        const byMetric: Record<string, Record<string, number>> = {};
        (Object.values(KEY_MAP) as string[]).forEach((metricKey) => {
          const monthMap: Record<string, number> = {};
          MONTHS.forEach((m) => {
            const vals: number[] = [];
            mates.forEach((pl) => {
              const perf = (pl as any)['Physical Performance'];
              const series = perf?.[metricKey];
              const v = series?.[m];
              if (typeof v === 'number') vals.push(v);
            });
            monthMap[m] = vals.length ? avg(vals) : NaN;
          });
          byMetric[metricKey] = monthMap;
        });
        if (isMounted) setTeamMonthly(byMetric);
      } catch {
        // best-effort; if it fails, team line will be empty
      }
    })();

    return () => { isMounted = false; };
  }, [player.teamId]);

  // Build the chart rows from player + team for the selected metric
  const chartData: ChartRow[] = useMemo(() => {
    const metricKey = KEY_MAP[selectedMetric];
    const perf = (player as any)['Physical Performance'] as Record<string, Record<string, number>> | undefined;
    const playerSeries = perf?.[metricKey] || {};

    // Use the last 7 months that actually exist, default to chronological order
    const monthsInOrder = MONTHS.filter((m) => playerSeries[m] != null || teamMonthly[metricKey]?.[m] != null);
    const last7 = monthsInOrder.slice(-7);

    // Collect all raw values for normalization
    const rawAll: number[] = [];
    last7.forEach((m) => {
      const pv = playerSeries[m];
      const tv = teamMonthly[metricKey]?.[m];
      if (typeof pv === 'number') rawAll.push(pv);
      if (typeof tv === 'number') rawAll.push(tv);
    });

    const norm = normalizeTo4to10(rawAll.length ? rawAll : [0, 1]); // safe default

    return last7.map((m) => ({
      month: m,
      ahmed: playerSeries[m] != null ? Number(norm(playerSeries[m]).toFixed(2)) : NaN,
      team:  teamMonthly[metricKey]?.[m] != null ? Number(norm(teamMonthly[metricKey][m]).toFixed(2)) : NaN,
    }));
  }, [player, selectedMetric, teamMonthly]);

  // Summary blocks (averages/progress + improvement state) from normalized chart values
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

  const improvement = useMemo(() => trendLabel(chartData.map((r) => r.ahmed).filter((v) => Number.isFinite(v))), [chartData]);
  const improving = improvement === 'Improving';
  const declining = improvement === 'Declining';

  const currentBtn = metricButtons.find((m) => m.name === selectedMetric) || metricButtons[0];
  const title = TITLE_MAP[selectedMetric];

  return (
    <div className="performance-analytics">
      {/* Performance Analytics Section */}
      <div className="performance-analytics-section">
        <div className="analytics-header">
          <div className="analytics-title-section">
            <div className="analytics-subtitle">Performance Charts</div>
          </div>
          <div className="analytics-filter">
            <Filter size={16} />
            <span>Filtered Data</span>
          </div>
        </div>

        {/* Physical Assessment Section */}
        <div className="physical-assessment-section">
          <div className="assessment-header">
            <div className="assessment-title-section">
              <h3 className="assessment-title1">Physical Assessment</h3>
              <p className="assessment-description">
                Track progress across physical assessment performance indicators.
              </p>
            </div>
            <div className="selected-metric" style={{ color: 'var(--db-text)' }}>
              <div style={{ color: currentBtn.color }}>
                {currentBtn.icon}
              </div>
              <span>{title.title}</span>
            </div>
          </div>

          {/* Physical Assessment Metrics */}
          <div className="assessment-metrics">
            {metricButtons.map((metric) => (
              <button
                key={metric.name}
                className={`assessment-metric-btn ${selectedMetric === metric.name ? 'active' : ''}`}
                onClick={() => setSelectedMetric(metric.name)}
              >
                {metric.icon}
                <span>{metric.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Section */}
      <div className="performance-chart">
        <div className="chart-header">
          <div className="chart-title-container">
            <div
              className="chart-icon"
              style={{ color: currentBtn.color, backgroundColor: currentBtn.iconBgColor }}
            >
              {currentBtn.icon}
            </div>
            <div className="chart-title-content">
              <div className="chart-title-text">{title.title}</div>
              <div className="chart-subtitle">{title.subtitle}</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color ahmed" style={{ backgroundColor: currentBtn.color }}></div>
              <span>{playerName || player.name}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color team" style={{ backgroundColor: currentBtn.teamColor }}></div>
              <span>Team</span>
            </div>
          </div>
        </div>

        <div className="metrics-summary">
          <div className="metric-card">
            <div className="metric-value" style={{ color: currentBtn.color }}>
              {yourAvg.toFixed(2)}
            </div>
            <div className="metric-label">Your Average</div>
            <div className="progress-bar">
              <div
                className="progress-fill your-average"
                style={{ width: `${yourProgressPct}%`, backgroundColor: currentBtn.color }}
              />
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value" style={{ color: currentBtn.teamColor }}>
              {teamAvg.toFixed(2)}
            </div>
            <div className="metric-label">Team Average</div>
            <div className="progress-bar">
              <div
                className="progress-fill team-average"
                style={{ width: `${teamProgressPct}%`, backgroundColor: currentBtn.teamColor }}
              />
            </div>
          </div>
        </div>

        {/* Improvement Indicator */}
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
                  <stop offset="0%"  stopColor={currentBtn.color}     stopOpacity={0.3} />
                  <stop offset="70%" stopColor={currentBtn.color}     stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <Area type="monotone" dataKey="ahmed" stroke="none" fill={`url(#${gradientId})`} stackId="1" />
              <Line type="monotone" dataKey="ahmed" stroke={currentBtn.color} strokeWidth={2} dot={{ fill: currentBtn.color, strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="team"  stroke={currentBtn.teamColor} strokeWidth={2} dot={{ fill: currentBtn.teamColor, strokeWidth: 2, r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
