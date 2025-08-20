import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Check, Play } from 'lucide-react';

interface InjuryReason {
  code: string;
  label: string;
  weight: number;
}

interface InjuryData {
  playerId: number;
  status: 'at-risk' | 'injured' | 'healthy';
  riskScore: number;
  confidence: number;
  expectedStart: string | null;
  expectedEnd: string | null;
  reasons: InjuryReason[];
  notes: string;
}

interface PlayerInjurySummary {
  atRisk: InjuryData | null;
  injured: InjuryData | null;
  hasAnyInjuries: boolean;
}

interface InjuryStatusProps {
  playerId: number;
}

// Video Card component for injury references
const VideoCard: React.FC<{ video: { title: string; duration?: string; sectionType: 'physical' | 'skills' } }> = ({ video }) => {
  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <div className="play-button">
          <Play size={16} />
        </div>
        {video.duration && (
          <div className="video-duration">{video.duration}</div>
        )}
      </div>
      <div className="video-title-container">
        <p className="video-title-text">{video.title}</p>
        <div className={`video-title-underline ${video.sectionType === 'physical' ? 'physical-underline' : 'skills-underline'}`}></div>
      </div>
    </div>
  );
};



const InjuryStatus: React.FC<InjuryStatusProps> = ({ playerId }) => {
  const [injurySummary, setInjurySummary] = useState<PlayerInjurySummary>({
    atRisk: null,
    injured: null,
    hasAnyInjuries: false
  });
  const [expandedReason, setExpandedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInjuryData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/data/injuries.json');
        if (!response.ok) throw new Error('Failed to fetch injury data');
        
        const injuries: InjuryData[] = await response.json();
        const playerInjuries = injuries.filter(injury => injury.playerId === playerId);
        
        console.log('All injuries data:', injuries);
        console.log('Player ID:', playerId);
        console.log('Player injuries:', playerInjuries);
        
        const summary: PlayerInjurySummary = {
          atRisk: playerInjuries.find(injury => injury.status === 'at-risk') || null,
          injured: playerInjuries.find(injury => injury.status === 'injured') || null,
          hasAnyInjuries: playerInjuries.some(injury => injury.status !== 'healthy')
        };
        
        console.log('Injury summary:', summary);
        setInjurySummary(summary);
      } catch (error) {
        console.error('Error fetching injury data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInjuryData();
  }, [playerId]);

  if (loading) {
    return (
      <div className="injury-status">
        <div className="injury-status__header">
          <h2 className="injury-status__title">Injury Status</h2>
        </div>
        <div className="injury-status__content">
          <div className="loading-placeholder">Loading injury data...</div>
        </div>
      </div>
    );
  }

  if (!injurySummary.hasAnyInjuries) {
    return (
      <div className="injury-status">
        <div className="injury-status__header">
          <h2 className="injury-status__title">Injury Status</h2>
        </div>
        <div className="injury-status__content">
          <div className="healthy-status">
            <div className="healthy-status-icon">
              <Check className="check-icon" size={32} />
            </div>
            <div className="healthy-status-message">
              <p className="healthy-status-title">No Injuries Detected</p>
              <p className="healthy-status-subtitle">Player has no existing or predicted injuries. Keep monitoring and training to maintain this status.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasExistingInjuries = injurySummary.injured !== null;
  const hasPredictedRisks = injurySummary.atRisk !== null || injurySummary.injured !== null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'injured':
        return <AlertTriangle className="status-icon injured" size={16} />;
      case 'at-risk':
        return <Activity className="status-icon at-risk" size={16} />;
      default:
        return <Check className="status-icon healthy" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'injured':
        return 'var(--db-danger-10)';
      case 'at-risk':
        return 'var(--risk-yellow-10)';
      default:
        return 'var(--db-success-10)';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="injury-status">
      <div className="injury-status__header">
        <h2 className="injury-status__title">Injury Status</h2>
      </div>
      
      <div className="injury-status__layout">
        {/* Left Column: Stacked Existing and Predicted */}
        <div className="injury-status__left">
          {/* Existing Injuries Column */}
          {hasExistingInjuries && injurySummary.injured && (
            <div className="injury-column">
              <h3 className="injury-column__title">Existing</h3>
              <div className="injury-column__content">
                {injurySummary.injured.reasons
                  .filter((reason: InjuryReason) => reason.weight > 0.3) // Show only significant reasons
                  .map((reason: InjuryReason, index: number) => (
                    <div key={index} className="injury-item">
                      <button
                        className="injury-toggle"
                        onClick={() => setExpandedReason(
                          expandedReason === `injured-${reason.code}` ? null : `injured-${reason.code}`
                        )}
                      >
                        <div 
                          className="injury-bullet1"
                          style={{ backgroundColor: getStatusColor(injurySummary.injured!.status) }}
                        >
                          <div className="injury-arrow1">
                            {expandedReason === `injured-${reason.code}` ? '▼' : '▶'}
                          </div>
                        </div>
                        <span className="injury-label">{reason.label}</span>
                      </button>
                      
                      {expandedReason === `injured-${reason.code}` && (
                        <div className="injury-notes">
                          <p>{injurySummary.injured!.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Predicted/At-Risk Column */}
          {hasPredictedRisks && (
            <div className="injury-column">
              <h3 className="injury-column__title">Predicted</h3>
              <div className="injury-column__content">
                {/* Show at-risk reasons */}
                {injurySummary.atRisk && injurySummary.atRisk.reasons
                  .filter((reason: InjuryReason) => reason.weight <= 0.3) // Show lower weight reasons as predictions
                  .map((reason: InjuryReason, index: number) => (
                    <div key={`atrisk-${index}`} className="injury-item">
                      <button
                        className="injury-toggle"
                        onClick={() => setExpandedReason(
                          expandedReason === `atrisk-${reason.code}` ? null : `atrisk-${reason.code}`
                        )}
                      >
                        <div 
                          className="injury-bullet2"
                          style={{ backgroundColor: getStatusColor('at-risk') }}
                        >
                          <div className="injury-arrow2">
                            {expandedReason === `atrisk-${reason.code}` ? '▼' : '▶'}
                          </div>
                        </div>
                        <span className="injury-label">{reason.label}</span>
                      </button>
                      
                      {expandedReason === `atrisk-${reason.code}` && (
                        <div className="injury-notes">
                          <p>{injurySummary.atRisk!.notes}</p>
                          <div className="injury-meta">
                            <span>Risk Score: {(reason.weight * 100).toFixed(0)}%</span>
                            <span>Confidence: {(injurySummary.atRisk!.confidence * 100).toFixed(0)}%</span>
                          </div>
                          
                          {/* Video reference for Wrong Form */}
                          {reason.code === 'form' && (
                            <div className="injury-video-reference">
                              <h4>Reference Video:</h4>
                              <VideoCard 
                                video={{
                                  title: "Vertical Jump",
                                  duration: "2:34",
                                  sectionType: "physical"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                
                {/* Show injured reasons with lower weights as predictions */}
                {injurySummary.injured && injurySummary.injured.reasons
                  .filter((reason: InjuryReason) => reason.weight <= 0.3) // Show lower weight reasons as predictions
                  .map((reason: InjuryReason, index: number) => (
                    <div key={`injured-${index}`} className="injury-item">
                      <button
                        className="injury-toggle"
                        onClick={() => setExpandedReason(
                          expandedReason === `injured-${reason.code}` ? null : `injured-${reason.code}`
                        )}
                      >
                        <div 
                          className="injury-bullet2"
                          style={{ backgroundColor: getStatusColor('at-risk') }}
                        >
                          <div className="injury-arrow2">
                            {expandedReason === `injured-${reason.code}` ? '▼' : '▶'}
                          </div>
                        </div>
                        <span className="injury-label">{reason.label}</span>
                      </button>
                      
                      {expandedReason === `injured-${reason.code}` && (
                        <div className="injury-notes">
                          <p>{injurySummary.injured!.notes}</p>
                          <div className="injury-meta">
                            <span>Risk Score: {(reason.weight * 100).toFixed(0)}%</span>
                            <span>Confidence: {(injurySummary.injured!.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Container for future content (only visible when injuries exist) */}
        {(injurySummary.atRisk || injurySummary.injured) && (
          <div className="injury-status__right">
            <div className="injury-right-container">
              <h3 className="injury-right-title">Injury 3D Viewer</h3>
              <div className="injury-right-content">
                <div className="anatomy-viewer-container">
                  <iframe
                    src="https://euphonious-eclair-d25580.netlify.app"
                    style={{ width: "100%", height: "100%", border: 0 }}
                    title="3D Anatomy Viewer"
                    loading="lazy"
                    allow="xr-spatial-tracking; fullscreen"
                    className="anatomy-viewer-iframe"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Injury Information */}
      {(injurySummary.atRisk || injurySummary.injured) && (
        <div className="injury-details">
            {injurySummary.injured?.expectedEnd && (
              <div className="summary-item">
                <span className="summary-label">Expected Return:</span>
                <span className="summary-value">{formatDate(injurySummary.injured.expectedEnd)}</span>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default InjuryStatus;
