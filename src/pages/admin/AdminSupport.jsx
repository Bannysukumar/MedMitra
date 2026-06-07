import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSupportTickets } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { updateSupportTicket } from '../../services/adminService'
import { TICKET_PRIORITIES } from '../../config/constants'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminSelect,
  AdminRowActions,
} from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'
import { formatDate } from '../../utils/helpers'

export default function AdminSupport() {
  const { user, profile } = useAuth()
  const { data: tickets, loading } = useSupportTickets()
  const [replying, setReplying] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [saving, setSaving] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  const openReply = (ticket) => {
    setReplying(ticket)
    setReplyText(ticket.adminReply || '')
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replying) return
    setSaving(true)
    try {
      await updateSupportTicket(replying.id, { adminReply: replyText.trim() }, admin)
      toast.success('Reply saved')
      setReplying(null)
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleStatus = async (ticket, status) => {
    try {
      await updateSupportTicket(ticket.id, { status }, admin)
      toast.success(`Ticket ${status}`)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  const handlePriority = async (ticket, priority) => {
    try {
      await updateSupportTicket(ticket.id, { priority }, admin)
      toast.success('Priority updated')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage support tickets — reply, set priority, close or reopen" />

      <AdminTable columns={['Subject', 'Message', 'Status', 'Priority', 'Date', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>Loading tickets…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && tickets.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>No support tickets.</AdminTableCell>
          </AdminTableRow>
        )}
        {tickets.map((t) => (
          <AdminTableRow key={t.id}>
            <AdminTableCell highlight>{t.subject || '—'}</AdminTableCell>
            <AdminTableCell className="max-w-xs truncate">{t.message?.slice(0, 80) || '—'}</AdminTableCell>
            <AdminTableCell>
              <StatusPill status={t.status || 'open'} type="ticket" />
            </AdminTableCell>
            <AdminTableCell>
              <AdminSelect
                value={t.priority || 'medium'}
                onChange={(e) => handlePriority(t, e.target.value)}
                className="!w-auto min-w-[120px] py-1.5"
              >
                {Object.keys(TICKET_PRIORITIES).map((p) => (
                  <option key={p} value={p}>{TICKET_PRIORITIES[p].label}</option>
                ))}
              </AdminSelect>
            </AdminTableCell>
            <AdminTableCell>{formatDate(t.createdAt)}</AdminTableCell>
            <AdminTableCell>
              <AdminRowActions onEdit={() => openReply(t)}>
                {t.status === 'closed' ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => handleStatus(t, 'open')}>
                    Reopen
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="secondary" onClick={() => handleStatus(t, 'closed')}>
                    Close
                  </Button>
                )}
              </AdminRowActions>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>

      <Modal open={!!replying} onClose={() => setReplying(null)} title="Admin Reply" size="lg">
        {replying && (
          <form onSubmit={handleReply} className="space-y-4">
            <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
              <strong>User message:</strong> {replying.message}
            </p>
            <Textarea
              label="Admin reply"
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" loading={saving} className="flex-1">Save Reply</Button>
              <Button type="button" variant="outline" onClick={() => setReplying(null)}>Cancel</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
