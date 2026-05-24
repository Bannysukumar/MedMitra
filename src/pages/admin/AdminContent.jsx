import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  useBlogPosts,
  useFaqs,
  useTeam,
  useTestimonials,
  usePricing,
  useSiteStats,
} from '../../hooks/useFirestore'
import {
  saveBlogPost,
  deleteBlogPost,
  saveFaq,
  deleteFaq,
  saveTeamMember,
  deleteTeamMember,
  saveTestimonial,
  deleteTestimonial,
  savePricingPlan,
  deletePricingPlan,
  saveSiteStats,
} from '../../services/firestoreService'
import Card from '../../components/ui/Card'
import AdminPageHeader, {
  AdminRowActions,
  AdminSelect,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'
import { slugify } from '../../utils/helpers'
import { Plus } from 'lucide-react'

const TABS = ['Blog', 'FAQ', 'Team', 'Testimonials', 'Pricing', 'Site Stats']

const FAQ_CATEGORIES = ['general', 'orders', 'prescriptions', 'payments', 'account']

export default function AdminContent() {
  const [tab, setTab] = useState('Blog')
  const { data: blogPosts } = useBlogPosts()
  const { data: faqs } = useFaqs()
  const { data: team } = useTeam()
  const { data: testimonials } = useTestimonials()
  const { data: pricingPlans } = usePricing()
  const { stats: siteStats, loading: statsLoading } = useSiteStats()

  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const close = () => setModal(null)

  const openBlog = (item = null) => {
    setForm(item ? { ...item } : {
      title: '', slug: '', excerpt: '', category: 'Health', author: 'MedMitra Team',
      date: new Date().toISOString().slice(0, 10), image: '', content: '',
    })
    setModal({ type: 'blog', item })
  }

  const openFaq = (item = null, id = null) => {
    setForm(item ? { ...item, _id: id } : { category: 'general', question: '', answer: '' })
    setModal({ type: 'faq', id: item?.id || id })
  }

  const openTeam = (item = null) => {
    setForm(item ? { ...item } : {
      name: '', role: '', bio: '', image: '', linkedin: '#', twitter: '#',
    })
    setModal({ type: 'team', item })
  }

  const openTestimonial = (item = null) => {
    setForm(item ? { ...item } : { name: '', role: '', rating: 5, text: '' })
    setModal({ type: 'testimonial', item })
  }

  const openPricing = (item = null) => {
    setForm(item ? { ...item, featuresText: (item.features || []).join('\n') } : {
      name: '', price: 0, period: 'month', popular: false, featuresText: '',
    })
    setModal({ type: 'pricing', item })
  }

  const openStats = () => {
    setForm({
      users: siteStats?.users || '',
      medicines: siteStats?.medicines || '',
      orders: siteStats?.orders || '',
      prescriptions: siteStats?.prescriptions || '',
    })
    setModal({ type: 'stats' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal.type === 'blog') {
        const slug = form.slug || slugify(form.title)
        await saveBlogPost(modal.item?.id, { ...form, slug })
        toast.success('Blog post saved')
      } else if (modal.type === 'faq') {
        await saveFaq(modal.id, {
          category: form.category,
          question: form.question.trim(),
          answer: form.answer.trim(),
        })
        toast.success('FAQ saved')
      } else if (modal.type === 'team') {
        await saveTeamMember(modal.item?.id, form)
        toast.success('Team member saved')
      } else if (modal.type === 'testimonial') {
        await saveTestimonial(modal.item?.id, {
          ...form,
          rating: Number(form.rating),
        })
        toast.success('Testimonial saved')
      } else if (modal.type === 'pricing') {
        await savePricingPlan(modal.item?.id, {
          name: form.name,
          price: Number(form.price),
          period: form.period,
          popular: !!form.popular,
          features: form.featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
        })
        toast.success('Pricing plan saved')
      } else if (modal.type === 'stats') {
        await saveSiteStats(form)
        toast.success('Site stats updated')
      }
      close()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => {
      const next = { ...f, [key]: val }
      if (key === 'title' && !modal?.item) next.slug = slugify(val)
      return next
    })
  }

  const renderList = (items, onEdit, onDelete, labelKey = 'title') => (
    <ul className="space-y-2">
      {items.length === 0 && (
        <li className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          No items yet. Click Add to create one.
        </li>
      )}
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
        >
          <span className="font-medium text-gray-800">
            {item[labelKey] || item.question || item.name}
          </span>
          <AdminRowActions
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage website content — blog, FAQ, team, and more" />

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Blog' && (
        <Card className="!p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Blog Posts ({blogPosts.length})</h3>
            <Button size="sm" onClick={() => openBlog()}>
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </div>
          {renderList(
            blogPosts,
            openBlog,
            async (p) => {
              if (!confirmDelete(p.title)) return
              await deleteBlogPost(p.id)
              toast.success('Post deleted')
            },
            'title'
          )}
        </Card>
      )}

      {tab === 'FAQ' && (
        <Card className="!p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">FAQ Items ({faqs.length})</h3>
            <Button size="sm" onClick={() => openFaq()}>
              <Plus className="h-4 w-4" /> Add FAQ
            </Button>
          </div>
          {renderList(
            faqs.map((f, i) => ({ ...f, id: f.id || `faq-${i}` })),
            (f) => openFaq(f, f.id),
            async (f) => {
              if (!confirmDelete(f.question)) return
              await deleteFaq(f.id)
              toast.success('FAQ deleted')
            },
            'question'
          )}
        </Card>
      )}

      {tab === 'Team' && (
        <Card className="!p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Team ({team.length})</h3>
            <Button size="sm" onClick={() => openTeam()}>
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </div>
          {renderList(
            team,
            openTeam,
            async (m) => {
              if (!confirmDelete(m.name)) return
              await deleteTeamMember(m.id)
              toast.success('Member deleted')
            },
            'name'
          )}
        </Card>
      )}

      {tab === 'Testimonials' && (
        <Card className="!p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Testimonials ({testimonials.length})</h3>
            <Button size="sm" onClick={() => openTestimonial()}>
              <Plus className="h-4 w-4" /> Add Testimonial
            </Button>
          </div>
          {renderList(
            testimonials,
            openTestimonial,
            async (t) => {
              if (!confirmDelete(t.name)) return
              await deleteTestimonial(t.id)
              toast.success('Testimonial deleted')
            },
            'name'
          )}
        </Card>
      )}

      {tab === 'Pricing' && (
        <Card className="!p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Pricing Plans ({pricingPlans.length})</h3>
            <Button size="sm" onClick={() => openPricing()}>
              <Plus className="h-4 w-4" /> Add Plan
            </Button>
          </div>
          {renderList(
            pricingPlans,
            openPricing,
            async (p) => {
              if (!confirmDelete(p.name)) return
              await deletePricingPlan(p.id)
              toast.success('Plan deleted')
            },
            'name'
          )}
        </Card>
      )}

      {tab === 'Site Stats' && (
        <Card className="!p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">Homepage Statistics</h3>
            <Button size="sm" onClick={openStats} disabled={statsLoading}>
              Edit Stats
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['users', 'medicines', 'orders', 'prescriptions'].map((key) => (
              <div
                key={key}
                className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase text-gray-500">{key}</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {siteStats?.[key] ?? '—'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={!!modal}
        onClose={close}
        title={
          modal?.type === 'blog' ? (modal.item ? 'Edit Post' : 'New Post') :
          modal?.type === 'faq' ? (modal.id ? 'Edit FAQ' : 'Add FAQ') :
          modal?.type === 'team' ? (modal.item ? 'Edit Member' : 'Add Member') :
          modal?.type === 'testimonial' ? (modal.item ? 'Edit Testimonial' : 'Add Testimonial') :
          modal?.type === 'pricing' ? (modal.item ? 'Edit Plan' : 'Add Plan') :
          'Edit Site Stats'
        }
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {modal?.type === 'blog' && (
            <>
              <Input label="Title" value={form.title || ''} onChange={set('title')} required />
              <Input label="Slug" value={form.slug || ''} onChange={set('slug')} required />
              <Input label="Category" value={form.category || ''} onChange={set('category')} />
              <Input label="Author" value={form.author || ''} onChange={set('author')} />
              <Input label="Date" type="date" value={form.date || ''} onChange={set('date')} />
              <Input label="Image URL" value={form.image || ''} onChange={set('image')} />
              <Textarea label="Excerpt" rows={2} value={form.excerpt || ''} onChange={set('excerpt')} />
              <Textarea label="Content" rows={4} value={form.content || ''} onChange={set('content')} />
            </>
          )}
          {modal?.type === 'faq' && (
            <>
              <AdminSelect label="Category" value={form.category || 'general'} onChange={set('category')}>
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </AdminSelect>
              <Input label="Question" value={form.question || ''} onChange={set('question')} required />
              <Textarea label="Answer" rows={4} value={form.answer || ''} onChange={set('answer')} required />
            </>
          )}
          {modal?.type === 'team' && (
            <>
              <Input label="Name" value={form.name || ''} onChange={set('name')} required />
              <Input label="Role" value={form.role || ''} onChange={set('role')} required />
              <Textarea label="Bio" rows={3} value={form.bio || ''} onChange={set('bio')} />
              <Input label="Photo URL" value={form.image || ''} onChange={set('image')} />
              <Input label="LinkedIn URL" value={form.linkedin || ''} onChange={set('linkedin')} />
              <Input label="Twitter URL" value={form.twitter || ''} onChange={set('twitter')} />
            </>
          )}
          {modal?.type === 'testimonial' && (
            <>
              <Input label="Name" value={form.name || ''} onChange={set('name')} required />
              <Input label="Role" value={form.role || ''} onChange={set('role')} />
              <Input label="Rating (1-5)" type="number" min="1" max="5" value={form.rating || 5} onChange={set('rating')} />
              <Textarea label="Quote" rows={3} value={form.text || ''} onChange={set('text')} required />
            </>
          )}
          {modal?.type === 'pricing' && (
            <>
              <Input label="Plan Name" value={form.name || ''} onChange={set('name')} required />
              <Input label="Price (₹)" type="number" min="0" value={form.price ?? 0} onChange={set('price')} />
              <Input label="Period" value={form.period || 'month'} onChange={set('period')} placeholder="month / forever" />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={!!form.popular} onChange={set('popular')} />
                Mark as popular
              </label>
              <Textarea
                label="Features (one per line)"
                rows={5}
                value={form.featuresText || ''}
                onChange={set('featuresText')}
              />
            </>
          )}
          {modal?.type === 'stats' && (
            <>
              <Input label="Registered Users" value={form.users || ''} onChange={set('users')} placeholder="50,000+" />
              <Input label="Medicines" value={form.medicines || ''} onChange={set('medicines')} placeholder="10,000+" />
              <Input label="Orders Delivered" value={form.orders || ''} onChange={set('orders')} placeholder="1,00,000+" />
              <Input label="Prescriptions" value={form.prescriptions || ''} onChange={set('prescriptions')} placeholder="25,000+" />
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">Save</Button>
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
