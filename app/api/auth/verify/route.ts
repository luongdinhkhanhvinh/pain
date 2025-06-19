import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { dbHelpers } from "@/server/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Token không hợp lệ" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Check if this is hardcoded admin
      if (decoded.adminId === "hardcoded-admin-001") {
        const hardcodedAdmin = {
          id: "hardcoded-admin-001",
          username: "admin",
          email: "admin@silklux.com",
          fullName: "System Administrator",
          role: "super_admin",
          avatar: null,
          isActive: true,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return NextResponse.json({
          success: true,
          data: {
            user: hardcodedAdmin,
            isValid: true
          }
        })
      }

      // Normal database verification
      const admin = await dbHelpers.findAdminById(decoded.adminId)

      if (!admin || !admin.isActive) {
        return NextResponse.json({ success: false, error: "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa" }, { status: 401 })
      }

      const userData = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        avatar: admin.avatar,
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      }

      return NextResponse.json({
        success: true,
        data: {
          user: userData,
          isValid: true
        }
      })
    } catch (jwtError) {
      return NextResponse.json({ success: false, error: "Token không hợp lệ" }, { status: 401 })
    }
  } catch (error) {
    console.error("Verify token error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}
