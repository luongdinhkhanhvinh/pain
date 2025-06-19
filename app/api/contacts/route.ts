import { type NextRequest, NextResponse } from "next/server"
import { db, contacts, insertContactSchema } from "@/server/db"
import { eq, desc, asc, ilike, and } from "drizzle-orm"
import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["new", "contacted", "completed"]).optional(),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const { page, limit, search, status, sortBy, sortOrder } = query
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(ilike(contacts.name, `%${search}%`))
    }

    if (status) {
      conditions.push(eq(contacts.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Build order by
    const orderBy = sortOrder === "asc" ? asc(contacts[sortBy]) : desc(contacts[sortBy])

    // Get contacts with pagination
    const [contactList, totalCount] = await Promise.all([
      db.select().from(contacts).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
      db
        .select({ count: contacts.id })
        .from(contacts)
        .where(whereClause)
        .then((result) => result.length),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        contacts: contactList,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertContactSchema.parse(body)

    const [newContact] = await db
      .insert(contacts)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: newContact,
        message: "Contact created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating contact:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create contact" }, { status: 500 })
  }
}
