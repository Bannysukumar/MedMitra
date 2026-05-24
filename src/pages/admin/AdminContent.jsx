import { blogPosts, faqs } from '../../data/mockData'
import Card from '../../components/ui/Card'
import AdminPageHeader from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import { FileEdit, HelpCircle, Plus } from 'lucide-react'

export default function AdminContent() {
  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage blog posts and FAQ content for the public website" />

      <Card className="!p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <FileEdit className="h-5 w-5 text-primary-600" />
            Blog Posts
          </h3>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
        <ul className="space-y-2">
          {blogPosts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
            >
              <span className="font-medium text-gray-800">{p.title}</span>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="!p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
          <HelpCircle className="h-5 w-5 text-primary-600" />
          FAQ Items ({faqs.length})
        </h3>
        <ul className="space-y-2">
          {faqs.map((f, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-800"
            >
              {f.question}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
