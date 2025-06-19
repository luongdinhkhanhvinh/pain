"use client"

import { createContext, useContext } from "react"

// Supported languages
export const LANGUAGES = {
  vi: {
    code: "vi",
    name: "Tiếng Việt",
    flag: "🇻🇳",
  },
  en: {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
} as const

export type Language = keyof typeof LANGUAGES
export type TranslationKey = keyof typeof translations.vi

// Auto-detect language from timezone
export function detectLanguageFromTimezone(): Language {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Vietnam timezones
    const vietnamTimezones = [
      "Asia/Ho_Chi_Minh",
      "Asia/Saigon",
      "Asia/Bangkok", // Some VN users might have this
    ]

    if (vietnamTimezones.includes(timezone)) {
      return "vi"
    }

    // Default to English for other timezones
    return "en"
  } catch (error) {
    console.warn("Failed to detect timezone, defaulting to Vietnamese:", error)
    return "vi"
  }
}

// Translation context
export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

export const I18nContext = createContext<I18nContextType | null>(null)

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider")
  }
  return context
}

// Translations
export const translations = {
  vi: {
    // Navigation
    "nav.home": "Trang Chủ",
    "nav.products": "Sản Phẩm",
    "nav.about": "Giới Thiệu",
    "nav.contact": "Liên Hệ",
    "nav.admin": "Quản Trị",

    // Hero Section
    "hero.title": "Silklux",
    "hero.subtitle": "Nội Thất Cao Cấp",
    "hero.description":
      "Khám phá bộ sưu tập nội thất cao cấp đa dạng với thiết kế sang trọng và chất liệu premium. Mang đến không gian sống đẳng cấp và tinh tế cho ngôi nhà của bạn.",
    "hero.cta.products": "Xem Sản Phẩm",
    "hero.cta.consultation": "Tư Vấn Miễn Phí",
    "hero.rating": "từ 1000+ khách hàng",

    // Features
    "features.quality.title": "Chất Lượng Cao",
    "features.quality.desc": "Sản phẩm được kiểm định chất lượng nghiêm ngặt",
    "features.warranty.title": "Bảo Hành Dài Hạn",
    "features.warranty.desc": "Bảo hành 10 năm cho tất cả sản phẩm",
    "features.shipping.title": "Giao Hàng Miễn Phí",
    "features.shipping.desc": "Miễn phí giao hàng và lắp đặt tại TP.HCM",

    // Products
    "products.title": "Bộ Sưu Tập Gỗ Ép Tường",
    "products.subtitle":
      "Đa dạng màu sắc và vân hoạ tiết, từ cổ điển đến hiện đại, phù hợp với mọi phong cách thiết kế nội thất",
    "products.colors": "Màu sắc có sẵn:",
    "products.features": "Đặc điểm:",
    "products.contact": "Liên Hệ",
    "products.per_sqm": "/m²",

    // About
    "about.title": "Về WoodVeneer Pro",
    "about.desc1":
      "Với hơn 15 năm kinh nghiệm trong ngành gỗ ép tường, chúng tôi tự hào là đơn vị cung cấp các sản phẩm gỗ ép tường cao cấp với chất lượng tốt nhất.",
    "about.desc2":
      "Bộ sưu tập của chúng tôi bao gồm hàng trăm màu sắc và vân hoạ tiết khác nhau, từ những tông màu cổ điển đến những xu hướng hiện đại nhất, đáp ứng mọi nhu cầu thiết kế nội thất.",
    "about.customers": "Khách hàng hài lòng",
    "about.experience": "Năm kinh nghiệm",

    // Contact
    "contact.title": "Liên Hệ Với Chúng Tôi",
    "contact.subtitle": "Hãy để chúng tôi tư vấn và báo giá chi tiết cho dự án của bạn",
    "contact.info": "Thông Tin Liên Hệ",
    "contact.phone": "Điện thoại",
    "contact.email": "Email",
    "contact.address": "Địa chỉ",
    "contact.form.title": "Gửi Yêu Cầu Tư Vấn",
    "contact.form.subtitle": "Điền thông tin để nhận báo giá và tư vấn miễn phí",
    "contact.form.name": "Họ tên",
    "contact.form.phone": "Số điện thoại",
    "contact.form.email": "Email",
    "contact.form.address": "Địa chỉ dự án",
    "contact.form.message": "Mô tả dự án",
    "contact.form.message.placeholder": "Diện tích, loại gỗ quan tâm, thời gian thực hiện...",
    "contact.form.submit": "Gửi Yêu Cầu Tư Vấn",
    "contact.form.required": "*",

    // Contact Dialog
    "contact.dialog.title": "Liên Hệ Tư Vấn",
    "contact.dialog.subtitle": "Điền thông tin để nhận tư vấn chi tiết về sản phẩm:",
    "contact.dialog.project_address": "Địa chỉ",
    "contact.dialog.notes": "Ghi chú",
    "contact.dialog.notes.placeholder": "Diện tích cần lắp đặt, yêu cầu đặc biệt...",
    "contact.dialog.submit": "Gửi Thông Tin",
    "contact.dialog.success": "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",

    // Footer
    "footer.products": "Sản Phẩm",
    "footer.services": "Dịch Vụ",
    "footer.contact": "Liên Hệ",
    "footer.design": "Tư vấn thiết kế",
    "footer.installation": "Lắp đặt",
    "footer.warranty": "Bảo hành",
    "footer.support": "Hỗ trợ kỹ thuật",
    "footer.copyright": "Tất cả quyền được bảo lưu.",
    "footer.description": "Chuyên cung cấp giải pháp nội thất cao cấp với thiết kế sang trọng và chất liệu premium.",

    // Admin
    "admin.login": "Đăng Nhập",
    "admin.logout": "Đăng Xuất",
    "admin.dashboard": "Bảng Điều Khiển",
    "admin.products": "Sản Phẩm",
    "admin.customers": "Khách Hàng",
    "admin.contacts": "Liên Hệ",
    "admin.blog": "Blog",
    "admin.settings": "Cài Đặt",
    "admin.categories": "Danh Mục",
    "admin.options": "Tùy Chọn",
    "admin.admins": "Quản Trị Viên",

    // Common
    "common.loading": "Đang tải...",
    "common.error": "Có lỗi xảy ra",
    "common.success": "Thành công",
    "common.cancel": "Hủy",
    "common.save": "Lưu",
    "common.edit": "Sửa",
    "common.delete": "Xóa",
    "common.view": "Xem",
    "common.add": "Thêm",
    "common.search": "Tìm kiếm",
    "common.filter": "Lọc",
    "common.all": "Tất cả",
    "common.active": "Hoạt động",
    "common.inactive": "Không hoạt động",
    "common.yes": "Có",
    "common.no": "Không",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.admin": "Admin",

    // Hero Section
    "hero.title": "Silklux",
    "hero.subtitle": "Premium Interior",
    "hero.description":
      "Discover our diverse collection of premium interior solutions with luxury designs and premium materials. Bring elegance and sophistication to your living space.",
    "hero.cta.products": "View Products",
    "hero.cta.consultation": "Free Consultation",
    "hero.rating": "from 1000+ customers",

    // Features
    "features.quality.title": "High Quality",
    "features.quality.desc": "Products undergo strict quality inspection",
    "features.warranty.title": "Long-term Warranty",
    "features.warranty.desc": "10-year warranty on all products",
    "features.shipping.title": "Free Shipping",
    "features.shipping.desc": "Free delivery and installation in Ho Chi Minh City",

    // Products
    "products.title": "Wood Veneer Panel Collection",
    "products.subtitle":
      "Diverse colors and grain patterns, from classic to modern, suitable for all interior design styles",
    "products.colors": "Available colors:",
    "products.features": "Features:",
    "products.contact": "Contact",
    "products.per_sqm": "/m²",

    // About
    "about.title": "About WoodVeneer Pro",
    "about.desc1":
      "With over 15 years of experience in the wood veneer industry, we pride ourselves on being a provider of premium wood veneer products with the best quality.",
    "about.desc2":
      "Our collection includes hundreds of different colors and grain patterns, from classic tones to the most modern trends, meeting all interior design needs.",
    "about.customers": "Satisfied customers",
    "about.experience": "Years of experience",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Let us provide detailed consultation and quotes for your project",
    "contact.info": "Contact Information",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.form.title": "Send Consultation Request",
    "contact.form.subtitle": "Fill in your information to receive free quotes and consultation",
    "contact.form.name": "Full name",
    "contact.form.phone": "Phone number",
    "contact.form.email": "Email",
    "contact.form.address": "Project address",
    "contact.form.message": "Project description",
    "contact.form.message.placeholder": "Area, preferred wood type, timeline...",
    "contact.form.submit": "Send Consultation Request",
    "contact.form.required": "*",

    // Contact Dialog
    "contact.dialog.title": "Contact for Consultation",
    "contact.dialog.subtitle": "Fill in your information to receive detailed consultation about product:",
    "contact.dialog.project_address": "Address",
    "contact.dialog.notes": "Notes",
    "contact.dialog.notes.placeholder": "Installation area, special requirements...",
    "contact.dialog.submit": "Send Information",
    "contact.dialog.success": "Thank you for contacting us! We will respond as soon as possible.",

    // Footer
    "footer.products": "Products",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.design": "Design consultation",
    "footer.installation": "Installation",
    "footer.warranty": "Warranty",
    "footer.support": "Technical support",
    "footer.copyright": "All rights reserved.",
    "footer.description": "Specializing in premium interior solutions with luxury designs and premium materials.",

    // Admin
    "admin.login": "Login",
    "admin.logout": "Logout",
    "admin.dashboard": "Dashboard",
    "admin.products": "Products",
    "admin.customers": "Customers",
    "admin.contacts": "Contacts",
    "admin.blog": "Blog",
    "admin.settings": "Settings",
    "admin.categories": "Categories",
    "admin.options": "Options",
    "admin.admins": "Administrators",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.yes": "Yes",
    "common.no": "No",
  },
} as const
