import { type NextRequest, NextResponse } from "next/server"
import { db, blogPosts, insertBlogPostSchema } from "@/server/db"
import { eq, desc, asc, ilike, and } from "drizzle-orm"
import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
  sortBy: z.enum(["title", "publishedAt", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const { page, limit, search, category, isPublished, sortBy, sortOrder } = query
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(ilike(blogPosts.title, `%${search}%`))
    }

    if (category) {
      conditions.push(eq(blogPosts.category, category))
    }

    if (isPublished !== undefined) {
      conditions.push(eq(blogPosts.isPublished, isPublished))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Build order by
    const orderBy = sortOrder === "asc" ? asc(blogPosts[sortBy]) : desc(blogPosts[sortBy])

    // Get blog posts with pagination
    const [postList, totalCount] = await Promise.all([
      db.select().from(blogPosts).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
      db
        .select({ count: blogPosts.id })
        .from(blogPosts)
        .where(whereClause)
        .then((result) => result.length),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        posts: postList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertBlogPostSchema.parse(body)

    // Generate slug from title if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...validatedData,
        updatedAt: new Date(),
        publishedAt: validatedData.isPublished ? new Date() : null,
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newPost,
        message: "Blog post created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create blog post" }, { status: 500 })
  }
}
