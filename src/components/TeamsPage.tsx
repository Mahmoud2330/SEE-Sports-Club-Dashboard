import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Trophy,
  Heart,
  Target,
  Clock,
  Zap,
  Circle,
  Send,
  Star,
  Crown,
  Search as SearchIcon,
  Download,
  Share2,
  Bot, 
  MessageSquare, 
  X, 
  Minus 
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import athleteImage from "../assets/Player_Pic.png";
import "./Teams.css";
import "../App.css";
import ChatWidget from "./ChatWidget";
import { dataService } from "../services/dataService";
import type { Player, Team } from "../services/dataService";

// Simple component definitions for the teams page
const PhysicalPerformance: React.FC = () => (
  <div className="physical-performance">
    <div className="section-header">
      <h2 className="section-title physical-performance-title">
        Physical &nbsp;<span className="notification-badge-green">5</span>
      </h2>
    </div>
    <div className="performance-cards">
      <div className="performance-card-teams">
        <div className="performance-card-header-teams">
          <div className="performance-card-icon"><Zap size={16} /></div>
          <div className="performance-card-title">Vertical Jump</div>
        </div>
        <div className="performance-card-value-teams">70 cm</div>
      </div>
    </div>
  </div>
);

const SkillDevelopment: React.FC = () => (
  <div className="skill-development">
    <div className="section-header">
      <h2 className="skill-performance-title">
        Skills &nbsp;<span className="notification-badge-purple">5</span>
      </h2>
    </div>
    <div className="skill-development-cards">
      <div className="skill-development-card-teams">
        <div className="skill-development-card-header-teams">
          <div className="skill-development-card-icon"><Circle size={16} /></div>
          <div className="skill-development-card-title">Control</div>
        </div>
        <div className="skill-development-card-value-teams">7/10</div>
      </div>
    </div>
  </div>
);

const PhysicalChartCard: React.FC = () => (
  <section className="physchart card">
    <div className="physchart__head">
      <h2 className="physchart__title">Physical Chart</h2>
      <p className="muted tiny">Track physical performance metrics over time</p>
    </div>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Physical performance charts will be displayed here</p>
    </div>
  </section>
);

const SkillsChartCard: React.FC = () => (
  <section className="skillchart card">
    <div className="skillchart__head">
      <h2 className="skillchart__title">Skills Chart</h2>
      <p className="muted tiny">Monitor skill development and performance trends</p>
    </div>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Skills development charts will be displayed here</p>
    </div>
  </section>
);

const CoachNotes: React.FC = () => (
  <section className="coachnotes">
    <div className="cnotes__header">
      <h2 className="cnotes__title">Coach Notes</h2>
      <span className="badge badge--danger">4</span>
    </div>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Coach notes and feedback will be displayed here</p>
    </div>
  </section>
);

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  
  // State for dynamic data
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<{ [key: string]: Team }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current team data
  const currentTeam = teamId && teams[teamId] ? teams[teamId] : null;
  const currentTeamPlayers = players.filter(player => player.teamId === teamId);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [playersData, teamsData] = await Promise.all([
          dataService.getPlayers(),
          dataService.getTeams()
        ]);
        
        setPlayers(playersData);
        setTeams(teamsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPosition]);

  const filteredPlayers = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return currentTeamPlayers.filter((player) => {
      const matchesSearch =
        !s ||
        player.name.toLowerCase().includes(s) ||
        String(player.id).toLowerCase().includes(s) ||
        String(player.year).toLowerCase().includes(s) ||
        (player.team || "").toLowerCase().includes(s);
      const matchesPosition =
        filterPosition === "all" ||
        (player.shortPosition || "").toLowerCase() === filterPosition.toLowerCase();
      return matchesSearch && matchesPosition;
    });
  }, [searchTerm, filterPosition, currentTeamPlayers]);

  // NEW: rank filter
  const [rankFilter, setRankFilter] = useState<'all' | 'top3' | 'top4to10'>('all');

  // keep your filteredPlayers as-is, then rank by totalScore once
  const rankedPlayers = useMemo(() => {
    const arr = [...filteredPlayers].sort(
      (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
    );
    return arr.map((p, i) => ({ ...p, __rank: i + 1 })); // attach global rank
  }, [filteredPlayers]);

  // apply rank filter (top 3 or 4-10)
  const rankFilteredPlayers = useMemo(() => {
    if (rankFilter === 'top3') return rankedPlayers.slice(0, 3);
    if (rankFilter === 'top4to10') return rankedPlayers.slice(3, 10);
    return rankedPlayers;
  }, [rankFilter, rankedPlayers]);

  // RESET page on rank filter change (add to your existing effect deps)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPosition, rankFilter]);

  const totalPlayers = rankFilteredPlayers.length;
  const totalPages  = Math.max(1, Math.ceil(totalPlayers / PAGE_SIZE));
  const startIndex  = (currentPage - 1) * PAGE_SIZE;
  const endIndex    = Math.min(startIndex + PAGE_SIZE, totalPlayers);
  const pagePlayers = rankFilteredPlayers.slice(startIndex, endIndex);


  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Loading state
  if (isLoading) {
    return (
      <main className="teams-page">
        <div className="teams-page__inner">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Loading team data...</div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="teams-page">
        <div className="teams-page__inner">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <div>Error: {error}</div>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </main>
    );
  }

  // No team found
  if (!currentTeam) {
    return (
      <main className="teams-page">
        <div className="teams-page__inner">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Team not found</div>
            <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="teams-page">
      <div className="teams-page__inner">
        {/* Back link */}
        <button className="linkback" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>
        <br />

        {/* Title + subtitle */}
        <h1 className="pgtitle">{currentTeam.name} Details</h1>
        <p className="pgsubtitle">
          Detailed view of {currentTeam.name} performance, player roster, and statistics.
        </p>

        {/* Players card */}
        <section className="card">
          <div className="card__head">
            <div className="card__title">
              <div>
                <h2>Players</h2>
                <p className="muted">
                  Complete roster with player metrics and performance data
                </p>
              </div>
            </div>

            <div className="card__actions">
              <button
                className={`chip chip--gold ${rankFilter === 'top3' ? 'is-active' : ''}`}
                onClick={() =>
                  setRankFilter(prev => (prev === 'top3' ? 'all' : 'top3'))
                }
                title="Show Top 3 players by total score"
              >
                <Crown size={14} />
                <span>Top 3</span>
                <small>Elite</small>
              </button>

              <button
                className={`chip chip--violet ${rankFilter === 'top4to10' ? 'is-active' : ''}`}
                onClick={() =>
                  setRankFilter(prev => (prev === 'top4to10' ? 'all' : 'top4to10'))
                }
                title="Show ranks 4–10 by total score"
              >
                <Star size={14} />
                <span>4-10</span>
                <small>Top Performers</small>
              </button>

              <div className="actions">
                <button className="iconbtn" title="Share"><Share2 size={16} /></button>
                <button className="iconbtn" title="Download"><Download size={16} /></button>
              </div>
            </div>

          </div>

          {/* Search row */}
          <div className="toolbar">
            <div className="search">
            <SearchIcon size={16} className="search__icon" />
            <input
              className="search__input"
              placeholder="Search players by name, ID, year, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          </div>

          {/* Table */}
          <div className="tablewrap tablewrap--scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Year</th>
                  <th>Team</th>
                  <th>Height (cm)</th>
                  <th>Weight (kg)</th>
                  <th>Speed (km/h)</th>
                  <th>Endurance (min)</th>
                </tr>
              </thead>
              <tbody>
                {pagePlayers.map((player) => (
                  <tr
                    key={player.id}
                    className="player-row clickable"
                    onClick={() => navigate(`/players/${player.id}`)}
                  >
                    <td>
                      <span
                        className={`rankpill ${
                          player.__rank <= 3
                            ? 'rankpill--gold'
                            : player.__rank <= 10
                            ? 'rankpill--purple'
                            : ''
                        }`}
                      >
                        #{player.__rank}
                      </span>
                    </td>
                    <td className="mono">#{player.id}</td>
                    <td>
                      <div className="pstack">
                        <div className="avatar">
                          <img src={player.profilePicture} alt={player.name} />
                        </div>
                        <div className="pstack__meta">
                          <div className="pname">{player.name}</div>
                          <div className="psub muted tiny">
                            #{player.jerseyNumber} • {player.position}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{player.year}</td>
                    <td className="mono">{player.team}</td>
                    <td className="mono">{player.height}</td>
                    <td className="mono">{player.weight}</td>
                    <td className="metric metric--good">{Number(player.speed).toFixed(1)}</td>
                    <td className="metric metric--good">{Number(player.endurance).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Pagination footer */}
            <div className="table__footer">
              <div className="pager">
                <button className="pager__nav" onClick={goPrev} disabled={currentPage === 1}>
                  <ChevronLeft size={16} /> Previous
                </button>

                <div className="pager__center">
                  <div className="pager__page">Page {currentPage} of {totalPages}</div>
                  <div className="pager__meta muted tiny">
                    Showing {totalPlayers === 0 ? 0 : startIndex + 1}-{endIndex} of {totalPlayers} players
                  </div>
                  <div className="pager__dots">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`pager__dot ${i + 1 === currentPage ? "is-active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                        aria-label={`Go to page ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <button className="pager__nav" onClick={goNext} disabled={currentPage === totalPages}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <br />

        <div>
          <PhysicalPerformance />
        </div>
        <br />
        <div>
          <SkillDevelopment />
        </div>
        <br />
        <div>
          <PhysicalChartCard />
        </div>
        <br />
        <div>
          <SkillsChartCard />
        </div>
        <br />
        <div>
          <CoachNotes />
        </div>
          <ChatWidget />

      </div>
    </main>
  );
};

export default TeamsPage;
