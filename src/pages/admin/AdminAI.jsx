import { Sparkles, TrendingUp, Package, Users, FileText, Search } from 'lucide-react'
import { useAdminData } from '../../hooks/useFirestore'
import { computeAiInsights } from '../../utils/adminAnalytics'
import { FUTURE_MODULES } from '../../config/constants'
import AdminPageHeader, { AdminStatCard } from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'

export default function AdminAI() {
  const { users, orders, medicines, prescriptions, loading } = useAdminData()

  const insights = computeAiInsights({ medicines, orders, users, prescriptions })

  const cards = [
    {
      label: 'Trending Medicines',
      value: insights.trendingMedicines.length
        ? insights.trendingMedicines.map((m) => m.name).join(', ')
        : 'No data yet',
      icon: TrendingUp,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Inventory Suggestions',
      value: insights.inventorySuggestions.length
        ? `${insights.inventorySuggestions.length} restock alert(s)`
        : 'Stock levels healthy',
      icon: Package,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Order Trends',
      value: insights.orderTrend,
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'User Behavior',
      value: insights.userBehavior,
      icon: Users,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      label: 'Prescription Patterns',
      value: insights.prescriptionPattern,
      icon: FileText,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Search Analytics',
      value: insights.searchAnalytics,
      icon: Search,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={loading ? 'Computing insights…' : 'AI-style analytics derived from live Firebase data'}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <AdminStatCard key={c.label} {...c} change={insights.cancelRate != null ? `Cancel rate: ${insights.cancelRate}%` : undefined} />
        ))}
      </div>

      {insights.inventorySuggestions.length > 0 && (
        <Card className="!p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Sparkles className="h-5 w-5 text-primary-600" />
            Inventory Suggestions
          </h3>
          <ul className="space-y-2">
            {insights.inventorySuggestions.map((s) => (
              <li key={s.name} className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-gray-700">
                {s.suggestion}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {insights.trendingMedicines.length > 0 && (
        <Card className="!p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Top Trending Medicines</h3>
          <ul className="space-y-2">
            {insights.trendingMedicines.map((m) => (
              <li
                key={m.name}
                className="flex justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm"
              >
                <span className="font-medium text-gray-800">{m.name}</span>
                <span className="text-gray-500">{m.orders} orders</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="!p-6">
        <h3 className="mb-2 font-semibold text-gray-900">Architecture Roadmap</h3>
        <p className="mb-4 text-sm text-gray-600">Planned modules (FUTURE_MODULES)</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {FUTURE_MODULES.map((mod) => (
            <li
              key={mod}
              className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-700"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
              {mod}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
