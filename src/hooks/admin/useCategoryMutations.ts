import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, deleteCategory, updateCategory, type CategoryInput } from '@/lib/api/categories'

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['categories'] })
  queryClient.invalidateQueries({ queryKey: ['admin', 'categories-full'] })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Category created')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Omit<CategoryInput, 'id'>> }) =>
      updateCategory(id, input),
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Category updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Category deleted')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
