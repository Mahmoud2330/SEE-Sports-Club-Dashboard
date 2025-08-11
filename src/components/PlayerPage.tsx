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

const PlayerPage: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('3 Months');
  const [activeTest, setActiveTest] = useState('Vertical Jump');

  const periods = ['Last Month', '3 Months', '6 Months', 'This Year'];
  const physicalTests = ['Vertical Jump', 'Broad Jump', '10m Run', '5-10-5', 'T-Agility'];

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
    </div>
  );
};

export default PlayerPage; 