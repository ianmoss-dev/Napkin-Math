import { useRef, useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, ReferenceLine,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getBasePay } from '../data/militaryPayTables';
import { getBAH } from '../data/bahRates';
import { getBAS } from '../data/basRates';
import { getPromotionTimeline } from '../data/promotionTimelines';
import { federalTaxAdvantage } from '../utils/calculations';

function calcAnnualRMC(rank, tis, hasDependents, zip) {
  const bp  = getBasePay(rank, tis);
  const bah = getBAH(rank, hasDependents, zip);
  const bas = getBAS(rank);
  const tax = federalTaxAdvantage(bp, bah, bas, 0);
  return (bp + bah + bas + tax) * 12;
}

function buildCareerData(rank, tis, hasDependents, zip) {
  if (!rank || tis == null) return [];
  const timeline = getPromotionTimeline(rank);
  const data = [];

  for (let chartYear = 0; chartYear <= 20; chartYear++) {
    const actualTIS = tis + chartYear;
    let currentRank = rank;
    for (const p of timeline) {
      if (p.atYear <= actualTIS) currentRank = p.to;
    }
    const isPromotion = chartYear > 0 && timeline.some(p => p.atYear === actualTIS);
    data.push({
      tis: actualTIS,
      rmc: calcAnnualRMC(currentRank, actualTIS, hasDependents, zip),
      rank: currentRank,
      isNow: chartYear === 0,
      isPromotion,
    });
  }
  return data;
}

function CustomDot({ cx, cy, payload }) {
  if (payload.isNow) {
    return <circle cx={cx} cy={cy} r={6} fill="var(--gold)" stroke="#fff" strokeWidth={2} />;
  }
  if (payload.isPromotion) {
    return <circle cx={cx} cy={cy} r={5} fill="var(--blue)" stroke="#fff" strokeWidth={2} />;
  }
  return null;
}

function formatY(value) {
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;
  return `$${value}`;
}

export default function CareerEarningsChart({ rank, tis, hasDependents, zip, m2Rank, m2TIS, m2Dependents, m2ZIP, isDual }) {
  const scrollRef = useRef(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hide = () => setShowHint(false);
    el.addEventListener('scroll', hide, { once: true });
    return () => el.removeEventListener('scroll', hide);
  }, []);

  const m1Data = buildCareerData(rank, tis, hasDependents, zip);
  const m2Data = isDual ? buildCareerData(m2Rank, m2TIS, m2Dependents, m2ZIP) : [];

  if (!m1Data.length) return null;

  const allValues = [...m1Data.map(d => d.rmc), ...m2Data.map(d => d.rmc)];
  const yMax = Math.ceil(Math.max(...allValues) / 10000) * 10000;

  return (
    <div style={{ marginTop: 24, position: 'relative' }}>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--blue)',
        margin: '0 0 12px',
      }}>
        Career Earnings Trajectory
      </p>

      <div
        ref={scrollRef}
        style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}
      >
        <LineChart width={700} height={260} data={m1Data} margin={{ top: 8, right: 60, bottom: 8, left: 10 }}>
          <XAxis
            dataKey="tis"
            tickFormatter={v => `YOS ${v}`}
            tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: 'var(--gray)' }}
          />
          <YAxis
            tickFormatter={formatY}
            domain={[0, yMax]}
            tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: 'var(--gray)' }}
            width={50}
          />
          <Tooltip
            formatter={(value) => [`$${Math.round(value).toLocaleString('en-US')}/yr`, 'Annual RMC']}
            labelFormatter={(label) => `YOS ${label}`}
            contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}
          />
          <ReferenceLine y={100000} stroke="var(--gray)" strokeDasharray="4 4" label={{ value: '$100K', position: 'right', fontSize: 11, fill: 'var(--gray)', fontFamily: 'DM Sans, sans-serif' }} />
          <ReferenceLine y={150000} stroke="var(--gray)" strokeDasharray="4 4" label={{ value: '$150K', position: 'right', fontSize: 11, fill: 'var(--gray)', fontFamily: 'DM Sans, sans-serif' }} />
          <Line
            type="monotone"
            dataKey="rmc"
            stroke="var(--navy)"
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 5 }}
            name="Your RMC"
          />
          {isDual && m2Data.length > 0 && (
            <Line
              type="monotone"
              data={m2Data}
              dataKey="rmc"
              stroke="var(--gold)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              name="Partner RMC"
            />
          )}
          {isDual && <Legend wrapperStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13 }} />}
        </LineChart>
      </div>

      {showHint && (
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 12,
          color: 'var(--gray)',
          textAlign: 'center',
          margin: '6px 0 0',
          opacity: 0.6,
        }}>
          swipe to see more →
        </p>
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>Now</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)' }} />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>Promotion milestone</span>
        </div>
      </div>
    </div>
  );
}
