import React, { useState, useEffect } from 'react';
import PlayerOverview from './PlayerOverview';
import SkillsDevelopmentAnalysis from './SkillsDevelopmentAnalysis';
import PhysicalPerformance from './PhysicalPerformance';
import PerformanceChart from './PerformanceChart';
import SkillChart from './SkillChart';
import VideoAnalysis from './VideoAnalysis';
import InjuryStatus from './InjuryStatus';
import SkillDevelopment from './SkillDevelopment';
import AssessmentNotes from './AssessmentNotes';
import ChatWidget from './ChatWidget';
import { useParams } from 'react-router-dom';
import { dataService } from '../services/dataService';
import type { Player, Team } from '../services/dataService';

const PlayerPage: React.FC = () => {
  const { id: playerId } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  // State for assessment notes
  const [shouldShowAssessmentNotes, setShouldShowAssessmentNotes] = useState(false);
  const [teamTier, setTeamTier] = useState<string | undefined>(undefined);
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);

  // Check if player should show assessment notes and get team info
  useEffect(() => {
    const checkAssessmentNotes = async () => {
      if (!playerId) return;
      
      try {
        const shouldShow = await dataService.shouldShowAssessmentNotes(playerId);
        setShouldShowAssessmentNotes(shouldShow);
        
        const playerData = await dataService.getPlayerById(playerId);
        if (playerData) {
          setPlayer(playerData);

          const [tier, team] = await Promise.all([
            dataService.getTeamTier(playerData.teamId),
            dataService.getTeamById(playerData.teamId),
          ]);
          setTeamTier(tier);
          setCurrentTeam(team);
        } else {
          setError('Player not found');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error checking assessment notes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load player data');
        setLoading(false);
      }
    };

    checkAssessmentNotes();
  }, [playerId]);

  // Determine if chat widget should be shown based on team tier
  const canShowChat = currentTeam?.tier ? 
    ["PLATINUM", "PREMIUM"].includes(currentTeam.tier.toUpperCase()) : false;

  // Loading and error states
  if (loading) {
    return (
      <div className="player-page">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading player data...</div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="player-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-danger)' }}>
          <div>Error: {error || "Player not found"}</div>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-page">
      {/* Top Bar + header, uses its own data fetch internally (kept as-is) */}
      <PlayerOverview   />

      {/* Skills Development Analysis (kept as-is) */}
      <SkillsDevelopmentAnalysis player={player} />

      {/* Physical Performance Section (kept as-is) */}
      <PhysicalPerformance player={player} />

      {/* Skill Development (kept as-is) */}
      <SkillDevelopment player={player} />
      
      {/* Performance Chart (kept as-is) */}
      <PerformanceChart player={player} playerName={player.name} />
      
      {/* Skill Chart (kept as-is) */}
      <SkillChart player={player} playerName={player.name} />
  
      {/* Video Analysis (kept as-is) */}
      <VideoAnalysis />

      {/* Injury Status (kept as-is) */}
      <InjuryStatus playerId={parseInt(playerId || '0', 10)} />

      {/* Assessment Notes - Only for Platinum/Premium teams */}
      {shouldShowAssessmentNotes && teamTier && (
        <div style={{ marginTop: '24px' }}>
          <AssessmentNotes teamTier={teamTier} player={player} />
        </div>
      )}
      
      {/* Floating chat bot for Premium/Platinum only */}
      {canShowChat && <ChatWidget />}
    </div>
  );
};

export default PlayerPage;
