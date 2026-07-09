export type OrderStatus = 'submitted' | 'confirmed' | 'cancelled' | 'fulfilled'

export interface OrderItem {
  id: string
  orderId: string
  productId: string | null
  productName: string
  brandName?: string
  sizeMl?: number
  unitPriceAzn: number
  qty: number
  lineTotalAzn: number
}

export interface Order {
  id: string
  customerId: string | null
  customerName?: string
  customerPhone?: string
  status: OrderStatus
  channel: string
  totalAzn: number
  createdAt: string
  updatedAt: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}
