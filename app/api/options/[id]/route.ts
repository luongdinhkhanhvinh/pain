import { type NextRequest, NextResponse } from "next/server"
import { db, productOptions, updateProductOptionSchema } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [option] = await db.select().from(productOptions).where(eq(productOptions.id, params.id)).limit(1)

    if (!option) {
      return NextResponse.json({ success: false, error: "Option not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: option,
    })
  } catch (error) {
    console.error("Error fetching option:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch option" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateProductOptionSchema.parse(body)

    const [updatedOption] = await db
      .update(productOptions)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(productOptions.id, params.id))
      .returning()

    if (!updatedOption) {
      return NextResponse.json({ success: false, error: "Option not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedOption,
      message: "Option updated successfully",
    })
  } catch (error) {
    console.error("Error updating option:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update option" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [deletedOption] = await db.delete(productOptions).where(eq(productOptions.id, params.id)).returning()

    if (!deletedOption) {
      return NextResponse.json({ success: false, error: "Option not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Option deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting option:", error)
    return NextResponse.json({ success: false, error: "Failed to delete option" }, { status: 500 })
  }
}
