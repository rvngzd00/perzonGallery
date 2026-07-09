import { apiClient } from '@/lib/api/client'
import type { Order } from '@/types/order'
import { fetchOrders } from '@/lib/api/orders'
import { fetchContactMessages, type ContactMessage } from '@/lib/api/contactMessages'

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalContactMessages: number
  totalBrands: number
  totalBranches: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [products, orders, customers, contactMessages, brands, branches] =
    await Promise.all([
      apiClient.get<unknown[]>('products'),
      apiClient.get<unknown[]>('orders'),
      apiClient.get<unknown[]>('customers'),
      apiClient.get<unknown[]>('contactMessages'),
      apiClient.get<unknown[]>('brands'),
      apiClient.get<unknown[]>('branches'),
    ])

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalContactMessages: contactMessages.length,
    totalBrands: brands.length,
    totalBranches: branches.length,
  }
}

export async function fetchRecentOrders(limit = 5): Promise<Order[]> {
  const orders = await fetchOrders()
  return orders.slice(0, limit)
}

export async function fetchRecentMessages(limit = 5): Promise<ContactMessage[]> {
  const messages = await fetchContactMessages()
  return messages.slice(0, limit)
}
