"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Clock, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useTranslation } from "@/lib/i18n/context";

const getContactInfo = (t: any) => [
  {
    icon: Phone,
    title: t("contact.contactInfo.phone.title"),
    details: t("contact.contactInfo.phone.details"),
    color: "text-blue-600",
  },
  {
    icon: Mail,
    title: t("contact.contactInfo.email.title"),
    details: t("contact.contactInfo.email.details"),
    color: "text-green-600",
  },
  {
    icon: MapPin,
    title: t("contact.contactInfo.address.title"),
    details: t("contact.contactInfo.address.details"),
    color: "text-red-600",
  },
  {
    icon: Clock,
    title: t("contact.contactInfo.hours.title"),
    details: t("contact.contactInfo.hours.details"),
    color: "text-purple-600",
  },
];

const branches = [
  {
    name: "Chi nhánh TP.HCM",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0123.456.789",
    manager: "Nguyễn Văn A",
  },
  {
    name: "Chi nhánh Hà Nội",
    address: "456 Đường XYZ, Quận Ba Đình, Hà Nội",
    phone: "0987.654.321",
    manager: "Trần Thị B",
  },
  {
    name: "Chi nhánh Đà Nẵng",
    address: "789 Đường DEF, Quận Hải Châu, Đà Nẵng",
    phone: "0369.852.147",
    manager: "Lê Văn C",
  },
];

const getServices = (t: any) => [
  {
    title: t("contact.services.consultation.title"),
    description: t("contact.services.consultation.description"),
    badge: t("contact.services.consultation.badge"),
  },
  {
    title: t("contact.services.measurement.title"),
    description: t("contact.services.measurement.description"),
    badge: t("contact.services.measurement.badge"),
  },
  {
    title: t("contact.services.installation.title"),
    description: t("contact.services.installation.description"),
    badge: t("contact.services.installation.badge"),
  },
  {
    title: t("contact.services.support.title"),
    description: t("contact.services.support.description"),
    badge: t("contact.services.support.badge"),
  },
];

// Component to handle search params with Suspense
function ContactFormWithParams() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const contactInfo = getContactInfo(t);
  const services = getServices(t);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    message: "",
    product: "",
    productId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get product info from URL params
  useEffect(() => {
    const product = searchParams.get("product");
    const productId = searchParams.get("productId");

    if (product) {
      setFormData((prev) => ({
        ...prev,
        product: decodeURIComponent(product),
        productId: productId || "",
        message: t("contact.form.productMessage", {
          product: decodeURIComponent(product),
        }),
      }));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(t("contact.form.success"));

        // Reset form but keep product info if it exists
        const productInfo = {
          product: formData.product,
          productId: formData.productId,
        };

        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          service: "",
          message: productInfo.product
            ? t("contact.form.productMessage", { product: productInfo.product })
            : "",
          ...productInfo,
        });
      } else {
        alert(result.error || t("contact.form.error"));
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert(t("contact.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Breadcrumb - Desktop only */}
      <div className="bg-gray-50 py-4 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" size="sm" className="p-0">
              <a href="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t("navigation.home")}
              </a>
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-amber-600 font-medium">
              {t("navigation.contact")}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4`}
                  >
                    <info.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                  {/* <div className="space-y-1">
                    {info.details.map((detail: any, idx: any) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("contact.form.title")}
                </CardTitle>
                <CardDescription>
                  {t("contact.form.description")}
                </CardDescription>
                {formData.product && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>{t("contact.form.productInterest")}</strong>{" "}
                      {formData.product}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Hidden fields for product info */}
                  <input
                    type="hidden"
                    name="product"
                    value={formData.product}
                  />
                  <input
                    type="hidden"
                    name="productId"
                    value={formData.productId}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t("contact.form.name")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        placeholder={t("contact.form.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("contact.form.phone")} *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                        placeholder={t("contact.form.phonePlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t("contact.form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder={t("contact.form.emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">{t("contact.form.address")}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder={t("contact.form.addressPlaceholder")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">{t("contact.form.service")}</Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) =>
                        handleInputChange("service", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">
                        {t("contact.form.servicePlaceholder")}
                      </option>
                      <option value="consultation">
                        {t("contact.services.consultation.title")}
                      </option>
                      <option value="measurement">
                        {t("contact.services.measurement.title")}
                      </option>
                      <option value="installation">
                        {t("contact.services.installation.title")}
                      </option>
                      <option value="maintenance">Bảo trì sửa chữa</option>
                      <option value="wholesale">Mua sỉ</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">{t("contact.form.message")}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder={t("contact.form.messagePlaceholder")}
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("contact.form.submit")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Services & Info */}
            <div className="space-y-8">
              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("contact.services.title")}</CardTitle>
                  <CardDescription>
                    {t("contact.services.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{service.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {service.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("contact.quickContact.title")}</CardTitle>
                  <CardDescription>
                    {t("contact.quickContact.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {t("contact.quickContact.hotline")}
                        </p>
                        <p className="text-600">0123.456.789</p>
                      </div>
                      <Button size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        {t("contact.quickContact.callNow")}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {t("contact.quickContact.zalo")}
                        </p>
                        <p className="text-600">0987.654.321</p>
                      </div>
                      <Button size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        {t("contact.quickContact.chatNow")}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {t("contact.contactInfo.email.title")}
                        </p>
                        <p className="text-600">info@silklux.vn</p>
                      </div>
                      <Button size="sm">
                        <Mail className="w-4 h-4 mr-1" />
                        {t("contact.quickContact.sendEmail")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Hệ Thống Chi Nhánh
            </h2>
            <p className="text-xl text-gray-600">
              Chúng tôi có mặt tại các thành phố lớn trên toàn quốc
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <p className="text-sm text-gray-600">{branch.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{branch.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Quản lý: {branch.manager}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                    Liên hệ chi nhánh
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('contact.map.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('contact.map.description')}
            </p>
          </div>

          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Bản đồ Google Maps sẽ được tích hợp tại đây
              </p>
              <p className="text-sm text-gray-500 mt-2">
                123 Đường ABC, Quận 1, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('contact.faq.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('contact.faq.description')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Thời gian bảo hành sản phẩm là bao lâu?
                </h3>
                <p className="text-gray-600">
                  Chúng tôi bảo hành 10 năm cho tất cả sản phẩm gỗ ép tường và
                  cung cấp hỗ trợ kỹ thuật suốt đời.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Chi phí lắp đặt như thế nào?
                </h3>
                <p className="text-gray-600">
                  Chi phí lắp đặt phụ thuộc vào diện tích và độ phức tạp của
                  công trình. Chúng tôi miễn phí lắp đặt cho đơn hàng từ 50m²
                  trở lên.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Có thể xem mẫu trực tiếp không?
                </h3>
                <p className="text-gray-600">
                  Có, bạn có thể ghé thăm showroom của chúng tôi hoặc yêu cầu
                  mang mẫu đến tận nơi để tư vấn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Thời gian giao hàng và lắp đặt?
                </h3>
                <p className="text-gray-600">
                  Thời gian giao hàng từ 3-7 ngày làm việc tùy theo số lượng.
                  Lắp đặt thường hoàn thành trong 1-2 ngày.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// Main component with Suspense wrapper
export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <ContactFormWithParams />
    </Suspense>
  );
}
