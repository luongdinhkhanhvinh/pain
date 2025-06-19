export interface ProductVariation {
  name: string
  price: number
  isDefault?: boolean
}

export interface ProductVariations {
  colors: ProductVariation[]
  sizes: ProductVariation[]
  thickness: ProductVariation[]
}

export interface Product {
  id: string
  name: string
  description: string
  content?: string // Rich content for product details
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviewCount?: number
  category: string
  variations: ProductVariations
  // Legacy fields for backward compatibility
  colors: string[]
  sizes: string[]
  thickness: string[]
  features: string[]
  images: string[]
  specifications: ProductSpecifications
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductSpecifications {
  material: string
  origin: string
  warranty: string
  fireResistant: string
  moistureResistant: string
  installation: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  author: string
  category: string
  tags: string[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  product?: string
  message: string
  status: "new" | "contacted" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  company?: string
  taxCode?: string
  customerType: "individual" | "business"
  status: "active" | "inactive" | "potential"
  notes?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: Date
  source: "contact" | "direct" | "referral" | "online"
  contactId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Admin {
  id: string
  username: string
  email: string
  fullName: string
  role: "super_admin" | "admin" | "editor"
  avatar?: string
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: Admin
  token: string
  expiresAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductOption {
  id: string
  type: "color" | "size" | "thickness"
  name: string
  value: string
  hexColor?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
