import { type NextRequest, NextResponse } from "next/server"
import { db, categories, updateCategorySchema } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [category] = await db.select().from(categories).where(eq(categories.id, params.id)).limit(1)

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, params.id))
      .returning()

    if (!updatedCategory) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    })
  } catch (error) {
    console.error("Error updating category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [deletedCategory] = await db.delete(categories).where(eq(categories.id, params.id)).returning()

    if (!deletedCategory) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 })
  }
}
