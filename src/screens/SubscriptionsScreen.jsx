import { useEffect, useState } from 'react';
import { SUBSCRIPTIONS, CATEGORIES } from '../data/subscriptions';
import { formatCurrency } from '../utils/formatters';

export default function SubscriptionsScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(() => new Set((userData.subscriptions || []).map(s => s.id)));
  const [customs, setCustoms] = useState({}); // category -> [{name, price}]
  const [addingIn, setAddingIn] = useState(null); // category key being added to
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addCustom = (category) => {
    const price = parseFloat(newPrice);
    if (!newName.trim() || isNaN(price) || price <= 0) return;
    const id = `custom_${category}_${Date.now()}`;
    setCustoms(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), { id, name: newName.trim(), price }],
    }));
    setSelected(prev => new Set([...prev, id]));
    setNewName('');
    setNewPrice('');
    setAddingIn(null);
  };

  const total = (() => {
    let sum = 0;
    SUBSCRIPTIONS.forEach(s => { if (selected.has(s.id)) sum += s.price; });
    Object.values(customs).flat().forEach(s => { if (selected.has(s.id)) sum += s.price; });
    return sum;
  })();

  const buildSubscriptionsList = () => {
    const list = SUBSCRIPTIONS.filter(s => selected.has(s.id));
    Object.values(customs).flat().forEach(s => { if (selected.has(s.id)) list.push(s); });
    return list;
  };

  const handleContinue = () => {
    updateUserData({ subscriptions: buildSubscriptionsList() });
    onNext('budgetChildcare');
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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 0' }}>
        Subscriptions
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 0', lineHeight: 1.5 }}>
        Tap everything you're currently paying for.
      </p>

      {/* Running total */}
      <div style={{ position: 'sticky', top: 0, background: '#F8F9FA', paddingBlock: 12, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E0E0E0', marginBottom: 8 }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Monthly total</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: total > 0 ? 'var(--navy)' : 'var(--gray)' }}>
          {formatCurrency(total)}/mo
        </span>
      </div>

      {CATEGORIES.map(category => {
        const items = SUBSCRIPTIONS.filter(s => s.category === category);
        const categoryCustoms = customs[category] || [];
        const allItems = [...items, ...categoryCustoms];

        return (
          <div key={category} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {category}
              </p>
              {addingIn !== category ? (
                <button onClick={() => setAddingIn(category)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                  + Add one I don't see
                </button>
              ) : (
                <button onClick={() => setAddingIn(null)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Cancel
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allItems.map(sub => {
                const active = selected.has(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggle(sub.id)}
                    style={{
                      padding: '8px 14px', borderRadius: 20,
                      border: `1.5px solid ${active ? 'var(--navy)' : '#D0D0D0'}`,
                      background: active ? 'var(--navy)' : '#fff',
                      color: active ? '#fff' : 'var(--navy)',
                      fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                      cursor: 'pointer', transition: 'all 150ms',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {sub.name}
                    <span style={{ fontSize: 12, opacity: 0.8 }}>${sub.price.toFixed(0)}</span>
                  </button>
                );
              })}
            </div>

            {addingIn === category && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <input
                  placeholder="Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{ flex: 2, height: 48, border: '2px solid var(--navy)', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15, padding: '0 12px', outline: 'none' }}
                />
                <input
                  placeholder="$/mo"
                  type="number"
                  inputMode="decimal"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustom(category)}
                  style={{ flex: 1, height: 48, border: '2px solid var(--navy)', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15, padding: '0 12px', outline: 'none' }}
                />
                <button onClick={() => addCustom(category)} style={{ height: 48, paddingInline: 16, borderRadius: 10, border: 'none', background: 'var(--navy)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  Add
                </button>
              </div>
            )}
          </div>
        );
      })}

      {total > 100 && (
        <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            That's {formatCurrency(total * 12)} a year. Worth a quick look at what you actually use.
          </p>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button onClick={handleContinue} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
        Continue
      </button>
    </div>
  );
}
