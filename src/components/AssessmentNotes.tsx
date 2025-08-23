import React from 'react';
import { StickyNote, Zap, Target } from 'lucide-react';
import type { Player } from '../services/dataService';

interface AssessmentNotesProps {
  teamTier?: string;
  player?: Player;
}

const AssessmentNotes: React.FC<AssessmentNotesProps> = ({ teamTier, player }) => {
  // Only show for platinum or premium teams
  const isPlatinumOrPremium = teamTier && (teamTier === 'PLATINUM' || teamTier === 'PREMIUM');
  
  if (!isPlatinumOrPremium) {
    return null;
  }

  // Get assessment notes from player data or use fallback
  const assessmentNotes = player?.['Assessment Notes'];
  
  // Fallback data if no player assessment notes available
  const fallbackNotes = {
    'Physical Assessments': {
      'Vertical Jump': [
        'Needs to focus on arm swing coordination',
        'Landing technique could be refined',
        'Good explosive power from legs'
      ],
      'Broad Jump': [
        'Strong leg drive during jump phase',
        'Excellent horizontal distance achieved',
        'Could improve arm positioning'
      ],
      '10 Meter Run': [
        'Maintain running form at high speed',
        'Focus on stride frequency',
        'Good acceleration phase'
      ],
      'Five Ten Five': [
        'Deceleration technique improving',
        'Work on maintaining speed through turns',
        'Good change of direction'
      ],
      'T-Agility': [
        'Good body positioning during cuts',
        'Consistent times across multiple attempts',
        'Could improve lateral movement speed'
      ]
    },
    'Skills Assessments': {
      'Ball Control': [
        'Excellent first touch under pressure',
        'Good use of both feet for control',
        'Maintains control in tight spaces'
      ],
      'Passing': [
        'Improve passing under defensive pressure',
        'Good vision for through balls',
        'Accurate short-range passing'
      ],
      '1v1': [
        'Good use of body feints and skills',
        'Work on finishing after beating defender',
        'Excellent dribbling technique'
      ],
      'Running with Ball': [
        'Close control at speed is excellent',
        'Keep head up more to spot teammates',
        'Good acceleration with ball'
      ],
      'Shooting': [
        'Powerful shots with good accuracy',
        'Good composure in front of goal',
        'Could improve weak foot shooting'
      ]
    }
  };

  // Use player data if available, otherwise fallback
  const notes = assessmentNotes || fallbackNotes;

  const getTierLabel = () => {
    if (teamTier === 'PLATINUM') return 'Platinum Tier';
    if (teamTier === 'PREMIUM') return 'Premium Tier';
    return '';
  };

  const getTierColor = () => {
    if (teamTier === 'PLATINUM') return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500';
    if (teamTier === 'PREMIUM') return 'bg-dashboard-primary/10 border-dashboard-primary/20 text-dashboard-primary';
    return '';
  };

  const getTierDotColor = () => {
    if (teamTier === 'PLATINUM') return 'bg-yellow-500';
    if (teamTier === 'PREMIUM') return 'bg-dashboard-primary';
    return '';
  };

  return (
    <section className="space-y-6 transition-all duration-500 opacity-100 scale-100" aria-labelledby="assessment-notes-heading">
      <div className="bg-dashboard-card rounded-lg border border-dashboard-border overflow-hidden shadow-lg">
        <div className="p-6 border-b border-dashboard-border">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-dashboard-primary/20 flex items-center justify-center">
                  <StickyNote className="w-5 h-5 text-dashboard-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="assessment-notes-heading" className="text-xl lg:text-2xl font-bold text-dashboard-primary">
                    Assessment Notes
                  </h2>
                  <div className="text-dashboard-text-muted text-sm">
                    Detailed observations
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getTierColor()}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${getTierDotColor()}`}></div>
              <span className="text-sm font-medium">{getTierLabel()}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Physical Assessments */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-dashboard-border/30">
                <div className="w-8 h-8 rounded-lg bg-dashboard-success/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-dashboard-success" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-dashboard-success">Physical Assessments</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(notes['Physical Assessments']).map(([testName, testNotes]) => (
                  <div key={testName} className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                    <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
                      {testName}
                    </h4>
                    <div className="space-y-2">
                      {testNotes.map((note, index) => (
                        <div key={index} className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skills Assessments */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-dashboard-border/30">
                <div className="w-8 h-8 rounded-lg bg-dashboard-primary/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-dashboard-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-dashboard-primary">Skills Assessments</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(notes['Skills Assessments']).map(([skillName, skillNotes]) => (
                  <div key={skillName} className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                    <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-dashboard-primary rounded-full"></div>
                      {skillName}
                    </h4>
                    <div className="space-y-2">
                      {skillNotes.map((note, index) => (
                        <div key={index} className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentNotes;
