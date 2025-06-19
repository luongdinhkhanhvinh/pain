import { type NextRequest, NextResponse } from "next/server"
import { db, contacts, customers } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

const convertSchema = z.object({
  contactId: z.string(),
  customerType: z.enum(["individual", "business"]).default("individual"),
  company: z.string().optional(),
  taxCode: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactId, customerType, company, taxCode, notes } = convertSchema.parse(body)

    // Get contact information
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, contactId)).limit(1)

    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })
    }

    // Check if customer already exists for this contact
    const [existingCustomer] = await db.select().from(customers).where(eq(customers.contactId, contactId)).limit(1)

    if (existingCustomer) {
      return NextResponse.json({ success: false, error: "Customer already exists for this contact" }, { status: 400 })
    }

    // Create new customer from contact
    const [newCustomer] = await db
      .insert(customers)
      .values({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        company,
        taxCode,
        customerType,
        status: "potential",
        notes: notes || `Chuyển đổi từ liên hệ: ${contact.message}`,
        totalOrders: 0,
        totalSpent: 0,
        source: "contact",
        contactId: contact.id,
      })
      .returning()

    // Update contact status to completed
    await db
      .update(contacts)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, contactId))

    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: "Contact converted to customer successfully",
    })
  } catch (error) {
    console.error("Error converting contact to customer:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to convert contact to customer" }, { status: 500 })
  }
}
