import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBrand, deleteBrand, updateBrand, type BrandInput } from '@/lib/api/brands'

export function useCreateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BrandInput) => createBrand(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand created')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Omit<BrandInput, 'id'>> }) =>
      updateBrand(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand deleted')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
