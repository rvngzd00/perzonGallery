import { useQuery } from '@tanstack/react-query'
import { fetchBrands } from '@/lib/api/brands'
import { BRANDS } from '@/constants/brands'
import type { Brand } from '@/types/brand'

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    initialData: BRANDS,
    initialDataUpdatedAt: 0,
  })
}
