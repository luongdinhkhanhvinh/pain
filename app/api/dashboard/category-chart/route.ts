import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { products } from "@/server/db/schema"
import { count, sql } from "drizzle-orm"

export async function GET() {
  try {
    // Get product count by category (using category field directly)
    const categoryStats = await db
      .select({
        categoryName: products.category,
        productCount: count(products.id),
      })
      .from(products)
      .groupBy(products.category)
      .orderBy(sql`count(${products.id}) DESC`)

    // Calculate total products
    const totalProducts = categoryStats.reduce((sum, cat) => sum + cat.productCount, 0)

    // Convert to percentage and add colors
    const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6B7280", "#3B82F6", "#EC4899"]

    const categoryData = categoryStats.map((cat, index) => ({
      name: cat.categoryName || "Chưa phân loại",
      value: totalProducts > 0 ? Math.round((cat.productCount / totalProducts) * 100) : 0,
      count: cat.productCount,
      color: colors[index % colors.length],
    }))

    // If no categories, return default data
    if (categoryData.length === 0) {
      return NextResponse.json({
        categoryData: [{ name: "Chưa có dữ liệu", value: 100, count: 0, color: "#6B7280" }],
      })
    }

    return NextResponse.json({ categoryData })
  } catch (error) {
    console.error("Error fetching category chart data:", error)
    return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 })
  }
}
