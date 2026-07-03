const STATUS_STYLES = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  paid: 'bg-blue-500/10 text-blue-400',
  preparing: 'bg-blue-500/10 text-blue-400',
  out_for_delivery: 'bg-purple-500/10 text-purple-400',
  completed: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-white/5 text-ngip-muted',
};

const STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[status] || 'bg-white/5 text-ngip-muted'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
