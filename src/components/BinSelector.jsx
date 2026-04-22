import { useState, useRef } from 'react';
import { formatCurrency } from '../utils/formatters';

export default function BinSelector({ bins, selectedValue, onSelect }) {
  const [inputVal, setInputVal] = useState(selectedValue != null ? String(selectedValue) : '');
  const [activeBin, setActiveBin] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setInputVal(raw);
    setActiveBin(null);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0) {
      onSelect(num);
    }
  };

  const handleBinClick = (bin) => {
    setActiveBin(bin.value);
    setInputVal(String(bin.value));
    onSelect(bin.value);
    inputRef.current?.blur();
  };

  const numericVal = parseFloat(inputVal);
  const hasValue = !isNaN(numericVal) && numericVal >= 0 && inputVal !== '';

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 8 }}>
        <span style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 22,
          color: hasValue ? 'var(--navy)' : '#BDBDBD',
          pointerEvents: 'none',
          fontWeight: 600,
        }}>$</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={inputVal}
          onChange={handleInputChange}
          style={{
            width: '100%',
            height: 64,
            border: `2px solid ${hasValue ? 'var(--navy)' : '#E0E0E0'}`,
            borderRadius: 14,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--navy)',
            padding: '0 16px 0 36px',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fff',
            transition: 'border-color 150ms',
          }}
        />
      </div>

      {hasValue && (
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          color: 'var(--gray)',
          margin: '0 0 16px 2px',
        }}>
          {formatCurrency(numericVal)}/mo · {formatCurrency(numericVal * 12)}/yr
        </p>
      )}

      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#BDBDBD',
        margin: hasValue ? '0 0 8px' : '8px 0 8px',
      }}>
        Not sure? Pick a range
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {bins.map((bin) => {
          const isActive = activeBin === bin.value;
          const hasSub = !!bin.sub;
          return (
            <button
              key={bin.value}
              onClick={() => handleBinClick(bin)}
              style={{
                minHeight: 40,
                paddingInline: 14,
                paddingBlock: hasSub ? 8 : 0,
                borderRadius: 20,
                border: `1.5px solid ${isActive ? 'var(--navy)' : '#D0D0D0'}`,
                background: isActive ? 'var(--navy)' : '#fff',
                color: isActive ? '#fff' : 'var(--gray)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'background 150ms, color 150ms, border-color 150ms',
                whiteSpace: hasSub ? 'normal' : 'nowrap',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                textAlign: 'center',
              }}
            >
              <span>{bin.label}</span>
              {hasSub && (
                <span style={{ fontSize: 10, opacity: 0.7, fontStyle: 'italic', fontWeight: 400 }}>
                  {bin.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
