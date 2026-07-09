import { apiClient } from '@/lib/api/client'
import type { Customer } from '@/types/customer'
import type { Order } from '@/types/order'

export async function fetchCustomers(): Promise<Customer[]> {
  const [customers, orders] = await Promise.all([
    apiClient.get<Customer[]>('customers'),
    apiClient.get<Order[]>('orders'),
  ])
  return [...customers]
    .map((customer) => ({
      ...customer,
      orderCount: orders.filter((order) => order.customerId === customer.id).length,
    }))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export async function fetchCustomer(id: string): Promise<Customer | null> {
  try {
    return await apiClient.get<Customer>('customers', id)
  } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) return null
    throw error
  }
}
