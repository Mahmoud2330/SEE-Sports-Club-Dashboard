import React, { useState } from 'react';
import { Filter, TrendingUp, TrendingDown } from 'lucide-react';

const SkillsDevelopmentAnalysis: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState('Ball Control');

  const skills = ['Ball Control', 'Passing', '1v1', 'Running w/ Ball', 'Shooting'];

  // Comprehensive data for each skill
  const skillData = {
    'Ball Control': {
      title: 'Ball Control',
      current: 8.3,
      lastBest: 7.4,
      consistency: 7.7,
      currentProgress: 83, // percentage for outer circle
      lastBestProgress: 74, // percentage for inner circle
      consistencyProgress: 77,
      improvement: '+12.2%',
      improvementType: 'improving',
      summary: 'Ball control significantly improved'
    },
    'Passing': {
      title: 'Passing',
      current: 7.8,
      lastBest: 8.1,
      consistency: 8.0,
      currentProgress: 78,
      lastBestProgress: 81,
      consistencyProgress: 80,
      improvement: '-3.7%',
      improvementType: 'declining',
      summary: 'Passing accuracy slightly decreased'
    },
    '1v1': {
      title: '1v1',
      current: 8.9,
      lastBest: 8.2,
      consistency: 8.5,
      currentProgress: 89,
      lastBestProgress: 82,
      consistencyProgress: 85,
      improvement: '+8.5%',
      improvementType: 'improving',
      summary: '1v1 skills showing strong improvement'
    },
    'Running w/ Ball': {
      title: 'Running w/ Ball',
      current: 7.5,
      lastBest: 7.8,
      consistency: 7.6,
      currentProgress: 75,
      lastBestProgress: 78,
      consistencyProgress: 76,
      improvement: '-3.8%',
      improvementType: 'declining',
      summary: 'Ball carrying needs attention'
    },
    'Shooting': {
      title: 'Shooting',
      current: 8.6,
      lastBest: 8.0,
      consistency: 8.3,
      currentProgress: 86,
      lastBestProgress: 80,
      consistencyProgress: 83,
      improvement: '+7.5%',
      improvementType: 'improving',
      summary: 'Shooting accuracy on the rise'
    }
  };

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
          <span>Skills Analysis Period</span>
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

                  {/* Purple arc - Outer circle (Last Best) */}
                  <circle
                    className="progress-fill-last-best"
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#6728f5"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={calculateCircleValues(getCurrentSkillData().lastBestProgress, 50).strokeDasharray}
                    strokeDashoffset={calculateCircleValues(getCurrentSkillData().lastBestProgress, 50).strokeDashoffset}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                  
                  {/* Green arc - Inner circle (Current) */}
                  <circle
                    className="progress-fill-current"
                    cx="60"
                    cy="60"
                    r="38"
                    stroke="#00ff88"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={calculateCircleValues(getCurrentSkillData().currentProgress, 38).strokeDasharray}
                    strokeDashoffset={calculateCircleValues(getCurrentSkillData().currentProgress, 38).strokeDashoffset}
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
                <span>Current: {getCurrentSkillData().current}/10</span>
              </div>
              <div className="skill-detail-item">
                <span className="skill-detail-dot last-best">•</span>
                <span>Last Best: {getCurrentSkillData().lastBest}/10</span>
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
                    stroke="#00ff88"
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
              <span>{getCurrentSkillData().improvementType === 'declining' ? 'Declining' : 'Improving'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsDevelopmentAnalysis; 