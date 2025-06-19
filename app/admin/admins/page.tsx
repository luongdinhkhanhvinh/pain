"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminLayout from "@/components/admin/admin-layout";
import { Plus, Edit, Trash2, Shield, User, Crown } from "lucide-react";
import type { Admin } from "@/shared/types";
import { useAuth } from "@/hooks/use-auth";

const roleLabels = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
};

const roleIcons = {
  super_admin: Crown,
  admin: Shield,
  editor: User,
};

const roleColors = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  editor: "bg-green-100 text-green-800",
};

export default function AdminsPage() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "editor" as Admin["role"],
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");
      const url = editingAdmin
        ? `/api/admins/${editingAdmin.id}`
        : "/api/admins";
      const method = editingAdmin ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAdmins();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save admin:", error);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      password: "",
      role: admin.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa admin này?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchAdmins();
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      fullName: "",
      password: "",
      role: "editor",
    });
    setEditingAdmin(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const getRoleBadge = (role: Admin["role"]) => {
    const Icon = roleIcons[role];
    return (
      <Badge className={roleColors[role]}>
        <Icon className="w-3 h-3 mr-1" />
        {roleLabels[role]}
      </Badge>
    );
  };

  const canManageAdmin = (admin: Admin) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;
    if (currentUser.role === "admin" && admin.role === "editor") return true;
    return false;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Admin</h1>
            <p className="text-gray-600">
              Quản lý tài khoản quản trị viên hệ thống
            </p>
          </div>
          {currentUser?.role === "super_admin" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingAdmin ? "Chỉnh Sửa Admin" : "Thêm Admin Mới"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAdmin
                      ? "Cập nhật thông tin admin"
                      : "Tạo tài khoản admin mới cho hệ thống"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Tên đăng nhập
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">
                        Họ tên
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        {editingAdmin ? "Mật khẩu mới" : "Mật khẩu"}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="col-span-3"
                        required={!editingAdmin}
                        placeholder={
                          editingAdmin ? "Để trống nếu không đổi" : ""
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Vai trò
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: Admin["role"]) =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          {currentUser?.role === "super_admin" && (
                            <SelectItem value="super_admin">
                              Super Admin
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {editingAdmin ? "Cập nhật" : "Tạo mới"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Admin</CardTitle>
            <CardDescription>
              Tổng cộng {admins.length} tài khoản quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={admin.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {admin.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.fullName}</div>
                          <div className="text-sm text-gray-500">
                            @{admin.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>
                      <Badge variant={admin.isActive ? "default" : "secondary"}>
                        {admin.isActive ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chưa đăng nhập"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {canManageAdmin(admin) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(admin)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {admin.id !== currentUser?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(admin.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
