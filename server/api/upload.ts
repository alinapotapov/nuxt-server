import formidable from 'formidable'
import { IncomingMessage } from 'http'
import { readFile } from 'fs/promises'
import { FileStorage } from '../utils/file-storage'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  const form = formidable()
  const fileStorage = new FileStorage()

  try {
    const [fields, files] = await form.parse(event.node.req as IncomingMessage)
    const uploadedFile = files.file?.[0]

    if (!uploadedFile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // Validate file type (only txt files allowed)
    if (!uploadedFile.originalFilename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file: no filename'
      })
    }

    if (!FileStorage.validateFileExtension(uploadedFile.originalFilename)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only .txt files are allowed'
      })
    }

    // Get processor ID from form fields or use default
    const processorId = fields.processorId?.[0] || 'default'
    
    // Validate processor ID
    if (!FileStorage.validateProcessorId(processorId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid processor ID format'
      })
    }

    // Read uploaded file (allow empty files)
    const data = await readFile(uploadedFile.filepath)
    const filename = uploadedFile.originalFilename || 'uploaded-file.txt'
    
    // Save file to outgoing directory
    const filePath = await fileStorage.saveFile(processorId, filename, data)

    return { 
      message: 'File uploaded successfully',
      processorId,
      filename,
      path: filePath
    }

  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Upload failed'
    })
  }
}) 