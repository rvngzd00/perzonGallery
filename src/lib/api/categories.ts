import { apiClient } from '@/lib/api/client'
import type { ProductCategory } from '@/types/product'

export async function fetchCategories(): Promise<ProductCategory[]> {
  const categories = await fetchCategoriesFull()
  return categories.map((row) => row.id)
}

export interface CategoryFull {
  id: ProductCategory
  name: string
  sortOrder: number
}

export async function fetchCategoriesFull(): Promise<CategoryFull[]> {
  const categories = await apiClient.get<CategoryFull[]>('categories')
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
}

export interface CategoryInput {
  id: ProductCategory
  name: string
  sortOrder?: number
}

export async function createCategory(input: CategoryInput): Promise<void> {
  await apiClient.post<CategoryFull>('categories', {
    ...input,
    sortOrder: input.sortOrder ?? 0,
  })
}

export async function updateCategory(
  id: string,
  input: Partial<Omit<CategoryInput, 'id'>>,
): Promise<void> {
  await apiClient.patch<CategoryFull>('categories', id, input)
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete('categories', id)
}
