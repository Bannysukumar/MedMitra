import { useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { demoNotifications } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatDate, cn } from '../../utils/helpers'

export default function Notifications() {
  const [notifications, setNotifications] = useState(demoNotifications)

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {notifications.filter((n) => !n.read).length} unread
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <Check className="h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={cn(!n.read && 'border-l-4 border-l-primary-600')}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
                <Bell className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  <span className="text-xs text-gray-500">{formatDate(n.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{n.message}</p>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="mt-2 text-xs font-medium text-primary-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
