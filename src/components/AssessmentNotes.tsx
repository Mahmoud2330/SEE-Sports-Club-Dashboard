import React from 'react';
import { StickyNote, Zap, Target } from 'lucide-react';

interface AssessmentNotesProps {
  teamTier?: string;
}

const AssessmentNotes: React.FC<AssessmentNotesProps> = ({ teamTier }) => {
  // Only show for platinum or premium teams
  const isPlatinumOrPremium = teamTier && (teamTier === 'PLATINUM' || teamTier === 'PREMIUM');
  
  if (!isPlatinumOrPremium) {
    return null;
  }

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
                    Detailed observations for each assessment category
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
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
                    Vertical Jump
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Needs to focus on arm swing coordination
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Landing technique could be refined
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Needs to focus on arm swing coordination
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
                    Broad Jump
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Strong leg drive during jump phase
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Excellent horizontal distance achieved
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
                    Ten Meter Run
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Maintain running form at high speed
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Focus on stride frequency
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Maintain running form at high speed
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
                    Five Ten Five
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Deceleration technique improving
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Work on maintaining speed through turns
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Deceleration technique improving
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-success rounded-full"></div>
                    T Agility
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Good body positioning during cuts
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Consistent times across multiple attempts
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-success/30">
                      Good body positioning during cuts
                    </div>
                  </div>
                </div>
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
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-primary rounded-full"></div>
                    Ball Control
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Excellent first touch under pressure
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Good use of both feet for control
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-primary rounded-full"></div>
                    Passing
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Improve passing under defensive pressure
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Good vision for through balls
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Improve passing under defensive pressure
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-primary rounded-full"></div>
                    One v One
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Good use of body feints and skills
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Work on finishing after beating defender
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Good use of body feints and skills
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-primary rounded-full"></div>
                    Running With Ball
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Close control at speed is excellent
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Keep head up more to spot teammates
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Close control at speed is excellent
                    </div>
                  </div>
                </div>
                
                <div className="bg-dashboard-base/30 rounded-lg p-4 border border-dashboard-border/20">
                  <h4 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-dashboard-primary rounded-full"></div>
                    Shooting
                  </h4>
                  <div className="space-y-2">
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Powerful shots with good accuracy
                    </div>
                    <div className="text-dashboard-text text-sm leading-relaxed pl-4 border-l-2 border-dashboard-primary/30">
                      Good composure in front of goal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentNotes;
