import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../utils/helpers'

export default function OrderSuccess() {
  const { state } = useLocation()
  const orderId = state?.orderId || 'ORD-SUCCESS'
  const total = state?.total ?? 0

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Order Placed Successfully!</h1>
      <p className="mt-2 text-gray-600">Thank you for choosing MedMitra</p>

      <Card className="mt-8 text-left">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold text-gray-900">{orderId}</p>
          </div>
        </div>
        <p className="mt-4 text-lg font-bold text-primary-600">Total: {formatCurrency(total)}</p>
        <p className="mt-2 text-sm text-gray-600">
          You will receive a confirmation email shortly. Estimated delivery: 24-48 hours.
        </p>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/dashboard/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
        <Link to="/dashboard/medicines">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
