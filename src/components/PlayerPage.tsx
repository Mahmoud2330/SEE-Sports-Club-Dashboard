import React, { useState, useEffect, useMemo } from 'react';
import { Share2, Filter, ChevronRight, User, TrendingUp } from 'lucide-react';
import PlayerOverview from './PlayerOverview';
import PlayerCard from './PlayerCard';
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
  const [activePeriod, setActivePeriod] = useState('3 Months');
  const [activeTest, setActiveTest] = useState('Vertical Jump');
  const { id: playerId } = useParams<{ id: string }>();

  const periods = ['Last Month', '3 Months', '6 Months', 'This Year'];
  const physicalTests = ['Vertical Jump', 'Broad Jump', '10m Run', '5-10-5', 'T-Agility'];

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
        
        if (shouldShow) {
          const playerData = await dataService.getPlayerById(playerId);
          if (playerData) {
            setPlayer(playerData);
            const tier = await dataService.getTeamTier(playerData.teamId);
            setTeamTier(tier);
            
            // Get team info for chat widget
            const team = await dataService.getTeamById(playerData.teamId);
            setCurrentTeam(team);
          }
        } else {
          // Even if no assessment notes, get player and team for chat widget
          const playerData = await dataService.getPlayerById(playerId);
          if (playerData) {
            setPlayer(playerData);
            const team = await dataService.getTeamById(playerData.teamId);
            setCurrentTeam(team);
          }
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
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff9898' }}>
          <div>Error: {error || "Player not found"}</div>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-page">
        {/* Top Bar */}
        <PlayerOverview />

        {/* Skills Development Analysis */}
        <SkillsDevelopmentAnalysis />

        {/* Physical Performance Section */}
        <PhysicalPerformance />
    
        {/* Skill Development */}
        <SkillDevelopment />
        
        {/* Performance Chart */}
        <PerformanceChart playerName={player.name} />
        
        {/* Skill Chart */}
        <SkillChart playerName={player.name} />
    
        {/* Video Analysis */}
        <VideoAnalysis />

        {/* Injury Status */}
        <InjuryStatus playerId={parseInt(playerId || '0', 10)} />

        {/* Assessment Notes - Only for Platinum/Premium teams */}
        {shouldShowAssessmentNotes && teamTier && (
          <div style={{ marginTop: '24px' }}>
            <AssessmentNotes teamTier={teamTier} />
          </div>
        )}
        
        {/* Floating chat bot */}
        {canShowChat && <ChatWidget />}
    </div>
  );
};

export default PlayerPage; 