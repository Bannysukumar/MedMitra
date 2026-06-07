import { useMemo, useState } from 'react'
import { useAuditLogs } from '../../hooks/useFirestore'
import AdminPageHeader, {
  AdminSearch,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '../../components/admin/AdminComponents'
import { formatDate } from '../../utils/helpers'

export default function AdminAuditLog() {
  const { data: logs, loading } = useAuditLogs()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return logs
    return logs.filter(
      (l) =>
        (l.adminName || '').toLowerCase().includes(q) ||
        (l.action || '').toLowerCase().includes(q) ||
        (l.module || '').toLowerCase().includes(q) ||
        (l.details || '').toLowerCase().includes(q)
    )
  }, [logs, search])

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Immutable audit trail of admin actions across all modules" />

      <AdminSearch
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search admin, action, module, or details…"
      />

      <AdminTable columns={['Admin', 'Action', 'Module', 'Timestamp', 'Details']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={5}>Loading audit log…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && filtered.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={5}>No audit entries found.</AdminTableCell>
          </AdminTableRow>
        )}
        {filtered.map((l) => (
          <AdminTableRow key={l.id}>
            <AdminTableCell highlight>{l.adminName || '—'}</AdminTableCell>
            <AdminTableCell>{l.action}</AdminTableCell>
            <AdminTableCell className="capitalize">{l.module}</AdminTableCell>
            <AdminTableCell>{formatDate(l.timestamp)}</AdminTableCell>
            <AdminTableCell className="max-w-xs truncate text-gray-600">{l.details || '—'}</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}
