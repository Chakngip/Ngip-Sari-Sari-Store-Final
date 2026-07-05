export default function SummaryCard({ title, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        text-left
        rounded-xl
        p-4
        border
        transition-all
        duration-200
        hover:scale-105
        hover:shadow-lg

        ${color}
      `}
    >
      <p className="text-sm opacity-80">{title}</p>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </button>
  );
}
