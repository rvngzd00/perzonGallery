import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBranch, deleteBranch, updateBranch, type BranchInput } from '@/lib/api/branches'

export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BranchInput) => createBranch(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch created')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Omit<BranchInput, 'id'>> }) =>
      updateBranch(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch deleted')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
