import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCustomers } from '@/hooks/admin/useCustomers'

export default function AdminCustomers() {
  const { data: customers, isLoading, isError } = useCustomers()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!customers) return []
    const term = search.trim().toLowerCase()
    if (!term) return customers
    return customers.filter(
      (c) => c.name.toLowerCase().includes(term) || c.phone.toLowerCase().includes(term),
    )
  }, [customers, search])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-medium">Customers</h1>

      <Input
        placeholder="Search by name or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load customers.</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No customers found.</p>
      )}

      {filtered.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Link to={`/admin/customers/${customer.id}`} className="hover:underline">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.orderCount ?? 0}</TableCell>
                <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
