export default function StatCard({ label, value, accent }) {
  return (
    <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5">
      <div className="text-xs text-ngip-muted mb-1">{label}</div>
      <div className={`font-display text-2xl font-bold ${accent ? 'text-ngip-accent' : ''}`}>{value}</div>
    </div>
  );
}
