import { useEffect, useState } from 'react';
import CareerEarningsChart from '../components/CareerEarningsChart';
import { getBasePay } from '../data/militaryPayTables';
import { getBAH, getMHAName } from '../data/bahRates';
import { getBAS } from '../data/basRates';
import { federalTaxAdvantage } from '../utils/calculations';
import { getNextIncomeScreen } from '../utils/flow';

const RANKS = {
  'Enlisted': ['E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9'],
  'Warrant Officer': ['W-1','W-2','W-3','W-4','W-5'],
  'Officer': ['O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10'],
};

const SPECIAL_PAYS_LIST = [
  { key: 'staticLine', label: 'Static Line',   amount: 150 },
  { key: 'halo',       label: 'HALO',           amount: 225 },
  { key: 'aviation',   label: 'Aviation',        amount: 200, note: 'estimate' },
  { key: 'dive',       label: 'Dive',            amount: 150 },
  { key: 'demo',       label: 'Demo',            amount: 150 },
  { key: 'hostileFire',label: 'Hostile Fire',    amount: 225 },
];

const BENEFITS = [
  { name: 'Tricare',                  desc: 'Comprehensive health coverage for you and eligible family members at little or no cost.' },
  { name: 'Commissary & Exchange',    desc: 'Access to on-base stores with prices significantly below retail.' },
  { name: 'Tuition Assistance',       desc: 'Up to $4,500/year toward college courses while serving.' },
  { name: 'GI Bill',                  desc: 'Post-9/11 GI Bill covers tuition, housing, and books after service.' },
  { name: 'Legal Services',           desc: 'Free legal assistance for wills, powers of attorney, and personal legal matters.' },
  { name: 'TSP Match (BRS)',          desc: 'Under the Blended Retirement System, DoD matches up to 5% of base pay in your TSP.' },
  { name: 'Pension',                  desc: 'A defined-benefit pension worth 40–75%+ of base pay for life, beginning at 20 years.' },
];

function calcSpecialPaysTotal(sp) {
  let total = 0;
  for (const p of SPECIAL_PAYS_LIST) {
    if (sp[p.key]) total += p.amount;
  }
  total += Number(sp.flpb) || 0;
  for (const c of sp.custom || []) total += Number(c.amount) || 0;
  return total;
}

function fmt(amount) {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

function CompRow({ label, monthly, annual }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>{fmt(monthly)}</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', marginLeft: 6 }}>{fmt(annual)}/yr</span>
      </div>
    </div>
  );
}

export default function PayReconstructionScreen({ userData, updateUserData, onNext, onBack, memberNumber }) {
  const m = memberNumber === 1 ? 'm1' : 'm2';
  const [mounted, setMounted] = useState(false);
  const [rank, setRank]           = useState(userData[`${m}Rank`] || '');
  const [tis, setTis]             = useState(userData[`${m}TIS`] ?? '');
  const [zip, setZip]             = useState(userData[`${m}ZIP`] || '');
  const [isOCONUS, setIsOCONUS]   = useState(userData[`${m}IsOCONUS`] || false);
  const [ohaRental, setOhaRental] = useState(userData[`${m}OHARental`] || '');
  const [ohaUtility, setOhaUtility] = useState(userData[`${m}OHAUtility`] || '');
  const [cola, setCola]           = useState(userData[`${m}COLA`] || '');
  const [hasDep, setHasDep]       = useState(userData[`${m}Dependents`] || false);
  const [specialPays, setSpecialPays] = useState(userData[`${m}SpecialPays`] || { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: '', custom: [] });
  const [spOpen, setSpOpen]       = useState(false);
  const [benefitsOpen, setBenefitsOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  // Dual military dependents constraint
  const m2DepLocked = memberNumber === 2 && userData.m1Dependents;

  // Effective dependents for BAH
  const effectiveDep = m2DepLocked ? false : hasDep;

  const tisNum = parseInt(tis, 10) || 0;

  // Live calculations
  const basePay = rank && tisNum ? getBasePay(rank, tisNum) : 0;
  const bahMonthly = rank ? (isOCONUS ? (Number(ohaRental) + Number(ohaUtility)) : getBAH(rank, effectiveDep, zip)) : 0;
  const mhaName = !isOCONUS && zip.length === 5 ? getMHAName(zip) : null;
  const bas = rank ? getBAS(rank) : 0;
  const spTotal = calcSpecialPaysTotal(specialPays);
  const taxAdv = basePay ? federalTaxAdvantage(basePay, isOCONUS ? 0 : bahMonthly, bas, spTotal) : 0;
  const rmc = basePay + bahMonthly + bas + spTotal + taxAdv;

  const cardVisible = !!(rank && tisNum);

  const canContinue = !!(rank && tisNum && (isOCONUS ? (Number(ohaRental) > 0 || Number(ohaUtility) > 0) : (zip.length === 5 && mhaName)));

  const handleContinue = () => {
    const updates = {
      [`${m}Rank`]: rank,
      [`${m}TIS`]: tisNum,
      [`${m}ZIP`]: zip,
      [`${m}IsOCONUS`]: isOCONUS,
      [`${m}OHARental`]: Number(ohaRental) || 0,
      [`${m}OHAUtility`]: Number(ohaUtility) || 0,
      [`${m}COLA`]: Number(cola) || 0,
      [`${m}Dependents`]: effectiveDep,
      [`${m}SpecialPays`]: specialPays,
      [`${m}BasePay`]: basePay,
      [`${m}BAH`]: bahMonthly,
      [`${m}BAS`]: bas,
      [`${m}TaxAdvantage`]: taxAdv,
      [`${m}RMC`]: rmc,
      [`${m}RMCAnnual`]: rmc * 12,
    };
    const nextUserData = { ...userData, ...updates };
    updateUserData(updates);
    onNext(getNextIncomeScreen(nextUserData));
  };

  const updateSP = (key, val) => setSpecialPays(p => ({ ...p, [key]: val }));
  const addCustomSP = () => setSpecialPays(p => ({ ...p, custom: [...(p.custom || []), { name: '', amount: '' }] }));
  const updateCustomSP = (i, field, val) => setSpecialPays(p => {
    const custom = [...p.custom];
    custom[i] = { ...custom[i], [field]: val };
    return { ...p, custom };
  });
  const removeCustomSP = (i) => setSpecialPays(p => ({ ...p, custom: p.custom.filter((_, idx) => idx !== i) }));

  const inputStyle = {
    height: 56, border: '2px solid #E0E0E0', borderRadius: 12,
    fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px',
    width: '100%', background: '#fff', outline: 'none',
    transition: 'border-color 150ms',
  };

  const sectionLabel = {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)',
    margin: '24px 0 10px',
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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 0', lineHeight: 1.2 }}>
        {memberNumber === 1 ? "Let's look at your pay" : "Now let's look at your spouse's pay"}
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 0', lineHeight: 1.5 }}>
        Your bank account tells part of the story. Let&rsquo;s hear the rest.
      </p>

      {/* THE BASICS */}
      <p style={sectionLabel}>The Basics</p>
      <div style={{ marginBottom: 12 }}>
        <select
          value={rank}
          onChange={e => setRank(e.target.value)}
          style={{ ...inputStyle, color: rank ? 'var(--navy)' : 'var(--gray)' }}
        >
          <option value="">Pay Grade</option>
          {Object.entries(RANKS).map(([group, ranks]) => (
            <optgroup key={group} label={group}>
              {ranks.map(r => <option key={r} value={r}>{r}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
      <input
        type="number"
        inputMode="numeric"
        placeholder="Years of Service"
        value={tis}
        min={0} max={40}
        onChange={e => setTis(e.target.value)}
        style={inputStyle}
      />

      {/* ZIP / OCONUS */}
      <p style={sectionLabel}>Duty Station</p>
      {!isOCONUS && (
        <>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Duty Station ZIP"
            maxLength={5}
            value={zip}
            onChange={e => setZip(e.target.value)}
            style={{ ...inputStyle, marginBottom: 4 }}
          />
          {zip.length === 5 && mhaName && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--green)', margin: '0 0 12px', fontStyle: 'italic' }}>
              {mhaName}
            </p>
          )}
          {zip.length === 5 && !mhaName && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--red)', margin: '0 0 12px', fontStyle: 'italic' }}>
              ZIP not recognized — check your entry or use a nearby ZIP.
            </p>
          )}
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)' }}>Stationed overseas?</span>
        <button
          onClick={() => setIsOCONUS(v => !v)}
          style={{
            width: 40, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: isOCONUS ? 'var(--navy)' : '#ccc', position: 'relative', transition: 'background 200ms',
          }}
        >
          <div style={{ position: 'absolute', top: 3, left: isOCONUS ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
        </button>
      </div>

      {isOCONUS && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
          <input type="number" inputMode="decimal" placeholder="OHA Monthly Rental" value={ohaRental} onChange={e => setOhaRental(e.target.value)} style={inputStyle} />
          <input type="number" inputMode="decimal" placeholder="OHA Monthly Utility" value={ohaUtility} onChange={e => setOhaUtility(e.target.value)} style={inputStyle} />
          <input type="number" inputMode="decimal" placeholder="Overseas COLA (monthly)" value={cola} onChange={e => setCola(e.target.value)} style={inputStyle} />
          <a href="https://www.travel.dod.mil" target="_blank" rel="noreferrer" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--blue)', textDecoration: 'none' }}>
            Find your rates at travel.dod.mil →
          </a>
        </div>
      )}

      {/* DEPENDENTS */}
      <p style={sectionLabel}>Dependents</p>
      {m2DepLocked ? (
        <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            Dependents already claimed by Member 1. Per DoD policy (JTR Vol 1, Ch 10), only one spouse receives BAH at the with-dependents rate.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)' }}>I have dependents (spouse or children)</span>
          <button
            onClick={() => setHasDep(v => !v)}
            style={{ width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: hasDep ? 'var(--navy)' : '#ccc', position: 'relative', transition: 'background 200ms', flexShrink: 0 }}
          >
            <div style={{ position: 'absolute', top: 4, left: hasDep ? 23 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
          </button>
        </div>
      )}

      {/* SPECIAL PAYS */}
      <button
        onClick={() => setSpOpen(v => !v)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', border: 'none', borderRadius: 12, padding: '14px 16px', marginTop: 24, cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>Special Pays</span>
        <span style={{ fontSize: 20, color: 'var(--navy)', lineHeight: 1 }}>{spOpen ? '−' : '+'}</span>
      </button>

      {spOpen && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {SPECIAL_PAYS_LIST.map(p => (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
              <input
                type="checkbox"
                id={p.key}
                checked={!!specialPays[p.key]}
                onChange={e => updateSP(p.key, e.target.checked)}
                style={{ width: 20, height: 20, marginRight: 12, accentColor: 'var(--navy)', cursor: 'pointer' }}
              />
              <label htmlFor={p.key} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', flexGrow: 1, cursor: 'pointer' }}>
                {p.label}{p.note && <span style={{ fontSize: 12, marginLeft: 4 }}>({p.note})</span>}
              </label>
              {specialPays[p.key] && (
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>+${p.amount}/mo</span>
              )}
            </div>
          ))}

          {/* FLPB */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--light-gray)', gap: 12 }}>
            <input
              type="checkbox"
              id="flpb"
              checked={!!specialPays.flpbChecked}
              onChange={e => updateSP('flpbChecked', e.target.checked)}
              style={{ width: 20, height: 20, accentColor: 'var(--navy)', cursor: 'pointer', flexShrink: 0 }}
            />
            <label htmlFor="flpb" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', flexGrow: 1 }}>FLPB</label>
            {specialPays.flpbChecked && (
              <input
                type="number"
                inputMode="decimal"
                placeholder="$/mo"
                value={specialPays.flpb || ''}
                onChange={e => updateSP('flpb', e.target.value)}
                style={{ width: 90, height: 40, border: '2px solid #E0E0E0', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 15, padding: '0 10px', outline: 'none' }}
              />
            )}
          </div>

          {/* Custom special pays */}
          {(specialPays.custom || []).map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
              <input
                placeholder="Pay name"
                value={c.name}
                onChange={e => updateCustomSP(i, 'name', e.target.value)}
                style={{ flex: 1, height: 40, border: '2px solid #E0E0E0', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 14, padding: '0 10px', outline: 'none' }}
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="$/mo"
                value={c.amount}
                onChange={e => updateCustomSP(i, 'amount', e.target.value)}
                style={{ width: 80, height: 40, border: '2px solid #E0E0E0', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 14, padding: '0 10px', outline: 'none' }}
              />
              <button onClick={() => removeCustomSP(i)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 18, cursor: 'pointer', padding: 4 }}>×</button>
            </div>
          ))}
          <button onClick={addCustomSP} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', textDecoration: 'underline' }}>
            + Add another special pay
          </button>
        </div>
      )}

      {/* LIVE COMPENSATION CARD */}
      {cardVisible && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginTop: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 4px' }}>
            Your Compensation
          </p>
          <CompRow label="Base Pay" monthly={basePay} annual={basePay * 12} />
          <CompRow label={isOCONUS ? 'OHA' : 'BAH'} monthly={bahMonthly} annual={bahMonthly * 12} />
          <CompRow label="BAS" monthly={bas} annual={bas * 12} />
          {spTotal > 0 && <CompRow label="Special Pays" monthly={spTotal} annual={spTotal * 12} />}
          <CompRow label="Federal Tax Advantage" monthly={taxAdv} annual={taxAdv * 12} />

          <div style={{ borderTop: '2px solid var(--light-gray)', marginTop: 8, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)' }}>RMC</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>{fmt(rmc)}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', display: 'block' }}>{fmt(rmc * 12)}/yr</span>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontStyle: 'italic', color: 'var(--gray)', margin: '12px 0 0', lineHeight: 1.5 }}>
            The DoD&rsquo;s official measure of cash compensation. Calculated using the standard deduction — your actual tax advantage varies by filing status and state.
          </p>
        </div>
      )}

      {/* CAREER EARNINGS CHART */}
      {cardVisible && (
        <CareerEarningsChart
          rank={rank}
          tis={tisNum}
          hasDependents={effectiveDep}
          zip={zip}
          isDual={userData.isDualMilitary && memberNumber === 2}
          m2Rank={userData.m2Rank}
          m2TIS={userData.m2TIS}
          m2Dependents={userData.m2Dependents}
          m2ZIP={userData.m2ZIP}
        />
      )}

      {/* ADDITIONAL BENEFITS */}
      <button
        onClick={() => setBenefitsOpen(v => !v)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', border: 'none', borderRadius: 12, padding: '14px 16px', marginTop: 24, cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>Additional Benefits</span>
        <span style={{ fontSize: 20, color: 'var(--navy)', lineHeight: 1 }}>{benefitsOpen ? '−' : '+'}</span>
      </button>

      {benefitsOpen && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: '0 0 16px', lineHeight: 1.5 }}>
            These aren&rsquo;t included in your RMC — but a civilian pays for all of them out of their paycheck.
          </p>
          {BENEFITS.map((b, i) => (
            <div key={b.name} style={{ paddingBottom: 14, marginBottom: i < BENEFITS.length - 1 ? 14 : 0, borderBottom: i < BENEFITS.length - 1 ? '1px solid var(--light-gray)' : 'none' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>{b.name}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Continue */}
      {canContinue && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button
            onClick={handleContinue}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
          >
            See what this all means
          </button>
        </>
      )}
    </div>
  );
}
