import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useDashboardStats, useRecentMessages, useRecentOrders } from '@/hooks/admin/useDashboard'
import { STATUS_VARIANT } from '@/pages/admin/orderStatus'

const STAT_LABELS = [
  { key: 'totalProducts', label: 'Total Products' },
  { key: 'totalOrders', label: 'Total Orders' },
  { key: 'totalCustomers', label: 'Total Customers' },
  { key: 'totalContactMessages', label: 'Total Messages' },
  { key: 'totalBrands', label: 'Total Brands' },
  { key: 'totalBranches', label: 'Total Branches' },
] as const

export default function AdminDashboard() {
  const { data: stats, isLoading, isError } = useDashboardStats()
  const { data: recentOrders } = useRecentOrders()
  const { data: recentMessages } = useRecentMessages()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-medium">Dashboard</h1>

      {isError && (
        <p className="text-sm text-destructive">Failed to load statistics.</p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {STAT_LABELS.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-normal text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? '—' : stats?.[key] ?? 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentOrders || recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                          {order.customerName ?? 'Guest'}
                        </Link>
                      </TableCell>
                      <TableCell>{order.totalAzn.toFixed(2)} AZN</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentMessages || recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMessages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <Link to="/admin/messages" className="hover:underline">
                          {msg.name}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-64 truncate whitespace-normal">
                        {msg.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
