import { type NextRequest, NextResponse } from "next/server"
import { db, products } from "@/server/db"
import { sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    // Get all unique categories
    const categoriesResult = await db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(sql`${products.isActive} = true`)

    // Get all unique colors from the colors jsonb array
    const colorsQuery = sql`
      SELECT DISTINCT jsonb_array_elements_text(colors) as color
      FROM products
      WHERE is_active = true AND colors IS NOT NULL
      ORDER BY color
    `
    const colorsResult = await db.execute(colorsQuery)

    // Get all unique thickness from the thickness jsonb array
    const thicknessQuery = sql`
      SELECT DISTINCT jsonb_array_elements_text(thickness) as thickness
      FROM products
      WHERE is_active = true AND thickness IS NOT NULL
      ORDER BY thickness
    `
    const thicknessResult = await db.execute(thicknessQuery)

    // Get price range
    const priceRangeQuery = sql`
      SELECT
        MIN(CAST(price AS NUMERIC)) as min_price,
        MAX(CAST(price AS NUMERIC)) as max_price
      FROM products
      WHERE is_active = true
    `
    const priceRangeResult = await db.execute(priceRangeQuery)

    const categories = categoriesResult.map(row => row.category).filter(Boolean)

    // Handle colors result - it might be an array directly or have a rows property
    let colors: string[] = []
    if (Array.isArray(colorsResult)) {
      colors = colorsResult.map((row: any) => row.color).filter(Boolean)
    } else if ((colorsResult as any).rows) {
      colors = (colorsResult as any).rows.map((row: any) => row.color).filter(Boolean)
    }

    // Handle thickness result
    let thickness: string[] = []
    if (Array.isArray(thicknessResult)) {
      thickness = thicknessResult.map((row: any) => row.thickness).filter(Boolean)
    } else if ((thicknessResult as any).rows) {
      thickness = (thicknessResult as any).rows.map((row: any) => row.thickness).filter(Boolean)
    }

    // Handle price range result
    let priceRange: any = { min_price: 0, max_price: 1000000 }
    if (Array.isArray(priceRangeResult) && priceRangeResult.length > 0) {
      priceRange = priceRangeResult[0]
    } else if ((priceRangeResult as any).rows && (priceRangeResult as any).rows.length > 0) {
      priceRange = (priceRangeResult as any).rows[0]
    }

    return NextResponse.json({
      success: true,
      data: {
        categories,
        colors,
        thickness,
        priceRange: {
          min: Number(priceRange?.min_price) || 0,
          max: Number(priceRange?.max_price) || 1000000
        }
      },
    })
  } catch (error) {
    console.error("Error fetching filter options:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch filter options" }, 
      { status: 500 }
    )
  }
}
