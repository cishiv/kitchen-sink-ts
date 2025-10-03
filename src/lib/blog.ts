import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import readingTime from 'reading-time'

export interface BlogPostFrontmatter {
  title: string
  description: string
  published: string
  author: string
  tags?: Array<string>
  image?: string
}

export interface BlogPost {
  slug: string
  frontmatter: BlogPostFrontmatter
  content: string
  htmlContent: string
  readingTime: string
}

export interface BlogPostPreview {
  slug: string
  frontmatter: BlogPostFrontmatter
  readingTime: string
}

export const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

export const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

/**
 * Get all blog posts with metadata (for blog index)
 */
export function getAllBlogPosts(): Array<BlogPostPreview> {
  if (!fs.existsSync(BLOG_DIR)) {
    return []
  }

  const files = fs.readdirSync(BLOG_DIR)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  const posts = markdownFiles.map((filename) => {
    const slug = filename.replace('.md', '')
    const filePath = path.join(BLOG_DIR, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      frontmatter: data as BlogPostFrontmatter,
      readingTime: readingTime(content).text,
    }
  })

  // Sort by published date, newest first
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.published).getTime()
    const dateB = new Date(b.frontmatter.published).getTime()
    return dateB - dateA
  })
}

/**
 * Get a single blog post by slug with full content
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const htmlContent = await marked.parse(content)

    return {
      slug,
      frontmatter: data as BlogPostFrontmatter,
      content,
      htmlContent: htmlContent,
      readingTime: readingTime(content).text,
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}
