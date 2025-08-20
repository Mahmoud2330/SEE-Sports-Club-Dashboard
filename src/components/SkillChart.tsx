import React, { useState, useId, useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { Filter, TrendingUp, Heart, Zap, Clock, Activity, TrendingDown } from 'lucide-react';

interface SkillChartProps {
  playerName?: string;
}

const SkillChart: React.FC<SkillChartProps> = ({ playerName = 'Ahmed Mohamed' }) => {
  const [selectedSkill, setSelectedSkill] = useState('Ball Control');

  // unique, safe id for the gradient (no spaces, no collisions)
  const uid = useId();
  const gradientId = useMemo(() => `skillAreaGradient-${uid}`, [uid]);

  const skillMetrics = [
    { 
      name: 'Ball Control', 
      icon: <TrendingUp size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#283630'
    },
    { 
      name: 'Passing', 
      icon: <Heart size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#283630'
    },
    { 
      name: 'Shooting', 
      icon: <Zap size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#283630'
    },
    { 
      name: 'Dribbling', 
      icon: <Clock size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#283630'
    },
    { 
      name: 'Defending', 
      icon: <Activity size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#283630'
    },
  ];

  // Comprehensive data for each skill
  const skillData = {
    'Ball Control': {
      title: 'Ball Control Mastery',
      subtitle: 'Technical ball handling and control skills',
      yourAverage: 8.15,
      teamAverage: 7.89,
      yourProgress: 82,
      teamProgress: 79,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ballControl: 9.2, passing: 6.8, shooting: 6.5 },
        { month: 'Feb', ballControl: 8.0, passing: 6.9, shooting: 6.7 },
        { month: 'Mar', ballControl: 6.4, passing: 7.1, shooting: 6.9 },
        { month: 'Apr', ballControl: 5.6, passing: 7.3, shooting: 7.1 },
        { month: 'May', ballControl: 4.8, passing: 7.5, shooting: 7.3 },
        { month: 'Jun', ballControl: 6.0, passing: 7.7, shooting: 7.5 },
        { month: 'Jul', ballControl: 8.2, passing: 7.9, shooting: 7.7 },
      ]
    },
    'Passing': {
      title: 'Passing Accuracy',
      subtitle: 'Precision and timing in ball distribution',
      yourAverage: 7.45,
      teamAverage: 7.23,
      yourProgress: 74,
      teamProgress: 72,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ballControl: 7.8, passing: 6.8, shooting: 6.5 },
        { month: 'Feb', ballControl: 7.5, passing: 7.1, shooting: 6.7 },
        { month: 'Mar', ballControl: 7.2, passing: 7.4, shooting: 6.9 },
        { month: 'Apr', ballControl: 7.0, passing: 7.6, shooting: 7.1 },
        { month: 'May', ballControl: 6.8, passing: 7.8, shooting: 7.3 },
        { month: 'Jun', ballControl: 7.1, passing: 8.0, shooting: 7.5 },
        { month: 'Jul', ballControl: 7.4, passing: 8.2, shooting: 7.7 },
      ]
    },
    'Shooting': {
      title: 'Shooting Precision',
      subtitle: 'Accuracy and power in goal scoring',
      yourAverage: 7.89,
      teamAverage: 7.56,
      yourProgress: 79,
      teamProgress: 76,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ballControl: 7.2, passing: 6.8, shooting: 6.5 },
        { month: 'Feb', ballControl: 7.0, passing: 6.9, shooting: 6.8 },
        { month: 'Mar', ballControl: 6.8, passing: 7.1, shooting: 7.1 },
        { month: 'Apr', ballControl: 6.6, passing: 7.3, shooting: 7.4 },
        { month: 'May', ballControl: 6.4, passing: 7.5, shooting: 7.7 },
        { month: 'Jun', ballControl: 6.7, passing: 7.7, shooting: 8.0 },
        { month: 'Jul', ballControl: 7.0, passing: 7.9, shooting: 8.3 },
      ]
    },
    'Dribbling': {
      title: 'Dribbling Skills',
      subtitle: 'Ball control while moving at speed',
      yourAverage: 7.23,
      teamAverage: 7.01,
      yourProgress: 72,
      teamProgress: 70,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ballControl: 7.5, passing: 6.8, shooting: 6.5 },
        { month: 'Feb', ballControl: 7.3, passing: 6.9, shooting: 6.7 },
        { month: 'Mar', ballControl: 7.1, passing: 7.1, shooting: 6.9 },
        { month: 'Apr', ballControl: 6.9, passing: 7.3, shooting: 7.1 },
        { month: 'May', ballControl: 6.7, passing: 7.5, shooting: 7.3 },
        { month: 'Jun', ballControl: 7.0, passing: 7.7, shooting: 7.5 },
        { month: 'Jul', ballControl: 7.3, passing: 7.9, shooting: 7.7 },
      ]
    },
    'Defending': {
      title: 'Defensive Mastery',
      subtitle: 'Tackling, positioning, and defensive awareness',
      yourAverage: 7.67,
      teamAverage: 7.34,
      yourProgress: 77,
      teamProgress: 73,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ballControl: 7.8, passing: 6.8, shooting: 6.5 },
        { month: 'Feb', ballControl: 7.6, passing: 6.9, shooting: 6.7 },
        { month: 'Mar', ballControl: 7.4, passing: 7.1, shooting: 6.9 },
        { month: 'Apr', ballControl: 7.2, passing: 7.3, shooting: 7.1 },
        { month: 'May', ballControl: 7.0, passing: 7.5, shooting: 7.3 },
        { month: 'Jun', ballControl: 7.3, passing: 7.7, shooting: 7.5 },
        { month: 'Jul', ballControl: 7.6, passing: 7.9, shooting: 7.7 },
      ]
    },
  };

  const getCurrentSkillData = () => {
    return skillData[selectedSkill as keyof typeof skillData] || skillData['Ball Control'];
  };

  const getCurrentSkillColors = () => {
    return skillMetrics.find(skill => skill.name === selectedSkill) || skillMetrics[0];
  };

  return (
    <div className="skill-analytics">
      {/* Skill Analytics Section */}
      <div className="skill-analytics-section">
        

        {/* Skill Assessment Section */}
        <div className="skill-assessment-section">
          <div className="assessment-header">
            <div className="assessment-title-section">
              <h3 className="assessment-title">Skill Assessment</h3>
              <p className="assessment-description">
                Track progress across technical skill performance indicators.
              </p>
            </div>
            <div className="selected-metric" style={{ color: '#fff' }}>
              <div style={{ color: getCurrentSkillColors().color }}>
                {getCurrentSkillColors().icon}
              </div>
              <span>{getCurrentSkillData().title}</span>
            </div>
          </div>

          {/* Skill Assessment Metrics */}
          <div className="assessment-metrics">
            {skillMetrics.map((skill, index) => (
              <button
                key={index}
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

      {/* Skill Chart Section */}
      <div className="skill-chart">
        <div className="chart-header">
          <div className="chart-title-container">
            <div 
              className="chart-icon" 
              style={{ 
                color: getCurrentSkillColors().color,
                backgroundColor: getCurrentSkillColors().iconBgColor
              }}
            >
              {getCurrentSkillColors().icon}
            </div>
            <div className="chart-title-content">
              <div className="chart-title-text">{getCurrentSkillData().title}</div>
              <div className="chart-subtitle">{getCurrentSkillData().subtitle}</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color ball-control" style={{ backgroundColor: getCurrentSkillColors().color }}></div>
              <span>{selectedSkill}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color passing" style={{ backgroundColor: getCurrentSkillColors().teamColor }}></div>
              <span>Team</span>
            </div>
          </div>
        </div>
        
        <div className="metrics-summary">
          <div className="metric-card">
            <div className="metric-value" style={{ color: getCurrentSkillColors().color }}>
              {getCurrentSkillData().yourAverage}
            </div>
            <div className="metric-label">Your Average</div>
            <div className="progress-bar">
              <div 
                className="progress-fill your-average" 
                style={{ 
                  width: `${getCurrentSkillData().yourProgress}%`,
                  backgroundColor: getCurrentSkillColors().color
                }}
              ></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value" style={{ color: getCurrentSkillColors().teamColor }}>
              {getCurrentSkillData().teamAverage}
            </div>
            <div className="metric-label">Team Average</div>
            <div className="progress-bar">
              <div 
                className="progress-fill team-average" 
                style={{ 
                  width: `${getCurrentSkillData().teamProgress}%`,
                  backgroundColor: getCurrentSkillColors().teamColor
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Improvement Indicator */}
        <div className="improvement-indicator-container" style={{ textAlign: 'right', marginBottom: '16px' }}>
          <div className={`improvement-indicator ${getCurrentSkillData().improvementType === 'declining' ? 'declining' : 'improving'}`}>
            {getCurrentSkillData().improvementType === 'declining' ? (
              <TrendingDown size={16} />
            ) : (
              <TrendingUp size={16} />
            )}
            <span>{getCurrentSkillData().improvement}</span>
          </div>
        </div>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={getCurrentSkillData().chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                tick={{ fill: '#666' }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#666' }}
                domain={[4, 10]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getCurrentSkillColors().color} stopOpacity={0.3} />
                  <stop offset="70%" stopColor={getCurrentSkillColors().color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              

              <Area 
                type="monotone" 
                dataKey="ballControl" 
                stroke={getCurrentSkillColors().color} 
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={{ fill: getCurrentSkillColors().color, strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="passing" 
                stroke={getCurrentSkillColors().teamColor} 
                strokeWidth={2}
                dot={{ fill: getCurrentSkillColors().teamColor, strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SkillChart;
