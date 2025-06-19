import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const IMAGEKIT_PRIVATE_KEY = "private_HFnP8dGK9Ql9l0slR/IHrlGCDhI="

export async function GET(request: NextRequest) {
  try {
    // Generate authentication parameters
    const token = crypto.randomUUID()
    const expire = Math.floor(Date.now() / 1000) + 2400 // 40 minutes from now
    
    // Create signature
    const signature = crypto
      .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
      .update(token + expire)
      .digest('hex')
    
    return NextResponse.json({
      token,
      expire,
      signature
    })
  } catch (error) {
    console.error('Error generating ImageKit auth params:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth params' },
      { status: 500 }
    )
  }
}
