"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Phone, Mail, Calendar, Search, Download, UserPlus } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/lib/i18n/context"

interface Contact {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  productName: string | null
  message: string | null
  status: "pending" | "contacted" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export default function AdminContactsPage() {
  const { t } = useTranslation()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)
  const [convertFormData, setConvertFormData] = useState({
    customerType: "individual",
    company: "",
    taxCode: "",
    notes: "",
  })

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact')
      const result = await response.json()

      if (result.success) {
        setContacts(result.data.contactRequests)
      } else {
        console.error('Failed to fetch contacts:', result.error)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load contacts on component mount
  useEffect(() => {
    fetchContacts()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">{t('admin.contacts.statusPending')}</Badge>
      case "contacted":
        return <Badge className="bg-yellow-100 text-yellow-800">{t('admin.contacts.statusContacted')}</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">{t('admin.contacts.statusCompleted')}</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">{t('admin.contacts.statusCancelled')}</Badge>
      default:
        return <Badge variant="secondary">{t('admin.contacts.statusUnknown')}</Badge>
    }
  }

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setContacts(contacts.map((contact) =>
          contact.id === contactId ? { ...contact, status: newStatus as any } : contact
        ))
      } else {
        console.error('Failed to update contact status')
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.productName && contact.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const handleConvertToCustomer = async (contactId: string) => {
    try {
      const response = await fetch("/api/contacts/convert-to-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId,
          ...convertFormData,
        }),
      })

      if (response.ok) {
        // Update contact status to completed
        setContacts(
          contacts.map((contact) => (contact.id === contactId ? { ...contact, status: "completed" } : contact)),
        )
        setIsConvertDialogOpen(false)
        setConvertFormData({
          customerType: "individual",
          company: "",
          taxCode: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error converting to customer:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.contacts.title')}</h1>
            <p className="text-gray-600">{t('admin.contacts.description')}</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('admin.contacts.exportExcel')}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder={t('admin.contacts.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">{t('admin.contacts.allStatuses')}</option>
                <option value="pending">{t('admin.contacts.statusPending')}</option>
                <option value="contacted">{t('admin.contacts.statusContacted')}</option>
                <option value="completed">{t('admin.contacts.statusCompleted')}</option>
                <option value="cancelled">{t('admin.contacts.statusCancelled')}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Liên Hệ ({loading ? '...' : filteredContacts.length})</CardTitle>
            <CardDescription>Quản lý các yêu cầu tư vấn từ khách hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.contacts.customer')}</TableHead>
                  <TableHead>{t('admin.contacts.contact')}</TableHead>
                  <TableHead>{t('admin.contacts.product')}</TableHead>
                  <TableHead>{t('admin.contacts.status')}</TableHead>
                  <TableHead>{t('admin.contacts.createdDate')}</TableHead>
                  <TableHead>{t('admin.contacts.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mr-2"></div>
                        {t('admin.contacts.loading')}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {t('admin.contacts.noContacts')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.address || t('admin.contacts.noAddress')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.phone}
                          </div>
                          {contact.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{contact.productName || t('admin.contacts.generalConsultation')}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t('admin.contacts.detailTitle')}</DialogTitle>
                              <DialogDescription>{t('admin.contacts.detailDescription')}</DialogDescription>
                            </DialogHeader>
                            {selectedContact && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">{t('admin.contacts.name')}</label>
                                    <p className="text-sm text-gray-600">{selectedContact.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">{t('admin.contacts.phone')}</label>
                                    <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">{t('admin.contacts.email')}</label>
                                    <p className="text-sm text-gray-600">{selectedContact.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">{t('admin.contacts.interestedProduct')}</label>
                                    <p className="text-sm text-gray-600">{selectedContact.productName || t('admin.contacts.generalConsultation')}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">{t('admin.contacts.address')}</label>
                                  <p className="text-sm text-gray-600">{selectedContact.address}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">{t('admin.contacts.message')}</label>
                                  <p className="text-sm text-gray-600">{selectedContact.message}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <label className="text-sm font-medium">{t('admin.contacts.updateStatus')}:</label>
                                  <select
                                    value={selectedContact.status}
                                    onChange={(e) => updateContactStatus(selectedContact.id, e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                                  >
                                    <option value="pending">{t('admin.contacts.statusPending')}</option>
                                    <option value="contacted">{t('admin.contacts.statusContacted')}</option>
                                    <option value="completed">{t('admin.contacts.statusCompleted')}</option>
                                    <option value="cancelled">{t('admin.contacts.statusCancelled')}</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact)
                            setIsConvertDialogOpen(true)
                          }}
                          className="text-green-600 hover:text-green-700"
                          disabled={contact.status === "completed"}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <select
                          value={contact.status}
                          onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="pending">{t('admin.contacts.statusPending')}</option>
                          <option value="contacted">{t('admin.contacts.statusContacted')}</option>
                          <option value="completed">{t('admin.contacts.statusCompleted')}</option>
                          <option value="cancelled">{t('admin.contacts.statusCancelled')}</option>
                        </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Convert to Customer Dialog */}
        <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('admin.contacts.convertTitle')}</DialogTitle>
              <DialogDescription>
                {t('admin.contacts.convertDescription', { name: selectedContact?.name || '' })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="convert-customerType">{t('admin.contacts.customerType')}</Label>
                  <Select
                    value={convertFormData.customerType}
                    onValueChange={(value) => setConvertFormData({ ...convertFormData, customerType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">{t('admin.contacts.typeIndividual')}</SelectItem>
                      <SelectItem value="business">{t('admin.contacts.typeBusiness')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {convertFormData.customerType === "business" && (
                  <>
                    <div>
                      <Label htmlFor="convert-company">{t('admin.contacts.company')}</Label>
                      <Input
                        id="convert-company"
                        value={convertFormData.company}
                        onChange={(e) => setConvertFormData({ ...convertFormData, company: e.target.value })}
                        placeholder={t('admin.contacts.companyPlaceholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="convert-taxCode">{t('admin.contacts.taxCode')}</Label>
                      <Input
                        id="convert-taxCode"
                        value={convertFormData.taxCode}
                        onChange={(e) => setConvertFormData({ ...convertFormData, taxCode: e.target.value })}
                        placeholder={t('admin.contacts.taxCodePlaceholder')}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <Label htmlFor="convert-notes">{t('admin.contacts.notes')}</Label>
                <Textarea
                  id="convert-notes"
                  value={convertFormData.notes}
                  onChange={(e) => setConvertFormData({ ...convertFormData, notes: e.target.value })}
                  placeholder={t('admin.contacts.notesPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
                {t('admin.contacts.cancel')}
              </Button>
              <Button onClick={() => handleConvertToCustomer(selectedContact?.id!)}>
                {t('admin.contacts.convert')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
