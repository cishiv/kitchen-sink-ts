import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { JSX } from 'react'
import type { BlogPostPreview } from '@/lib/blog'
import { getAllBlogPosts } from '@/lib/blog'
import { seo } from '@/lib/seo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const getAllBlogPostsFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<BlogPostPreview>> => {
    return getAllBlogPosts()
  },
)

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: seo({
      title: 'Blog | Kitchen Sink',
      description:
        'Read the latest updates, tutorials, and best practices for building with Kitchen Sink.',
    }),
  }),
  loader: async () => {
    const posts = await getAllBlogPostsFn()
    return { posts }
  },
  component: BlogIndex,
})

function BlogIndex(): JSX.Element {
  const { posts } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Latest updates, tutorials, and best practices for building with
            Kitchen Sink
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                        {post.frontmatter.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {post.frontmatter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {new Date(
                            post.frontmatter.published,
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span>{post.readingTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>By {post.frontmatter.author}</span>
                      </div>
                      {post.frontmatter.tags &&
                        post.frontmatter.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.frontmatter.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
