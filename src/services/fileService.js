import { api } from './api'

export const fileService = {
  getMyFiles: async () => {
    const { data } = await api.get('/storage/my-files')
    return data
  },
  
  uploadFile: async (formData) => {
    try {
      const { data } = await api.post('/Storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    } catch (error) {
      if (error.response?.status === 409) {
        const message = error.response.data || 'A file with this name already exists'
        throw new Error(message)
      }
      console.log('Upload error details:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      })
      throw error
    }
  },
  
  deleteFile: async (blobName) => {
    const { data } = await api.delete(`/storage/files/${blobName}`)
    return data
  },
  
  getAuditFiles: async (cleanup = false) => {
    const { data } = await api.get(`/storage/audit-files${cleanup ? '?cleanup=true' : ''}`)
    return data
  }
}
