// Data service for fetching player and team information from JSON files

// -------- Time-series types (added) --------
export type MonthKey =
  | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
  | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

export interface SeriesByMonth {
  [seriesName: string]: Record<MonthKey, number>;
}

// -------- Your existing interfaces (Player extended with optional series) --------
export interface Player {
  id: number;
  name: string;
  position: string;
  shortPosition: string;
  totalScore: number;
  physical: number;
  skills: number;
  profilePicture: string;
  jerseyNumber: number;
  year: number;
  team: string;
  teamId: string;
  height: number;
  weight: number;
  speed: number;
  endurance: number;
  nationality: string;
  age: number;
  contractExpiry: string;
  marketValue: string;
  preferredFoot: string;
  weakFoot: number;
  skillMoves: number;
  workRate: string;
  attackingWorkRate: string;
  defensiveWorkRate: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  overall: number;

  // Optional time‑series blocks used by charts/progress
  ['Physical Performance']?: SeriesByMonth;
  ['Skill Performance']?: SeriesByMonth;
  
  // Assessment notes for platinum/premium teams
  ['Assessment Notes']?: {
    'Physical Assessments': {
      'Vertical Jump': string[];
      'Broad Jump': string[];
      '10 Meter Run': string[];
      'Five Ten Five': string[];
      'T-Agility': string[];
    };
    'Skills Assessments': {
      'Ball Control': string[];
      'Passing': string[];
      '1v1': string[];
      'Running with Ball': string[];
      'Shooting': string[];
    };
  };
}

export interface InjuryData {
  playerId: number;
  status: 'healthy' | 'injured' | 'at-risk';
  bodyPart: string | null;
  riskScore: number;
  confidence: number;
  expectedStart: string | null;
  expectedEnd: string | null;
  reasons: Array<{
    code: string;
    label: string;
    weight: number;
  }>;
  notes: string;
}

export interface Team {
  id: string;
  name: string;
  tier: string;
  color: string;
  totalPlayers: number;
  teamScore: string;
  formation: string;
  manager: string;
  stadium: string;
  founded: number;
  league: string;
}

export interface DataResponse {
  players: Player[];
  teams: { [key: string]: Team };
  metadata: {
    lastUpdated: string;
    version: string;
    totalPlayers: number;
    totalTeams: number;
    dataSource: string;
  };
}

class DataService {
  private data: DataResponse | null = null;
  private isLoading = false;
  private error: string | null = null;
  private fetchPromise: Promise<DataResponse> | null = null;

  // Fetch data from JSON files
  async fetchData(): Promise<DataResponse> {
    if (this.data && !this.isLoading) {
      return this.data;
    }

    if (this.isLoading && this.fetchPromise) {
      // If already loading, return the existing promise instead of throwing an error
      return this.fetchPromise;
    }

    this.isLoading = true;
    this.error = null;

    this.fetchPromise = (async () => {
      try {
        // Fetch both players and teams data from the new location
        const [playersResponse, teamsResponse] = await Promise.all([
          fetch('/data/players.json'),
          fetch('/data/teams.json'),
        ]);

        if (!playersResponse.ok) {
          throw new Error(`Failed to fetch players data: ${playersResponse.status} ${playersResponse.statusText}`);
        }

        if (!teamsResponse.ok) {
          throw new Error(`Failed to fetch teams data: ${teamsResponse.status} ${teamsResponse.statusText}`);
        }

        const playersData = await playersResponse.json();
        const teamsData = await teamsResponse.json();

        // Combine the data
        this.data = {
          players: playersData,
          teams: teamsData,
          metadata: {
            lastUpdated: new Date().toISOString(),
            version: '1.0.0',
            totalPlayers: playersData.length,
            totalTeams: Object.keys(teamsData).length,
            dataSource: 'SEE Sports Club Database',
          },
        };

        this.isLoading = false;
        this.fetchPromise = null;
        return this.data;
      } catch (err) {
        this.isLoading = false;
        this.fetchPromise = null;
        this.error = err instanceof Error ? err.message : 'Unknown error occurred';
        throw new Error(this.error);
      }
    })();

    return this.fetchPromise;
  }

  // Get all players
  async getPlayers(): Promise<Player[]> {
    const data = await this.fetchData();
    return data.players;
  }

  // Get player by ID (route param as string)
  async getPlayerById(id: string): Promise<Player | undefined> {
    const players = await this.getPlayers();
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return undefined;
    }
    return players.find((player) => player.id === numericId);
  }

  // Get players by team ID
  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    const players = await this.getPlayers();
    return players.filter((player) => player.teamId === teamId);
  }

  // Get all teams
  async getTeams(): Promise<{ [key: string]: Team }> {
    const data = await this.fetchData();
    return data.teams;
  }

  // Fetch teams data separately (useful for team-specific operations)
  async fetchTeamsData(): Promise<{ [key: string]: Team }> {
    try {
      const response = await fetch('/data/teams.json');

      if (!response.ok) {
        throw new Error(`Failed to fetch teams data: ${response.status} ${response.statusText}`);
      }

      const teamsData = await response.json();
      return teamsData;
    } catch (err) {
      console.error('Error fetching teams data:', err);
      throw err;
    }
  }

  // Get team by ID
  async getTeamById(teamId: string): Promise<Team | undefined> {
    const teams = await this.getTeams();
    return teams[teamId];
  }

  // Get team tier by team ID
  async getTeamTier(teamId: string): Promise<string | undefined> {
    const team = await this.getTeamById(teamId);
    return team?.tier;
  }

  // Get injury count for a specific team
  async getTeamInjuryCount(teamId: string): Promise<number> {
    try {
      const response = await fetch('/data/injuries.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch injuries data: ${response.status}`);
      }
      
      const injuries: InjuryData[] = await response.json();
      const teamPlayers = await this.getPlayersByTeam(teamId);
      const teamPlayerIds = teamPlayers.map(player => player.id);
      
      // Count players with 'injured' or 'at-risk' status
      const injuryCount = injuries.filter(injury => 
        teamPlayerIds.includes(injury.playerId) && 
        (injury.status === 'injured' || injury.status === 'at-risk')
      ).length;
      
      return injuryCount;
    } catch (error) {
      console.error('Error calculating team injury count:', error);
      return 0;
    }
  }

  // Get all teams with dynamic injury counts
  async getTeamsWithInjuries(): Promise<{ [key: string]: Team & { injuries: number } }> {
    const teams = await this.getTeams();
    const teamsWithInjuries: { [key: string]: Team & { injuries: number } } = {};
    
    for (const [teamId, team] of Object.entries(teams)) {
      const injuryCount = await this.getTeamInjuryCount(teamId);
      teamsWithInjuries[teamId] = {
        ...team,
        injuries: injuryCount
      };
    }
    
    return teamsWithInjuries;
  }

  // Check if player should show assessment notes (Platinum or Premium tier)
  async shouldShowAssessmentNotes(playerId: string): Promise<boolean> {
    const player = await this.getPlayerById(playerId);
    if (!player) return false;

    const teamTier = await this.getTeamTier(player.teamId);
    return teamTier === 'PLATINUM' || teamTier === 'PREMIUM';
  }

  // Get data status
  getStatus() {
    return {
      isLoading: this.isLoading,
      error: this.error,
      hasData: !!this.data,
    };
  }

  // Clear cached data (useful for testing or refreshing)
  clearCache() {
    this.data = null;
    this.error = null;
    this.isLoading = false;
    this.fetchPromise = null;
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;

// -------- Lightweight helpers for charts/progress (added) --------

export function months(): MonthKey[] {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
}

/** Convert { seriesName: { Jan..Dec } } into [{month, series1, series2, ...}] */
export function seriesToArray(
  namedSeries: Record<string, Record<MonthKey, number>> | undefined
) {
  const m = months();
  if (!namedSeries) return m.map((month) => ({ month }));
  return m.map((month) => {
    const row: Record<string, number | string> = { month };
    for (const key of Object.keys(namedSeries)) {
      row[key] = namedSeries[key]?.[month] ?? 0;
    }
    return row;
  });
}

/** For a single series {Jan..Dec}: returns current, best, and month‑over‑month change */
export function currentAndBest(series: Record<MonthKey, number> | undefined) {
  const m = months();
  const values = m.map((k) => series?.[k] ?? 0);
  const current = values[values.length - 1] ?? 0;
  const prev = values[Math.max(0, values.length - 2)] ?? 0;
  const best = Math.max(...values);
  const change = current - prev;
  return { current, best, change };
}
