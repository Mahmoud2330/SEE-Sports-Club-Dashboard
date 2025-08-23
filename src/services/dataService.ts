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

export interface Team {
  id: string;
  name: string;
  tier: string;
  color: string;
  totalPlayers: number;
  teamScore: string;
  injuries: number;
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

  // Fetch data from JSON files
  async fetchData(): Promise<DataResponse> {
    if (this.data && !this.isLoading) {
      return this.data;
    }

    if (this.isLoading) {
      throw new Error('Data fetch already in progress');
    }

    this.isLoading = true;
    this.error = null;

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
      return this.data;
    } catch (err) {
      this.isLoading = false;
      this.error = err instanceof Error ? err.message : 'Unknown error occurred';
      throw new Error(this.error);
    }
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
