export default function StatCard({
  icon,
  label,
  value,
  accent = false,
  subtitle,
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white dark:bg-ngip-panel
        border border-gray-200 dark:border-white/5
        p-5
        shadow-sm hover:shadow-lg
        transition-all duration-300
        hover:-translate-y-1
      `}
    >
      {/* Accent line */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          accent ? "bg-ngip-accent" : "bg-gray-300 dark:bg-white/10"
        }`}
      />

      {/* Icon */}
      {icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ngip-accent/10 text-ngip-accent">
          {icon}
        </div>
      )}

      {/* Label */}
      <p className="text-sm text-gray-500 dark:text-ngip-muted">{label}</p>

      {/* Value */}
      <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-ngip-text">
        {value}
      </h2>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="mt-2 text-xs text-gray-400 dark:text-ngip-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
