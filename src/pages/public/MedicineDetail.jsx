import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react'
import { medicines } from '../../data/mockData'
import { useCartStore, useWishlistStore } from '../../stores/useStore'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { formatCurrency, cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function MedicineDetail() {
  const { id } = useParams()
  const med = medicines.find((m) => m.id === id)
  const addToCart = useCartStore((s) => s.addItem)
  const { toggle, isInWishlist } = useWishlistStore()

  if (!med) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-600">Medicine not found</p>
        <Link to="/medicines" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/medicines" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" />
        Back to medicines
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <img src={med.image} alt={med.name} className="w-full rounded-2xl object-cover shadow-lg" />
        <div>
          <span className="text-sm font-medium text-primary-600">{med.category}</span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{med.name}</h1>
          <p className="text-gray-600">{med.brand} · {med.genericName}</p>
          <div className="mt-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{med.rating}</span>
            <span className="text-gray-500">({med.reviews} reviews)</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-primary-600">{formatCurrency(med.price)}</p>
          <p className="mt-4 text-gray-700">{med.description}</p>
          <p className="mt-2 text-sm text-gray-500">In stock: {med.stock} units</p>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                addToCart(med)
                toast.success('Added to cart')
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" onClick={() => toggle(med)}>
              <Heart className={cn('h-5 w-5', isInWishlist(med.id) && 'fill-red-500 text-red-500')} />
            </Button>
          </div>

          <div className="mt-8 space-y-4">
            {[
              { title: 'Dosage', content: med.dosage },
              { title: 'Usage', content: med.usage },
              { title: 'Side Effects', content: med.sideEffects },
            ].map(({ title, content }) => (
              <Card key={title}>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{content}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
