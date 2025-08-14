import React, { useState, useMemo } from "react";
import {
  User,
  Flag,
  Heart,
  Trophy,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatWidget from "./ChatWidget";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ----------------------------- Types & Data ----------------------------- */

type TrendKind = "up" | "down" | "stable";

interface Team {
  id: string;
  name: string;
  color: string;
  players: number;
  score: number;
  injuries: number;
  tier: string;
  trend: { kind: TrendKind; value: string };
  series: { physical: number; skill: number }[];
}

const TEAMS: Team[] = [
  {
    id: "team-a",
    name: "Team A",
    color: "#ef4444",
    players: 23,
    score: 78.5,
    injuries: 1,
    tier: "STANDARD",
    trend: { kind: "up", value: "26.9" },
    series: [
      { physical: 5.2, skill: 6.8 },
      { physical: 7.5, skill: 5.1 },
      { physical: 6.8, skill: 7.8 },
      { physical: 8.1, skill: 6.6 },
      { physical: 7.4, skill: 8.9 },
      { physical: 4.7, skill: 6.2 },
      { physical: 6.0, skill: 8.5 },
      { physical: 8.3, skill: 5.8 },
    ],
  },
  {
    id: "team-b",
    name: "Team B",
    color: "#3b82f6",
    players: 21,
    score: 82.3,
    injuries: 0,
    tier: "PREMIUM",
    trend: { kind: "up", value: "18.2" },
    series: [
      { physical: 5.5, skill: 7.2 },
      { physical: 7.8, skill: 6.5 },
      { physical: 6.1, skill: 5.8 },
      { physical: 8.4, skill: 4.1 },
      { physical: 4.7, skill: 8.4 },
      { physical: 5.0, skill: 6.7 },
      { physical: 6.3, skill: 7.0 },
      { physical: 7.6, skill: 5.3 },
    ],
  },
  {
    id: "team-c",
    name: "Team C",
    color: "#10b981",
    players: 19,
    score: 75.8,
    injuries: 2,
    tier: "PLATINUM",
    trend: { kind: "down", value: "12.4" },
    series: [
      { physical: 5.8, skill: 6.5 },
      { physical: 6.5, skill: 7.2 },
      { physical: 7.2, skill: 8.9 },
      { physical: 7.9, skill: 9.6 },
      { physical: 5.6, skill: 7.3 },
      { physical: 4.3, skill: 6.0 },
      { physical: 3.0, skill: 8.7 },
      { physical: 7.7, skill: 8.4 },
    ],
  },
];

/* --------------------------- Chart Component ---------------------------- */

const MiniDualSpark: React.FC<{ data: { label: string; physical: number; skill: number }[] }> = ({ data }) => (
  <div style={{ height: 112, position: "relative" }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
        <CartesianGrid stroke="var(--db-border)" strokeDasharray="2 4" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          tick={{ fill: "var(--db-text-muted)", fontSize: 10, fontWeight: 600 }}
          height={30}
        />
        <defs>
          <linearGradient id="physicalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7BFFBA" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7BFFBA" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6728f5" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6728f5" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="skill" stroke="none" fill="url(#skillGradient)" fillOpacity={0.6} />
        <Area type="monotone" dataKey="physical" stroke="none" fill="url(#physicalGradient)" fillOpacity={0.6} />
        <Line type="monotone" dataKey="physical" stroke="#7BFFBA" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="skill" stroke="#6728f5" strokeWidth={2.5} dot={false} />
        <Tooltip 
          contentStyle={{ 
            background: "#1a1a1a", 
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#fff"
          }}
          formatter={(value: number, name: string) => [
            value.toFixed(1), 
            name === 'physical' ? 'Physical' : 'Skill'
          ]}
          labelStyle={{ color: "#9e9e9e" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/* ------------------------------ Small Bits ------------------------------ */

const Badge: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({
  children,
  variant = "default",
  className = "",
}) => (
  <span className={`badge ${variant} ${className}`}>
    {children}
  </span>
);

const MetricCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  delta?: { text: string; kind: TrendKind };
  label: string;
  tint?: "primary" | "success" | "danger";
}> = ({ icon, value, delta, label, tint = "primary" }) => (
  <div className={`dashboard-metric-card dashboard-metric-card--${tint}`}>
    <div className="dashboard-metric-card__icon">{icon}</div>

    <div className="dashboard-metric-card__valueRow">
      <span className="dashboard-metric-card__value">{value}</span>
      {delta && (
        <span className={`dashboard-metric-card__delta dashboard-metric-card__delta--${delta.kind}`}>
          {delta.text}
        </span>
      )}
    </div>

    <span className="dashboard-metric-card__label">{label}</span>
  </div>
);

const TeamCard: React.FC<{
  team: Team;
  dateRangeLabel: string;
}> = ({ team, dateRangeLabel }) => {
  const navigate = useNavigate();
  
  const chartData = team.series.map((p, i) => ({
    label: i === 0 ? "Jun 23" : i === team.series.length - 1 ? "Aug 11" : "",
    physical: p.physical,
    skill: p.skill,
  }));

  const handleViewClick = () => {
    navigate(`/teams/${team.id}`);
  };

  return (
    <div className="team-card">
      <div className="team-card__header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="team-card__flag" style={{ background: team.color }}>
            <Flag size={12} />
          </div>
          <span className={`badge ${team.trend.kind === "up" ? "trend-up" : "danger"}`}>
            {team.trend.kind === "up" ? "▲" : "▼"} {team.trend.value}
          </span>
        </div>
        <span className={`badge ${team.tier.toLowerCase()}`}>{team.tier}</span>
      </div>

      <div className="team-card__title">
        <h3>{team.name}</h3>
        <p>{team.players} Players</p>
      </div>

      <MiniDualSpark data={chartData} />

      <div className="legend legend--chips">
        <div className="chip">
          <span className="chip-bar chip-bar--success" />
          <span className="chip-text">Physical</span>
        </div>
        <div className="chip">
          <span className="chip-bar chip-bar--primary" />
          <span className="chip-text">Skill</span>
        </div>
      </div>



      <div className="team-card__footer">
        <div className="team-card__date-range">
          <div className="date-chip">
            <span>{dateRangeLabel}</span>
          </div>
        </div>
        <div className="team-card__footer-content">
          <div className="team-card__stats">
            <div>
              <p className="stat-label">Team Score</p>
              <p className="stat">{team.score}</p>
            </div>
            <div>
              <p className="stat-label">Injuries</p>
              <p className={`stat ${team.injuries > 0 ? "danger" : "success"}`}>
                {team.injuries}
                {team.injuries > 0 && <span className="injury-icon">!</span>}
              </p>
            </div>
          </div>
          <button className="btn btn--primary" onClick={handleViewClick}>View</button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Main Component ------------------------------ */

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "score" | "players">("name");

  const filteredTeams = useMemo(() => {
    return TEAMS.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, sort]);

  const metrics = useMemo(() => {
    const active = TEAMS.length;
    const players = TEAMS.reduce((s, t) => s + t.players, 0);
    const injuries = TEAMS.reduce((s, t) => s + t.injuries, 0);
    const avgScore = TEAMS.reduce((s, t) => s + t.score, 0) / active;
    return { activeTeams: active, players, injuries, clubScore: avgScore };
  }, []);

  const dateRangeLabel = "Jun 23 — Aug 11";

  return (
    <main className="dashboard">
      <div className="dashboard__inner">
        <header className="dash-header">
          <div>
            <h1>Club Dashboard</h1>
            <p className="muted">
              Overview of your football club's performance and statistics.
            </p>
          </div>
        </header>

        <section>
          <div className="section-head">
            <h2>Key Metrics</h2>
          </div>
          <div className="metrics-grid">
            <MetricCard tint="primary" icon={<Flag size={20} />} value={String(metrics.activeTeams)} delta={{ text: "↗ +1", kind: "up" }} label="Active Teams" />
            <MetricCard tint="primary" icon={<User size={20} />} value={String(metrics.players)} delta={{ text: "↗ +8", kind: "up" }} label="Total Players" />
            <MetricCard tint="danger" icon={<Heart size={20} />} value={String(metrics.injuries)} delta={{ text: "↘ -2", kind: "down" }} label="Current Injuries" />
            <MetricCard tint="success" icon={<Trophy size={20} />} value={`${metrics.clubScore.toFixed(1)}/100`} delta={{ text: "↗ +3", kind: "up" }} label="Overall Club Score" />
          </div>
        </section>

        <section>
          <div className="teams-head">
            <h2>Teams Overview</h2>
            <div className="input-wrap">
              <Search size={16} className="input-icon" />
              <input placeholder="Search teams..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="team-grid">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} dateRangeLabel={dateRangeLabel} />
            ))}
          </div>
        </section>
      </div>
      
      {/* Floating chat bot */}
      <ChatWidget />
    </main>
  );
}
