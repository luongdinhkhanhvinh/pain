"use client";

import { MobileHeader } from "@/components/layout/mobile-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Grid,
  List,
  Loader2,
  Search,
  Star,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  images: string[];
  category: string;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface FilterOptions {
  categories: string[];
  colors: string[];
  thickness: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface Filters {
  category: string;
  colors: string[];
  thickness: string[];
  priceRange: [number, number];
}

export default function ProductsPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    colors: [],
    thickness: [],
    priceRange: { min: 0, max: 1000000 }
  });
  const [filters, setFilters] = useState<Filters>({
    category: "",
    colors: [],
    thickness: [],
    priceRange: [0, 1000000]
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/products/filters');
      const data = await response.json();

      if (data.success) {
        setFilterOptions(data.data);
        // Initialize price range filter with actual min/max
        setFilters(prev => ({
          ...prev,
          priceRange: [data.data.priceRange.min, data.data.priceRange.max]
        }));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.category && { category: filters.category }),
        ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
        ...(filters.thickness.length > 0 && { thickness: filters.thickness.join(',') }),
        ...(filters.priceRange[0] > filterOptions.priceRange.min && { minPrice: filters.priceRange[0].toString() }),
        ...(filters.priceRange[1] < filterOptions.priceRange.max && { maxPrice: filters.priceRange[1].toString() }),
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const response = await fetch(`/api/products?${params}`);
      const data: ProductsResponse = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        setError(t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch products on component mount and when filters/pagination changes
  useEffect(() => {
    if (filterOptions.categories.length > 0) { // Only fetch after filter options are loaded
      fetchProducts();
    }
  }, [pagination.page, filters, filterOptions]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      } else if (filterOptions.categories.length > 0) {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter handlers
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? "" : category }));
  };

  const handleColorChange = (color: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      colors: checked
        ? [...prev.colors, color]
        : prev.colors.filter(c => c !== color)
    }));
  };

  const handleThicknessChange = (thickness: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      thickness: checked
        ? [...prev.thickness, thickness]
        : prev.thickness.filter(t => t !== thickness)
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      colors: [],
      thickness: [],
      priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max]
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.colors.length > 0) count++;
    if (filters.thickness.length > 0) count++;
    if (filters.priceRange[0] > filterOptions.priceRange.min || filters.priceRange[1] < filterOptions.priceRange.max) count++;
    return count;
  };

  return (
    <div className="bg-white">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Breadcrumb - Desktop only */}
      <div className="bg-gray-50 py-4 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-amber-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('navigation.home')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-amber-600 font-medium">{t('navigation.products')}</span>
          </div>
        </div>
      </div>

      {/* Page Header - Desktop only */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-50 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('products.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Search and Filter */}
      <section className="md:hidden py-4 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('products.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="h-12 px-4"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('common.filter')}
              {getActiveFiltersCount() > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Filters Collapsible */}
          <Collapsible open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <CollapsibleContent className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('products.filters.category')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.categories.map((category) => (
                        <Button
                          key={category}
                          variant={filters.category === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCategoryChange(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('products.filters.colors')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.colors.slice(0, 6).map((color) => (
                        <Button
                          key={color}
                          variant={filters.colors.includes(color) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleColorChange(color, !filters.colors.includes(color))}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className="w-full">
                      <X className="w-4 h-4 mr-2" />
                      {t('products.filters.clear')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <div className="mt-3 text-sm text-gray-600">
            {t('products.results.showing', { total: pagination.total })}
          </div>
        </div>
      </section>

      {/* Desktop Layout with Sidebar */}
      <section className="py-8 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('products.filters.title')}</CardTitle>
                      {getActiveFiltersCount() > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="w-4 h-4 mr-1" />
                          {t('products.filters.clearCount', { count: getActiveFiltersCount() })}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">{t('products.filters.search')}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder={t('products.searchPlaceholder')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">{t('products.filters.category')}</Label>
                      <div className="space-y-2">
                        {filterOptions.categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={filters.category === category}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label
                              htmlFor={`category-${category}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">{t('products.filters.colors')}</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {filterOptions.colors.map((color) => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox
                              id={`color-${color}`}
                              checked={filters.colors.includes(color)}
                              onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                            />
                            <Label
                              htmlFor={`color-${color}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {color}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Thickness */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">{t('products.filters.thickness')}</Label>
                      <div className="space-y-2">
                        {filterOptions.thickness.map((thickness) => (
                          <div key={thickness} className="flex items-center space-x-2">
                            <Checkbox
                              id={`thickness-${thickness}`}
                              checked={filters.thickness.includes(thickness)}
                              onCheckedChange={(checked) => handleThicknessChange(thickness, checked as boolean)}
                            />
                            <Label
                              htmlFor={`thickness-${thickness}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {thickness}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        {t('products.filters.priceRange')}: {filters.priceRange[0].toLocaleString()}₫ - {filters.priceRange[1].toLocaleString()}₫
                      </Label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={handlePriceRangeChange}
                        max={filterOptions.priceRange.max}
                        min={filterOptions.priceRange.min}
                        step={50000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{filterOptions.priceRange.min.toLocaleString()}₫</span>
                        <span>{filterOptions.priceRange.max.toLocaleString()}₫</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header with view mode and results count */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {t('products.results.showing', { total: pagination.total })}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">{t('common.loading')}</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <Button onClick={fetchProducts} className="mt-4">
                {t('common.back')}
              </Button>
            </div>
          ) : (
                <div
                  className={`grid gap-4 md:gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`group hover:shadow-xl transition-shadow duration-300 ${
                    viewMode === "list" ? "md:flex md:flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list"
                        ? "md:w-64 md:flex-shrink-0"
                        : "rounded-t-lg"
                    }`}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={400}
                      height={300}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === "list"
                          ? "w-full h-48 md:h-full"
                          : "w-full h-48 md:h-64"
                      }`}
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.discount && product.discount > 0 && (
                        <Badge className="bg-red-500">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="bg-green-500">{t('products.card.new')}</Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="bg-blue-500">{t('products.card.featured')}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {product.rating}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg md:text-xl line-clamp-2 mb-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription
                        className={`text-sm ${
                          viewMode === "list"
                            ? "line-clamp-2"
                            : "line-clamp-2 md:line-clamp-3"
                        }`}
                      >
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl md:text-2xl font-bold text-amber-600">
                            {product.price.toLocaleString("vi-VN")}₫
                          </span>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2 block md:inline">
                                {product.originalPrice.toLocaleString("vi-VN")}₫
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full" variant="outline">
                            {t('products.card.viewDetails')}
                          </Button>
                        </Link>
                        <Link
                          href={`/contact?product=${encodeURIComponent(
                            product.name
                          )}&productId=${product.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full">{t('products.card.contact')}</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
                ))}
                </div>
              )}

              {products.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {t('products.results.noResults')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Products Section */}
      <section className="py-12 md:hidden">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">{t('common.loading')}</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <Button onClick={fetchProducts} className="mt-4">
                {t('common.back')}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-48"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.discount && product.discount > 0 && (
                        <Badge className="bg-red-500">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="bg-green-500">{t('products.card.new')}</Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="bg-blue-500">{t('products.card.featured')}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {product.rating}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl font-bold text-amber-600">
                            {product.price.toLocaleString("vi-VN")}₫
                          </span>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2 block">
                                {product.originalPrice.toLocaleString("vi-VN")}₫
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full" variant="outline">
                            {t('products.card.viewDetails')}
                          </Button>
                        </Link>
                        <Link
                          href={`/contact?product=${encodeURIComponent(
                            product.name
                          )}&productId=${product.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full">{t('products.card.contact')}</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {products.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {t('products.results.noResults')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.previous')}
              </Button>

              <div className="flex gap-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: pageNum }))
                    }
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
              >
                {t('common.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
