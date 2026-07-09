import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useOrders } from '@/hooks/admin/useOrders'
import { ORDER_STATUSES, STATUS_VARIANT } from '@/pages/admin/orderStatus'
import type { OrderStatus } from '@/types/order'

type SortKey = 'date' | 'total'

export default function AdminOrders() {
  const { data: orders, isLoading, isError } = useOrders()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')

  const filtered = useMemo(() => {
    if (!orders) return []
    const term = search.trim().toLowerCase()
    return orders
      .filter((o) => (statusFilter === 'all' ? true : o.status === statusFilter))
      .filter((o) =>
        term
          ? (o.customerName ?? 'guest').toLowerCase().includes(term) ||
            o.id.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) =>
        sortKey === 'total'
          ? b.totalAzn - a.totalAzn
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [orders, search, statusFilter, sortKey])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-medium">Orders</h1>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by customer or order id…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Newest first</SelectItem>
            <SelectItem value="total">Highest total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load orders.</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders found.</p>
      )}

      {filtered.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link to={`/admin/orders/${order.id}`} className="font-mono text-xs hover:underline">
                    {order.id.slice(0, 8)}
                  </Link>
                </TableCell>
                <TableCell>{order.customerName ?? 'Guest'}</TableCell>
                <TableCell>{order.totalAzn.toFixed(2)} AZN</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
