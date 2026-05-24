import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { useCartStore } from '../../stores/useStore'
import { useUserAddresses } from '../../hooks/useFirestore'
import { createOrder } from '../../services/firestoreService'
import Card, { CardHeader } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { formatCurrency, generateOrderId } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: addresses } = useUserAddresses(user?.uid)
  const { items, getSubtotal, getDiscount, getTotal, clearCart, applyCoupon, coupon } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]

  const { register, handleSubmit } = useForm({
    defaultValues: {
      address: defaultAddr?.address || '',
      city: defaultAddr?.city || '',
      pincode: defaultAddr?.pincode || '',
      payment: 'upi',
    },
  })

  const onSubmit = async (data) => {
    if (!user) return
    const orderId = generateOrderId()
    await createOrder(user.uid, {
      id: orderId,
      items: items.map((i) => ({
        medicineId: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
      })),
      total: getTotal(),
      savings: getDiscount(),
      address: `${data.address}, ${data.city} ${data.pincode}`,
      payment: data.payment,
    })
    clearCart()
    navigate('/dashboard/order-success', { state: { orderId, total: getTotal() } })
    toast.success('Order placed successfully!')
  }

  if (items.length === 0) {
    navigate('/dashboard/cart')
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600">Complete your order</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Delivery Address" />
            <div className="space-y-4">
              <Input label="Address" {...register('address', { required: true })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="City" {...register('city', { required: true })} />
                <Input label="Pincode" {...register('pincode', { required: true })} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Payment Method" />
            <div className="space-y-2">
              {['upi', 'card', 'cod'].map((method) => (
                <label key={method} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-primary-500">
                  <input type="radio" value={method} {...register('payment')} className="text-primary-600" />
                  <span className="font-medium capitalize text-gray-900">{method === 'cod' ? 'Cash on Delivery' : method.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Order Summary" />
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600 truncate pr-2">{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(getSubtotal())}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({coupon.code})</span>
                  <span>-{formatCurrency(getDiscount())}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(getTotal())}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (applyCoupon(couponCode)) toast.success('Coupon applied')
                else toast.error('Invalid coupon')
              }}
            >
              Apply
            </Button>
          </div>
          <Button type="submit" size="full" className="mt-6">
            Place Order
          </Button>
        </Card>
      </form>
    </div>
  )
}
