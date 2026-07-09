import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardStats,
  fetchRecentMessages,
  fetchRecentOrders,
  type DashboardStats,
} from '@/lib/api/dashboard'
import type { Order } from '@/types/order'
import type { ContactMessage } from '@/lib/api/contactMessages'

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })
}

export function useRecentOrders() {
  return useQuery<Order[]>({
    queryKey: ['admin', 'dashboard', 'recent-orders'],
    queryFn: () => fetchRecentOrders(5),
  })
}

export function useRecentMessages() {
  return useQuery<ContactMessage[]>({
    queryKey: ['admin', 'dashboard', 'recent-messages'],
    queryFn: () => fetchRecentMessages(5),
  })
}
