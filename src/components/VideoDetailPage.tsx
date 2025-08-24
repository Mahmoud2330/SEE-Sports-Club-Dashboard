import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, Maximize, Clock, Target, TrendingUp } from 'lucide-react';

interface VideoMetrics {
  title: string;
  duration: string;
  category: 'physical' | 'skills';
  highlights: string[];
  performanceMetrics: {
    score: number;
    maxScore: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  };
  analysis: {
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
  timestamp: string;
  coachNotes: string;
}

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set(['vertical-jump']));
  const [hiddenTests, setHiddenTests] = useState<Set<string>>(new Set());

  // Video data for the current video
  const [videoData, setVideoData] = useState<VideoMetrics | null>(null);
  // All test metrics data
  const [testMetricsData, setTestMetricsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load both current video data and all test metrics
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load current video data
        const mockVideoData: VideoMetrics = {
          title: 'Vertical Jump Test',
          duration: '0:52',
          category: 'physical',
          highlights: [
            'Excellent explosive power from legs',
            'Good arm swing coordination',
            'Proper landing technique',
            'Consistent jump height across attempts'
          ],
          performanceMetrics: {
            score: 85,
            maxScore: 100,
            unit: 'cm',
            trend: 'up'
          },
          analysis: {
            strengths: [
              'Strong lower body power',
              'Good technique execution',
              'Consistent performance'
            ],
            areasForImprovement: [
              'Could improve arm swing timing',
              'Landing could be more controlled'
            ],
            recommendations: [
              'Focus on arm swing coordination drills',
              'Practice landing technique with soft surfaces',
              'Continue explosive power training'
            ]
          },
          timestamp: '2024-01-15',
          coachNotes: 'Player shows excellent progress in vertical jump performance. Technique has improved significantly over the past month. Continue with current training program.'
        };
        
        setVideoData(mockVideoData);

        // Load all test metrics data from videos.json
        try {
          const response = await fetch('/data/videos.json');
          const data = await response.json();
          setTestMetricsData(data.videos);
        } catch (error) {
          console.error('Error loading test metrics:', error);
          // Fallback data if fetch fails
          setTestMetricsData({
            'vertical-jump': {
              title: 'Vertical Jump',
              highlights: ['Excellent explosive power from legs', 'Good arm swing coordination'],
              category: 'physical'
            },
            '10-meter-run': {
              title: '10 Meter Run',
              highlights: ['Speed and acceleration test', 'Sprint performance measurement'],
              category: 'physical'
            },
            '5-10-5': {
              title: '5-10-5',
              highlights: ['Agility test', 'Change of direction speed'],
              category: 'physical'
            },
            'broad-jump': {
              title: 'Broad Jump',
              highlights: ['Horizontal jump test', 'Explosive power measurement'],
              category: 'physical'
            },
            't-agility': {
              title: 'T-Agility',
              highlights: ['T-shaped agility course', 'Lateral movement testing'],
              category: 'physical'
            }
          });
        }
      } catch (error) {
        console.error('Error loading video data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [videoId]);

  const handleBack = () => {
    navigate(-1);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleTestExpansion = (testId: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  const isTestExpanded = (testId: string) => expandedTests.has(testId);

  const hideTest = (testId: string) => {
    const newHidden = new Set(hiddenTests);
    newHidden.add(testId);
    setHiddenTests(newHidden);
    // Also collapse the test if it was expanded
    const newExpanded = new Set(expandedTests);
    newExpanded.delete(testId);
    setExpandedTests(newExpanded);
  };

  const resetHiddenTests = () => {
    setHiddenTests(new Set());
  };

  const isTestHidden = (testId: string) => hiddenTests.has(testId);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="video-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading video analysis...</p>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="video-detail-error">
        <h2>Video not found</h2>
        <button onClick={handleBack} className="btn btn--primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="video-detail-page">
      {/* Header */}
      <div className="video-detail-header">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={20} />
          Back to Analysis
        </button>
        <h1>{videoData.title}</h1>
        <div className="video-meta">
          <span className="video-category">{videoData.category.toUpperCase()}</span>
          <span className="video-duration">{videoData.duration}</span>
          <span className="video-date">{videoData.timestamp}</span>
        </div>
      </div>

      <div className="video-detail-content">
        {/* Video Player Section */}
        <div className="video-player-section">
          <div className="video-container">
            <div className="video-placeholder">
              {/* This will be replaced with actual video player */}
              <div className="video-placeholder-content">
                <div className="play-icon-large">
                  <Play size={48} />
                </div>
                <p>Video Player - {videoData.title}</p>
                <p className="video-placeholder-note">Actual video content will be loaded here</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="video-controls">
              <button onClick={togglePlay} className="control-btn play-btn">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
              </div>
              
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <div className="volume-control">
                <Volume2 size={16} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              
              <button className="control-btn fullscreen-btn">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Test Metrics Sidebar */}
        <div className="test-metrics-sidebar">
          <div className="sidebar-header">
            {hiddenTests.size > 0 && (
              <button className="reset-btn" onClick={resetHiddenTests}>
                Reset
              </button>
            )}
          </div>
          
          {/* Vertical Jump - Current Test (Highlighted) */}
          {!isTestHidden('vertical-jump') && testMetricsData && (
            <div className="test-metric-item current-test">
              <div className="test-metric-header" onClick={() => toggleTestExpansion('vertical-jump')}>
                <div className="test-metric-info">
                  <div className={`test-icon ${testMetricsData['vertical-jump']?.category === 'physical' ? 'physical-icon' : 'skills-icon'}`}>
                    <Target size={20} />
                  </div>
                  <div className="test-details">
                    <h4 className="test-name">{testMetricsData['vertical-jump']?.title || 'Vertical Jump'}</h4>
                    {isTestExpanded('vertical-jump') && (
                      <p className="test-description">{testMetricsData['vertical-jump']?.highlights?.join(', ') || 'No highlights available'}</p>
                    )}
                  </div>
                </div>
                <button className="hide-btn" onClick={(e) => { e.stopPropagation(); hideTest('vertical-jump'); }}>Hide</button>
              </div>
            </div>
          )}

          {/* 10 Meter Run */}
          {!isTestHidden('10-meter-run') && testMetricsData && (
            <div className="test-metric-item">
              <div className="test-metric-header" onClick={() => toggleTestExpansion('10-meter-run')}>
                <div className="test-metric-info">
                  <div className={`test-icon ${testMetricsData['10-meter-run']?.category === 'physical' ? 'physical-icon' : 'skills-icon'}`}>
                    <Clock size={20} />
                  </div>
                  <div className="test-details">
                    <h4 className="test-name">{testMetricsData['10-meter-run']?.title || '10 Meter Run'}</h4>
                    {isTestExpanded('10-meter-run') && (
                      <p className="test-description">{testMetricsData['10-meter-run']?.highlights?.join(', ') || 'No highlights available'}</p>
                    )}
                  </div>
                </div>
                <button className="hide-btn" onClick={(e) => { e.stopPropagation(); hideTest('10-meter-run'); }}>Hide</button>
              </div>
            </div>
          )}

          {/* 5-10-5 */}
          {!isTestHidden('5-10-5') && testMetricsData && (
            <div className="test-metric-item">
              <div className="test-metric-header" onClick={() => toggleTestExpansion('5-10-5')}>
                <div className="test-metric-info">
                  <div className={`test-icon ${testMetricsData['5-10-5']?.category === 'physical' ? 'physical-icon' : 'skills-icon'}`}>
                    <TrendingUp size={20} />
                  </div>
                  <div className="test-details">
                    <h4 className="test-name">{testMetricsData['5-10-5']?.title || '5-10-5'}</h4>
                    {isTestExpanded('5-10-5') && (
                      <p className="test-description">{testMetricsData['5-10-5']?.highlights?.join(', ') || 'No highlights available'}</p>
                    )}
                  </div>
                </div>
                <button className="hide-btn" onClick={(e) => { e.stopPropagation(); hideTest('5-10-5'); }}>Hide</button>
              </div>
            </div>
          )}

          {/* Broad Jump */}
          {!isTestHidden('broad-jump') && testMetricsData && (
            <div className="test-metric-item">
              <div className="test-metric-header" onClick={() => toggleTestExpansion('broad-jump')}>
                <div className="test-metric-info">
                  <div className={`test-icon ${testMetricsData['broad-jump']?.category === 'physical' ? 'physical-icon' : 'skills-icon'}`}>
                    <Target size={20} />
                  </div>
                  <div className="test-details">
                    <h4 className="test-name">{testMetricsData['broad-jump']?.title || 'Broad Jump'}</h4>
                    {isTestExpanded('broad-jump') && (
                      <p className="test-description">{testMetricsData['broad-jump']?.highlights?.join(', ') || 'No highlights available'}</p>
                    )}
                  </div>
                </div>
                <button className="hide-btn" onClick={(e) => { e.stopPropagation(); hideTest('broad-jump'); }}>Hide</button>
              </div>
            </div>
          )}

          {/* T-Agility */}
          {!isTestHidden('t-agility') && testMetricsData && (
            <div className="test-metric-item">
              <div className="test-metric-header" onClick={() => toggleTestExpansion('t-agility')}>
                <div className="test-metric-info">
                  <div className={`test-icon ${testMetricsData['t-agility']?.category === 'physical' ? 'physical-icon' : 'skills-icon'}`}>
                    <TrendingUp size={20} />
                  </div>
                  <div className="test-details">
                    <h4 className="test-name">{testMetricsData['t-agility']?.title || 'T-Agility'}</h4>
                    {isTestExpanded('t-agility') && (
                      <p className="test-description">{testMetricsData['t-agility']?.highlights?.join(', ') || 'No highlights available'}</p>
                    )}
                  </div>
                </div>
                <button className="hide-btn" onClick={(e) => { e.stopPropagation(); hideTest('t-agility'); }}>Hide</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
