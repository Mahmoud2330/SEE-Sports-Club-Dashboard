import React, { useState, useEffect, useMemo } from 'react';
import { Share2, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PlayerCard from './PlayerCard';
import CustomDatePicker from './CustomDatePicker';
import { dataService } from '../services/dataService';
import type { Player } from '../services/dataService';

/* ------------------------------ Helpers ------------------------------ */

const MONTHS_ORDER = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
] as const;

type SeriesPoint = { month: string; value: number };

function getMonthlySeries(player: any, jsonKey: string): SeriesPoint[] {
  const bucket = player?.['Physical Performance']?.[jsonKey];
  if (!bucket) return [];
  return MONTHS_ORDER
    .filter((m) => typeof bucket[m] === 'number')
    .map((m) => ({ month: m, value: Number(bucket[m]) }));
}

function pctOfRange(value:number, min:number, max:number){
  const span = Math.max(1e-6, max-min);
  return Math.round(((value-min)/span)*100);
}

function computeTrendAndConsistency(vals: number[]) {
  if (vals.length < 2) return { label: 'Stable' as const, consistencyPct: 100 };

  // least-squares slope for trend
  const n = vals.length;
  const xs = Array.from({ length: n }, (_, i) => i);
  const xMean = xs.reduce((a,b)=>a+b,0)/n;
  const yMean = vals.reduce((a,b)=>a+b,0)/n;
  const num = xs.reduce((s,x,i)=>s+(x-xMean)*(vals[i]-yMean),0);
  const den = xs.reduce((s,x)=>s+Math.pow(x-xMean,2),0) || 1;
  const slope = num/den;

  // label thresholds – tweak if you want a stricter/looser call
  const IMPROVE_T = 0.08;
  const DECLINE_T = -0.08;

  let label:'Improving'|'Declining'|'Stable'='Stable';
  if (slope > IMPROVE_T) label='Improving';
  else if (slope < DECLINE_T) label='Declining';

  // Consistency: Coefficient of Variation (CV) approach
  // Lower CV = more consistent performance
  const mean = vals.reduce((a,b)=>a+b,0)/vals.length;
  const variance = vals.reduce((s,v)=>s+Math.pow(v-mean,2),0)/vals.length;
  const stdDev = Math.sqrt(variance);
  
  // CV = standard deviation / mean (as percentage)
  // We want to invert this so higher percentage = more consistent
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
  
  // Convert CV to consistency percentage (0-100)
  // CV of 0% = perfect consistency (100%)
  // CV of 50% = moderate consistency (50%)
  // CV of 100%+ = poor consistency (0%)
  const consistencyPct = Math.max(0, Math.min(100, Math.round(100 - Math.min(cv, 100))));

  return { label, consistencyPct };
}

/* ----------------------------- Component ----------------------------- */

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

        const player = await dataService.getPlayerById(playerId);
        if (player) {
          setPlayerData(player);
        } else {
          setError('Player not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch player data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  // Dynamic breadcrumbs based on current player and team
  const breadcrumbs = playerData
    ? [
        { name: 'Club', path: '/dashboard' },
        { name: 'Teams', path: '/teams' },
        { name: playerData.team, path: `/teams/${playerData.teamId}` },
        { name: playerData.name, path: `/players/${playerData.id}` },
      ]
    : [];

  const handleBreadcrumbClick = (crumb: { name: string; path: string }, index: number) => {
    if (index === breadcrumbs.length - 1) return; // current page
    navigate(crumb.path);
  };

  // Share functionality
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${playerData?.name} - Player Profile`,
          text: `Check out ${playerData?.name}'s performance profile and statistics.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      } catch {
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  // Period controls (kept as-is)
  const handlePeriodChange = (period: string) => {
    setIsUpdating(true);
    setActivePeriod(period);
    setTimeout(() => setIsUpdating(false), 700);
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    setIsUpdating(true);
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setTimeout(() => setIsUpdating(false), 700);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const getCurrentDateRange = () => {
    if (activePeriod === 'Last Month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return `${formatDate(lastMonth)} - ${formatDate(new Date())}`;
    }
    if (activePeriod === '3 Months') {
      return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
    }
    if (activePeriod === '6 Months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return `${formatDate(sixMonthsAgo)} - ${formatDate(new Date())}`;
    }
    if (activePeriod === 'This Year') {
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
    setTimeout(() => setIsUpdating(false), 700);
  };

  /* ------------------ Dynamic Physical-Progress Derivations ------------------ */

  // UI tab -> JSON key in players.json
  const TEST_KEY_MAP = {
    'Vertical Jump': 'Vertical Jump',
    'Broad Jump': 'Broad Jump',
    '10m Run': '10 Meter Run',
    '5-10-5': 'Five Ten Five',
    'T-Agility': 'T-Agility',
  } as const;

  const UNIT_MAP = {
    'Vertical Jump': 'cm',
    'Broad Jump': 'cm',
    '10m Run': 'sec',
    '5-10-5': 'sec',
    'T-Agility': 'sec',
  } as const;

  const derived = useMemo(() => {
    if (!playerData) {
      return {
        title: activeTest,
        unit: UNIT_MAP[activeTest as keyof typeof UNIT_MAP] ?? '',
        current: 0,
        best: 0,
        currentPct: 0,
        bestPct: 0,
        consistencyPct: 0,
        trendLabel: 'Stable' as 'Stable'|'Improving'|'Declining',
        showUnit: false,
      };
    }

    const jsonKey = TEST_KEY_MAP[activeTest as keyof typeof TEST_KEY_MAP];
    const series = getMonthlySeries(playerData, jsonKey);
    const values = series.map(s=>s.value);
    if (!values.length) {
      return {
        title: activeTest,
        unit: UNIT_MAP[activeTest as keyof typeof UNIT_MAP] ?? '',
        current: 0,
        best: 0,
        currentPct: 0,
        bestPct: 0,
        consistencyPct: 0,
        trendLabel: 'Stable' as const,
        showUnit: false,
      };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const current = values[values.length-1];
    const best = max; // highest in the year

    // Detect score vs unit. If your JSON is 0..100 scores, we don't append unit text.
    const looksLikeScore = max <= 100 && min >= 0;

    const currentPct = looksLikeScore ? Math.round(current) : pctOfRange(current, min, max);
    const bestPct    = looksLikeScore ? Math.round(best)    : pctOfRange(best, min, max);

    const { label, consistencyPct } = computeTrendAndConsistency(values);

    return {
      title: activeTest,
      unit: looksLikeScore ? '' : (UNIT_MAP[activeTest as keyof typeof UNIT_MAP] ?? ''),
      current,
      best,
      currentPct: Math.max(0, Math.min(100, currentPct)),
      bestPct:    Math.max(0, Math.min(100, bestPct)),
      consistencyPct,
      trendLabel: label,
      showUnit: !looksLikeScore,
    };
  }, [playerData, activeTest]);

  /* ------------------------------------------------------------------------- */

  return (
    <div className="player-overview">
      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading player data...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <div>Error: {error}</div>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Content */}
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

            <div className="share-section">
              <button className="share-btn" onClick={handleShare}>
                <Share2 size={18} />
                <span>Share Profile</span>
              </button>
            </div>
          </div>

          {/* Player Header */}
          <div className="player-header">
            <div className="player-info">
              <h1 className="player-name">{playerData.name}</h1>
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
              <span className="date-active-dot">
                <span className="live-dot"></span> {getCurrentDateRange()}
              </span>
              <CustomDatePicker
                onDateChange={handleCustomDateChange}
                currentStartDate={customStartDate}
                currentEndDate={customEndDate}
              />
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          {/* Inline loading indicator for data updates */}
          {isUpdating && (
            <div className="updating-data">
              <div className="spinner"></div>
              <span>Updating data...</span>
            </div>
          )}

          {/* Two-Column Layout */}
          <div className="player-content-layout">
            {/* Left: Player Card */}
            <div className="player-card-column">
              <div className="player-card-section">
                <h2 className="section-title1">
                  Player Card{' '}
                  <span className="active-dot">
                    <span className="live-dot"></span> Active
                  </span>
                </h2>
                <div className="player-card-container">
                  <div className="player-card-background">
                    <div className="player-card-wrapper">
                      <PlayerCard playerData={playerData} />
                    </div>

                    <div className="player-card-footer">
                      <div className="player-info-footer">
                        <div className="left-info">
                          <div className="player-name-card">{playerData.name}</div>
                          <div className="team-name-card">{playerData.team}</div>
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

            {/* Right: Physical Progress */}
            <div className="physical-progress-column">
              <div className="physical-progress">
                <div className="section-header">
                  <h2 className="section-title physical-progress-title">Physical Progress</h2>
                </div>
                <div className="sub-sec">
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
                    {/* Current / Best */}
                    <div className="progress-card">
                      <h3 className="card-title">{derived.title}</h3>
                      <div className="progress-circle-container">
                        <div className="progress-circle">
                          <svg className="progress-svg" viewBox="0 0 120 120">
                            {/* outer ring = current */}
                            <circle className="progress-background" cx="60" cy="60" r="50" stroke="#333" strokeWidth="8" fill="none" />
                            <circle
                              className="progress-fill"
                              cx="60" cy="60" r="50"
                              stroke="#6728f5" strokeWidth="8" fill="none"
                              style={{
                                // inline style to ensure it overrides any CSS default
                                strokeDasharray: `${2*Math.PI*50}`,
                                strokeDashoffset: `${2*Math.PI*50 - (derived.currentPct/100)*(2*Math.PI*50)}`
                              }}
                              transform="rotate(-90 60 60)"
                              strokeLinecap="round"
                            />

                            {/* inner ring = best */}
                            <circle className="progress-background" cx="60" cy="60" r="38" stroke="#333" strokeWidth="8" fill="none" />
                            <circle
                              className="progress-fill2"
                              cx="60" cy="60" r="38"
                              stroke="#7BFFBA" strokeWidth="8" fill="none"
                              style={{
                                strokeDasharray: `${2*Math.PI*38}`,
                                strokeDashoffset: `${2*Math.PI*38 - (derived.bestPct/100)*(2*Math.PI*38)}`
                              }}
                              transform="rotate(-90 60 60)"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="progress-text">
                            <div className="progress-label">Current</div>
                            <div className="progress-value">
                              {Math.round(derived.current)}{derived.showUnit ? derived.unit : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="progress-details">
                        <div className="detail-item">
                          <span className="detail-dot">•</span>
                          <span>
                            Current {Math.round(derived.current)}{derived.showUnit ? derived.unit : ''}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-dot last-best">•</span>
                          <span>
                            Best {Math.round(derived.best)}{derived.showUnit ? derived.unit : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Consistency */}
                    <div className="progress-card">
                      <h3 className="card-title">Consistency</h3>
                      <div className="progress-circle-container">
                        <div className="progress-circle">
                          <svg className="progress-svg" viewBox="0 0 120 120">
                            <circle className="progress-background" cx="60" cy="60" r="50" stroke="#333" strokeWidth="8" fill="none" />
                            <circle
                              className="progress-fill2"
                              cx="60" cy="60" r="50"
                              stroke="#7BFFBA" strokeWidth="8" fill="none"
                              style={{
                                strokeDasharray: `${2*Math.PI*50}`,
                                strokeDashoffset: `${2*Math.PI*50 - (derived.consistencyPct/100)*(2*Math.PI*50)}`
                              }}
                              transform="rotate(-90 60 60)"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="progress-text">
                            <div className="progress-label">Rate</div>
                            <div className="progress-value">{derived.consistencyPct}</div>
                          </div>
                        </div>
                      </div>
                      <div className="progress-details">
                        <div className="improvement-item">
                          {derived.trendLabel === 'Declining'
                            ? <svg width="16" height="16"><path d="M2 4 L8 10 L14 4" stroke="#ff8080" strokeWidth="2" fill="none"/></svg>
                            : <TrendingUp size={16} />
                          }
                          <span>{derived.trendLabel}</span>
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