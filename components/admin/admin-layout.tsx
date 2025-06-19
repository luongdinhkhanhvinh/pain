"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ShoppingBag,
  Tags,
  Sliders,
  UserCog,
  Home,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface MenuItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

const getMenuItems = (t: any): MenuItem[] => [
  {
    title: t("admin.navigation.dashboard"),
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: t("admin.navigation.products"),
    icon: Package,
    children: [
      {
        title: t("admin.products.title"),
        href: "/admin/products",
        icon: ShoppingBag,
      },
      {
        title: t("admin.categories.title"),
        href: "/admin/categories",
        icon: Tags,
      },
      {
        title: t("admin.options.title"),
        href: "/admin/options",
        icon: Sliders,
      },
    ],
  },
  {
    title: t("admin.navigation.customers"),
    icon: Users,
    children: [
      {
        title: t("admin.customers.title"),
        href: "/admin/customers",
        icon: Users,
      },
      {
        title: t("admin.contacts.title"),
        href: "/admin/contacts",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: t("admin.navigation.blog"),
    icon: FileText,
    children: [
      {
        title: t("admin.navigation.blog"),
        href: "/admin/blog",
        icon: FileText,
      },
    ],
  },
  {
    title: t("admin.navigation.settings"),
    icon: Settings,
    children: [
      {
        title: t("admin.navigation.settings"),
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: t("admin.navigation.admins"),
        href: "/admin/admins",
        icon: UserCog,
      },
    ],
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();
  const menuItems = getMenuItems(t);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-700 transition-colors",
              level > 0 && "pl-8"
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="bg-gray-900">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href!}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors",
          level > 0 && "pl-8"
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-amber-500" />
            <h1 className="text-xl font-bold">Silklux Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full p-4 border-b border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.fullName?.charAt(0) || "A"}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 shadow-lg z-50">
              <div className="p-4 border-b border-gray-700">
                <LanguageSwitcher />
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {t("admin.navigation.logout")}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Silklux Admin</h1>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 xl:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };
export default AdminLayout;
