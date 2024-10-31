import { useQuery } from '@tanstack/react-query'
import { fileService } from '../services/fileService'

export function useFiles() {
  const {
    data: files = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['my-files'],
    queryFn: fileService.getMyFiles
  })

  return { files, isLoading, error }
}
