import { apiClient } from '@/lib/api/client'
import type { Brand } from '@/types/brand'

export async function fetchBrands(): Promise<Brand[]> {
  return apiClient.get<Brand[]>('brands')
}

export interface BrandInput {
  id: string
  name: string
  origin: string
  tagline?: string
  flagshipProductId?: string
}

export async function createBrand(input: BrandInput): Promise<void> {
  await apiClient.post<Brand>('brands', input)
}

export async function updateBrand(
  id: string,
  input: Partial<Omit<BrandInput, 'id'>>,
): Promise<void> {
  await apiClient.patch<Brand>('brands', id, input)
}

export async function deleteBrand(id: string): Promise<void> {
  await apiClient.delete('brands', id)
}
