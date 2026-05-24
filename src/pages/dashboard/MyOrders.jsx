import { useState } from 'react'
import { Link } from 'react-router-dom'
import { demoOrders } from '../../data/mockData'
import Card from '../../components/ui/Card'
import StatusPill from '../../components/ui/StatusPill'
import { formatCurrency, formatDate, cn } from '../../utils/helpers'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered =
    activeTab === 'all' ? demoOrders : demoOrders.filter((o) => o.status === activeTab)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-t-lg px-4 py-2.5 text-sm font-medium transition',
              activeTab === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const item = order.items[0]
          return (
            <Card key={order.id} className="!p-4">
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover ring-1 ring-gray-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {order.id} · {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusPill status={order.status} />
                  <Link
                    to={`/dashboard/orders`}
                    className="text-sm font-semibold text-primary-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-gray-500">No orders in this category.</p>
        )}
      </div>
    </div>
  )
}
