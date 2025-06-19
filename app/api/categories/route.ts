import { type NextRequest, NextResponse } from "next/server"
import { db, categories, insertCategorySchema } from "@/server/db"
import { eq, desc, asc, ilike, and } from "drizzle-orm"
import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const { page, limit, search, isActive, sortBy, sortOrder } = query
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(ilike(categories.name, `%${search}%`))
    }

    if (isActive !== undefined) {
      conditions.push(eq(categories.isActive, isActive))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Build order by
    const orderBy = sortOrder === "asc" ? asc(categories[sortBy]) : desc(categories[sortBy])

    // Get categories with pagination
    const [categoryList, totalCount] = await Promise.all([
      db.select().from(categories).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
      db
        .select({ count: categories.id })
        .from(categories)
        .where(whereClause)
        .then((result) => result.length),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: categoryList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertCategorySchema.parse(body)

    const [newCategory] = await db
      .insert(categories)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newCategory,
        message: "Category created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
