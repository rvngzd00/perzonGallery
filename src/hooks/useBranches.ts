import { useQuery } from '@tanstack/react-query'
import { fetchBranches } from '@/lib/api/branches'
import { BRANCHES } from '@/constants/branches'
import type { Branch } from '@/types/branch'

export function useBranches() {
  return useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    initialData: BRANCHES,
    initialDataUpdatedAt: 0,
  })
}
