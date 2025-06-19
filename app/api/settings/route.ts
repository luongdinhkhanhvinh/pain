import { type NextRequest, NextResponse } from "next/server"

// Mock settings storage - in production, this would be stored in database
let settings = {
  siteName: "WoodVeneer Pro",
  siteDescription: "Chuyên cung cấp gỗ ép tường cao cấp với đa dạng màu sắc và vân hoạ tiết",
  siteKeywords: "gỗ ép tường, gỗ ép cao cấp, vân gỗ, nội thất, trang trí tường",
  contactEmail: "info@woodveneerpro.com",
  contactPhone: "0123.456.789",
  contactAddress: "123 Đường ABC, Quận 1, TP.HCM",
  socialMedia: {
    facebook: "https://facebook.com/woodveneerpro",
    instagram: "https://instagram.com/woodveneerpro",
    youtube: "https://youtube.com/woodveneerpro",
    zalo: "0987.654.321",
  },
  seo: {
    metaTitle: "WoodVeneer Pro - Gỗ Ép Tường Cao Cấp",
    metaDescription:
      "Chuyên cung cấp gỗ ép tường cao cấp với đa dạng màu sắc và vân hoạ tiết. Chất lượng tốt nhất, giá cả hợp lý.",
    ogImage: "",
  },
  maintenance: {
    enabled: false,
    message: "Website đang bảo trì. Vui lòng quay lại sau.",
  },
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Update settings
    settings = { ...settings, ...body }

    return NextResponse.json({
      success: true,
      data: settings,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}
