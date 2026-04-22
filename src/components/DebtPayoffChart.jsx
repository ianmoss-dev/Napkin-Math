import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '../utils/formatters';

function buildPayoffData(balance, rate, payment) {
  const r = rate / 100 / 12;
  const data = [{ month: 0, balance: Math.round(balance) }];
  let bal = balance;
  let month = 0;
  while (bal > 0 && month < 600) {
    const interest = r === 0 ? 0 : bal * r;
    bal = Math.max(0, bal - (payment - interest));
    month++;
    if (month % 3 === 0 || bal === 0) data.push({ month, balance: Math.round(bal) });
  }
  return data;
}

export default function DebtPayoffChart({ balance, rate, payment }) {
  if (!balance || !payment || payment <= 0) return null;
  const data = buildPayoffData(balance, rate, payment);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tickFormatter={v => v === 0 ? 'Now' : `Mo ${v}`}
          tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#595959' }}
          tickLine={false} axisLine={false}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#595959' }}
          tickLine={false} axisLine={false} width={40}
        />
        <Tooltip
          formatter={v => [formatCurrency(v), 'Balance']}
          labelFormatter={l => l === 0 ? 'Now' : `Month ${l}`}
          contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, borderRadius: 8, border: '1px solid #E0E0E0' }}
        />
        <Line type="monotone" dataKey="balance" stroke="var(--navy)" strokeWidth={2.5} dot={false} />
        <ReferenceLine y={0} stroke="#E0E0E0" />
      </LineChart>
    </ResponsiveContainer>
  );
}
