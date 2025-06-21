import { FileStorage } from '../utils/file-storage'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const processorId = query.processorId as string
    const fileStorage = new FileStorage()

    if (!processorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Processor ID is required'
      })
    }

    // Validate processor ID
    if (!FileStorage.validateProcessorId(processorId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid processor ID format'
      })
    }

    // Read all files from outgoing directory
    const files = await fileStorage.readOutgoingFiles(processorId)

    return {
      processorId,
      files,
      count: files.length
    }

  } catch (error) {
    console.error('Read outgoing files error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to read outgoing files'
    })
  }
}) 