import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

export default function BinSelector({ bins, selectedValue, onSelect }) {
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleCustomSubmit = () => {
    const val = Number(customInput);
    if (val > 0) {
      onSelect(val);
      setCustomMode(false);
    }
  };

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {bins.map((bin) => {
          const isSelected = !customMode && selectedValue === bin.value;
          return (
            <button
              key={bin.value}
              onClick={() => { setCustomMode(false); onSelect(bin.value); }}
              style={{
                height: 72,
                borderRadius: 12,
                border: `2px solid ${isSelected ? 'var(--navy)' : 'var(--navy)'}`,
                background: isSelected ? 'var(--navy)' : '#fff',
                color: isSelected ? '#fff' : 'var(--navy)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 15,
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                padding: '0 10px',
                transition: 'background 150ms, color 150ms',
                lineHeight: 1.3,
              }}
            >
              {bin.label}
            </button>
          );
        })}
      </div>

      {!customMode ? (
        <button
          onClick={() => setCustomMode(true)}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            color: 'var(--blue)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '12px 0 0',
            textDecoration: 'underline',
          }}
        >
          Enter exact amount
        </button>
      ) : (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Monthly amount"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
            autoFocus
            style={{
              flex: 1, height: 56, border: '2px solid var(--navy)', borderRadius: 12,
              fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px', outline: 'none',
            }}
          />
          <button
            onClick={handleCustomSubmit}
            style={{
              height: 56, paddingInline: 20, borderRadius: 12, border: 'none',
              background: 'var(--navy)', color: '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            }}
          >
            OK
          </button>
          <button
            onClick={() => { setCustomMode(false); setCustomInput(''); }}
            style={{ height: 56, paddingInline: 12, borderRadius: 12, border: '2px solid #E0E0E0', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}

      {selectedValue != null && customMode === false && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '8px 0 0' }}>
          Selected: {formatCurrency(selectedValue)}/mo · {formatCurrency(selectedValue * 12)}/yr
        </p>
      )}
    </div>
  );
}
