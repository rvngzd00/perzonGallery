import { useQuery } from '@tanstack/react-query'
import { fetchCategoriesFull, type CategoryFull } from '@/lib/api/categories'

export function useCategoriesFull() {
  return useQuery<CategoryFull[]>({
    queryKey: ['admin', 'categories-full'],
    queryFn: fetchCategoriesFull,
  })
}
