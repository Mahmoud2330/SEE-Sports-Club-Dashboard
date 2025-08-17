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

/* ================= PHYSICAL & SKILLS CARDS (Enhanced from TeamsPage2) ================= */

const PhysicalPerformance: React.FC = () => {
  const performanceMetrics = [
    { title: "Vertical Jump", icon: <Zap size={16} />, value: "70 cm" },
    { title: "Broad Jump",    icon: <Target size={16} />, value: "274 cm" },
    { title: "10 Meter Run",  icon: <Clock size={16} />, value: "1.70 sec" },
    { title: "Five Ten Five", icon: <Clock size={16} />, value: "4.30 sec" },
    { title: "T-Agility",     icon: <Users size={16} />, value: "9.70 sec" },
  ];
  return (
    <div className="physical-performance">
      <div className="section-header">
        <h2 className="section-title physical-performance-title">
          Physical &nbsp;<span className="notification-badge-green">5</span>
        </h2>
      </div>
      <div className="performance-cards">
        {performanceMetrics.map((m, i) => (
          <div key={i} className="performance-card-teams">
            <div className="performance-card-header-teams">
              <div className="performance-card-icon">{m.icon}</div>&nbsp;&nbsp;
              <div className="performance-card-title">{m.title}</div>
            </div>
            <div className="performance-card-value-teams">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillDevelopment: React.FC = () => {
  const SkillMetrics = [
    { title: "Control",          icon: <Circle size={16} />, value: "7/10" },
    { title: "Passing",          icon: <Send size={16} />,   value: "9/10" },
    { title: "Running wth Ball", icon: <Zap size={16} />,    value: "10/10" },
    { title: "1v1",              icon: <Target size={16} />, value: "7/10" },
    { title: "Shooting",         icon: <Target size={16} />, value: "9/10" },
  ];
  return (
    <div className="skill-development">
      <div className="section-header">
        <h2 className="skill-performance-title">
          Skills &nbsp;<span className="notification-badge-purple">5</span>
        </h2>
      </div>
      <div className="skill-development-cards">
        {SkillMetrics.map((m, i) => (
          <div key={i} className="skill-development-card-teams">
            <div className="skill-development-card-header-teams">
              <div className="performance-card-icon">{m.icon}</div> &nbsp;&nbsp;
              <div className="performance-card-title">{m.title}</div>
            </div>
            <div className="performance-card-value-teams">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= PHYSICAL CHART CARD (Enhanced from TeamsPage2) ================= */

type DataPoint = { week: string; value: number };
const weeks = Array.from({ length: 24 }, (_, i) => `W${i + 1}`);

const dataFiveTenFive: DataPoint[] = weeks.map((w, i) => ({ week: w, value: 3.9 + Math.sin(i / 5) * 0.15 + (i % 3) * 0.03 }));
const dataBroadJump:  DataPoint[] = weeks.map((w, i) => ({ week: w, value: 240 + Math.sin(i / 4) * 12 + (i % 4) * 2 }));
const dataTAgility:   DataPoint[] = weeks.map((w, i) => ({ week: w, value: 9.3 + Math.sin(i / 6) * 0.25 + (i % 5) * 0.02 }));
const dataVJump:      DataPoint[] = weeks.map((w, i) => ({ week: w, value: 230 + Math.sin(i / 6) * 12 + (i % 4) * 2 }));
const data10MRun:     DataPoint[] = weeks.map((w, i) => ({ week: w, value: 8.1 + Math.sin(i / 6) * 0.25 + (i % 5) * 0.02 }));

const metricUnits: Record<string, string> = {
  fiveTenFive: "s", broadJump: "cm", tAgility: "s", verticalJump: "cm", tenMRun: "s",
};
const metricLabel: Record<string, string> = {
  fiveTenFive: "Five Ten Five", broadJump: "Broad Jump", tAgility: "T-Agility", verticalJump: "Vertical Jump", tenMRun: "10M Run",
};
const seriesMap: Record<string, DataPoint[]> = {
  fiveTenFive: dataFiveTenFive, broadJump: dataBroadJump, tAgility: dataTAgility, verticalJump: dataVJump, tenMRun: data10MRun,
};

const PhysicalChartCard: React.FC = () => {
  const [metric, setMetric] = useState<"fiveTenFive" | "broadJump" | "tAgility" | "verticalJump" | "tenMRun">("fiveTenFive");
  const [range, setRange] = useState<"3m" | "6m" | "all">("6m");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const PcActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#7BFFBA" />
        <circle cx={cx} cy={cy} r={6} fill="none" stroke="#000" strokeWidth={3} />
      </g>
    );
  };
  const full = seriesMap[metric];
  const displayData = useMemo(() => {
    if (range === "3m") return full.slice(-12);
    if (range === "6m") return full.slice(-24);
    return full;
  }, [full, range]);
  const avg = displayData.reduce((s, d) => s + d.value, 0) / (displayData.length || 1);
  const current = displayData[displayData.length - 1]?.value ?? 0;
  const best = metric === "broadJump"
    ? Math.max(...displayData.map((d) => d.value))
    : Math.min(...displayData.map((d) => d.value));
  const unit = metricUnits[metric];

  const PcTooltip = ({ active, label, payload }: any) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value as number;
    const good = metric === "broadJump" ? v >= avg : v <= avg;
    return (
      <div className="pc-tooltip">
        <div className="pc-t__row pc-t__head"><span className="pc-dot" /><span className="pc-t__week">{label}</span></div>
        <div className="pc-t__metric">{metricLabel[metric]}</div>
        <div className="pc-t__value">{v.toFixed(2)} <span className="pc-unit">{unit}</span></div>
        <div className="pc-t__row"><span className="pc-t__label">Performance</span>
          <span className={`pc-chip ${good ? "pc-chip--good" : "pc-chip--bad"}`}>{good ? "Good" : "Below Avg"}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="physchart card">
      <div className="physchart__head" style={{marginTop:"2%"}}>
        <div>
          <h2 className="physchart__title">Physical Chart</h2>
          <p className="muted tiny">Track physical performance metrics over time</p>
        </div>
        <div className="physchart__ranges">
          {[
            { key: "3m", label: "3 Months" },
            { key: "6m", label: "6 Months" },
            { key: "all", label: "All Time" },
          ].map((r) => (
            <button key={r.key} className={`pill ${range === r.key ? "is-active" : ""}`} onClick={() => setRange(r.key as any)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="physchart__tabs ">
        {(["fiveTenFive", "broadJump", "tAgility" , "verticalJump", "tenMRun"] as const).map((k) => (
          <button key={k} onClick={() => setMetric(k)} className={`tab ${metric === k ? "is-active" : ""}`}>
            {metricLabel[k]}
          </button>
        ))}
      </div>

      <div className="physchart__grid">
        <div className="physchart__canvas">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={displayData}
              margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
              onMouseMove={(s: any) => setActiveIdx(s?.activeTooltipIndex ?? null)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <defs>
                <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7BFFBA" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#7BFFBA" stopOpacity={0} />
                </linearGradient>
              </defs>
              {activeIdx !== null && displayData[activeIdx] && (
                <ReferenceLine x={displayData[activeIdx].week} stroke="#7BFFBA" strokeDasharray="4 8" strokeOpacity={0.6} />
              )}
              <XAxis dataKey="week" tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
              <Tooltip content={<PcTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#7BFFBA" strokeWidth={3} fill="url(#pcGrad)" dot={false} activeDot={<PcActiveDot />} />
            </AreaChart>
          </ResponsiveContainer>

          <div className="pc-overlay">
            <div className="pc-badge"><span className="pc-bullet" /> Live Data</div>
            <div className="pc-avg">Avg: {avg.toFixed(2)} {unit}</div>
          </div>
        </div>

        <div className="physchart__side">
          <div className="sidecard">
            <div className="sidecard__title">Current Team Average</div>
            <div className="sidecard__value">{avg.toFixed(2)} {unit}</div>
            <div className="muted tiny">Based on {displayData.length} weeks</div>
          </div>
        </div>
      </div>

      <div className="physchart__bottom">
        <div className="mcard">
          <div className="mcard__label">Current</div>
          <div className="mcard__value">{current.toFixed(2)} {unit}</div>
          <span className="dot dot--green" />
        </div>
        <div className="mcard mcard--purple">
          <div className="mcard__label">Best</div>
          <div className="mcard__value">{best.toFixed(2)} {unit}</div>
          <span className="dot dot--violet" />
        </div>
        <div className="mcard mcard--amber">
          <div className="mcard__label">Trend</div>
          <div className="mcard__value">
            {(() => {
              const idx = Math.max(0, displayData.length - 5);
              const base = displayData[idx]?.value ?? current;
              const pct = base ? ((current - base) / base) * 100 : 0;
              const sign = pct >= 0 ? "+" : "";
              return `${sign}${pct.toFixed(1)}%`;
            })()} <span className="muted tiny">vs last month</span>
          </div>
          <span className="dot dot--amber" />
        </div>
      </div>
    </section>
  );
};

/* ================= SKILLS CHART CARD (Enhanced from TeamsPage2) ================= */

type SkillPoint = { week: string; value: number };
const wks = Array.from({ length: 24 }, (_, i) => `W${i + 1}`);
const passingData:    SkillPoint[] = wks.map((w, i) => ({ week: w, value: 6.6 + Math.sin(i / 4) * 0.4 + (i % 4) * 0.05 }));
const runningBallData:SkillPoint[] = wks.map((w, i) => ({ week: w, value: 7.0 + Math.sin(i / 5) * 0.35 + ((i + 2) % 5) * 0.04 }));
const controlData:    SkillPoint[] = wks.map((w, i) => ({ week: w, value: 6.8 + Math.sin(i / 6) * 0.45 + (i % 3) * 0.05 }));
const shootingData:   SkillPoint[] = wks.map((w, i) => ({ week: w, value: 7.8 + Math.sin(i / 6) * 0.45 + (i % 3) * 0.05 }));
const oneVoneData:    SkillPoint[] = wks.map((w, i) => ({ week: w, value: 8.6 + Math.sin(i / 6) * 0.45 + (i % 3) * 0.05 }));

const skillSeries: Record<string, SkillPoint[]> = {
  passing: passingData, running: runningBallData, control: controlData, shooting: shootingData, oneVone: oneVoneData,
};

const SkillsChartCard: React.FC = () => {
  const [metric, setMetric] = useState<"passing" | "running" | "control" | "shooting"| "oneVone">("passing");
  const [range, setRange] = useState<"3m" | "6m" | "all">("6m");
  const [sActiveIdx, setSActiveIdx] = useState<number | null>(null);

  const full = skillSeries[metric];
  const displayData = useMemo(() => {
    if (range === "3m") return full.slice(-12);
    if (range === "6m") return full.slice(-24);
    return full;
  }, [full, range]);

  const avg = displayData.reduce((s, d) => s + d.value, 0) / (displayData.length || 1);
  const current = displayData[displayData.length - 1]?.value ?? 0;
  const peak = Math.max(...displayData.map((d) => d.value));
  const baseIdx = Math.max(0, displayData.length - 5);
  const base = displayData[baseIdx]?.value ?? current;
  const progress = current - base;

  const donut = [
    { name: "score", value: Math.min(10, Math.max(0, current)) },
    { name: "rest",  value: Math.max(0, 10 - Math.min(10, Math.max(0, current))) },
  ];
  const label = metric === "passing" ? "Passing" : metric === "running" ? "Running with ball" : metric === "oneVone" ? "1V1" : metric === "shooting" ? "Shooting" : "Control";

  const ScActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6}  fill="#7c4dff" />
        <circle cx={cx} cy={cy} r={10} fill="none" stroke="#24173a" strokeWidth={6} />
      </g>
    );
  };
  const ScTooltip = ({ active, label, payload }: any) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value as number;
    const good = v >= avg;
    return (
      <div className="sc-tooltip">
        <div className="sc-t__head"><span className="sc-dot" /> <span className="sc-week">{label}</span></div>
        <div className="sc-metric">{label === "W15" ? "Passing" : "Passing"}</div>
        <div className="sc-value">{v.toFixed(1)} <span className="sc-outof">/10</span></div>
        <div className="sc-row"><span className="sc-label">Rating</span>
          <span className={`sc-chip ${good ? "sc-chip--good" : "sc-chip--bad"}`}>{good ? "Good" : "Below Avg"}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="skillchart card">
      <div className="skillchart__head" style={{ marginTop:"2%" }}>
        <div>
          <h2 className="skillchart__title">Skills Chart</h2>
          <p className="muted tiny">Monitor skill development and performance trends</p>
        </div>
        <div className="skillchart__ranges">
          {[
            { key: "3m", label: "3 Months" },
            { key: "6m", label: "6 Months" },
            { key: "all", label: "All Time" },
          ].map((r) => (
            <button key={r.key} className={`pill pill--purple ${range === r.key ? "is-active" : ""}`} onClick={() => setRange(r.key as any)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="skillchart__tabs">
        {(["passing", "running", "control", "shooting", "oneVone" ] as const).map((k) => (
          <button key={k} onClick={() => setMetric(k)} className={`stab ${metric === k ? "is-active" : ""}`}>
            {k === "running" ? "Running with ball" : k === "oneVone" ? "1v1" : k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      <div className="skillchart__grid">
        <div className="scard scard--left">
          <div className="scard__title">◎ Current Team Average</div>
          <div className="scard__value">{avg.toFixed(1)}/10</div>
          <div className="muted tiny">Based on {displayData.length} players</div>
        </div>

        <div className="donut">
          <PieChart width={520} height={320}>
            <defs>
              <linearGradient id="sgPurple" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c4dff" />
                <stop offset="100%" stopColor="#932bff" />
              </linearGradient>
            </defs>
            <Pie data={donut} dataKey="value" innerRadius={100} outerRadius={140} startAngle={90} endAngle={-270} stroke="none">
              <Cell key="score" fill="url(#sgPurple)" />
              <Cell key="rest"  fill="#221b33" />
            </Pie>
          </PieChart>
          <div className="donut__center">
            <div className="donut__value">{current.toFixed(1)}</div>
            <div className="donut__sub">out of 10</div>
            <div className="donut__label">{label}</div>
          </div>
        </div>

        <div className="skillchart__spark">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={displayData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              onMouseMove={(s: any) => setSActiveIdx(s?.activeTooltipIndex ?? null)}
              onMouseLeave={() => setSActiveIdx(null)}
            >
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c4dff" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#7c4dff" stopOpacity={0} />
                </linearGradient>
              </defs>
              {sActiveIdx !== null && displayData[sActiveIdx] && (
                <ReferenceLine x={displayData[sActiveIdx].week} stroke="#7c4dff" strokeDasharray="4 8" strokeOpacity={0.75} />
              )}
              <XAxis dataKey="week" tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ScTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#7c4dff" strokeWidth={3} fill="url(#sparkGrad)" dot={false} activeDot={<ScActiveDot />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="skillchart__bottom">
        <div className="mcard mcard--purple">
          <div className="mcard__label">Current</div>
          <div className="mcard__value">{current.toFixed(1)} <span className="tiny">/10</span></div>
          <span className="dot dot--violet" />
        </div>
        <div className="mcard">
          <div className="mcard__label">Peak</div>
          <div className="mcard__value">{peak.toFixed(1)} <span className="tiny">/10</span></div>
          <span className="dot dot--green" />
        </div>
        <div className="mcard mcard--amber">
          <div className="mcard__label">Average</div>
          <div className="mcard__value">{avg.toFixed(1)} <span className="tiny">/10</span></div>
          <span className="dot dot--amber" />
        </div>
        <div className="mcard">
          <div className="mcard__label">Progress</div>
          <div className="mcard__value">
            {progress >= 0 ? `+${progress.toFixed(1)}` : progress.toFixed(1)} <span className="tiny">vs last period</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= COACH NOTES (Enhanced from TeamsPage2) ================= */

type Note = { coach: string; category: "Strategy" | "Technique" | "Performance" | "Training"; color: string; date: string; message: string; };
const coachNotes: Note[] = [
  { coach: "Coach Martinez",  category: "Strategy",   color: "#ff4d57", date: "Aug 9, 2025",  message:"Need to focus more on defensive positioning in the upcoming training sessions." },
  { coach: "Coach Rodriguez", category: "Technique",  color: "#f4c531", date: "Jul 31, 2025", message:"Players demonstrated strong teamwork and communication throughout the match." },
  { coach: "Coach Martinez",  category: "Performance",color: "#7c4dff", date: "Jul 24, 2025", message:"Fitness levels are improving consistently across all players." },
  { coach: "Coach Rodriguez", category: "Training",   color: "#33d17a", date: "Jul 17, 2025", message:"Tactical awareness needs improvement when transitioning from defense to attack." },
];

const CoachNotes: React.FC = () => (
  <section className="coachnotes">
    <div className="cnotes__header">
      <h2 className="cnotes__title">Coach Notes</h2>
      <span className="badge badge--danger">{coachNotes.length}</span>
    </div>
    <ul className="cnotes__list">
      {coachNotes.map((n, i) => (
        <li key={i} className="cnotes__item">
          <div className="cnotes__top"><span className="cnotes__coach">{n.coach}</span><time className="cnotes__date">{n.date}</time></div>
          <div className="cnotes__catrow"><span className="cnotes__swatch" style={{ background: n.color }} /><span className="cnotes__cat">{n.category}</span></div>
          <p className="cnotes__text">{n.message}</p>
        </li>
      ))}
    </ul>
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

  // Check if team can show chat widget (Platinum or Premium)
  const canShowChat = ["PLATINUM", "PREMIUM"].includes((currentTeam?.tier || "").toUpperCase());

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

        {/* Chat Widget - Only for Platinum/Premium teams */}
        {canShowChat && <ChatWidget />}

      </div>
    </main>
  );
};

export default TeamsPage;
