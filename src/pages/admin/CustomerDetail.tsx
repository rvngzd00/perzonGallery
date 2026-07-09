import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useCustomer } from '@/hooks/admin/useCustomers'
import { useOrdersByCustomer } from '@/hooks/admin/useOrders'
import { STATUS_VARIANT } from '@/pages/admin/orderStatus'

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: customer, isLoading, isError } = useCustomer(id)
  const { data: orders } = useOrdersByCustomer(id)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/admin/customers"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Customers
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load customer.</p>}
      {!isLoading && !customer && <p className="text-sm text-muted-foreground">Customer not found.</p>}

      {customer && (
        <>
          <h1 className="font-heading text-2xl font-medium">{customer.name}</h1>

          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{customer.phone}</p>
              <p className="text-muted-foreground">
                Joined {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {!orders || orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link to={`/admin/orders/${order.id}`} className="font-mono text-xs hover:underline">
                            {order.id.slice(0, 8)}
                          </Link>
                        </TableCell>
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
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
