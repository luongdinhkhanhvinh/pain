import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { products, contactRequests, customers } from "@/server/db/schema"
import { count, eq, gte, lt, and } from "drizzle-orm"

export async function GET() {
  try {
    // Get current date and previous month for comparison
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get total products
    const totalProducts = await db.select({ count: count() }).from(products)
    const totalProductsLastMonth = await db
      .select({ count: count() })
      .from(products)
      .where(lt(products.createdAt, currentMonth))

    // Get new contacts this month
    const newContacts = await db.select({ count: count() }).from(contactRequests).where(gte(contactRequests.createdAt, currentMonth))

    const newContactsLastMonth = await db
      .select({ count: count() })
      .from(contactRequests)
      .where(and(
        gte(contactRequests.createdAt, previousMonth),
        lt(contactRequests.createdAt, currentMonth)
      ))

    // Get active customers
    const activeCustomers = await db.select({ count: count() }).from(customers).where(eq(customers.status, "active"))

    // Calculate total revenue (mock calculation based on customers)
    const totalCustomers = await db.select({ count: count() }).from(customers)
    const mockRevenue = totalCustomers[0].count * 15000000 // Average 15M per customer

    // Get today's page views (mock data since we don't have analytics)
    const todayViews = Math.floor(Math.random() * 2000) + 800

    // Calculate percentage changes
    const productChange =
      totalProductsLastMonth[0].count > 0
        ? Math.round(
            ((totalProducts[0].count - totalProductsLastMonth[0].count) / totalProductsLastMonth[0].count) * 100,
          )
        : 100

    const contactChange =
      newContactsLastMonth[0].count > 0
        ? Math.round(((newContacts[0].count - newContactsLastMonth[0].count) / newContactsLastMonth[0].count) * 100)
        : 100

    const stats = [
      {
        title: "Tổng Sản Phẩm",
        value: totalProducts[0].count.toString(),
        change: `${productChange >= 0 ? "+" : ""}${productChange}%`,
        icon: "Package",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Liên Hệ Mới",
        value: newContacts[0].count.toString(),
        change: `${contactChange >= 0 ? "+" : ""}${contactChange}%`,
        icon: "MessageSquare",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "Doanh Thu Tháng",
        value: `${Math.round(mockRevenue / 1000000)}M`,
        change: "+8%",
        icon: "DollarSign",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        title: "Lượt Xem Hôm Nay",
        value: todayViews.toLocaleString(),
        change: "+15%",
        icon: "Eye",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
    ]

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
