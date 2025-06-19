import { type NextRequest, NextResponse } from "next/server"
import { db, products, updateProductSchema } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Transform numeric fields to strings for decimal fields
    if (body.price && typeof body.price === 'number') {
      body.price = body.price.toString()
    }
    if (body.originalPrice && typeof body.originalPrice === 'number') {
      body.originalPrice = body.originalPrice.toString()
    }

    const validatedData = updateProductSchema.parse(body)

    const [updatedProduct] = await db
      .update(products)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning()

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [deletedProduct] = await db.delete(products).where(eq(products.id, id)).returning()

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
