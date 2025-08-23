import React from 'react';
import { Filter, Zap, Target, Clock, Users } from 'lucide-react';
import type { Player } from '../services/dataService';

// Local type for what we render
type Card = { name: string; current: string; average?: string };

const iconFor = (title: string) => {
  const key = title.toLowerCase();
  if (key.includes('vertical')) return <Zap size={16} />;
  if (key.includes('broad')) return <Target size={16} />;
  if (key.includes('10') || key.includes('five ten five') || key.includes('5-10-5')) return <Clock size={16} />;
  if (key.includes('agility') || key.includes('t-agility')) return <Users size={16} />;
  return <Clock size={16} />;
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

function formatValue(raw: number, unit: 'cm' | 'sec') {
  // keep your current look
  return unit === 'cm' ? `${raw} cm` : `${raw.toFixed(2)} sec`;
}

function buildCardsFromPlayer(player: Player): Card[] {
  // Your JSON uses a key with a space: "Physical Performance"
  const perf = (player as any)['Physical Performance'] as
    | Record<string, Record<string, number>>
    | undefined;

  if (!perf) {
    // Fallback to your existing static values if player has no data
    return [
      { name: 'Vertical Jump', current: '70 cm' },
      { name: 'Broad Jump', current: '274 cm' },
      { name: '10 Meter Run', current: '1.70 sec' },
      { name: 'Five Ten Five', current: '4.30 sec' },
      { name: 'T-Agility', current: '9.70 sec' },
    ];
  }

  // Define unit and “higher-is-better” for each test
  const spec: Record<
    string,
    { unit: 'cm' | 'sec'; higherBetter: boolean; jsonKey: string }
  > = {
    'Vertical Jump': { unit: 'cm',  higherBetter: true,  jsonKey: 'Vertical Jump' },
    'Broad Jump':    { unit: 'cm',  higherBetter: true,  jsonKey: 'Broad Jump' },
    '10 Meter Run':  { unit: 'sec', higherBetter: false, jsonKey: '10 Meter Run' },
    'Five Ten Five': { unit: 'sec', higherBetter: false, jsonKey: 'Five Ten Five' },
    'T-Agility':     { unit: 'sec', higherBetter: false, jsonKey: 'T-Agility' },
  };

  const cards: Card[] = [];

  Object.entries(spec).forEach(([label, cfg]) => {
    const series = perf[cfg.jsonKey];
    if (!series) return;

    // Determine latest value by the last month present in MONTHS order
    let latestVal: number | undefined;
    for (let i = MONTHS.length - 1; i >= 0; i--) {
      const m = MONTHS[i];
      if (series[m] != null) { latestVal = series[m]; break; }
    }

    // Calculate average value for the period instead of best
    const values = MONTHS.map((m) => series[m]).filter((v): v is number => typeof v === 'number');
    const avgVal =
      values.length === 0
        ? undefined
        : values.reduce((sum, val) => sum + val, 0) / values.length;

    cards.push({
      name: label,
      current: latestVal != null ? formatValue(latestVal, cfg.unit) : '—',
      average: avgVal != null ? formatValue(Math.round(avgVal), cfg.unit) : undefined,
    });
  });

  return cards;
}

interface Props {
  player: Player;                 // <-- now required
  periodLabel?: string;           // optional header label
}

const PhysicalPerformance: React.FC<Props> = ({ player, periodLabel }) => {
  const cards = buildCardsFromPlayer(player);
  const label = periodLabel || 'Sep 2024 - Aug 2025';

  return (
    <div className="physical-performance">
      <div className="section-header">
        <h2 className="physical-performance-title">Physical Performance</h2>
        <div className="performance-filter">
          <Filter size={16} />
          <span>{label}</span>
        </div>
      </div>

      <div className="performance-cards">
        {cards.map((metric, index) => (
          <div key={index} className="performance-card">
            <div className="performance-card-header">
              <div className="performance-card-title">{metric.name}</div>
              <div className="performance-card-icon">{iconFor(metric.name)}</div>
            </div>
            <div className="performance-card-value">{metric.average}</div>
            <div className="performance-card-subtitle">
              {metric.average ? `Average in period: ${metric.average}` : 'Average in period'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhysicalPerformance;
