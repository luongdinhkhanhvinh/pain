import { type NextRequest, NextResponse } from "next/server"
import { db, customers, updateCustomerSchema } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [customer] = await db.select().from(customers).where(eq(customers.id, params.id)).limit(1)

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateCustomerSchema.parse(body)

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, params.id))
      .returning()

    if (!updatedCustomer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: "Customer updated successfully",
    })
  } catch (error) {
    console.error("Error updating customer:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [deletedCustomer] = await db.delete(customers).where(eq(customers.id, params.id)).returning()

    if (!deletedCustomer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ success: false, error: "Failed to delete customer" }, { status: 500 })
  }
}
