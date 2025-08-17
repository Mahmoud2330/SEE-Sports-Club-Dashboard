import React, { useState, useEffect } from 'react';
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
import { dataService } from '../services/dataService';

const PlayerPage: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('3 Months');
  const [activeTest, setActiveTest] = useState('Vertical Jump');
  const { id: playerId } = useParams<{ id: string }>();

  const periods = ['Last Month', '3 Months', '6 Months', 'This Year'];
  const physicalTests = ['Vertical Jump', 'Broad Jump', '10m Run', '5-10-5', 'T-Agility'];

  // State for assessment notes
  const [shouldShowAssessmentNotes, setShouldShowAssessmentNotes] = useState(false);
  const [teamTier, setTeamTier] = useState<string | undefined>(undefined);

  // Check if player should show assessment notes
  useEffect(() => {
    const checkAssessmentNotes = async () => {
      if (!playerId) return;
      
      try {
        const shouldShow = await dataService.shouldShowAssessmentNotes(playerId);
        setShouldShowAssessmentNotes(shouldShow);
        
        if (shouldShow) {
          const player = await dataService.getPlayerById(playerId);
          if (player) {
            const tier = await dataService.getTeamTier(player.teamId);
            setTeamTier(tier);
          }
        }
      } catch (err) {
        console.error('Error checking assessment notes:', err);
      }
    };

    checkAssessmentNotes();
  }, [playerId]);

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
        {shouldShowAssessmentNotes && teamTier && (
          <div style={{ marginTop: '24px' }}>
            <AssessmentNotes teamTier={teamTier} />
          </div>
        )}
        
        {/* Floating chat bot */}
        <ChatWidget />
    </div>
  );
};

export default PlayerPage; 