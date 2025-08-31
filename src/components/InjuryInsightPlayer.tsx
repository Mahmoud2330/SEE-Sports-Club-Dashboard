import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import injuries from "../../public/data/injuries.json"; // requires tsconfig: resolveJsonModule: true

type Reason = { code: string; label: string; weight: number };
type InjuryRow = {
  playerId: number;
  status: "healthy" | "injured" | "at-risk";
  riskScore: number;        // 0..1
  confidence: number;       // 0..1
  expectedStart: string | null; // ISO date or null
  expectedEnd: string | null;   // ISO date or null
  reasons: Reason[];
  notes?: string;
};

type DateRange = { start: Date; end: Date };

function withinRange(d: Date | null, range?: DateRange) {
  if (!d || !range) return true; // if no filter, show anyway
  const t = d.getTime();
  return t >= range.start.getTime() && t <= range.end.getTime();
}

function statusColors(status: InjuryRow["status"]) {
  // Use CSS custom properties that will adapt to theme
  switch (status) {
    case "injured":
      return { accent: "#ff4d57", bg: "var(--db-danger-10, rgba(255, 75, 87, 0.1))", border: "var(--db-danger-20, rgba(255, 75, 87, 0.2))" };
    case "at-risk":
      return { accent: "#f4c531", bg: "var(--db-warning-10, rgba(245, 197, 49, 0.1))", border: "var(--db-warning-20, rgba(245, 197, 49, 0.2))" };
    default:
      return { accent: "#33d17a", bg: "var(--db-success-10, rgba(51, 209, 122, 0.1))", border: "var(--db-success-20, rgba(51, 209, 122, 0.2))" };
  }
}

export default function InjuryInsightPlayer({
  playerId,
  range
}: {
  playerId: number;
  range?: DateRange;
}) {
  const row = useMemo<InjuryRow | null>(() => {
    const r = (injuries as InjuryRow[]).find(x => x.playerId === playerId) || null;
    if (!r) return null;
    // Hide “expected” if outside chosen period, but still show status/risk
    const s = r.expectedStart ? new Date(r.expectedStart) : null;
    const e = r.expectedEnd ? new Date(r.expectedEnd) : null;
    return {
      ...r,
      expectedStart: withinRange(s, range) ? r.expectedStart : null,
      expectedEnd: withinRange(e, range) ? r.expectedEnd : null
    };
  }, [playerId, range]);

  // graceful default if no record
  const data = row ?? {
    playerId,
    status: "healthy" as const,
    riskScore: 0.1,
    confidence: 0.4,
    expectedStart: null,
    expectedEnd: null,
    reasons: [],
    notes: "No risk signals detected in the selected period."
  };

  const ring = [
    { name: "risk", value: Math.round(data.riskScore * 100) },
    { name: "rest", value: 100 - Math.round(data.riskScore * 100) }
  ];
  const colors = statusColors(data.status);

  return (
    <section className="card injurycard">
      <div className="injury__head">
        <div className="injury__title">Injury Insight</div>
        <span className={`badgepill ${data.status}`}>
          {data.status === "injured" ? "Injured" :
           data.status === "at-risk" ? "At Risk" : "Healthy"}
        </span>
      </div>

      <div className="injury__grid">
        {/* Risk ring */}
        <div className="injury__ring">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={colors.accent} />
                  <stop offset="100%" stopColor={colors.accent} />
                </linearGradient>
              </defs>
              <Pie
                data={ring}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill="url(#riskGrad)" />
                <Cell fill="#1a1a1f" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="injury__ringCenter">
            <div className="injury__risk">{Math.round(data.riskScore * 100)}%</div>
            <div className="injury__sub">Risk</div>
            <div className="injury__conf">Conf: {(data.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Window + notes */}
        <div className="injury__meta">
          <div className="injury__row">
            <div className="injury__label">Expected Window</div>
            <div className="injury__value">
              {data.expectedStart && data.expectedEnd
                ? `${new Date(data.expectedStart).toLocaleDateString()} – ${new Date(
                    data.expectedEnd
                  ).toLocaleDateString()}`
                : "—"}
            </div>
          </div>
          <div className="injury__row">
            <div className="injury__label">Status</div>
            <div className="injury__value">{data.status}</div>
          </div>
          <div className="injury__row">
            <div className="injury__label">Notes</div>
            <div className="injury__value muted">{data.notes || "—"}</div>
          </div>
        </div>

        {/* Reasons */}
        <div className="injury__reasons">
          <div className="injury__subtitle">Top Reasons</div>
          {data.reasons.length === 0 ? (
            <div className="muted tiny">No high-impact contributors in this period.</div>
          ) : (
            <ul className="injury__list">
              {data.reasons
                .sort((a, b) => b.weight - a.weight)
                .map((r) => (
                  <li key={r.code} className="injury__reason">
                    <span className="reason__label">{r.label}</span>
                    <span className="reason__bar">
                      <span
                        className="reason__fill"
                        style={{ width: `${Math.round(r.weight * 100)}%` }}
                      />
                    </span>
                    <span className="reason__pct">{Math.round(r.weight * 100)}%</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
