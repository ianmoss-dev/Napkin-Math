import { useEffect, useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';

const AGE_COSTS = { '0-5': 50, '5-10': 100, '10-15': 175, '15+': 250 };
const AGE_LABELS = ['Under 5 yrs', '5–10 yrs', '10–15 yrs', '15+ yrs'];
const AGE_KEYS = ['0-5', '5-10', '10-15', '15+'];

const OIL_INTERVALS = [
  { label: 'Every 3,000 mi', value: 3000 },
  { label: 'Every 5,000 mi', value: 5000 },
  { label: 'Every 7,500 mi', value: 7500 },
  { label: 'Every 10,000 mi', value: 10000 },
];

const OIL_COSTS = [
  { label: 'Under $60', value: 50 },
  { label: '$60 – $100', value: 80 },
  { label: '$100 – $150', value: 125 },
  { label: '$150+', value: 175 },
];

const TIRE_INTERVALS = [
  { label: 'Every 30k mi', value: 30000 },
  { label: 'Every 40k mi', value: 40000 },
  { label: 'Every 50k mi', value: 50000 },
  { label: 'Every 60k+ mi', value: 65000 },
];

const TIRE_COSTS = [
  { label: '$300 – $500', value: 400 },
  { label: '$500 – $800', value: 650 },
  { label: '$800 – $1,200', value: 1000 },
  { label: '$1,200+', value: 1400 },
];

function ChipRow({ options, value, onChange, labelKey = 'label', valueKey = 'value' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const v = opt[valueKey];
        const active = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              height: 40, paddingInline: 14, borderRadius: 20,
              border: `1.5px solid ${active ? 'var(--navy)' : '#D0D0D0'}`,
              background: active ? 'var(--navy)' : '#fff',
              color: active ? '#fff' : 'var(--gray)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              fontWeight: active ? 600 : 400, cursor: 'pointer',
              transition: 'all 150ms', whiteSpace: 'nowrap',
            }}
          >
            {opt[labelKey]}
          </button>
        );
      })}
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder = '0', suffix = '' }) {
  const [draft, setDraft] = useState(value === 0 ? '' : String(value));
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = isFocused ? draft : (value === 0 ? '' : String(value));

  return (
    <div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 6px' }}>
        {label}
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={displayValue}
          onFocus={() => {
            setDraft(value === 0 ? '' : String(value));
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onChange={e => {
            const raw = e.target.value.replace(/,/g, '.');
            if (!/^\d*\.?\d*$/.test(raw)) return;

            setDraft(raw);

            if (raw === '' || raw === '.') {
              onChange(0);
              return;
            }

            const n = parseFloat(raw);
            onChange(isNaN(n) ? 0 : n);
          }}
          style={{
            width: '100%', height: 52, border: '2px solid #E0E0E0', borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: `0 ${suffix ? 48 : 16}px 0 16px`,
            outline: 'none', boxSizing: 'border-box', background: '#fff',
          }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#BDBDBD' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 16px' }}>
        {title}
      </p>
      {children}
    </div>
  );
}

const DEFAULT_CAR = { milesPerYear: 12000, mpg: 25, ageKey: '0-5' };

export default function CarMaintenanceScreen({ updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [numCars, setNumCars] = useState(1);
  const [cars, setCars] = useState([{ ...DEFAULT_CAR }]);
  const [gasPrice, setGasPrice] = useState(3.50);
  const [oilInterval, setOilInterval] = useState(5000);
  const [oilCost, setOilCost] = useState(80);
  const [tireInterval, setTireInterval] = useState(50000);
  const [tireCost, setTireCost] = useState(650);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const updateNumCars = (n) => {
    setNumCars(n);
    setCars(prev => {
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill(null).map(() => ({ ...DEFAULT_CAR }))];
      return prev.slice(0, n);
    });
  };

  const updateCar = (i, field, val) => {
    setCars(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const { fuelMonthly, oilMonthly, tireMonthly, otherMonthly, total } = useMemo(() => {
    let fuel = 0, oil = 0, tire = 0, other = 0;
    for (const car of cars) {
      const mi = car.milesPerYear || 0;
      const mpg = car.mpg || 1;
      fuel += (mi / mpg * gasPrice) / 12;
      oil += (oilCost / oilInterval) * mi / 12;
      tire += (tireCost / tireInterval) * mi / 12;
      other += AGE_COSTS[car.ageKey] || 0;
    }
    return {
      fuelMonthly: Math.round(fuel),
      oilMonthly: Math.round(oil),
      tireMonthly: Math.round(tire),
      otherMonthly: Math.round(other),
      total: Math.round(fuel + oil + tire + other),
    };
  }, [cars, gasPrice, oilInterval, oilCost, tireInterval, tireCost]);

  const handleContinue = () => {
    updateUserData({ gasAndFuel: total });
    onNext('budgetCarInsurance');
  };

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 4px', lineHeight: 1.2 }}>
        Car maintenance
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 20px', lineHeight: 1.5 }}>
        Fuel, oil changes, tires, and upkeep — across all your vehicles.
      </p>

      {/* Running total */}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Estimated monthly total</p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>
          {formatCurrency(total)}/mo
        </p>
      </div>

      {/* Breakdown */}
      {total > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Fuel', v: fuelMonthly },
            { label: 'Oil', v: oilMonthly },
            { label: 'Tires', v: tireMonthly },
            { label: 'Other', v: otherMonthly },
          ].map(({ label, v }) => (
            <div key={label} style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '10px 12px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#BDBDBD', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>{formatCurrency(v)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Number of vehicles */}
      <Section title="Vehicles">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: '0 0 12px' }}>How many vehicles do you have?</p>
        <ChipRow
          options={[{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }]}
          value={numCars}
          onChange={updateNumCars}
        />
      </Section>

      {/* Per-car inputs */}
      {cars.map((car, i) => (
        <Section key={i} title={numCars > 1 ? `Vehicle ${i + 1}` : 'Your vehicle'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <NumberInput
              label="Miles/year"
              value={car.milesPerYear}
              onChange={v => updateCar(i, 'milesPerYear', v)}
              placeholder="12000"
            />
            <NumberInput
              label="MPG"
              value={car.mpg}
              onChange={v => updateCar(i, 'mpg', v)}
              placeholder="25"
            />
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--navy)', margin: '0 0 8px' }}>How old is this car?</p>
          <ChipRow
            options={AGE_KEYS.map((k, j) => ({ label: AGE_LABELS[j], value: k }))}
            value={car.ageKey}
            onChange={v => updateCar(i, 'ageKey', v)}
          />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
            Used to estimate repairs &amp; brakes: {formatCurrency(AGE_COSTS[car.ageKey])}/mo
          </p>
        </Section>
      ))}

      {/* Fuel */}
      <Section title="Fuel">
        <NumberInput
          label="Gas price per gallon"
          value={gasPrice}
          onChange={setGasPrice}
          placeholder="3.50"
          suffix="$/gal"
        />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
          National average ~$3.20–$3.80 · Adjust for your area
        </p>
      </Section>

      {/* Oil changes */}
      <Section title="Oil changes">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>How often do you change your oil?</p>
        <ChipRow options={OIL_INTERVALS} value={oilInterval} onChange={setOilInterval} />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '16px 0 8px' }}>Cost per oil change</p>
        <ChipRow options={OIL_COSTS} value={oilCost} onChange={setOilCost} />
      </Section>

      {/* Tires */}
      <Section title="Tires">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>How often do you replace tires?</p>
        <ChipRow options={TIRE_INTERVALS} value={tireInterval} onChange={setTireInterval} />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '16px 0 8px' }}>Cost per full set</p>
        <ChipRow options={TIRE_COSTS} value={tireCost} onChange={setTireCost} />
      </Section>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button
        onClick={handleContinue}
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
      >
        Continue — {formatCurrency(total)}/mo
      </button>
    </div>
  );
}
