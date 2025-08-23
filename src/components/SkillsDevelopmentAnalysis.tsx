import React, { useState } from 'react';
import { Filter, TrendingUp, TrendingDown } from 'lucide-react';
import type { Player } from '../services/dataService';

interface Props {
  player: Player;                 // <-- now required
  periodLabel?: string;           // optional header label
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

function buildSkillDataFromPlayer(player: Player) {
  // Your JSON uses a key with a space: "Skill Performance"
  const skillPerf = (player as any)['Skill Performance'] as
    | Record<string, Record<string, number>>
    | undefined;

  if (!skillPerf) {
    // Fallback to your existing static values if player has no data
    return {
      'Ball Control': {
        title: 'Ball Control',
        current: 6.0,
        lastBest: 6.0,
        consistency: 6.0,
        currentProgress: 60,
        lastBestProgress: 60,
        consistencyProgress: 60,
        improvement: '0%',
        improvementType: 'stable' as const,
        summary: 'No data available'
      },
      'Passing': {
        title: 'Passing',
        current: 6.0,
        lastBest: 6.0,
        consistency: 6.0,
        currentProgress: 60,
        lastBestProgress: 60,
        consistencyProgress: 60,
        improvement: '0%',
        improvementType: 'stable' as const,
        summary: 'No data available'
      },
      '1v1': {
        title: '1v1',
        current: 6.0,
        lastBest: 6.0,
        consistency: 6.0,
        currentProgress: 60,
        lastBestProgress: 60,
        consistencyProgress: 60,
        improvement: '0%',
        improvementType: 'stable' as const,
        summary: 'No data available'
      },
      'Dribbling': {
        title: 'Dribbling',
        current: 6.0,
        lastBest: 6.0,
        consistency: 6.0,
        currentProgress: 60,
        lastBestProgress: 60,
        consistencyProgress: 60,
        improvement: '0%',
        improvementType: 'stable' as const,
        summary: 'No data available'
      },
      'Shooting': {
        title: 'Shooting',
        current: 6.0,
        lastBest: 6.0,
        consistency: 6.0,
        currentProgress: 60,
        lastBestProgress: 60,
        consistencyProgress: 60,
        improvement: '0%',
        improvementType: 'stable' as const,
        summary: 'No data available'
      }
    };
  }

  // Define the mapping from UI labels to JSON keys
  const spec: Record<
    string,
    { jsonKey: string }
  > = {
    'Ball Control': { jsonKey: 'Ball Control' },
    'Passing': { jsonKey: 'passing' },
    '1v1': { jsonKey: '1v1' },
    'Dribbling': { jsonKey: 'Running with Ball' },
    'Shooting': { jsonKey: 'shooting' }
  };

  const skillData: Record<string, {
    title: string;
    current: number;
    lastBest: number;
    consistency: number;
    currentProgress: number;
    lastBestProgress: number;
    consistencyProgress: number;
    improvement: string;
    improvementType: 'improving' | 'declining' | 'stable';
    summary: string;
  }> = {};

  Object.entries(spec).forEach(([label, cfg]) => {
    const series = skillPerf[cfg.jsonKey];
    
    if (!series) {
      return;
    }

    // Get all values for the skill
    const values = MONTHS.map((m) => series[m]).filter((v): v is number => typeof v === 'number');
    
    if (values.length === 0) {
      return;
    }

    const current = values[values.length - 1];
    const lastBest = Math.max(...values);
    const avgRating = values.reduce((a, b) => a + b, 0) / values.length;

    // Normalize from 80-100 range to 0-10 scale
    const normalizedCurrent = Math.round((current / 10) * 10) / 10;
    const normalizedLastBest = Math.round((lastBest / 10) * 10) / 10;

    // Calculate consistency using normalized values (0-10 scale) for more accurate results
    const normalizedValues = values.map(v => v / 10); // Convert all values to 0-10 scale
    const normalizedMean = normalizedValues.reduce((a, b) => a + b, 0) / normalizedValues.length;
    const normalizedVariance = normalizedValues.reduce((sum, val) => sum + Math.pow(val - normalizedMean, 2), 0) / normalizedValues.length;
    const normalizedStdDev = Math.sqrt(normalizedVariance);
    
    // CV = standard deviation / mean (as percentage)
    // We want to invert this so higher percentage = more consistent
    const cv = normalizedMean > 0 ? (normalizedStdDev / normalizedMean) * 100 : 0;
    
    // Convert CV to consistency percentage (0-100)
    // CV of 0% = perfect consistency (100%)
    // CV of 50% = moderate consistency (50%)
    // CV of 100%+ = poor consistency (0%)
    const consistency = Math.max(0, Math.min(100, Math.round(100 - Math.min(cv, 100))));

    // Alternative: Use range-based consistency for more varied scores
    // Calculate how much the values vary relative to their range
    const range = Math.max(...normalizedValues) - Math.min(...normalizedValues);
    const rangeBasedConsistency = Math.max(0, Math.min(100, Math.round(100 - (range / 10) * 100)));
    
    // Use the more varied range-based consistency
    const finalConsistency = rangeBasedConsistency;

    // Calculate improvement percentage
    const improvement = lastBest > current ? 
      `-${Math.round(((lastBest - current) / lastBest) * 100)}%` : 
      `+${Math.round(((current - lastBest) / lastBest) * 100)}%`;

    const improvementType: 'improving' | 'declining' | 'stable' = 
      current > lastBest ? 'improving' : current < lastBest ? 'declining' : 'stable';

    skillData[label] = {
      title: label,
      current: normalizedCurrent,
      lastBest: normalizedLastBest,
      consistency: finalConsistency,
      currentProgress: Math.round((normalizedCurrent / 10) * 100),
      lastBestProgress: Math.round((normalizedLastBest / 10) * 100),
      consistencyProgress: finalConsistency,
      improvement,
      improvementType,
      summary: `${label} ${improvementType === 'improving' ? 'showing improvement' : improvementType === 'declining' ? 'needs attention' : 'stable'}`
    };
  });

  return skillData;
}

const SkillsDevelopmentAnalysis: React.FC<Props> = ({ player, periodLabel }) => {
  const [activeSkill, setActiveSkill] = useState('Ball Control');

  const skills = ['Ball Control', 'Passing', '1v1', 'Dribbling', 'Shooting'];
  const skillData = buildSkillDataFromPlayer(player);

  const getCurrentSkillData = () => {
    return skillData[activeSkill as keyof typeof skillData] || skillData['Ball Control'];
  };

  // Helper functions for SVG circle calculations
  const calculateCircleValues = (percentage: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return { strokeDasharray, strokeDashoffset };
  };

  return (
    <div className="skills-development-analysis">
      <div className="section-header">
        <h2 className="section-title">Skills Progress</h2>
        <div className="analysis-filter">
          <Filter size={16} />
          <span>{periodLabel || 'Skills Analysis Period'}</span>
        </div>
      </div>

      <div className="skills-content">
        <div className="skills-tabs">
          {skills.map((skill) => (
            <button
              key={skill}
              className={`skill-tab ${activeSkill === skill ? 'active' : ''}`}
              onClick={() => setActiveSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="skills-progress-cards">
          <div className="skill-progress-card">
            <h3 className="card-title">{getCurrentSkillData().title}</h3>
            <div className="progress-circle-container">
              <div className="dual-progress-circle">
                <svg 
                  className="progress-svg" 
                  viewBox="0 0 120 120" 
                  width="120" 
                  height="120"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  {/* Background circle */}
                  <circle
                    className="progress-background"
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#333"
                    strokeWidth="5"
                    fill="none"
                  />

                  {/* Background circle */}
                  <circle
                    className="progress-background-1"
                    cx="60"
                    cy="60"
                    r="38"
                    stroke="#333"
                    strokeWidth="6"
                    fill="none"
                  />

                  <circle
                    className="progress-background-2"
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#333"
                    strokeWidth="6"
                    fill="none"
                  />

                  {/* Purple arc - Outer circle (Current) */}
                  <circle
                    className="progress-fill-current"
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="var(--db-primary)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={calculateCircleValues(getCurrentSkillData().currentProgress, 50).strokeDasharray}
                    strokeDashoffset={calculateCircleValues(getCurrentSkillData().currentProgress, 50).strokeDashoffset}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                  
                  {/* Green arc - Inner circle (Best) */}
                  <circle
                    className="progress-fill-last-best"
                    cx="60"
                    cy="60"
                    r="38"
                    stroke="var(--db-success)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={calculateCircleValues(getCurrentSkillData().lastBestProgress, 38).strokeDasharray}
                    strokeDashoffset={calculateCircleValues(getCurrentSkillData().lastBestProgress, 38).strokeDashoffset}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                  
                </svg>
                <div className="progress-text">
                  <div className="progress-label">Current</div>
                  <div className="progress-value">{getCurrentSkillData().current}/10</div>
                </div>
              </div>
            </div>
            <div className="skill-progress-details">
              <div className="skill-detail-item">
                <span className="skill-detail-dot current">•</span>
                <span>Current (Outer): {getCurrentSkillData().current}/10</span>
              </div>
              <div className="skill-detail-item">
                <span className="skill-detail-dot last-best">•</span>
                <span>Best (Inner): {getCurrentSkillData().lastBest}/10</span>
              </div>
            </div>
            <div className={`improvement-indicator ${getCurrentSkillData().improvementType === 'declining' ? 'declining' : 'improving'}`}>
              {getCurrentSkillData().improvementType === 'declining' ? (
                <TrendingDown size={16} />
              ) : (
                <TrendingUp size={16} />
              )}
              <span>{getCurrentSkillData().improvement} {getCurrentSkillData().improvementType === 'declining' ? 'decline' : 'improvement'}</span>
            </div>
          </div>

          <div className="skill-progress-card">
            <h3 className="card-title">{getCurrentSkillData().title} Consistency</h3>
            <div className="progress-circle-container">
              <div className="progress-circle">
                <svg 
                  className="progress-svg" 
                  viewBox="0 0 120 120"
                  width="120" 
                  height="120"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  <circle
                    className="progress-background"
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#333"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    className="progress-fill-current"
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="var(--db-success)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={calculateCircleValues(getCurrentSkillData().consistencyProgress, 50).strokeDasharray}
                    strokeDashoffset={calculateCircleValues(getCurrentSkillData().consistencyProgress, 50).strokeDashoffset}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="progress-text">
                  <div className="progress-label">Rate</div>
                  <div className="progress-value">{getCurrentSkillData().consistency}</div>
                </div>
              </div>
            </div>
            <div className={`improvement-indicator ${getCurrentSkillData().improvementType === 'declining' ? 'declining' : 'improving'}`}>
              {getCurrentSkillData().improvementType === 'declining' ? (
                <TrendingDown size={16} />
              ) : (
                <TrendingUp size={16} />
              )}
              <span>Consistency: {getCurrentSkillData().consistency}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsDevelopmentAnalysis; 