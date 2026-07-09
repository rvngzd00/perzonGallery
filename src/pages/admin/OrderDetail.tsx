import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrder } from '@/hooks/admin/useOrders'
import { useUpdateOrderStatus } from '@/hooks/admin/useOrderMutations'
import { ORDER_STATUSES } from '@/pages/admin/orderStatus'
import type { OrderStatus } from '@/types/order'

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError } = useOrder(id)
  const updateStatus = useUpdateOrderStatus()

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/orders" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Orders
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load order.</p>}
      {!isLoading && !order && <p className="text-sm text-muted-foreground">Order not found.</p>}

      {order && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-2xl font-medium">Order {order.id.slice(0, 8)}</h1>
            <Select
              value={order.status}
              onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v as OrderStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {order.customerName ? (
                  <>
                    <p>{order.customerName}</p>
                    <p className="text-muted-foreground">{order.customerPhone}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Guest checkout (no customer info)</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-xl font-semibold">{order.totalAzn.toFixed(2)} AZN</p>
                <p className="text-muted-foreground">via {order.channel}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Placed</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit price</TableHead>
                    <TableHead>Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.brandName ?? '—'}</TableCell>
                      <TableCell>{item.sizeMl ? `${item.sizeMl} ml` : '—'}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.unitPriceAzn.toFixed(2)} AZN</TableCell>
                      <TableCell>{item.lineTotalAzn.toFixed(2)} AZN</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
