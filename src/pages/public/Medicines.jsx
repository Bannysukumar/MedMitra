import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, ShoppingCart, Filter, Package } from 'lucide-react'
import { MEDICINE_CATEGORIES } from '../../config/constants'
import { searchMedicines, getSymptomSuggestions } from '../../services/searchService'
import { useMedicines } from '../../hooks/useFirestore'
import { useCartStore } from '../../stores/useStore'
import PageHero from '../../components/marketing/PageHero'
import CTASection from '../../components/marketing/CTASection'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency, cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function Medicines() {
  const { data: medicines, loading, error } = useMedicines()
  const addToCart = useCartStore((s) => s.addItem)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  let filtered = medicines
  if (query.trim()) filtered = searchMedicines(query, medicines)
  if (category !== 'All') filtered = filtered.filter((m) => m.category === category)

  const handleAddToCart = (e, med) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(med)
    toast.success(`${med.name} added to cart`)
  }

  return (
    <div>
      <PageHero
        badge="Medicine Catalog"
        title="Browse"
        highlight={`${medicines.length}+ genuine medicines`}
        subtitle="Licensed pharmacy products with transparent pricing, verified quality, and fast doorstep delivery."
        centered
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, or symptom..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {getSymptomSuggestions().map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-medium text-primary-600 shadow-sm transition hover:bg-primary-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="py-20">
        {error && (
          <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Could not load medicines from Firebase. Check your connection and try again.
            </p>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filtered.length}</span> products found
            </p>
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 card-shadow"
            >
              <Filter className="h-4 w-4" />
              Categories
            </button>
          </div>

          <div className="flex gap-8">
            <aside
              className={cn(
                'w-64 shrink-0 lg:block',
                sidebarOpen ? 'block' : 'hidden'
              )}
            >
              <Card className="sticky top-24 border border-gray-100 p-0 overflow-hidden">
                <div className="border-b border-gray-100 bg-primary-50 px-5 py-4">
                  <h2 className="font-bold text-gray-900">Categories</h2>
                  <p className="mt-0.5 text-xs text-gray-500">Filter by type</p>
                </div>
                <nav className="p-3">
                  {['All', ...MEDICINE_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat)
                        setSidebarOpen(false)
                      }}
                      className={cn(
                        'mb-1 flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-medium transition',
                        category === cat
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {cat}
                      {category === cat && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                          {cat === 'All'
                            ? medicines.length
                            : medicines.filter((m) => m.category === cat).length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </Card>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-8 hidden items-center justify-between lg:flex">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {category === 'All' ? 'All Medicines' : category}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing {filtered.length} of {medicines.length} products
                  </p>
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <Card className="border border-gray-100 py-16 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {loading ? 'Loading medicines...' : 'No medicines found'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">Try a different search or category.</p>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((med) => (
                    <Link key={med.id} to={`/medicines/${med.id}`} className="group block">
                      <Card hover className="h-full overflow-hidden border border-gray-100 p-0">
                        <div className="relative overflow-hidden bg-gray-50">
                          <img
                            src={med.image}
                            alt={med.name}
                            className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary-600 shadow-sm backdrop-blur-sm">
                            {med.category}
                          </span>
                        </div>
                        <div className="p-5">
                          <p className="text-xs font-medium text-gray-500">{med.brand}</p>
                          <h3 className="mt-1 font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600">
                            {med.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold text-gray-900">{med.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400">({med.reviews} reviews)</span>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-xl font-bold text-primary-600">{formatCurrency(med.price)}</p>
                            <Button
                              size="sm"
                              onClick={(e) => handleAddToCart(e, med)}
                              className="shrink-0"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Need help finding the right medicine?"
        subtitle="Upload your prescription and our pharmacists will help you order the right products."
        primaryLabel="Upload Prescription"
        primaryTo="/dashboard/prescriptions"
        secondaryLabel="Contact Support"
        secondaryTo="/contact"
      />
    </div>
  )
}
