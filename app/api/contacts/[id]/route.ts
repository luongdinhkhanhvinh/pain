import { type NextRequest, NextResponse } from "next/server"
import { db, contacts, updateContactSchema } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, params.id)).limit(1)

    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch contact" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateContactSchema.parse(body)

    const [updatedContact] = await db
      .update(contacts)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, params.id))
      .returning()

    if (!updatedContact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: "Contact updated successfully",
    })
  } catch (error) {
    console.error("Error updating contact:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update contact" }, { status: 500 })
  }
}
