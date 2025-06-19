import { type NextRequest, NextResponse } from "next/server"
import { db, productOptions, insertProductOptionSchema } from "@/server/db"
import { eq, desc, asc, ilike, and } from "drizzle-orm"
import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.enum(["color", "size", "thickness"]).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["name", "type", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const { page, limit, search, type, isActive, sortBy, sortOrder } = query
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(ilike(productOptions.name, `%${search}%`))
    }

    if (type) {
      conditions.push(eq(productOptions.type, type))
    }

    if (isActive !== undefined) {
      conditions.push(eq(productOptions.isActive, isActive))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Build order by
    const orderBy = sortOrder === "asc" ? asc(productOptions[sortBy]) : desc(productOptions[sortBy])

    // Get options with pagination
    const [optionList, totalCount] = await Promise.all([
      db.select().from(productOptions).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
      db
        .select({ count: productOptions.id })
        .from(productOptions)
        .where(whereClause)
        .then((result) => result.length),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: optionList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching options:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch options" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertProductOptionSchema.parse(body)

    const [newOption] = await db
      .insert(productOptions)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newOption,
        message: "Option created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating option:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create option" }, { status: 500 })
  }
}
