import { useState } from 'react'
import { Search, Filter, ShoppingCart, Heart } from 'lucide-react'
import { useMedicines } from '../../hooks/useFirestore'
import { MEDICINE_CATEGORIES } from '../../config/constants'
import { useCartStore, useWishlistStore } from '../../stores/useStore'
import { searchMedicines } from '../../services/searchService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency, cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function DashboardMedicines() {
  const { data: medicines } = useMedicines()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const addToCart = useCartStore((s) => s.addItem)
  const { toggle, isInWishlist } = useWishlistStore()
  const filtered = (() => {
  let list = medicines

  if (category !== 'All') {
    list = list.filter((m) => m.category === category)
  }

  if (query.trim()) {
    list = searchMedicines(query, medicines).filter(
      (m) => category === 'All' || m.category === category
    )
  }

  if (sortBy === 'priceLow') {
    list = [...list].sort((a, b) => a.price - b.price)
  }

  if (sortBy === 'priceHigh') {
    list = [...list].sort((a, b) => b.price - a.price)
  }

  if (sortBy === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  }

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
          <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-primary-500 focus:outline-none"
>
  <option value="default">Sort By</option>
  <option value="priceLow">Price ↑</option>
  <option value="priceHigh">Price ↓</option>
  <option value="name">Name A-Z</option>
</select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((med) => (
            <Card key={med.id} className="!p-4">
              <img src={med.image} alt={med.name} className="h-36 w-full rounded-xl object-cover" />
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{med.name}</h3>
              <p className="mt-1 text-lg font-bold text-primary-600">
                
              {formatCurrency(med.price)}
              </p>

    <div className="mt-3 flex gap-2">
  <button
  onClick={() => {
    if (isInWishlist(med.id)) {
      toggle(med)
      toast.success('Removed from wishlist')
    } else {
      toggle(med)
      toast.success('Added to wishlist')
    }
  }}
  className="rounded-lg border border-gray-200 px-3"
>
  <Heart
    className={`h-5 w-5 ${
      isInWishlist(med.id)
        ? 'fill-red-500 text-red-500'
        : 'text-gray-500'
    }`}
  />
</button>

  <Button
    size="full"
    className="!py-2.5"
    onClick={() => {
      addToCart(med)
      toast.success('Added to cart')
    }}
  >
    <ShoppingCart className="h-4 w-4" />
    Add to Cart
  </Button>
</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
