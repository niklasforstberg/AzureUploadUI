import { api } from './api'

export const fileService = {
  getMyFiles: async () => {
    const { data } = await api.get('/storage/my-files')
    return data
  },
  
  uploadFile: async (formData) => {
    const { data } = await api.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return data
  },
  
  deleteFile: async (fileName) => {
    const { data } = await api.delete(`/storage/files/${fileName}`)
    return data
  },
  
  getAuditFiles: async (cleanup = false) => {
    const { data } = await api.get(`/storage/audit-files${cleanup ? '?cleanup=true' : ''}`)
    return data
  }
}
