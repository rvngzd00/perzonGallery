import { useQuery } from '@tanstack/react-query'
import { fetchOrder, fetchOrders, fetchOrdersByCustomer } from '@/lib/api/orders'
import type { Order, OrderWithItems } from '@/types/order'

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['admin', 'orders'],
    queryFn: fetchOrders,
  })
}

export function useOrder(id: string | undefined) {
  return useQuery<OrderWithItems | null>({
    queryKey: ['admin', 'orders', id],
    queryFn: () => fetchOrder(id as string),
    enabled: !!id,
  })
}

export function useOrdersByCustomer(customerId: string | undefined) {
  return useQuery<Order[]>({
    queryKey: ['admin', 'orders', 'by-customer', customerId],
    queryFn: () => fetchOrdersByCustomer(customerId as string),
    enabled: !!customerId,
  })
}
