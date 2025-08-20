import React, { useState, useEffect } from 'react';
import { Share2, Filter, ChevronRight, User, TrendingUp } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PlayerCard from './PlayerCard';
import SkillsDevelopmentAnalysis from './SkillsDevelopmentAnalysis';
import PhysicalPerformance from './PhysicalPerformance';
import PerformanceChart from './PerformanceChart';
import SkillChart from './SkillChart';
import ChatWidget from './ChatWidget';
import CustomDatePicker from './CustomDatePicker';
import { dataService } from '../services/dataService';
import type { Player } from '../services/dataService';

const PlayerOverview: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('3 Months');
  const [activeTest, setActiveTest] = useState('Vertical Jump');
  const navigate = useNavigate();
  const { id: playerId } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Loading state for period changes
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Custom date range state
  const [customStartDate, setCustomStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());

  const periods = ['Last Month', '3 Months', '6 Months', 'This Year'];
  const physicalTests = ['Vertical Jump', 'Broad Jump', '10m Run', '5-10-5', 'T-Agility'];
  
  // State for dynamic data
  const [playerData, setPlayerData] = useState<Player | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch player data on component mount
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!playerId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching player data for ID:', playerId, 'Type:', typeof playerId);
        const player = await dataService.getPlayerById(playerId);
        console.log('Received player data:', player);
        
        if (player) {
          setPlayerData(player);
        } else {
          setError('Player not found');
        }
      } catch (err) {
        console.error('Error in fetchPlayerData:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch player data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  // Dynamic breadcrumbs based on current player and team
  const breadcrumbs = playerData ? [
    { name: 'Club', path: '/dashboard' },
    { name: 'Teams', path: '/teams' },
    { name: playerData.team, path: `/teams/${playerData.teamId}` },
    { name: playerData.name, path: `/players/${playerData.id}` }
  ] : [];

  const handleBreadcrumbClick = (crumb: { name: string; path: string }, index: number) => {
    // Don't navigate if it's the current page (last breadcrumb)
    if (index === breadcrumbs.length - 1) {
      return;
    }
    
    // Navigate to the appropriate page
    navigate(crumb.path);
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: `${playerData?.name} - Player Profile`,
          text: `Check out ${playerData?.name}'s performance profile and statistics.`,
          url: window.location.href
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

//   // Handle PDF download functionality
//   const handleDownloadPDF = () => {
//     // For now, we'll use a simple approach - in a real app, you'd use a library like jsPDF
//     // or send a request to the server to generate a PDF
//     try {
//       // Create a simple text representation of the player data
//       const playerInfo = `
// Player Profile: ${playerData?.name}
// Team: ${playerData?.team}
// Position: ${playerData?.position}
// Overall Score: ${playerData?.totalScore}/100
// Physical: ${playerData?.physical}/100
// Skills: ${playerData?.skills}/100
// Nationality: ${playerData?.nationality}
// Age: ${playerData?.age}
// Contract Expiry: ${playerData?.contractExpiry}
// Market Value: ${playerData?.marketValue}

// Profile URL: ${window.location.href}
// Generated on: ${new Date().toLocaleDateString()}
//       `;
      
//       // Create and download a text file (as a placeholder for PDF)
//       const blob = new Blob([playerInfo], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${playerData?.name?.replace(/\s+/g, '_')}_Profile.txt`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//       alert('Profile data downloaded! (Note: This is a text file. PDF generation would require additional setup.)');
//     } catch (error) {
//       console.error('Error downloading profile:', error);
//       alert('Unable to download profile. Please try again.');
//     }
//   };

  // Comprehensive data for each physical test
  const physicalTestData = {
    'Vertical Jump': {
      title: 'Vertical Jump',
      current: 8.4,
      best: 7.7,
      consistency: 7.8,
      currentProgress: 74, // percentage for circle
      bestProgress: 85,
      consistencyProgress: 75,
      unit: 'cm',
      improvement: 'Improving',
      summary: 'Jump height increased by 9%'
    },
    'Broad Jump': {
      title: 'Broad Jump',
      current: 2.74,
      best: 2.85,
      consistency: 8.2,
      currentProgress: 82,
      bestProgress: 90,
      consistencyProgress: 82,
      unit: 'm',
      improvement: 'Stable',
      summary: 'Distance maintained consistently'
    },
    '10m Run': {
      title: '10m Run',
      current: 1.70,
      best: 1.65,
      consistency: 8.5,
      currentProgress: 88,
      bestProgress: 92,
      consistencyProgress: 85,
      unit: 'sec',
      improvement: 'Improving',
      summary: 'Speed improved by 3%'
    },
    '5-10-5': {
      title: '5-10-5',
      current: 4.30,
      best: 4.15,
      consistency: 7.9,
      currentProgress: 78,
      bestProgress: 85,
      consistencyProgress: 79,
      unit: 'sec',
      improvement: 'Stable',
      summary: 'Agility test performance maintained'
    },
    'T-Agility': {
      title: 'T-Agility',
      current: 9.70,
      best: 9.45,
      consistency: 8.1,
      currentProgress: 76,
      bestProgress: 82,
      consistencyProgress: 81,
      unit: 'sec',
      improvement: 'Improving',
      summary: 'Agility improved by 2.6%'
    }
  };

  const handlePeriodChange = (period: string) => {
    setIsUpdating(true);
    setActivePeriod(period);
    
    // Simulate data update delay
    setTimeout(() => {
      setIsUpdating(false);
    }, 700);
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    setIsUpdating(true);
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    
    // Simulate data update delay
    setTimeout(() => {
      setIsUpdating(false);
    }, 700);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getCurrentDateRange = () => {
    if (activePeriod === 'Last Month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return `${formatDate(lastMonth)} - ${formatDate(new Date())}`;
    } else if (activePeriod === '3 Months') {
      return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
    } else if (activePeriod === '6 Months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return `${formatDate(sixMonthsAgo)} - ${formatDate(new Date())}`;
    } else if (activePeriod === 'This Year') {
      const thisYear = new Date();
      thisYear.setMonth(0, 1);
      return `${formatDate(thisYear)} - ${formatDate(new Date())}`;
    }
    return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
  };

  const handleReset = () => {
    setIsUpdating(true);
    setActivePeriod('3 Months');
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    setCustomStartDate(threeMonthsAgo);
    setCustomEndDate(today);
    
    // Simulate data update delay
    setTimeout(() => {
      setIsUpdating(false);
    }, 700);
  };

  // Helper functions for SVG circle calculations
  const calculateCircleValues = (percentage: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return { strokeDasharray, strokeDashoffset };
  };

  const getCurrentTestData = () => {
    return physicalTestData[activeTest as keyof typeof physicalTestData] || physicalTestData['Vertical Jump'];
  };
  
  return (
    <div className="player-overview">
      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading player data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <div>Error: {error}</div>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Main Content - Only show when data is loaded and no errors */}
      {!isLoading && !error && playerData && (
        <>
          {/* Top Bar */}
          <div className="top-bar">
            <div className="breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <button 
                    onClick={() => handleBreadcrumbClick(crumb, index)}
                    className={index === breadcrumbs.length - 1 ? 'active' : ''}
                  >
                    {crumb.name}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight size={16} className="chevron" />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Share Button */}
            <div className="share-section">
              <button className="share-btn" onClick={handleShare}>
                <Share2 size={18} />
                <span>Share Profile</span>
              </button>
              {/* <button className="pdf-btn" onClick={handleDownloadPDF}>
                <Share2 size={18} />
                <span>Download PDF</span>
              </button> */}
            </div>
          </div>
        
          {/* Player Header */}
          <div className="player-header">
            <div className="player-info">
              <h1 className="player-name">{playerData?.name}</h1>
              <p className="player-description">
                Detailed player profile with performance metrics, statistics, and development progress.
              </p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="period-selector">
            <div className="period-label">Period:</div>
            <div className="period-buttons">
              {periods.map((period) => (
                <button
                  key={period}
                  className={`period-btn ${activePeriod === period ? 'active' : ''}`}
                  onClick={() => handlePeriodChange(period)}
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="date-range">
             <span className="date-active-dot"><span className="live-dot"></span> {getCurrentDateRange()}</span>
              <CustomDatePicker 
                onDateChange={handleCustomDateChange}
                currentStartDate={customStartDate}
                currentEndDate={customEndDate}
              />
              <button className="reset-btn" onClick={handleReset}>Reset</button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isUpdating && (
            <div className="updating-data">
              <div className="spinner"></div>
              <span>Updating data...</span>
            </div>
          )}

          {/* Two-Column Layout: Player Card and Physical Progress */}
          <div className="player-content-layout">
            {/* Left Column: Player Card */}
            <div className="player-card-column">
              <div className="player-card-section">
                <h2 className="section-title1">Player Card <span className="active-dot"><span className="live-dot"></span> Active</span></h2>
                <div className="player-card-container">
                  {/* Unified Background Container */}
                  <div className="player-card-background">
                    {/* Player Card Component */}
                    <div className="player-card-wrapper">
                      <PlayerCard playerData={playerData} />
                    </div>
                    
                    {/* Player Card Footer */}
                    <div className="player-card-footer">
                      <div className="player-info-footer">
                        <div className="left-info">
                          <div className="player-name-card">{playerData?.name}</div>
                          <div className="team-name-card">{playerData?.team}</div>
                        </div>
                        <div className="live-status">
                          <span className="live-dot" />
                          <span className="live-text">Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Progress */}
            <div className="physical-progress-column">
              <div className="physical-progress">
                <div className="section-header">
                  <h2 className="section-title physical-progress-title">
                    Physical Progress
                  </h2>
                </div>
                <div className="sub-sec" >
                  <div className="test-tabs">
                    {physicalTests.map((test) => (
                      <button
                        key={test}
                        className={`test-tab ${activeTest === test ? 'active' : ''}`}
                        onClick={() => setActiveTest(test)}
                      >
                        {test}
                      </button>
                    ))}
                  </div>

                  <div className="progress-cards">
                    <div className="progress-card">
                      <h3 className="card-title">{getCurrentTestData().title}</h3>
                      <div className="progress-circle-container">
                        <div className="progress-circle">
                          <svg className="progress-svg" viewBox="0 0 120 120">
                            <circle
                              className="progress-background"
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#333"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              className="progress-fill"
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#6728f5"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={calculateCircleValues(getCurrentTestData().currentProgress, 50).strokeDasharray}
                              strokeDashoffset={calculateCircleValues(getCurrentTestData().currentProgress, 50).strokeDashoffset}
                              transform="rotate(-90 60 60)"
                              strokeLinecap="round"
                            />

                            <circle
                              className="progress-background"
                              cx="60"
                              cy="60"
                              r="38"
                              stroke="#333"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              className="progress-fill2"
                              cx="60"
                              cy="60"
                              r="38"
                              stroke="#6728f5"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={calculateCircleValues(getCurrentTestData().bestProgress, 38).strokeDasharray}
                              strokeDashoffset={calculateCircleValues(getCurrentTestData().bestProgress, 38).strokeDashoffset}
                              transform="rotate(-90 60 60)"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="progress-text">
                            <div className="progress-label">Current</div>
                            <div className="progress-value">{getCurrentTestData().current}{getCurrentTestData().unit}</div>
                          </div>
                        </div>
                      </div>
                      <div className="progress-details">
                        <div className="detail-item">
                          <span className="detail-dot">•</span>
                          <span>Current {getCurrentTestData().current}{getCurrentTestData().unit}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-dot">•</span>
                          <span>Best {getCurrentTestData().best}{getCurrentTestData().unit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="progress-card">
                      <h3 className="card-title">Consistency</h3>
                      <div className="progress-circle-container">
                        <div className="progress-circle">
                          <svg className="progress-svg" viewBox="0 0 120 120">
                            <circle
                              className="progress-background"
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#333"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              className="progress-fill2"
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#6728f5"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={calculateCircleValues(getCurrentTestData().consistencyProgress, 50).strokeDasharray}
                              strokeDashoffset={calculateCircleValues(getCurrentTestData().consistencyProgress, 50).strokeDashoffset}
                              transform="rotate(-90 60 60)"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="progress-text">
                            <div className="progress-label">Rate</div>
                            <div className="progress-value">{getCurrentTestData().consistency}</div>
                          </div>
                        </div>
                      </div>
                      <div className="progress-details">
                        <div className="improvement-item">
                          <TrendingUp size={16} />
                          <span>{getCurrentTestData().improvement}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-items">
                      <div className="summary-item">
                        <span className="improvement-dot">• Improved:</span>
                        <span> Overall Physical Performance</span>
                      </div>
                    </div>
                    <div className="period-info">Period: Jun 2025 - Aug 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerOverview; 