export default function StatGrid({ stats, overlap = false }) {
  return (
    <section
      className={
        overlap
          ? 'relative z-10 -mt-10 pb-4'
          : 'border-y border-gray-100 bg-white py-12'
      }
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            overlap
              ? 'grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-white p-6 card-shadow-lg sm:grid-cols-4 sm:gap-8 sm:p-8'
              : 'mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4'
          }
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary-600 sm:text-3xl lg:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm font-semibold text-gray-800">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
