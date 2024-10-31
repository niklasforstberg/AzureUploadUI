import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/authService'

export function useUser() {
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: authService.getCurrentUser
  })

  return { user, isLoading, error, refetch }
}
