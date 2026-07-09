import { apiClient } from '@/lib/api/client'
import type { CartPricingLine } from '@/hooks/useCartPricing'
import type { Customer } from '@/types/customer'
import type { Order, OrderItem, OrderStatus, OrderWithItems } from '@/types/order'

export async function fetchOrders(): Promise<Order[]> {
  const orders = await apiClient.get<Order[]>('orders')
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function fetchOrder(id: string): Promise<OrderWithItems | null> {
  try {
    const [order, items] = await Promise.all([
      apiClient.get<Order>('orders', id),
      apiClient.get<OrderItem[]>('orderItems'),
    ])
    return {
      ...order,
      items: items.filter((item) => item.orderId === id),
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) return null
    throw error
  }
}

export async function fetchOrdersByCustomer(customerId: string): Promise<Order[]> {
  const orders = await fetchOrders()
  return orders.filter((order) => order.customerId === customerId)
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  await apiClient.patch<Order>('orders', id, {
    status,
    updatedAt: new Date().toISOString(),
  })
}

export interface CreateOrderInput {
  customerName?: string
  customerPhone?: string
  lines: CartPricingLine[]
  total: number
}

async function upsertCustomer(name?: string, phone?: string) {
  if (!name && !phone) return null

  const customers = await apiClient.get<Customer[]>('customers')
  const existing = customers.find((customer) => customer.phone === phone)
  if (existing) return existing

  const now = new Date().toISOString()
  return apiClient.post<Customer>('customers', {
    id: crypto.randomUUID(),
    name: name || 'Guest',
    phone: phone || '',
    createdAt: now,
    updatedAt: now,
  })
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const now = new Date().toISOString()
  const customer = await upsertCustomer(input.customerName, input.customerPhone)
  const orderId = crypto.randomUUID()

  await apiClient.post<Order>('orders', {
    id: orderId,
    customerId: customer?.id ?? null,
    customerName: customer?.name,
    customerPhone: customer?.phone,
    status: 'submitted',
    channel: 'whatsapp',
    totalAzn: input.total,
    createdAt: now,
    updatedAt: now,
  })

  await Promise.all(
    input.lines.map((line) =>
      apiClient.post<OrderItem>('orderItems', {
        id: crypto.randomUUID(),
        orderId,
        productId: line.product.id,
        productName: line.product.name,
        brandName: line.product.brand,
        sizeMl: line.item.sizeMl ?? undefined,
        unitPriceAzn: line.unitPrice,
        qty: line.item.qty,
        lineTotalAzn: line.lineTotal,
      }),
    ),
  )

  return orderId
}
