import 'dotenv/config'
import { createUploadthing } from 'uploadthing/server'
import { generateUploadButton } from 'uploadthing/client'
import { supabase } from './client.js'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const authHeader = req.headers['authorization'] || req.headers['Authorization']
      if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete:', file.url, 'for user:', metadata.userId)
      return { url: file.url, name: file.name }
    }),

  pdfUploader: f({ pdf: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const authHeader = req.headers['authorization'] || req.headers['Authorization']
      if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete:', file.url, 'for user:', metadata.userId)
      return { url: file.url, name: file.name }
    }),
}

export const UploadButton = generateUploadButton({ url: '/api/uploadthing' })
