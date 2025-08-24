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

  // Mock data - this will be replaced with actual JSON data later
  const [videoData, setVideoData] = useState<VideoMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading video data
    // This will be replaced with actual API call to your JSON file
    const loadVideoData = async () => {
      setIsLoading(true);
      try {
        // Mock data for now - replace with actual fetch
        const mockData: VideoMetrics = {
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
        
        setVideoData(mockData);
      } catch (error) {
        console.error('Error loading video data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoData();
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

        {/* Metrics and Analysis Section */}
        <div className="video-metrics-section">
          {/* Performance Score */}
          <div className="metric-card performance-score">
            <div className="metric-header">
              <Target size={20} />
              <h3>Performance Score</h3>
            </div>
            <div className="score-display">
              <span className="score-value">{videoData.performanceMetrics.score}</span>
              <span className="score-max">/ {videoData.performanceMetrics.maxScore}</span>
              <span className="score-unit">{videoData.performanceMetrics.unit}</span>
            </div>
            <div className={`score-trend ${videoData.performanceMetrics.trend}`}>
              <TrendingUp size={16} />
              <span>Improving</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="metric-card highlights">
            <div className="metric-header">
              <Clock size={20} />
              <h3>Key Highlights</h3>
            </div>
            <ul className="highlights-list">
              {videoData.highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">
                  <span className="highlight-bullet"></span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* Analysis */}
          <div className="metric-card analysis">
            <div className="metric-header">
              <TrendingUp size={20} />
              <h3>Performance Analysis</h3>
            </div>
            
            <div className="analysis-section">
              <h4>Strengths</h4>
              <ul className="analysis-list strengths">
                {videoData.analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h4>Areas for Improvement</h4>
              <ul className="analysis-list improvements">
                {videoData.analysis.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h4>Recommendations</h4>
              <ul className="analysis-list recommendations">
                {videoData.analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coach Notes */}
          <div className="metric-card coach-notes">
            <div className="metric-header">
              <h3>Coach Notes</h3>
            </div>
            <p className="notes-text">{videoData.coachNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
