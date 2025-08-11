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
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import athleteImage from "../assets/Player_Pic.png";
import "./Teams.css";
import "../App.css";

// Mock data (unchanged)
const mockTeamData = {
  name: "Manchester United",
  tier: "Premium",
  totalPlayers: 25,
  teamScore: "8.7",
  injuries: 2,
  color: "#DA291C",
};

const mockPlayers = [
  {
    id: 1,
    name: "Marcus Rashford",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 85,
    physical: 78,
    skills: 82,
    profilePicture: athleteImage,
    jerseyNumber: 10,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 70,
    speed: 32.5,
    endurance: 85,
  },
  {
    id: 16,
    name: "Marcus Rashford",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 85,
    physical: 78,
    skills: 82,
    profilePicture: athleteImage,
    jerseyNumber: 10,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 70,
    speed: 32.5,
    endurance: 85,
  },
  {
    id: 15,
    name: "Marcus Rashford",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 85,
    physical: 78,
    skills: 82,
    profilePicture: athleteImage,
    jerseyNumber: 10,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 70,
    speed: 32.5,
    endurance: 85,
  },
  {
    id: 14,
    name: "Marcus Rashford",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 85,
    physical: 78,
    skills: 82,
    profilePicture: athleteImage,
    jerseyNumber: 10,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 70,
    speed: 32.5,
    endurance: 85,
  },
  {
    id: 13,
    name: "Marcus Rashford",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 85,
    physical: 78,
    skills: 82,
    profilePicture: athleteImage,
    jerseyNumber: 10,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 70,
    speed: 32.5,
    endurance: 85,
  },
  {
    id: 12,
    name: "Marcus Rashford",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 85,
    physical: 78,
    skills: 82,
    profilePicture: athleteImage,
    jerseyNumber: 10,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 70,
    speed: 32.5,
    endurance: 85,
  },
  {
    id: 2,
    name: "Bruno Fernandes",
    position: "Midfielder",
    shortPosition: "MF",
    totalScore: 87,
    physical: 72,
    skills: 89,
    profilePicture: athleteImage,
    jerseyNumber: 8,
    year: 2024,
    team: "Manchester United",
    height: 179,
    weight: 69,
    speed: 28.2,
    endurance: 90,
  },
  {
    id: 3,
    name: "Harry Maguire",
    position: "Defender",
    shortPosition: "DF",
    totalScore: 79,
    physical: 85,
    skills: 73,
    profilePicture: athleteImage,
    jerseyNumber: 5,
    year: 2024,
    team: "Manchester United",
    height: 194,
    weight: 82,
    speed: 26.8,
    endurance: 78,
  },
  {
    id: 4,
    name: "David de Gea",
    position: "Goalkeeper",
    shortPosition: "GK",
    totalScore: 83,
    physical: 76,
    skills: 88,
    profilePicture: athleteImage,
    jerseyNumber: 1,
    year: 2024,
    team: "Manchester United",
    height: 192,
    weight: 76,
    speed: 24.5,
    endurance: 82,
  },
  {
    id: 5,
    name: "Jadon Sancho",
    position: "Forward",
    shortPosition: "FW",
    totalScore: 81,
    physical: 75,
    skills: 84,
    profilePicture: athleteImage,
    jerseyNumber: 25,
    year: 2024,
    team: "Manchester United",
    height: 180,
    weight: 76,
    speed: 31.8,
    endurance: 80,
  },
  {
    id: 6,
    name: "Paul Pogba",
    position: "Midfielder",
    shortPosition: "MF",
    totalScore: 84,
    physical: 80,
    skills: 86,
    profilePicture: athleteImage,
    jerseyNumber: 6,
    year: 2024,
    team: "Manchester United",
    height: 191,
    weight: 84,
    speed: 29.4,
    endurance: 88,
  },
];


const PhysicalPerformance: React.FC = () => {
  const performanceMetrics = [
    { title: "Vertical Jump", icon: <Zap size={16} />, value: "70 cm", subtitle: "Best in period" },
    { title: "Broad Jump", icon: <Target size={16} />, value: "274 cm", subtitle: "Best in period" },
    { title: "10 Meter Run", icon: <Clock size={16} />, value: "1.70 sec", subtitle: "Best in period" },
    { title: "Five Ten Five", icon: <Clock size={16} />, value: "4.30 sec", subtitle: "Best in period" },
    { title: "T-Agility", icon: <Users size={16} />, value: "9.70 sec", subtitle: "Best in period" },
  ];

  return (
    <div className="physical-performance">
      <div className="section-header">
        <h2 className="section-title physical-performance-title">
          Physical &nbsp;<span className="notification-badge2">5</span>
        </h2>
        <div className="performance-filter"></div>
      </div>

      <div className="performance-cards">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="performance-card-teams">
            <div className="performance-card-header-teams">
              <div className="performance-card-icon">{metric.icon}</div>&nbsp;&nbsp;
              <div className="performance-card-title">{metric.title}</div> 
            </div>
            <div className="performance-card-value-teams">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillDevelopment: React.FC = () => {
  const SkillMetrics = [
    { title: "Control", icon: <Circle size={16} />, value: "7/10", subtitle: "Average Rating" },
    { title: "Passing", icon: <Send size={16} />, value: "9/10", subtitle: "Average Rating" },
    { title: "Running wth Ball", icon: <Zap size={16} />, value: "10/10", subtitle: "Average Rating" },
    { title: "1v1", icon: <Target size={16} />, value: "7/10", subtitle: "Average Rating" },
    { title: "Shooting", icon: <Target size={16} />, value: "9/10", subtitle: "Average Rating" },
  ];

  return (
    <div className="skill-development">
      <div className="section-header">
        <h2 className="section-title skill-development-title">
          Skills &nbsp;<span className="notification-badge">5</span>
        </h2>
        <div className="performance-filter"></div>
      </div>

      <div className="skill-development-cards">
        {SkillMetrics.map((metric, index) => (
          <div key={index} className="skill-development-card-teams">
            <div className="skill-development-card-header-teams">
              <div className="skill-development-card-icon">{metric.icon}</div> &nbsp;&nbsp;
              <div className="skill-development-card-title">{metric.title}</div>
            </div>
            <div className="skill-development-card-value-teams">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};



  /* -------------------- PHYSICAL CHART CARD -------------------- */
  
  type DataPoint = { week: string; value: number };
  
  const weeks = Array.from({ length: 24 }, (_, i) => `W${i + 1}`);
  
  // sample data (feel free to replace with real API data)
  const dataFiveTenFive: DataPoint[] = weeks.map((w, i) => ({
    week: w,
    value: 3.9 + Math.sin(i / 5) * 0.15 + (i % 3) * 0.03, // ~3.8–4.5 sec
  }));
  const dataBroadJump: DataPoint[] = weeks.map((w, i) => ({
    week: w,
    value: 240 + Math.sin(i / 4) * 12 + (i % 4) * 2, // ~230–270 cm
  }));
  const dataTAgility: DataPoint[] = weeks.map((w, i) => ({
    week: w,
    value: 9.3 + Math.sin(i / 6) * 0.25 + (i % 5) * 0.02, // ~9.0–10.0 sec
  }));
  
  const metricUnits: Record<string, string> = {
    fiveTenFive: "s",
    broadJump: "cm",
    tAgility: "s",
  };
  
  const metricLabel: Record<string, string> = {
    fiveTenFive: "Five Ten Five",
    broadJump: "Broad Jump",
    tAgility: "T-Agility",
  };
  
  const seriesMap: Record<string, DataPoint[]> = {
    fiveTenFive: dataFiveTenFive,
    broadJump: dataBroadJump,
    tAgility: dataTAgility,
  };
  
  const PhysicalChartCard: React.FC = () => {
    const [metric, setMetric] = useState<"fiveTenFive" | "broadJump" | "tAgility">(
      "fiveTenFive"
    );
    const [range, setRange] = useState<"3m" | "6m" | "all">("6m");
  
    const full = seriesMap[metric];
  
    const displayData = useMemo(() => {
      if (range === "3m") return full.slice(-12); // ~12 weeks
      if (range === "6m") return full.slice(-24); // ~24 weeks
      return full; // all
    }, [full, range]);
  
    const avg =
      displayData.reduce((s, d) => s + d.value, 0) / (displayData.length || 1);
    const current = displayData[displayData.length - 1]?.value ?? 0;
    const best =
      metric === "broadJump"
        ? Math.max(...displayData.map((d) => d.value)) // higher is better (jump)
        : Math.min(...displayData.map((d) => d.value)); // lower is better (time)
  
    const unit = metricUnits[metric];
  
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
              <button
                key={r.key}
                className={`pill ${range === r.key ? "is-active" : ""}`}
                onClick={() => setRange(r.key as any)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
  
        {/* Tabs */}
        <div className="physchart__tabs">
          {(["fiveTenFive", "broadJump", "tAgility"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setMetric(k)}
              className={`tab ${metric === k ? "is-active" : ""}`}
            >
              {metricLabel[k]}
            </button>
          ))}
        </div>
  
        <div className="physchart__grid">
          {/* Chart */}
          <div className="physchart__canvas">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={displayData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94C94A" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#94C94A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#151519",
                    border: "1px solid #24242a",
                    borderRadius: 10,
                    color: "#e8e8ea",
                  }}
                  formatter={(v: number) => [`${v.toFixed(2)} ${unit}`, metricLabel[metric]]}
                  labelStyle={{ color: "#9a9aa3" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#94C94A"
                  strokeWidth={3}
                  fill="url(#pcGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          {/* Side stat */}
          <div className="physchart__side">
            <div className="sidecard">
              <div className="sidecard__title">
                <span className="spark">⎍</span> Current Team Average
              </div>
              <div className="sidecard__value">
                {avg.toFixed(2)} {unit}
              </div>
              <div className="muted tiny">Based on {displayData.length} weeks</div>
            </div>
          </div>
        </div>
  
        {/* Bottom metrics */}
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
              {/* simple trend vs. 4 weeks ago */}
              {(() => {
                const idx = Math.max(0, displayData.length - 5);
                const base = displayData[idx]?.value ?? current;
                const pct = base ? ((current - base) / base) * 100 : 0;
                const sign = pct >= 0 ? "+" : "";
                return `${sign}${pct.toFixed(1)}%`;
              })()}{" "}
              <span className="muted tiny">vs last month</span>
            </div>
            <span className="dot dot--amber" />
          </div>
        </div>
      </section>
    );
  };



  /* -------------------- SKILLS CHART CARD -------------------- */

type SkillPoint = { week: string; value: number };

const wks = Array.from({ length: 24 }, (_, i) => `W${i + 1}`);

const passingData: SkillPoint[] = wks.map((w, i) => ({
  week: w,
  value: 6.6 + Math.sin(i / 4) * 0.4 + (i % 4) * 0.05, // ~6.5–7.8
}));
const runningBallData: SkillPoint[] = wks.map((w, i) => ({
  week: w,
  value: 7.0 + Math.sin(i / 5) * 0.35 + ((i + 2) % 5) * 0.04,
}));
const controlData: SkillPoint[] = wks.map((w, i) => ({
  week: w,
  value: 6.8 + Math.sin(i / 6) * 0.45 + (i % 3) * 0.05,
}));

const skillSeries: Record<string, SkillPoint[]> = {
  passing: passingData,
  running: runningBallData,
  control: controlData,
};

const SkillsChartCard: React.FC = () => {
  const [metric, setMetric] = useState<"passing" | "running" | "control">("passing");
  const [range, setRange] = useState<"3m" | "6m" | "all">("6m");

  const full = skillSeries[metric];

  const displayData = useMemo(() => {
    if (range === "3m") return full.slice(-12); // ~12 weeks
    if (range === "6m") return full.slice(-24); // ~24 weeks
    return full;
  }, [full, range]);

  const avg = displayData.reduce((s, d) => s + d.value, 0) / (displayData.length || 1);
  const current = displayData[displayData.length - 1]?.value ?? 0;
  const peak = Math.max(...displayData.map((d) => d.value));

  // progress vs ~last month (4 weeks)
  const baseIdx = Math.max(0, displayData.length - 5);
  const base = displayData[baseIdx]?.value ?? current;
  const progress = current - base;

  // donut parts (out of 10)
  const donut = [
    { name: "score", value: Math.min(10, Math.max(0, current)) },
    { name: "rest", value: Math.max(0, 10 - Math.min(10, Math.max(0, current))) },
  ];

  const label = metric === "passing" ? "Passing" : metric === "running" ? "Running with ball" : "Control";

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
            <button
              key={r.key}
              className={`pill pill--purple ${range === r.key ? "is-active" : ""}`}
              onClick={() => setRange(r.key as any)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="skillchart__tabs">
        {(["passing", "running", "control"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setMetric(k)}
            className={`stab ${metric === k ? "is-active" : ""}`}
          >
            {k === "running" ? "Running with ball" : k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      {/* Top grid: left stat, center donut, right line */}
      <div className="skillchart__grid">
        {/* Left card */}
        <div className="scard scard--left">
          <div className="scard__title">◎ Current Team Average</div>
          <div className="scard__value">{avg.toFixed(1)}/10</div>
          <div className="muted tiny">Based on {displayData.length} players</div>
        </div>

        {/* Donut center */}
        <div className="donut">
          <PieChart width={520} height={320}>
            <defs>
              <linearGradient id="sgPurple" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c4dff" />
                <stop offset="100%" stopColor="#932bff" />
              </linearGradient>
            </defs>
            <Pie
              data={donut}
              dataKey="value"
              innerRadius={100}
              outerRadius={140}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell key="score" fill="url(#sgPurple)" />
              <Cell key="rest" fill="#221b33" />
            </Pie>
          </PieChart>

          <div className="donut__center">
            <div className="donut__value">{current.toFixed(1)}</div>
            <div className="donut__sub">out of 10</div>
            <div className="donut__label">{label}</div>
          </div>
        </div>

        {/* Right mini line */}
        <div className="skillchart__spark">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={displayData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c4dff" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#7c4dff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: "#a6a6ae" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#151519",
                  border: "1px solid #24242a",
                  borderRadius: 10,
                  color: "#e8e8ea",
                }}
                formatter={(v: number) => [`${v.toFixed(2)} /10`, label]}
                labelStyle={{ color: "#9a9aa3" }}
              />
              <Area type="monotone" dataKey="value" stroke="#7c4dff" strokeWidth={3} fill="url(#sparkGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom stat cards */}
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
            {progress >= 0 ? `+${progress.toFixed(1)}` : progress.toFixed(1)}{" "}
            <span className="tiny">vs last period</span>
          </div>
        </div>
      </div>
    </section>
  );
};


/* -------------------- COACH NOTES -------------------- */

type Note = {
  coach: string;
  category: "Strategy" | "Technique" | "Performance" | "Training";
  color: string;
  date: string;        
  message: string;
};

const coachNotes: Note[] = [
  {
    coach: "Coach Martinez",
    category: "Strategy",
    color: "#ff4d57",
    date: "Aug 9, 2025",
    message:
      "Need to focus more on defensive positioning in the upcoming training sessions.",
  },
  {
    coach: "Coach Rodriguez",
    category: "Technique",
    color: "#f4c531",
    date: "Jul 31, 2025",
    message:
      "Players demonstrated strong teamwork and communication throughout the match.",
  },
  {
    coach: "Coach Martinez",
    category: "Performance",
    color: "#7c4dff",
    date: "Jul 24, 2025",
    message:
      "Fitness levels are improving consistently across all players.",
  },
  {
    coach: "Coach Rodriguez",
    category: "Training",
    color: "#33d17a",
    date: "Jul 17, 2025",
    message:
      "Tactical awareness needs improvement when transitioning from defense to attack.",
  },
];

const CoachNotes: React.FC = () => {
  return (
    <section className="coachnotes">
      <div className="cnotes__header">
        <h2 className="cnotes__title">Coach Notes</h2>
        <span className="badge badge--danger">{coachNotes.length}</span>
      </div>

      <ul className="cnotes__list">
        {coachNotes.map((n, i) => (
          <li key={i} className="cnotes__item">
            <div className="cnotes__top">
              <span className="cnotes__coach">{n.coach}</span>
              <time className="cnotes__date">{n.date}</time>
            </div>

            <div className="cnotes__catrow">
              <span className="cnotes__swatch" style={{ background: n.color }} />
              <span className="cnotes__cat">{n.category}</span>
            </div>

            <p className="cnotes__text">
              {n.message}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};



/* -------------------- PAGE -------------------- */

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");

  // Pagination
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPosition]);

  const filteredPlayers = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return mockPlayers.filter((player) => {
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
  }, [searchTerm, filterPosition]);

  const totalPlayers = filteredPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalPlayers / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalPlayers);
  const pagePlayers = filteredPlayers.slice(startIndex, endIndex);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

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
        <h1 className="pgtitle">Team A Details</h1>
        <p className="pgsubtitle">
          Detailed view of team performance, player roster, and statistics.
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
              <button className="chip chip--gold">
                <Crown size={14} />
                <span>Top 3</span>
                <small>Elite</small>
              </button>
              <button className="chip chip--violet">
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
          <div className="tablewrap">
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
                {pagePlayers.map((player, index) => (
                  <tr key={player.id} className="player-row">
                    <td>
                      <span
                        className={`rankpill ${
                          startIndex + index + 1 <= 3
                            ? "rankpill--gold"
                            : startIndex + index + 1 <= 10
                            ? "rankpill--purple"
                            : ""
                        }`}
                      >
                        #{startIndex + index + 1}
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
                    <td className="metric metric--good">
                      {Number(player.speed).toFixed(1)}
                    </td>
                    <td className="metric metric--good">
                      {Number(player.endurance).toFixed(1)}
                    </td>
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
      </div>
    </main>
  );
};

export default TeamsPage;
