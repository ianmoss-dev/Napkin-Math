import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getStage } from '../utils/napkinScale';

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  label: { fontSize: 9, color: '#2E75B6', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  heading: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#1B3A6B', marginBottom: 8 },
  subheading: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1B3A6B', marginBottom: 6 },
  body: { fontSize: 11, color: '#595959', lineHeight: 1.6, marginBottom: 8 },
  rule: { height: 2, backgroundColor: '#C9A84C', width: 40, marginBottom: 16 },
  card: { backgroundColor: '#F2F2F2', borderRadius: 6, padding: 16, marginBottom: 12 },
  navy: { backgroundColor: '#1B3A6B', borderRadius: 6, padding: 16, marginBottom: 12 },
  navyText: { color: '#FFFFFF', fontSize: 11, lineHeight: 1.5 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statLabel: { fontSize: 11, color: '#595959' },
  statValue: { fontSize: 11, color: '#1B3A6B', fontFamily: 'Helvetica-Bold' },
  big: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#1B3A6B', marginBottom: 4 },
  gold: { fontSize: 11, color: '#C9A84C', fontFamily: 'Helvetica-Bold' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  footer: { position: 'absolute', bottom: 24, left: 48, right: 48, fontSize: 8, color: '#999', textAlign: 'center' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
});

function fmt(n) {
  if (!n && n !== 0) return '—';
  return '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getJobNow(userData) {
  const hasCushion = userData.hasCushion === 'yes';
  const highDebt = (userData.debts || []).filter(d => d.rate > 7);
  const hasEmergencyFund = userData.emergencyFundMonths != null;
  const capturingMatch = userData.capturingMatch === 'yes';
  const income = userData.monthlyTakeHome || 0;
  const target15 = income * 0.15;

  if (!hasCushion) {
    const months = userData.breathingRoom > 0 ? Math.ceil(1000 / userData.breathingRoom) : null;
    return `Open a high-yield savings account and auto-transfer ${fmt(Math.min(userData.breathingRoom, 200))}/month until you hit $1,000. ${months ? `At your breathing room, that's ${months} months.` : ''}`;
  }
  if (highDebt.length > 0) {
    const total = highDebt.reduce((s, d) => s + d.balance, 0);
    return `You have ${fmt(total)} in high-interest debt. Pay more than the minimum every month — even an extra $50 matters. Use the avalanche method: attack the highest rate first.`;
  }
  if (!hasEmergencyFund) {
    const essential = (userData.housing || 0) + (userData.utilities || 0) + (userData.groceries || 0);
    return `Build your emergency fund. Your target is ${fmt(essential * 3)}–${fmt(essential * 6)}. Auto-transfer your breathing room into a separate HYSA on payday.`;
  }
  if (!capturingMatch) {
    return 'Log into your benefits portal or MyPay and increase your TSP/retirement contribution to at least the employer match threshold. Do it today — this is the highest guaranteed return available to you.';
  }
  return `Keep directing ${fmt(target15)}/month toward retirement. You're in the right order. Stay the course.`;
}

function getReturnTriggers(userData) {
  const triggers = [];
  const highDebt = (userData.debts || []).filter(d => d.rate > 7);
  highDebt.forEach(d => triggers.push(`When your ${d.type} balance hits zero.`));
  if (userData.emergencyFundMonths && userData.emergencyFundTarget) {
    triggers.push(`When your emergency fund hits ${fmt(userData.emergencyFundTarget)}.`);
  }
  if (userData.goals?.length > 0) {
    triggers.push('When your income changes by more than 10% in either direction.');
  }
  triggers.push('In 6 months — to see how your picture has changed.');
  return triggers.slice(0, 3);
}

export default function PDFDocument({ userData }) {
  const stage = getStage(userData.napkinScale || 'blank');
  const debts = userData.debts || [];
  const subs = userData.subscriptions || [];
  const goals = userData.goals || [];
  const breathing = userData.breathingRoom || 0;
  const jobNow = getJobNow(userData);
  const triggers = getReturnTriggers(userData);

  const budgetLines = [
    { label: 'Housing', value: userData.housing },
    { label: 'Utilities', value: userData.utilities },
    { label: 'Groceries', value: userData.groceries },
    { label: 'Household Essentials', value: userData.householdEssentials },
    { label: 'Dining Out', value: userData.diningOut },
    { label: 'Car Payment', value: userData.carPayment },
    { label: 'Gas & Fuel', value: userData.gasAndFuel },
    { label: 'Car Insurance', value: userData.carInsurance },
    { label: 'Phone', value: userData.phone },
    { label: 'Internet', value: userData.internet },
    { label: 'Home Maintenance', value: userData.homeMaintenance },
    { label: 'Health Insurance', value: userData.healthInsurance },
    { label: 'Out of Pocket Medical', value: userData.outOfPocketMedical },
    { label: 'Childcare', value: userData.childcare },
    { label: 'Kid Expenses', value: userData.kidExpenses },
    { label: 'Clothing', value: userData.clothing },
    { label: 'Personal Care', value: userData.personalCare },
    { label: 'Entertainment', value: userData.entertainment },
    { label: 'Pets', value: userData.pets },
    { label: 'Travel', value: userData.travel },
    { label: 'Gifts', value: userData.gifts },
    { label: 'Giving', value: userData.giving },
  ].filter(l => l.value);

  const subTotal = subs.reduce((s, sub) => s + (sub.price || 0), 0);
  const debtMin = debts.reduce((s, d) => s + (d.minimum || 0), 0);

  return (
    <Document>
      {/* Page 1: Score + snapshot */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Napkin Math — {todayStr()}</Text>
        <View style={styles.rule} />
        <Text style={styles.heading}>{stage.name}</Text>
        <Text style={[styles.body, { marginBottom: 24 }]}>{stage.description}</Text>

        <View style={styles.navy}>
          <Text style={[styles.navyText, { fontFamily: 'Helvetica-Bold', marginBottom: 12 }]}>Monthly Snapshot</Text>
          <View style={styles.statRow}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Money coming in</Text>
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Helvetica-Bold' }}>{fmt(userData.monthlyTakeHome)}/mo</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Money going out</Text>
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Helvetica-Bold' }}>{fmt(userData.totalMonthlyExpenses)}/mo</Text>
          </View>
          <View style={[styles.statRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Breathing room</Text>
            <Text style={{ color: breathing >= 0 ? '#4CAF50' : '#EF5350', fontSize: 13, fontFamily: 'Helvetica-Bold' }}>{fmt(breathing)}/mo</Text>
          </View>
        </View>

        {userData.napkinScale && stage.next && (
          <View style={styles.card}>
            <Text style={[styles.label, { marginBottom: 6 }]}>Next stage: {stage.next ? stage.name : ''}</Text>
            <Text style={styles.body}>{stage.next}</Text>
          </View>
        )}

        <Text style={styles.footer}>Napkin Math provides financial planning tools, not financial advice. Not affiliated with the Department of Defense.</Text>
      </Page>

      {/* Page 2: Budget */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Your Complete Budget</Text>
        <View style={styles.rule} />

        {budgetLines.map(l => (
          <View key={l.label} style={styles.budgetRow}>
            <Text style={styles.statLabel}>{l.label}</Text>
            <Text style={styles.statValue}>{fmt(l.value)}/mo</Text>
          </View>
        ))}

        {subTotal > 0 && (
          <View style={styles.budgetRow}>
            <Text style={styles.statLabel}>Subscriptions ({subs.length} services)</Text>
            <Text style={styles.statValue}>{fmt(subTotal)}/mo</Text>
          </View>
        )}
        {debtMin > 0 && (
          <View style={styles.budgetRow}>
            <Text style={styles.statLabel}>Debt minimums ({debts.length} debts)</Text>
            <Text style={styles.statValue}>{fmt(debtMin)}/mo</Text>
          </View>
        )}

        <View style={[styles.divider, { marginTop: 8 }]} />
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { fontFamily: 'Helvetica-Bold' }]}>Total monthly expenses</Text>
          <Text style={[styles.statValue, { fontSize: 14 }]}>{fmt(userData.totalMonthlyExpenses)}/mo</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { fontFamily: 'Helvetica-Bold' }]}>Breathing room</Text>
          <Text style={[styles.statValue, { fontSize: 14, color: breathing >= 0 ? '#2E7D32' : '#C62828' }]}>{fmt(breathing)}/mo</Text>
        </View>

        {goals.length > 0 && (
          <>
            <View style={[styles.divider, { marginTop: 16 }]} />
            <Text style={[styles.label, { marginBottom: 8 }]}>Your Goals</Text>
            {goals.map(g => (
              <View key={g.id} style={styles.budgetRow}>
                <Text style={styles.statLabel}>{g.label || g.id}</Text>
                <Text style={styles.statValue}>{g.amount ? fmt(g.amount) : '—'}{g.years ? ` in ${g.years} yrs` : ''}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.footer}>Napkin Math provides financial planning tools, not financial advice. Not affiliated with the Department of Defense.</Text>
      </Page>

      {/* Page 3: One job */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Your One Job Right Now</Text>
        <View style={styles.rule} />
        <Text style={[styles.body, { fontSize: 14, lineHeight: 1.8, color: '#1B3A6B' }]}>{jobNow}</Text>

        <Text style={styles.footer}>Napkin Math provides financial planning tools, not financial advice. Not affiliated with the Department of Defense.</Text>
      </Page>

      {/* Page 4: Come back when */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Come Back When</Text>
        <View style={styles.rule} />
        <Text style={[styles.body, { marginBottom: 20 }]}>
          Napkin Math works best as a living document. Here's when to run it again:
        </Text>
        {triggers.map((t, i) => (
          <View key={i} style={[styles.card, { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }]}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18, color: '#C9A84C', marginRight: 12 }}>{i + 1}</Text>
            <Text style={[styles.body, { flex: 1, margin: 0 }]}>{t}</Text>
          </View>
        ))}

        <Text style={styles.footer}>Napkin Math provides financial planning tools, not financial advice. Not affiliated with the Department of Defense.</Text>
      </Page>
    </Document>
  );
}
