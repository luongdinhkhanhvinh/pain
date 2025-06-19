import { type NextRequest, NextResponse } from "next/server"
import { db, products, insertProductSchema } from "@/server/db"
import { eq, desc, asc, ilike, and, gte, lte, sql } from "drizzle-orm"
import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  colors: z.string().optional(), // Comma-separated colors
  thickness: z.string().optional(), // Comma-separated thickness
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const { page, limit, search, category, colors, thickness, minPrice, maxPrice, isActive, sortBy, sortOrder } = query
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`))
    }

    if (category) {
      conditions.push(eq(products.category, category))
    }

    // Filter by colors (check if any of the selected colors exist in the colors array)
    if (colors) {
      const colorList = colors.split(',').map(c => c.trim())
      const colorConditions = colorList.map(color =>
        sql`${products.colors}::jsonb ? ${color}`
      )
      if (colorConditions.length > 0) {
        conditions.push(sql`(${sql.join(colorConditions, sql` OR `)})`)
      }
    }

    // Filter by thickness (check if any of the selected thickness exist in the thickness array)
    if (thickness) {
      const thicknessList = thickness.split(',').map(t => t.trim())
      const thicknessConditions = thicknessList.map(thick =>
        sql`${products.thickness}::jsonb ? ${thick}`
      )
      if (thicknessConditions.length > 0) {
        conditions.push(sql`(${sql.join(thicknessConditions, sql` OR `)})`)
      }
    }

    // Filter by price range
    if (minPrice !== undefined) {
      conditions.push(gte(products.price, minPrice.toString()))
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(products.price, maxPrice.toString()))
    }

    if (isActive !== undefined) {
      conditions.push(eq(products.isActive, isActive))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Build order by
    const orderBy = sortOrder === "asc" ? asc(products[sortBy]) : desc(products[sortBy])

    // Get products with pagination
    const [productList, totalCount] = await Promise.all([
      db.select().from(products).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
      db
        .select({ count: products.id })
        .from(products)
        .where(whereClause)
        .then((result) => result.length),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        products: productList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertProductSchema.parse(body)

    const [newProduct] = await db
      .insert(products)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
