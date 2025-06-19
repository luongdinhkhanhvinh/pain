import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return success since the client will remove the token

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}
