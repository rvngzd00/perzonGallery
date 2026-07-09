import { useQuery } from '@tanstack/react-query'
import { fetchCustomer, fetchCustomers } from '@/lib/api/customers'
import type { Customer } from '@/types/customer'

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['admin', 'customers'],
    queryFn: fetchCustomers,
  })
}

export function useCustomer(id: string | undefined) {
  return useQuery<Customer | null>({
    queryKey: ['admin', 'customers', id],
    queryFn: () => fetchCustomer(id as string),
    enabled: !!id,
  })
}
