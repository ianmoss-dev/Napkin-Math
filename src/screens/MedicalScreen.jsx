import { useState } from 'react';
import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 2], [2, 4], [4, 6], [6, 100]];
const CAP = 400;

export default function MedicalScreen({ userData, updateUserData, onNext, onBack }) {
  const [selected, setSelected] = useState(userData.outOfPocketMedical ?? null);
  const [hasHSA, setHasHSA] = useState(userData.hasHSA ?? null);

  const handleContinue = () => {
    updateUserData({ hasHSA });
    onNext('budgetSubscriptions');
  };

  return (
    <BudgetScreen
      heading="Out of pocket medical"
      subtext="Copays, prescriptions, dental, vision — your monthly average."
      percentageBands={BANDS}
      binCap={CAP}
      fieldName="outOfPocketMedical"
      userData={userData}
      updateUserData={updateUserData}
      onNext={handleContinue}
      onBack={onBack}
      onSelectChange={setSelected}
    >
      {selected != null && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>
            Do you have a Health Savings Account (HSA)?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(opt => {
              const active = hasHSA === opt.val;
              return (
                <button
                  key={String(opt.val)}
                  onClick={() => { setHasHSA(opt.val); updateUserData({ hasHSA: opt.val }); }}
                  style={{
                    flex: 1, height: 56, borderRadius: 12,
                    border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
                    background: active ? 'var(--navy)' : '#fff',
                    color: active ? '#fff' : 'var(--navy)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: active ? 600 : 400,
                    cursor: 'pointer', transition: 'all 150ms',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {hasHSA === false && (
            <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginTop: 12 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
                If you have a high-deductible health plan, an HSA lets you pay medical costs with pre-tax dollars. We'll come back to this.
              </p>
            </div>
          )}
        </div>
      )}
    </BudgetScreen>
  );
}
