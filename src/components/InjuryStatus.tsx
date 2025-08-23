import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AlertTriangle, Activity, Check, Play } from 'lucide-react';

interface InjuryReason {
  code: string;
  label: string;
  weight: number;
}

type InjuryStatusValue = 'at-risk' | 'injured' | 'healthy';

interface InjuryData {
  playerId: number;
  status: InjuryStatusValue;
  bodyPart: string | null;
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

// Simple card used in your UI
const VideoCard: React.FC<{ video: { title: string; duration?: string; sectionType: 'physical' | 'skills' } }> = ({ video }) => {
  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <div className="play-button">
          <Play size={16} />
        </div>
        {video.duration && <div className="video-duration">{video.duration}</div>}
      </div>
      <div className="video-title-container">
        <p className="video-title-text">{video.title}</p>
        <div className={`video-title-underline ${video.sectionType === 'physical' ? 'physical-underline' : 'skills-underline'}`} />
      </div>
    </div>
  );
};

// =================== CONFIG ===================
const VIEWER_SRC    = "https://euphonious-eclair-d25580.netlify.app"; // your live viewer
const VIEWER_ORIGIN = "https://euphonious-eclair-d25580.netlify.app"; // lock to exact origin
// ==============================================

// Build the payload the viewer expects (injured > at-risk)
function buildInjuryPayload(rows: InjuryData[]): Record<string, 'injured' | 'risk'> {
  const map: Record<string, 'injured' | 'risk'> = {};
  for (const r of rows) {
    if (!r.bodyPart) continue;
    if (r.status === 'injured') {
      map[r.bodyPart] = 'injured';
    } else if (r.status === 'at-risk') {
      if (map[r.bodyPart] !== 'injured') map[r.bodyPart] = 'risk';
    }
  }
  return map;
}

const InjuryStatus: React.FC<InjuryStatusProps> = ({ playerId }) => {
  const [injurySummary, setInjurySummary] = useState<PlayerInjurySummary>({
    atRisk: null,
    injured: null,
    hasAnyInjuries: false
  });
  const [allRowsForPlayer, setAllRowsForPlayer] = useState<InjuryData[]>([]);
  const [expandedReason, setExpandedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // iframe + handshake
  const viewerRef = useRef<HTMLIFrameElement>(null);
  const viewerReady = useRef(false);

  // Listen for "viewerReady" from the iframe (handshake)
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== VIEWER_ORIGIN) return;
      if (e.data && typeof e.data === 'object' && e.data.type === 'viewerReady') {
        viewerReady.current = true;
        // Immediately send current data on ready
        const win = viewerRef.current?.contentWindow;
        if (win) {
          const payloadNow = buildInjuryPayload(allRowsForPlayer);
          win.postMessage({ type: 'injuryUpdate', payload: payloadNow }, VIEWER_ORIGIN);
        }
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [allRowsForPlayer]);

  // Fetch injuries.json and filter by player
  useEffect(() => {
    const fetchInjuryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/injuries.json');
        if (!response.ok) throw new Error('Failed to fetch injury data');
        const injuries: InjuryData[] = await response.json();

        const playerInjuries = injuries.filter(injury => injury.playerId === playerId);

        const summary: PlayerInjurySummary = {
          atRisk: playerInjuries.find(injury => injury.status === 'at-risk') || null,
          injured: playerInjuries.find(injury => injury.status === 'injured') || null,
          hasAnyInjuries: playerInjuries.some(injury => injury.status !== 'healthy')
        };

        setAllRowsForPlayer(playerInjuries);
        setInjurySummary(summary);
      } catch (error) {
        console.error('Error fetching injury data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInjuryData();
  }, [playerId]);

  const viewerPayload = useMemo(
    () => buildInjuryPayload(allRowsForPlayer),
    [allRowsForPlayer]
  );

  // Send to iframe whenever the payload changes (but only after ready)
  useEffect(() => {
    if (!viewerReady.current) return;
    const win = viewerRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: 'injuryUpdate', payload: viewerPayload }, VIEWER_ORIGIN);
  }, [viewerPayload]);

  // Backup: send once the iframe reports load
  const handleViewerLoad = () => {
    const win = viewerRef.current?.contentWindow;
    if (!win) return;
    setTimeout(() => {
      win.postMessage({ type: 'injuryUpdate', payload: viewerPayload }, VIEWER_ORIGIN);
    }, 150);
  };

  // ====== your existing UI below ======
  if (loading) {
    return (
      <div className="injury-status">
        <div className="injury-status__header"><h2 className="injury-status__title">Injury Status</h2></div>
        <div className="injury-status__content"><div className="loading-placeholder">Loading injury data...</div></div>
      </div>
    );
  }

  if (!injurySummary.hasAnyInjuries) {
    return (
      <div className="injury-status">
        <div className="injury-status__header"><h2 className="injury-status__title">Injury Status</h2></div>
        <div className="injury-status__content">
          <div className="healthy-status">
            <div className="healthy-status-icon"><Check className="check-icon" size={32} /></div>
            <div className="healthy-status-message">
              <p className="healthy-status-title">No Injuries Detected</p>
              <p className="healthy-status-subtitle">Player has no existing or predicted injuries. Keep monitoring and training to maintain this status.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasExistingInjuries = !!injurySummary.injured;
  const hasPredictedRisks   = !!injurySummary.atRisk || !!injurySummary.injured;

  const getStatusIcon = (status: string) =>
    status === 'injured'
      ? <AlertTriangle className="status-icon injured" size={16} />
      : status === 'at-risk'
      ? <Activity className="status-icon at-risk" size={16} />
      : <Check className="status-icon healthy" size={16} />;

  const getStatusColor = (status: string) =>
    status === 'injured' ? 'var(--db-danger-10)'
    : status === 'at-risk' ? 'var(--risk-yellow-10)'
    : 'var(--db-success-10)';

  const formatDate = (dateString: string | null) =>
    !dateString ? 'N/A' :
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="injury-status">
      <div className="injury-status__header"><h2 className="injury-status__title">Injury Status</h2></div>
      
      <div className="injury-status__layout">
        {/* Left Column */}
        <div className="injury-status__left">
          {hasExistingInjuries && injurySummary.injured && (
            <div className="injury-column">
              <h3 className="injury-column__title">Existing</h3>
              <div className="injury-column__content">
                {injurySummary.injured.reasons
                  .filter((r) => r.weight > 0.3)
                  .map((reason, i) => (
                    <div key={i} className="injury-item">
                      <button
                        className="injury-toggle"
                        onClick={() =>
                          setExpandedReason(expandedReason === `injured-${reason.code}` ? null : `injured-${reason.code}`)
                        }
                      >
                        <div className="injury-bullet1" style={{ backgroundColor: getStatusColor(injurySummary.injured!.status) }}>
                          <div className="injury-arrow1">{expandedReason === `injured-${reason.code}` ? '▼' : '▶'}</div>
                        </div>
                        <span className="injury-label">{reason.label}</span>
                      </button>
                      {expandedReason === `injured-${reason.code}` && (
                        <div className="injury-notes"><p>{injurySummary.injured!.notes}</p></div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {hasPredictedRisks && (
            <div className="injury-column">
              <h3 className="injury-column__title">Predicted</h3>
              <div className="injury-column__content">
                {injurySummary.atRisk && injurySummary.atRisk.reasons
                  .filter((r) => r.weight <= 0.3)
                  .map((reason, i) => (
                    <div key={`atrisk-${i}`} className="injury-item">
                      <button
                        className="injury-toggle"
                        onClick={() =>
                          setExpandedReason(expandedReason === `atrisk-${reason.code}` ? null : `atrisk-${reason.code}`)
                        }
                      >
                        <div className="injury-bullet2" style={{ backgroundColor: getStatusColor('at-risk') }}>
                          <div className="injury-arrow2">{expandedReason === `atrisk-${reason.code}` ? '▼' : '▶'}</div>
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
                          {reason.code === 'form' && (
                            <div className="injury-video-reference">
                              <h4>Reference Video:</h4>
                              <VideoCard video={{ title: "Vertical Jump", duration: "2:34", sectionType: "physical" }} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                {injurySummary.injured && injurySummary.injured.reasons
                  .filter((r) => r.weight <= 0.3)
                  .map((reason, i) => (
                    <div key={`injured-${i}`} className="injury-item">
                      <button
                        className="injury-toggle"
                        onClick={() =>
                          setExpandedReason(expandedReason === `injured-${reason.code}` ? null : `injured-${reason.code}`)
                        }
                      >
                        <div className="injury-bullet2" style={{ backgroundColor: getStatusColor('at-risk') }}>
                          <div className="injury-arrow2">{expandedReason === `injured-${reason.code}` ? '▼' : '▶'}</div>
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

        {/* Right Column: 3D Viewer */}
        {(injurySummary.atRisk || injurySummary.injured) && (
          <div className="injury-status__right">
            <div className="injury-right-container">
              <h3 className="injury-right-title">Injury 3D Viewer</h3>
              <div className="injury-right-content">
                <div className="anatomy-viewer-container">
                  <iframe
                    ref={viewerRef}
                    src={VIEWER_SRC}
                    style={{ width: "100%", height: "100%", border: 0 }}
                    title="3D Anatomy Viewer"
                    loading="lazy"
                    allow="xr-spatial-tracking; fullscreen"
                    className="anatomy-viewer-iframe"
                    onLoad={handleViewerLoad}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {(injurySummary.atRisk || injurySummary.injured) && injurySummary.injured?.expectedEnd && (
        <div className="injury-details">
          <div className="summary-item">
            <span className="summary-label">Expected Return:</span>
            <span className="summary-value">{formatDate(injurySummary.injured.expectedEnd)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InjuryStatus;