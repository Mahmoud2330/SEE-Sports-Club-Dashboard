import React, { useState } from 'react';
import { Share2, Filter, ChevronRight, User, TrendingUp } from 'lucide-react';
import PlayerOverview from './PlayerOverview';
import PlayerCard from './PlayerCard';
import SkillsDevelopmentAnalysis from './SkillsDevelopmentAnalysis';
import PhysicalPerformance from './PhysicalPerformance';
import PerformanceChart from './PerformanceChart';
import SkillChart from './SkillChart';
import VideoAnalysis from './VideoAnalysis';
import SkillDevelopment from './SkillDevelopment';
import AssessmentNotes from './AssessmentNotes';
import ChatWidget from './ChatWidget';
import { useParams } from 'react-router-dom';

// Import the same mock data structure used in TeamsPage
const mockTeams = {
  'team-a': { tier: 'STANDARD' },
  'team-b': { tier: 'PREMIUM' },
  'team-c': { tier: 'PLATINUM' }
};

const mockPlayers = [
  { id: '1', teamId: 'team-c' },
  { id: '16', teamId: 'team-c' },
  { id: '15', teamId: 'team-c' },
  { id: '14', teamId: 'team-c' },
  { id: '13', teamId: 'team-c' },
  { id: '12', teamId: 'team-c' },
  { id: '2', teamId: 'team-b' },
  { id: '3', teamId: 'team-b' },
  { id: '4', teamId: 'team-b' },
  { id: '5', teamId: 'team-b' },
  { id: '6', teamId: 'team-b' },
  { id: '7', teamId: 'team-a' },
  { id: '8', teamId: 'team-a' },
  { id: '9', teamId: 'team-a' },
  { id: '10', teamId: 'team-a' },
  { id: '11', teamId: 'team-a' },
  { id: '17', teamId: 'team-a' },
];

const PlayerPage: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('3 Months');
  const [activeTest, setActiveTest] = useState('Vertical Jump');
  const { id: playerId } = useParams<{ id: string }>();

  const periods = ['Last Month', '3 Months', '6 Months', 'This Year'];
  const physicalTests = ['Vertical Jump', 'Broad Jump', '10m Run', '5-10-5', 'T-Agility'];

  // Get team information from the player data
  const getPlayerTeamInfo = (playerId: string) => {
    const player = mockPlayers.find(p => p.id === playerId);
    return player ? mockTeams[player.teamId as keyof typeof mockTeams] : null;
  };

  const playerTeam = playerId ? getPlayerTeamInfo(playerId) : null;
  const shouldShowAssessmentNotes = playerTeam && (playerTeam.tier === 'PLATINUM' || playerTeam.tier === 'PREMIUM');

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
        <PerformanceChart playerName="Ahmed Mohamed" />
        
        {/* Skill Chart */}
        <SkillChart playerName="Ahmed Mohamed" />
    
        {/* Video Analysis */}
        <VideoAnalysis />
        
        {/* Assessment Notes - Only for Platinum/Premium teams */}
        {shouldShowAssessmentNotes && playerTeam && (
          <div style={{ marginTop: '24px' }}>
            <AssessmentNotes teamTier={playerTeam.tier} />
          </div>
        )}
        
        {/* Floating chat bot */}
        <ChatWidget />
    </div>
  );
};

export default PlayerPage; 