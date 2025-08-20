import React, {  useState, useId, useMemo  } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { Filter, TrendingUp, Heart, Zap, Clock, Activity, TrendingDown } from 'lucide-react';

interface PerformanceChartProps {
  playerName?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ playerName = 'Ahmed Mohamed' }) => {
  const [selectedMetric, setSelectedMetric] = useState('Vertical Jump');

  // unique, safe id for the gradient (no spaces, no collisions)
  const uid = useId();
  const gradientId = useMemo(() => `areaGradient-${uid}`, [uid]);

  const physicalMetrics = [
    { 
      name: 'Vertical Jump', 
      icon: <TrendingUp size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#7bffba1a'
    },
    { 
      name: 'Broad Jump', 
      icon: <Heart size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#7bffba1a'
    },
    { 
      name: '10m Run', 
      icon: <Zap size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#7bffba1a'
    },
    { 
      name: '5-10-5', 
      icon: <Clock size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#7bffba1a'
    },
    { 
      name: 'T-Agility', 
      icon: <Activity size={16} />,
      color: '#7BFFBA',
      areaColor: '#7BFFBA',
      teamColor: '#6728f5',
      iconBgColor: '#7bffba1a'
    },
  ];

  // Comprehensive data for each physical metric
  const metricData = {
    'Vertical Jump': {
      title: 'Vertical Jump Height',
      subtitle: 'Explosive leg power and jumping ability',
      yourAverage: 7.83,
      teamAverage: 7.51,
      yourProgress: 83,
      teamProgress: 75,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ahmed: 6.3, team: 6.2},
        { month: 'Feb', ahmed: 6.4, team: 5.9},
        { month: 'Mar', ahmed: 7.0, team: 6.1},
        { month: 'Apr', ahmed: 6.2, team: 6.5},
        { month: 'May', ahmed: 7.9, team: 6.8},
        { month: 'Jun', ahmed: 8.0, team: 7.1},
        { month: 'Jul', ahmed: 8.4, team: 7.4},
      ]
    },
    'Broad Jump': {
      title: 'Broad Jump Distance',
      subtitle: 'Horizontal power and leg strength',
      yourAverage: 7.66,
      teamAverage: 7.54,
      yourProgress: 76,
      teamProgress: 75,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ahmed: 7.5, team: 7.0},
        { month: 'Feb', ahmed: 7.8, team: 7.2},
        { month: 'Mar', ahmed: 7.2, team: 7.1},
        { month: 'Apr', ahmed: 7.9, team: 7.3},
        { month: 'May', ahmed: 7.4, team: 7.2},
        { month: 'Jun', ahmed: 7.7, team: 7.4},
        { month: 'Jul', ahmed: 8.1, team: 7.6},
      ]
    },
    '10m Run': {
      title: '10 Meter Sprint',
      subtitle: 'Acceleration and explosive speed',
      yourAverage: 8.0,
      teamAverage: 7.56,
      yourProgress: 80,
      teamProgress: 76,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ahmed: 7.0, team: 7.2},
        { month: 'Feb', ahmed: 7.5, team: 7.1},
        { month: 'Mar', ahmed: 7.8, team: 7.3},
        { month: 'Apr', ahmed: 7.2, team: 7.0},
        { month: 'May', ahmed: 7.9, team: 7.4},
        { month: 'Jun', ahmed: 8.2, team: 7.5},
        { month: 'Jul', ahmed: 8.5, team: 7.7},
      ]
    },
    '5-10-5': {
      title: 'Five Ten Five Drill',
      subtitle: 'Agility and change of direction speed',
      yourAverage: 7.66,
      teamAverage: 7.56,
      yourProgress: 76,
      teamProgress: 75,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ahmed: 7.5, team: 7.2},
        { month: 'Feb', ahmed: 7.8, team: 7.4},
        { month: 'Mar', ahmed: 7.2, team: 7.1},
        { month: 'Apr', ahmed: 7.9, team: 7.3},
        { month: 'May', ahmed: 7.4, team: 7.2},
        { month: 'Jun', ahmed: 7.7, team: 7.4},
        { month: 'Jul', ahmed: 8.1, team: 7.6},
      ]
    },
    'T-Agility': {
      title: 'T-Agility Test',
      subtitle: 'Lateral movement and coordination',
      yourAverage: 7.86,
      teamAverage: 7.51,
      yourProgress: 78,
      teamProgress: 75,
      improvement: 'Improving',
      improvementType: 'improving',
      chartData: [
        { month: 'Jan', ahmed: 6.5, team: 6.0},
        { month: 'Feb', ahmed: 7.0, team: 6.5},
        { month: 'Mar', ahmed: 7.5, team: 6.8},
        { month: 'Apr', ahmed: 7.2, team: 6.6},
        { month: 'May', ahmed: 7.8, team: 7.0},
        { month: 'Jun', ahmed: 8.0, team: 7.2},
        { month: 'Jul', ahmed: 8.2, team: 7.5},
      ]
    },
  };

  const getCurrentMetricData = () => {
    return metricData[selectedMetric as keyof typeof metricData] || metricData['Vertical Jump'];
  };

  const getCurrentMetricColors = () => {
    return physicalMetrics.find(metric => metric.name === selectedMetric) || physicalMetrics[0];
  };

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
            <div className="selected-metric" style={{ color: '#fff' }}>
              <div style={{ color: getCurrentMetricColors().color }}>
                {getCurrentMetricColors().icon}
              </div>
              <span>{getCurrentMetricData().title}</span>
            </div>
          </div>

          {/* Physical Assessment Metrics */}
          <div className="assessment-metrics">
            {physicalMetrics.map((metric, index) => (
              <button
                key={index}
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
              style={{ 
                color: getCurrentMetricColors().color,
                backgroundColor: getCurrentMetricColors().iconBgColor
              }}
            >
              {getCurrentMetricColors().icon}
            </div>
            <div className="chart-title-content">
              <div className="chart-title-text">{getCurrentMetricData().title}</div>
              <div className="chart-subtitle">{getCurrentMetricData().subtitle}</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color ahmed" style={{ backgroundColor: getCurrentMetricColors().color }}></div>
              <span>{playerName}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color team" style={{ backgroundColor: getCurrentMetricColors().teamColor }}></div>
              <span>Team</span>
            </div>
          </div>
        </div>
        
        <div className="metrics-summary">
          <div className="metric-card">
            <div className="metric-value" style={{ color: getCurrentMetricColors().color }}>
              {getCurrentMetricData().yourAverage}
            </div>
            <div className="metric-label">Your Average</div>
            <div className="progress-bar">
              <div 
                className="progress-fill your-average" 
                style={{ 
                  width: `${getCurrentMetricData().yourProgress}%`,
                  backgroundColor: getCurrentMetricColors().color
                }}
              ></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value" style={{ color: getCurrentMetricColors().teamColor }}>
              {getCurrentMetricData().teamAverage}
            </div>
            <div className="metric-label">Team Average</div>
            <div className="progress-bar">
              <div 
                className="progress-fill team-average" 
                style={{ 
                  width: `${getCurrentMetricData().teamProgress}%`,
                  backgroundColor: getCurrentMetricColors().teamColor
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Improvement Indicator */}
        <div className="improvement-indicator-container" style={{ textAlign: 'right', marginBottom: '16px' }}>
          <div className={`improvement-indicator ${getCurrentMetricData().improvementType === 'declining' ? 'declining' : 'improving'}`}>
            {getCurrentMetricData().improvementType === 'declining' ? (
              <TrendingDown size={16} />
            ) : (
              <TrendingUp size={16} />
            )}
            <span>{getCurrentMetricData().improvement}</span>
          </div>
        </div>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={getCurrentMetricData().chartData}>
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
                  <stop offset="0%" stopColor={getCurrentMetricColors().color} stopOpacity={0.3} />
                  <stop offset="70%" stopColor={getCurrentMetricColors().color} stopOpacity={0.05} />
                </linearGradient>
              </defs>

                <Area
                type="monotone" 
                dataKey="ahmed" 
                stroke={getCurrentMetricColors().color} 
                strokeWidth={2}
                recharts-wrapper
                dot={{ fill: getCurrentMetricColors().color, strokeWidth: 2, r: 4 }}
                fill={`url(#${gradientId})`}

              />
              <Line 
                type="monotone" 
                dataKey="team" 
                stroke={getCurrentMetricColors().teamColor} 
                strokeWidth={2}
                dot={{ fill: getCurrentMetricColors().teamColor, strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart; 