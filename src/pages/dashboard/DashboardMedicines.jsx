import { useState } from 'react'
import { Search, Filter, ShoppingCart } from 'lucide-react'
import { useMedicines } from '../../hooks/useFirestore'
import { MEDICINE_CATEGORIES } from '../../config/constants'
import { useCartStore } from '../../stores/useStore'
import { searchMedicines } from '../../services/searchService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency, cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function DashboardMedicines() {
  const { data: medicines } = useMedicines()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const addToCart = useCartStore((s) => s.addItem)

  const filtered = (() => {
    let list = medicines
    if (category !== 'All') list = list.filter((m) => m.category === category)
    if (query.trim()) list = searchMedicines(query, medicines).filter((m) => category === 'All' || m.category === category)
    return list
  })()

  return (
    <div className="flex gap-6">
      <aside className="hidden w-52 shrink-0 lg:block">
        <Card className="!p-4 sticky top-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Categories</p>
          <ul className="space-y-0.5">
            {['All', ...MEDICINE_CATEGORIES.slice(0, 8)].map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2.5 text-left text-sm transition',
                    category === cat
                      ? 'bg-primary-600 font-medium text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicines..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-primary-300 hover:text-primary-600"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((med) => (
            <Card key={med.id} className="!p-4">
              <img src={med.image} alt={med.name} className="h-36 w-full rounded-xl object-cover" />
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{med.name}</h3>
              <p className="mt-1 text-lg font-bold text-primary-600">{formatCurrency(med.price)}</p>
              <Button
                size="full"
                className="mt-3 !py-2.5"
                onClick={() => {
                  addToCart(med)
                  toast.success('Added to cart')
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
