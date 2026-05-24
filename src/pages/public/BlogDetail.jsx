import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { blogPosts } from '../../data/mockData'
import { formatDate } from '../../utils/helpers'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p>Article not found</p>
        <Link to="/blog" className="mt-4 text-primary-600 hover:underline">
          Back to blog
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>
      <img src={post.image} alt={post.title} className="mt-6 w-full rounded-2xl object-cover" />
      <span className="mt-6 inline-block text-sm font-medium text-primary-600">{post.category}</span>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">{post.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatDate(post.date)}
        </span>
      </div>
      <p className="mt-8 text-lg leading-relaxed text-gray-700">{post.content}</p>
      <p className="mt-6 text-gray-600">{post.excerpt}</p>
    </article>
  )
}
