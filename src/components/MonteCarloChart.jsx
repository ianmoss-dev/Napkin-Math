import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { runSimulation } from '../utils/calculations';

function buildProjectionData(contribution, years, profile) {
  const results = runSimulation(contribution, years, profile);
  const p10 = results[Math.floor(results.length * 0.10)];
  const p50 = results[Math.floor(results.length * 0.50)];
  const p90 = results[Math.floor(results.length * 0.90)];

  // Build year-by-year bands using same profile
  const RISK = {
    conservative: { mean: 0.05, std: 0.08 },
    moderate:     { mean: 0.07, std: 0.12 },
    aggressive:   { mean: 0.09, std: 0.15 },
  };
  const { mean } = RISK[profile];
  const r = mean / 12;
  const data = [{ year: 0, p10: 0, p50: 0, p90: 0 }];

  // Scale intermediates proportionally to final values
  for (let yr = 1; yr <= years; yr++) {
    const frac = yr / years;
    // Compound growth approximation for each percentile
    const approxMid = contribution * ((Math.pow(1 + r, yr * 12) - 1) / r);
    data.push({
      year: yr,
      p10: Math.round(p10 * frac * frac),
      p50: Math.round(approxMid),
      p90: Math.round(p90 * frac * Math.sqrt(frac)),
    });
  }
  // Override last point with actual simulation results
  data[data.length - 1] = { year: years, p10: Math.round(p10), p50: Math.round(p50), p90: Math.round(p90) };

  return { data, p10, p50, p90 };
}

export default function MonteCarloChart({ contribution, years = 30, profile }) {
  if (!contribution || !profile) return null;
  const { data, p10, p50, p90 } = buildProjectionData(contribution, years, profile);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Conservative (10th)', value: p10, color: 'var(--gray)' },
          { label: 'Likely (50th)', value: p50, color: 'var(--navy)' },
          { label: 'Strong (90th)', value: p90, color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: s.color, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>{s.label}</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: s.color, margin: 0 }}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="mcBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--blue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="year"
            tickFormatter={v => `Yr ${v}`}
            tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#595959' }}
            tickLine={false} axisLine={false}
          />
          <YAxis
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#595959' }}
            tickLine={false} axisLine={false} width={44}
          />
          <Tooltip
            formatter={(v, name) => [formatCurrency(v), name === 'p90' ? 'Strong (90th)' : name === 'p50' ? 'Likely (50th)' : 'Conservative (10th)']}
            labelFormatter={l => `Year ${l}`}
            contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, borderRadius: 8, border: '1px solid #E0E0E0' }}
          />
          <Area type="monotone" dataKey="p90" stroke="var(--gold)" strokeWidth={1.5} fill="url(#mcBand)" dot={false} strokeDasharray="4 2" />
          <Area type="monotone" dataKey="p50" stroke="var(--navy)" strokeWidth={2.5} fill="none" dot={false} />
          <Area type="monotone" dataKey="p10" stroke="var(--gray)" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
