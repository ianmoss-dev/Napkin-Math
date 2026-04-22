import { useState } from 'react';
import BudgetScreen from './BudgetScreen';

const BANDS = [[20, 25], [25, 35], [35, 45], [45, 100]];

export default function HousingScreen({ userData, updateUserData, onNext, onBack }) {
  const [selected, setSelected] = useState(userData.housing ?? null);
  const [rentOrOwn, setRentOrOwn] = useState(userData.housingType ?? null);

  const handleContinue = (screen) => {
    updateUserData({ housingType: rentOrOwn });
    onNext(screen);
  };

  return (
    <BudgetScreen
      heading="Housing"
      subtext="Your rent or mortgage payment only — we'll cover utilities separately."
      percentageBands={BANDS}
      fieldName="housing"
      flagAbovePct={35}
      flagCopy="Housing above 35% of income leaves less room for everything else. Not a problem — just worth knowing."
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => handleContinue('budgetUtilities')}
      onBack={onBack}
      onSelectChange={setSelected}
    >
      {selected != null && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>
            Do you rent or own?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Rent', 'Own'].map(opt => {
              const val = opt.toLowerCase();
              const active = rentOrOwn === val;
              return (
                <button
                  key={val}
                  onClick={() => {
                    setRentOrOwn(val);
                    updateUserData({ housingType: val });
                  }}
                  style={{
                    flex: 1, height: 56, borderRadius: 12,
                    border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
                    background: active ? 'var(--navy)' : '#fff',
                    color: active ? '#fff' : 'var(--navy)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: active ? 600 : 400,
                    cursor: 'pointer', transition: 'all 150ms',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {rentOrOwn === 'rent' && (
            <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 16, marginTop: 12 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', margin: 0, lineHeight: 1.5 }}>
                Renters insurance typically costs $10–20/month and covers your belongings. Worth it.
              </p>
            </div>
          )}
        </div>
      )}
    </BudgetScreen>
  );
}
