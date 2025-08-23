import React from 'react';
import { Filter, Zap, Target, Circle, Send } from 'lucide-react';
import type { Player } from '../services/dataService';

interface Props {
  player: Player;                 // <-- now required
  periodLabel?: string;           // optional header label
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

function buildSkillCardsFromPlayer(player: Player) {
  // Your JSON uses a key with a space: "Skill Performance"
  const skillPerf = (player as any)['Skill Performance'] as
    | Record<string, Record<string, number>>
    | undefined;

  if (!skillPerf) {
    // Fallback to your existing static values if player has no data
    return [
      { title: 'Ball Control', icon: <Circle size={16} />, value: '6/10', subtitle: 'Average Rating' },
      { title: 'Passing', icon: <Send size={16} />, value: '6/10', subtitle: 'Average Rating' },
      { title: '1v1', icon: <Target size={16} />, value: '6/10', subtitle: 'Average Rating' },
      { title: 'Dribbling', icon: <Zap size={16} />, value: '6/10', subtitle: 'Average Rating' },
      { title: 'Shooting', icon: <Target size={16} />, value: '6/10', subtitle: 'Average Rating' }
    ];
  }

  // Define the mapping from UI labels to JSON keys
  const spec: Record<
    string,
    { icon: React.ReactNode; jsonKey: string }
  > = {
    'Ball Control': { icon: <Circle size={16} />, jsonKey: 'Ball Control' },
    'Passing': { icon: <Send size={16} />, jsonKey: 'passing' },
    '1v1': { icon: <Target size={16} />, jsonKey: '1v1' },
    'Dribbling': { icon: <Zap size={16} />, jsonKey: 'Running with Ball' },
    'Shooting': { icon: <Target size={16} />, jsonKey: 'shooting' }
  };

  const cards: Array<{
    title: string;
    icon: React.ReactNode;
    value: string;
    subtitle: string;
  }> = [];

  Object.entries(spec).forEach(([label, cfg]) => {
    const series = skillPerf[cfg.jsonKey];
    
    if (!series) {
      return;
    }

    // Calculate average rating from all months
    const values = MONTHS.map((m) => series[m]).filter((v): v is number => typeof v === 'number');
    
    // Normalize from 80-100 range to 0-10 scale
    const avgRating = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) / 10) : 0;

    cards.push({
      title: label,
      icon: cfg.icon,
      value: `${avgRating}/10`,
      subtitle: `Average over ${values.length} months`
    });
  });

  return cards;
}

const SkillDevelopment: React.FC<Props> = ({ player, periodLabel }) => {
  const skillMetrics = buildSkillCardsFromPlayer(player);
  const label = periodLabel || 'Sep 2024 - Aug 2025';

  // Define the skills in the same order as SkillChart
  const skills = ['Ball Control', 'Passing', '1v1', 'Dribbling', 'Shooting'];

  return (
    <div className="skill-development">
      <div className="section-header">
        <h2 className="skill-performance-title">Skill Performance</h2>
        <div className="performance-filter">
          <Filter size={16} />
          <span>{label}</span>
        </div>
      </div>

      <div className="skill-development-cards">
        {skillMetrics.map((metric, index) => (
          <div key={index} className="skill-development-card">
            <div className="skill-development-card-header">
              <div className="skill-development-card-title">{metric.title}</div>
              <div className="skill-development-card-icon">
                {metric.icon}
              </div>
            </div>
            <div className="skill-development-card-value">{metric.value}</div>
            <div className="skill-development-card-subtitle">{metric.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDevelopment; 