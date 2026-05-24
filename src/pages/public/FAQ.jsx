import { useState, useMemo } from 'react'
import { ChevronDown, Search, HelpCircle, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { faqs } from '../../data/mockData'
import PageHero from '../../components/marketing/PageHero'
import CTASection from '../../components/marketing/CTASection'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/helpers'

const CATEGORY_LABELS = {
  general: 'General',
  orders: 'Orders & Delivery',
  prescriptions: 'Prescriptions',
  payments: 'Payments',
  account: 'Account',
}

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const categories = [...new Set(faqs.map((f) => f.category))]

  const filteredFaqs = useMemo(() => {
    let list = faqs
    if (activeTab !== 'all') list = list.filter((f) => f.category === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeTab, search])

  return (
    <div>
      <PageHero
        badge="Help Center"
        title="Frequently asked"
        highlight="questions"
        subtitle="Find quick answers about orders, prescriptions, payments, and your account."
        centered
      >
        <div className="relative mx-auto w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </PageHero>

      <section className="border-b border-gray-100 bg-white py-6">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 px-4">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={cn(
              'rounded-full px-5 py-2.5 text-sm font-semibold transition',
              activeTab === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-semibold transition',
                activeTab === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 mesh-bg sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center card-shadow">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 font-bold text-gray-900">No results found</h3>
              <p className="mt-2 text-sm font-medium text-gray-600">Try a different search term or category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => {
                const key = `${faq.category}-${i}`
                const isOpen = open === key
                return (
                  <div
                    key={key}
                    className={cn(
                      'overflow-hidden rounded-2xl bg-sidebar shadow-lg transition',
                      isOpen && 'ring-2 ring-primary-500/40'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary-300">
                          {CATEGORY_LABELS[faq.category] || faq.category}
                        </span>
                        <p className="mt-1.5 text-base font-semibold text-white sm:text-lg">{faq.question}</p>
                      </div>
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition',
                          isOpen && 'rotate-180 bg-primary-600'
                        )}
                      >
                        <ChevronDown className="h-5 w-5 text-white" />
                      </div>
                    </button>
                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-in-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-white/10 px-6 pb-5 pt-4">
                          <p className="text-sm leading-relaxed text-gray-300">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-sidebar p-6 shadow-lg sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-600/20">
              <MessageCircle className="h-7 w-7 text-primary-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-white">Still have questions?</h3>
              <p className="mt-1 text-sm text-gray-400">
                Our support team typically responds within 24 hours.
              </p>
            </div>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to get started?"
        subtitle="Create your free account and experience premium healthcare delivery."
        primaryLabel="Sign Up Free"
      />
    </div>
  )
}
