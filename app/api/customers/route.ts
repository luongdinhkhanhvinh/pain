import { type NextRequest, NextResponse } from "next/server"
import { db, customers, insertCustomerSchema } from "@/server/db"
import { desc, ilike, or, eq, and } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const customerType = searchParams.get("customerType") || ""
    const source = searchParams.get("source") || ""

    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(customers.name, `%${search}%`),
          ilike(customers.phone, `%${search}%`),
          ilike(customers.email, `%${search}%`),
          ilike(customers.company, `%${search}%`),
        ),
      )
    }

    if (status && status !== "all") {
      conditions.push(eq(customers.status, status))
    }

    if (customerType && customerType !== "all") {
      conditions.push(eq(customers.customerType, customerType))
    }

    if (source && source !== "all") {
      conditions.push(eq(customers.source, source))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get customers with pagination
    const customersList = await db
      .select()
      .from(customers)
      .where(whereClause)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db.select({ count: customers.id }).from(customers).where(whereClause)

    const total = totalResult.length

    return NextResponse.json({
      success: true,
      data: customersList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertCustomerSchema.parse(body)

    const [newCustomer] = await db.insert(customers).values(validatedData).returning()

    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: "Customer created successfully",
    })
  } catch (error) {
    console.error("Error creating customer:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create customer" }, { status: 500 })
  }
}
