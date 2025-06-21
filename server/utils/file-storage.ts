// server/utils/file-storage.ts
import { mkdir, readdir, readFile, writeFile, stat, unlink, rename } from 'fs/promises'
import { resolve, join } from 'path'
import { existsSync } from 'fs'

// Configuration for file storage
export const STORAGE_BASE_PATH = process.env.STORAGE_PATH || './storage'
export const ALLOWED_EXTENSIONS = ['.txt']

export interface FileInfo {
  filename: string
  content: string
  size: number
  modified: Date
  path: string
}

export interface OutgoingFileInfo {
  filename: string
  size: number
  modified: Date
  path: string
}

export class FileStorage {
  private basePath: string

  constructor(basePath: string = STORAGE_BASE_PATH) {
    this.basePath = basePath
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  async ensureDirectory(processorId: string, type: 'incoming' | 'outgoing'): Promise<string> {
    const dirPath = resolve(this.basePath, processorId, type)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }
    return dirPath
  }

  /**
   * Save file to outgoing directory
   */
  async saveFile(processorId: string, filename: string, content: Buffer | string): Promise<string> {
    const outgoingDir = await this.ensureDirectory(processorId, 'outgoing')
    const filePath = join(outgoingDir, filename)
    await writeFile(filePath, content)
    return filePath
  }

  /**
   * Read all txt files from incoming directory
   */
  async readIncomingFiles(processorId: string): Promise<FileInfo[]> {
    const incomingDir = await this.ensureDirectory(processorId, 'incoming')
    
    if (!existsSync(incomingDir)) {
      return []
    }

    const files = await readdir(incomingDir)
    const txtFiles = files.filter(file => file.toLowerCase().endsWith('.txt'))

    const fileContents = await Promise.all(
      txtFiles.map(async (filename) => {
        const filePath = join(incomingDir, filename)
        const fileStats = await stat(filePath)
        const content = await readFile(filePath, 'utf-8')
        
        return {
          filename,
          content,
          size: fileStats.size,
          modified: fileStats.mtime,
          path: filePath
        }
      })
    )

    return fileContents
  }

  /**
   * Read all txt files from outgoing directory (without content)
   */
  async readOutgoingFiles(processorId: string): Promise<OutgoingFileInfo[]> {
    const outgoingDir = await this.ensureDirectory(processorId, 'outgoing')
    
    if (!existsSync(outgoingDir)) {
      return []
    }

    const files = await readdir(outgoingDir)
    const txtFiles = files.filter(file => file.toLowerCase().endsWith('.txt'))

    const fileInfos = await Promise.all(
      txtFiles.map(async (filename) => {
        const filePath = join(outgoingDir, filename)
        const fileStats = await stat(filePath)
        
        return {
          filename,
          size: fileStats.size,
          modified: fileStats.mtime,
          path: filePath
        }
      })
    )

    return fileInfos
  }

  /**
   * Move file from outgoing to incoming directory
   */
  async moveFileToIncoming(processorId: string, filename: string): Promise<boolean> {
    const outgoingDir = resolve(this.basePath, processorId, 'outgoing')
    const incomingDir = await this.ensureDirectory(processorId, 'incoming')
    
    const outgoingPath = join(outgoingDir, filename)
    const newFilename = `processed-${filename}`
    const incomingPath = join(incomingDir, newFilename)
    
    if (!existsSync(outgoingPath)) {
      return false
    }

    // Read the original file content
    const originalContent = await readFile(outgoingPath, 'utf-8')
    
    // Create new content with "proceeded file" line
    const newContent = originalContent + '\nproceeded file'
    
    // Write the new file to incoming directory with new name
    await writeFile(incomingPath, newContent)
    
    return true
  }

  /**
   * Delete a file from incoming directory
   */
  async deleteIncomingFile(processorId: string, filename: string): Promise<boolean> {
    const incomingDir = resolve(this.basePath, processorId, 'incoming')
    const filePath = join(incomingDir, filename)
    
    if (existsSync(filePath)) {
      await unlink(filePath)
      return true
    }
    return false
  }

  /**
   * Validate processor ID format
   */
  static validateProcessorId(processorId: string): boolean {
    return /^[a-zA-Z0-9-]+$/.test(processorId)
  }

  /**
   * Validate file extension
   */
  static validateFileExtension(filename: string): boolean {
    if (!filename) return false
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
    return ALLOWED_EXTENSIONS.includes(ext)
  }
} 