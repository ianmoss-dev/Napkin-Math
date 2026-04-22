import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

function buildGrowthData(monthlyAmount, years) {
  const r = 0.06 / 12;
  const data = [{ year: 0, value: 0 }];
  let bal = 0;
  for (let m = 1; m <= years * 12; m++) {
    bal = (bal + monthlyAmount) * (1 + r);
    if (m % 12 === 0) data.push({ year: m / 12, value: Math.round(bal) });
  }
  return data;
}

export default function WealthBuildingChart({ monthlyAmount, years = 30 }) {
  if (!monthlyAmount || monthlyAmount <= 0) return null;
  const data = buildGrowthData(monthlyAmount, years);
  const final = data[data.length - 1]?.value || 0;

  return (
    <div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 4px', textAlign: 'center' }}>
        If invested instead at 6%
      </p>
      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 12px', textAlign: 'center' }}>
        {formatCurrency(final)}
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
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
            tickLine={false} axisLine={false} width={40}
          />
          <Tooltip
            formatter={v => [formatCurrency(v), 'Portfolio']}
            labelFormatter={l => `Year ${l}`}
            contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, borderRadius: 8, border: '1px solid #E0E0E0' }}
          />
          <Area type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2.5} fill="url(#wealthGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
