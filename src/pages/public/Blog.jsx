import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import { useBlogPosts } from '../../hooks/useFirestore'
import PageHero from '../../components/marketing/PageHero'
import SectionHeader from '../../components/marketing/SectionHeader'
import CTASection from '../../components/marketing/CTASection'
import { formatDate, cn } from '../../utils/helpers'

const ALL_CATEGORIES = 'All'

export default function Blog() {
  const { data: blogPosts, loading } = useBlogPosts()
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const categories = [ALL_CATEGORIES, ...new Set(blogPosts.map((p) => p.category))]

  const filtered = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) return blogPosts
    return blogPosts.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const [featured, ...rest] = filtered

  return (
    <div>
      <PageHero
        badge="Health Blog"
        title="Insights for a"
        highlight="healthier life"
        subtitle="Expert tips, disease guides, and wellness stories from our medical and technology team."
        centered
      />

      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-semibold transition',
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <section className="py-20">
          <div className="mx-auto max-w-lg px-4 text-center">
            <p className="font-medium text-gray-700">Loading blog posts...</p>
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="py-20">
          <div className="mx-auto max-w-lg px-4 text-center">
            <p className="font-medium text-gray-700">No posts in this category yet. Check back soon.</p>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="py-16 sm:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  eyebrow="Featured"
                  title="Editor's pick"
                  subtitle="Our latest and most impactful health story."
                  className="mb-10"
                />
                <Link to={`/blog/${featured.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-sidebar shadow-xl transition hover:shadow-2xl">
                    <div className="grid lg:grid-cols-2">
                      <div className="relative min-h-[280px] overflow-hidden lg:min-h-[400px]">
                        <img
                          src={featured.image}
                          alt={featured.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-6 top-6 rounded-full bg-primary-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                          Featured
                        </span>
                      </div>
                      <div className="flex flex-col justify-center p-8 lg:p-12">
                        <span className="text-sm font-bold text-primary-400">{featured.category}</span>
                        <h2 className="mt-3 text-2xl font-bold text-white transition group-hover:text-primary-300 sm:text-3xl lg:text-4xl">
                          {featured.title}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-gray-300">{featured.excerpt}</p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {featured.author}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(featured.date)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            5 min read
                          </span>
                        </div>
                        <span className="mt-8 inline-flex items-center gap-2 font-semibold text-primary-400 group-hover:text-primary-300">
                          Read article
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="py-16 mesh-bg sm:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  eyebrow="Latest"
                  title="More from the blog"
                  subtitle="Browse our collection of health guides and wellness tips."
                />
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                  {rest.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                      <div className="h-full overflow-hidden rounded-2xl bg-sidebar shadow-lg transition hover:shadow-xl">
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <span className="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white transition group-hover:text-primary-300">
                            {post.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-gray-300 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-5 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(post.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <CTASection
        title="Take charge of your health"
        subtitle="Order medicines, manage prescriptions, and track your wellness — all in one place."
        primaryLabel="Join MedMitra"
        secondaryLabel="Browse Medicines"
        secondaryTo="/medicines"
      />
    </div>
  )
}
