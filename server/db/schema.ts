import { pgTable, text, timestamp, boolean, integer, decimal, jsonb, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Products table
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content"), // Rich content for product details
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  category: text("category").notNull(),
  // Updated variations with pricing
  variations: jsonb("variations")
    .$type<{
      colors: Array<{ name: string; price: number; isDefault?: boolean }>
      sizes: Array<{ name: string; price: number; isDefault?: boolean }>
      thickness: Array<{ name: string; price: number; isDefault?: boolean }>
    }>()
    .notNull(),
  // Keep legacy fields for backward compatibility
  colors: jsonb("colors").$type<string[]>().notNull(),
  sizes: jsonb("sizes").$type<string[]>().notNull(),
  thickness: jsonb("thickness").$type<string[]>().notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  specifications: jsonb("specifications")
    .$type<{
      material: string
      origin: string
      warranty: string
      fireResistant: string
      moistureResistant: string
      installation: string
    }>()
    .notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Contact requests table
export const contactRequests = pgTable("contact_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  service: text("service"),
  message: text("message"),
  productName: text("product_name"),
  productId: uuid("product_id"),
  status: text("status").$type<"pending" | "contacted" | "completed" | "cancelled">().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Customers table
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  company: text("company"),
  taxCode: text("tax_code"),
  customerType: text("customer_type").$type<"individual" | "business">().default("individual"),
  status: text("status").$type<"active" | "inactive" | "potential">().default("potential"),
  notes: text("notes"),
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  lastOrderDate: timestamp("last_order_date"),
  source: text("source").$type<"contact" | "direct" | "referral" | "online">().default("direct"),
  contactId: uuid("contact_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Product options table
export const productOptions = pgTable("product_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").$type<"color" | "size" | "thickness">().notNull(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  hexColor: text("hex_color"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Admins table
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<"admin" | "super_admin">().default("admin"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products)
export const selectProductSchema = createSelectSchema(products)
export const updateProductSchema = insertProductSchema.partial().omit({ id: true, createdAt: true })

export const insertBlogPostSchema = createInsertSchema(blogPosts)
export const selectBlogPostSchema = createSelectSchema(blogPosts)
export const updateBlogPostSchema = insertBlogPostSchema.partial().omit({ id: true, createdAt: true })

export const insertContactRequestSchema = createInsertSchema(contactRequests)
export const selectContactRequestSchema = createSelectSchema(contactRequests)
export const updateContactRequestSchema = insertContactRequestSchema.partial().omit({ id: true, createdAt: true })

export const insertCustomerSchema = createInsertSchema(customers)
export const selectCustomerSchema = createSelectSchema(customers)
export const updateCustomerSchema = insertCustomerSchema.partial().omit({ id: true, createdAt: true })

export const insertCategorySchema = createInsertSchema(categories)
export const selectCategorySchema = createSelectSchema(categories)
export const updateCategorySchema = insertCategorySchema.partial().omit({ id: true, createdAt: true })

export const insertProductOptionSchema = createInsertSchema(productOptions)
export const selectProductOptionSchema = createSelectSchema(productOptions)
export const updateProductOptionSchema = insertProductOptionSchema.partial().omit({ id: true, createdAt: true })

export const insertAdminSchema = createInsertSchema(admins)
export const selectAdminSchema = createSelectSchema(admins)
export const updateAdminSchema = insertAdminSchema.partial().omit({ id: true, createdAt: true })

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type ContactRequest = typeof contactRequests.$inferSelect
export type NewContactRequest = typeof contactRequests.$inferInsert
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type ProductOption = typeof productOptions.$inferSelect
export type NewProductOption = typeof productOptions.$inferInsert
export type Admin = typeof admins.$inferSelect
export type NewAdmin = typeof admins.$inferInsert

// Aliases for backward compatibility
export const contacts = contactRequests
export const insertContactSchema = insertContactRequestSchema
export const updateContactSchema = updateContactRequestSchema
