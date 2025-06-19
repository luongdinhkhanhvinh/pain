import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { contactRequests } from '@/server/db/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      phone,
      email,
      address,
      service,
      message,
      product,
      productId
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Tên và số điện thoại là bắt buộc' },
        { status: 400 }
      )
    }

    // Validate productId if provided (must be valid UUID)
    let validProductId = null
    if (productId) {
      // Check if productId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (uuidRegex.test(productId)) {
        validProductId = productId
      }
    }

    // Insert contact request into database
    const [contactRequest] = await db
      .insert(contactRequests)
      .values({
        name,
        phone,
        email: email || null,
        address: address || null,
        service: service || null,
        message: message || null,
        productName: product || null,
        productId: validProductId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    // Here you could also send email notifications, SMS, etc.
    
    return NextResponse.json({
      success: true,
      data: {
        id: contactRequest.id,
        message: 'Yêu cầu tư vấn đã được gửi thành công!'
      }
    })

  } catch (error) {
    console.error('Error saving contact request:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const offset = (page - 1) * limit

    // Build query conditions
    let whereConditions = []
    
    if (status !== 'all') {
      whereConditions.push(`status = '${status}'`)
    }

    // Get contact requests with pagination
    const contactRequestsList = await db
      .select()
      .from(contactRequests)
      .orderBy(contactRequests.createdAt)
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalCount = await db
      .select({ count: contactRequests.id })
      .from(contactRequests)

    const total = totalCount.length

    return NextResponse.json({
      success: true,
      data: {
        contactRequests: contactRequestsList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching contact requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact requests' },
      { status: 500 }
    )
  }
}
