import { apiClient } from '@/lib/api/client'
import type { Branch } from '@/types/branch'

export async function fetchBranches(): Promise<Branch[]> {
  return apiClient.get<Branch[]>('branches')
}

export interface BranchInput {
  id: string
  name: string
  addressLine: string
  workingHours: string
  mapUrl?: string
}

export async function createBranch(input: BranchInput): Promise<void> {
  await apiClient.post<Branch>('branches', input)
}

export async function updateBranch(
  id: string,
  input: Partial<Omit<BranchInput, 'id'>>,
): Promise<void> {
  await apiClient.patch<Branch>('branches', id, input)
}

export async function deleteBranch(id: string): Promise<void> {
  await apiClient.delete('branches', id)
}
