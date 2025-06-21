import { FileStorage } from '../utils/file-storage'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { processorId, filename } = body

    if (!processorId || !filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Processor ID and filename are required'
      })
    }

    // Validate processor ID
    if (!FileStorage.validateProcessorId(processorId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid processor ID format'
      })
    }

    const fileStorage = new FileStorage()
    
    // Create processed file in incoming directory
    const success = await fileStorage.moveFileToIncoming(processorId, filename)
    
    if (!success) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found in outgoing directory'
      })
    }

    return {
      message: 'File processed successfully and added to incoming directory',
      processorId,
      filename
    }

  } catch (error) {
    console.error('Process file error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to process file'
    })
  }
}) 