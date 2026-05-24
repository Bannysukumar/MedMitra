import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlistStore, useCartStore } from '../../stores/useStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Your wishlist is empty</h2>
        <p className="mt-2 text-gray-600">Save medicines you love for later</p>
        <Link to="/dashboard/medicines" className="mt-6">
          <Button>Browse Medicines</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
        <p className="text-gray-600">{items.length} saved items</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((med) => (
          <Card key={med.id}>
            <img src={med.image} alt={med.name} className="h-40 w-full rounded-xl object-cover" />
            <h3 className="mt-3 font-semibold text-gray-900">{med.name}</h3>
            <p className="text-lg font-bold text-primary-600">{formatCurrency(med.price)}</p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => {
                  addToCart(med)
                  toast.success('Added to cart')
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button size="sm" variant="ghost" onClick={() => removeItem(med.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
