import { useEffect, useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';

function ChipRow({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
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
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, skip, onToggle, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: skip ? 0 : 12 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: 0 }}>
          {title}
        </p>
        {onToggle && (
          <button
            onClick={onToggle}
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {skip ? 'Add this' : 'Skip this'}
          </button>
        )}
      </div>
      {!skip && children}
      {skip && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>Not factored in.</p>}
    </div>
  );
}

const HOTEL_COSTS = [
  { label: 'Under $80/night', value: 70 },
  { label: '$80 – $150', value: 115 },
  { label: '$150 – $250', value: 200 },
  { label: '$250+', value: 325 },
];

const FLIGHT_COSTS = [
  { label: 'Under $200', value: 160 },
  { label: '$200 – $400', value: 300 },
  { label: '$400 – $700', value: 550 },
  { label: '$700+', value: 900 },
];

export default function TravelScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);

  // Short trips (weekend trips, visiting family)
  const [skipShort, setSkipShort] = useState(false);
  const [shortTripsPerYear, setShortTripsPerYear] = useState(3);
  const [shortNights, setShortNights] = useState(2);
  const [shortHotelCost, setShortHotelCost] = useState(115);

  // Vacations
  const [skipVacation, setSkipVacation] = useState(false);
  const [vacationsPerYear, setVacationsPerYear] = useState(1);
  const [vacNights, setVacNights] = useState(5);
  const [vacHotelCost, setVacHotelCost] = useState(200);

  // Flights (routine — family visits, TDY personal, etc.)
  const [skipFlights, setSkipFlights] = useState(false);
  const [routineFlights, setRoutineFlights] = useState(2);
  const [routineFlightCost, setRoutineFlightCost] = useState(300);

  // Vacation flights
  const [skipVacFlights, setSkipVacFlights] = useState(false);
  const [vacFlights, setVacFlights] = useState(2);
  const [vacFlightCost, setVacFlightCost] = useState(550);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const {
    shortMonthly, vacMonthly, flightMonthly, vacFlightMonthly, total,
  } = useMemo(() => {
    const short = skipShort ? 0 : (shortTripsPerYear * shortNights * shortHotelCost) / 12;
    const vac = skipVacation ? 0 : (vacationsPerYear * vacNights * vacHotelCost) / 12;
    const flights = skipFlights ? 0 : (routineFlights * routineFlightCost) / 12;
    const vacF = skipVacFlights ? 0 : (vacFlights * vacFlightCost) / 12;
    const t = short + vac + flights + vacF;
    return {
      shortMonthly: Math.round(short),
      vacMonthly: Math.round(vac),
      flightMonthly: Math.round(flights),
      vacFlightMonthly: Math.round(vacF),
      total: Math.round(t),
    };
  }, [skipShort, shortTripsPerYear, shortNights, shortHotelCost, skipVacation, vacationsPerYear, vacNights, vacHotelCost, skipFlights, routineFlights, routineFlightCost, skipVacFlights, vacFlights, vacFlightCost]);

  const handleContinue = () => {
    updateUserData({ travel: total });
    onNext('transition');
  };

  const numInput = (val, setter, label, unit = '') => (
    <div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 6px' }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setter(Math.max(0, val - 1))}
          style={{ width: 40, height: 40, borderRadius: 20, border: '1.5px solid #D0D0D0', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 20, color: 'var(--navy)', cursor: 'pointer' }}
        >–</button>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--navy)', minWidth: 40, textAlign: 'center' }}>{val}{unit}</span>
        <button
          onClick={() => setter(val + 1)}
          style={{ width: 40, height: 40, borderRadius: 20, border: '1.5px solid #D0D0D0', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 20, color: 'var(--navy)', cursor: 'pointer' }}
        >+</button>
      </div>
    </div>
  );

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
        Travel
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 20px', lineHeight: 1.5 }}>
        Flights, hotels, and weekend trips — averaged out monthly.
      </p>

      {/* Running total */}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Monthly average</p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 }}>{formatCurrency(total)}/mo</p>
      </div>

      {/* Short trips */}
      <Section title="Short trips" skip={skipShort} onToggle={() => setSkipShort(v => !v)}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 12px' }}>Weekend trips, visiting family, short getaways</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
          {numInput(shortTripsPerYear, setShortTripsPerYear, 'Trips per year')}
          {numInput(shortNights, setShortNights, 'Nights each')}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>Hotel / lodging per night</p>
        <ChipRow options={HOTEL_COSTS} value={shortHotelCost} onChange={setShortHotelCost} />
        {!skipShort && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
            {shortTripsPerYear} trips × {shortNights} nights × {formatCurrency(shortHotelCost)} = {formatCurrency(Math.round(shortTripsPerYear * shortNights * shortHotelCost / 12))}/mo
          </p>
        )}
      </Section>

      {/* Vacations */}
      <Section title="Vacations" skip={skipVacation} onToggle={() => setSkipVacation(v => !v)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
          {numInput(vacationsPerYear, setVacationsPerYear, 'Vacations per year')}
          {numInput(vacNights, setVacNights, 'Nights each')}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>Hotel / lodging per night</p>
        <ChipRow options={HOTEL_COSTS} value={vacHotelCost} onChange={setVacHotelCost} />
        {!skipVacation && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
            {vacationsPerYear} × {vacNights} nights × {formatCurrency(vacHotelCost)} = {formatCurrency(Math.round(vacationsPerYear * vacNights * vacHotelCost / 12))}/mo
          </p>
        )}
      </Section>

      {/* Routine flights */}
      <Section title="Routine flights" skip={skipFlights} onToggle={() => setSkipFlights(v => !v)}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 12px' }}>Flights for family visits, events, or routine travel</p>
        <div style={{ marginBottom: 12 }}>
          {numInput(routineFlights, setRoutineFlights, 'Flights per year')}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>Typical cost per round trip</p>
        <ChipRow options={FLIGHT_COSTS} value={routineFlightCost} onChange={setRoutineFlightCost} />
        {!skipFlights && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
            {routineFlights} × {formatCurrency(routineFlightCost)} = {formatCurrency(Math.round(routineFlights * routineFlightCost / 12))}/mo
          </p>
        )}
      </Section>

      {/* Vacation flights */}
      <Section title="Vacation flights" skip={skipVacFlights} onToggle={() => setSkipVacFlights(v => !v)}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 12px' }}>Flights specifically for vacation trips</p>
        <div style={{ marginBottom: 12 }}>
          {numInput(vacFlights, setVacFlights, 'Flights per year')}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>Typical cost per round trip</p>
        <ChipRow options={FLIGHT_COSTS} value={vacFlightCost} onChange={setVacFlightCost} />
        {!skipVacFlights && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
            {vacFlights} × {formatCurrency(vacFlightCost)} = {formatCurrency(Math.round(vacFlights * vacFlightCost / 12))}/mo
          </p>
        )}
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
