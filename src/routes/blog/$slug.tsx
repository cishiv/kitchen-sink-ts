import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import type { JSX } from 'react'
import type { BlogPost } from '@/lib/blog'
import { getBlogPost } from '@/lib/blog'
import { seo } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import 'highlight.js/styles/github-dark.css'

const getBlogPostFn = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: slug }): Promise<BlogPost | null> => {
    return await getBlogPost(slug)
  })

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getBlogPostFn({ data: params.slug })
    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: seo({
          title: 'Post Not Found | Kitchen Sink Blog',
        }),
      }
    }

    return {
      meta: seo({
        title: `${loaderData.frontmatter.title} | Kitchen Sink Blog`,
        description: loaderData.frontmatter.description,
        image: loaderData.frontmatter.image,
      }),
    }
  },
  component: BlogPostPage,
  notFoundComponent: () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  },
})

function BlogPostPage(): JSX.Element {
  const post = Route.useLoaderData()

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {post.frontmatter.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {post.frontmatter.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {new Date(post.frontmatter.published).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}
            </span>
            <span>•</span>
            <span>By {post.frontmatter.author}</span>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <article
            className="prose prose-lg prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        </div>

        <div className="mt-12 text-center">
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
