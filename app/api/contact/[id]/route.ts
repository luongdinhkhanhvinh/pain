import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { contactRequests } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'contacted', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Update contact request status
    const [updatedContact] = await db
      .update(contactRequests)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(contactRequests.id, id))
      .returning()

    if (!updatedContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact status updated successfully'
    })

  } catch (error) {
    console.error('Error updating contact status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact status' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get contact request by ID
    const [contact] = await db
      .select()
      .from(contactRequests)
      .where(eq(contactRequests.id, id))

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contact
    })

  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete contact request
    const [deletedContact] = await db
      .delete(contactRequests)
      .where(eq(contactRequests.id, id))
      .returning()

    if (!deletedContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
