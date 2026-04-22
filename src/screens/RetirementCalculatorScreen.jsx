import { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

function buildProjection(initialSavings, contribution, nominalRate, inflationRate, currentAge, years) {
  const r = nominalRate / 100 / 12;
  const realR = (nominalRate - inflationRate) / 100 / 12;
  const data = [{ year: 0, age: currentAge, nominal: Math.round(initialSavings), real: Math.round(initialSavings) }];
  let nominal = initialSavings;
  let real = initialSavings;
  for (let m = 1; m <= years * 12; m++) {
    nominal = (nominal + contribution) * (1 + r);
    real = (real + contribution) * (1 + realR);
    if (m % 12 === 0) {
      const yr = m / 12;
      data.push({ year: yr, age: currentAge + yr, nominal: Math.round(nominal), real: Math.round(real) });
    }
  }
  return data;
}

export default function RetirementCalculatorScreen({ userData, onBack, onNext }) {
  const [mounted, setMounted] = useState(false);

  const defaultContribution = Math.round(
    userData.tspContributionPct
      ? (userData.m1BasePay || 0) * (userData.tspContributionPct / 100)
      : (userData.monthlyTakeHome || 0) * 0.15
  );

  const [initialSavings, setInitialSavings] = useState(0);
  const [currentAge, setCurrentAge] = useState(28);
  const [contribution, setContribution] = useState(defaultContribution || 500);
  const [nominalRate, setNominalRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [retireAge, setRetireAge] = useState(60);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const years = Math.max(1, retireAge - currentAge);
  const data = useMemo(
    () => buildProjection(initialSavings, contribution, nominalRate, inflationRate, currentAge, years),
    [initialSavings, contribution, nominalRate, inflationRate, currentAge, years]
  );

  const finalNominal = data[data.length - 1]?.nominal || 0;
  const finalReal = data[data.length - 1]?.real || 0;
  const totalContributed = Math.round(initialSavings + contribution * years * 12);
  const growth = Math.max(0, finalNominal - totalContributed);

  const maxSlider = Math.max(3000, Math.round((userData.monthlyTakeHome || 5000) * 0.4));

  return (
    <div style={{
      minHeight: '100dvh',
      padding: '4px 24px 100px',
      background: '#F8F9FA',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button
        onClick={onBack}
        aria-label="Back"
        style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}
      >
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 4px', lineHeight: 1.2 }}>
        Retirement Calculator
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Adjust the numbers. See what time and consistency do.
      </p>

      {/* Result card */}
      <div style={{ background: 'var(--navy)', borderRadius: 20, padding: '20px 24px', marginBottom: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          At age {retireAge}
        </p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1 }}>
          {formatCurrency(finalNominal)}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px' }}>In today&rsquo;s dollars</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>{formatCurrency(finalReal)}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px' }}>You contributed</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{formatCurrency(totalContributed)}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px' }}>Market grew</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#4CAF50', margin: 0 }}>{formatCurrency(growth)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '16px 8px 8px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="retireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--navy)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--navy)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="age"
              tickFormatter={v => `${v}`}
              tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#595959' }}
              tickLine={false} axisLine={false}
              label={{ value: 'Age', position: 'insideBottomRight', offset: -4, fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#999' }}
            />
            <YAxis
              tickFormatter={v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}k`}
              tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#595959' }}
              tickLine={false} axisLine={false} width={44}
            />
            <Tooltip
              formatter={(v, name) => [formatCurrency(v), name === 'nominal' ? 'Nominal' : "Today's dollars"]}
              labelFormatter={l => `Age ${l}`}
              contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, borderRadius: 8, border: '1px solid #E0E0E0' }}
            />
            <Area type="monotone" dataKey="nominal" stroke="var(--navy)" strokeWidth={2.5} fill="url(#retireGrad)" dot={false} />
            <Area type="monotone" dataKey="real" stroke="var(--gold)" strokeWidth={1.5} fill="url(#realGrad)" dot={false} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, padding: '4px 16px 8px', justifyContent: 'center' }}>
          {[{ color: 'var(--navy)', label: 'Nominal', dash: false }, { color: 'var(--gold)', label: "Today's $", dash: true }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 2, background: l.color, opacity: l.dash ? 0.7 : 1 }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Monthly contribution — primary slider input */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 4px' }}>Monthly Contribution</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 12px' }}>{formatCurrency(contribution)}/mo</p>
          <input
            type="range"
            min={0}
            max={maxSlider}
            step={25}
            value={contribution}
            onChange={e => setContribution(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--navy)', height: 6, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#BDBDBD' }}>$0</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#BDBDBD' }}>{formatCurrency(maxSlider)}</span>
          </div>
        </div>

        {/* Two-col inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Current Age', value: currentAge, set: setCurrentAge, min: 16, max: 70, step: 1, format: v => `${v}` },
            { label: 'Retire At', value: retireAge, set: setRetireAge, min: currentAge + 1, max: 80, step: 1, format: v => `${v}` },
            { label: 'Starting Savings', value: initialSavings, set: setInitialSavings, min: 0, max: 500000, step: 1000, format: v => formatCurrency(v) },
            { label: 'Return Rate', value: nominalRate, set: setNominalRate, min: 1, max: 15, step: 0.5, format: v => `${v}%` },
          ].map(({ label, value, set, min, max, step, format }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 4px' }}>{label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px' }}>{format(value)}</p>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--navy)', height: 4, cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>

        {/* Inflation */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 4px' }}>Inflation Rate</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px' }}>{inflationRate}%</p>
          <input
            type="range"
            min={0}
            max={8}
            step={0.5}
            value={inflationRate}
            onChange={e => setInflationRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--navy)', height: 4, cursor: 'pointer' }}
          />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '4px 0 0' }}>Historical average: ~2.5–3%</p>
        </div>
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', textAlign: 'center', margin: '20px 0 0', lineHeight: 1.6 }}>
        Assumes consistent contributions and constant rates. Does not account for tax treatment, contribution limits, or market volatility.
      </p>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button
        onClick={onBack}
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
      >
        Done
      </button>
    </div>
  );
}
