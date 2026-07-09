import type { OrderStatus } from '@/types/order'

export const STATUS_VARIANT: Record<
  OrderStatus,
  'default' | 'success' | 'warning' | 'destructive'
> = {
  submitted: 'warning',
  confirmed: 'default',
  fulfilled: 'success',
  cancelled: 'destructive',
}

export const ORDER_STATUSES: OrderStatus[] = [
  'submitted',
  'confirmed',
  'fulfilled',
  'cancelled',
]
