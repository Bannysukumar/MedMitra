import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../stores/useStore'
import ProductImage from '../../components/ui/ProductImage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../utils/helpers'

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal, getDiscount, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <Link to="/dashboard/medicines" className="mt-6">
          <Button>Browse Medicines</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600">{items.length} items</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex gap-4">
                <ProductImage src={item.image} alt={item.name} className="h-20 w-20 rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-primary-600 font-bold">{formatCurrency(item.price)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="font-semibold text-gray-900">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">-{formatCurrency(getDiscount())}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 font-bold">
              <span>Total</span>
              <span>{formatCurrency(getTotal())}</span>
            </div>
          </div>
          <Link to="/dashboard/checkout" className="mt-6 block">
            <Button size="full">Proceed to Checkout</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
