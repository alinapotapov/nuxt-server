<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">File Management System</h1>
    
    <!-- Upload Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Upload File</h2>
      
      <form @submit.prevent="uploadFile" class="space-y-4">
        <div>
          <label for="dataProcessorUpload" class="block text-sm font-medium text-gray-700 mb-2">
            Data Processor
          </label>
          <select
            id="dataProcessorUpload"
            v-model="selectedProcessorId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option disabled value="">Please select a processor</option>
            <option v-for="p in participants" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="fileInput" class="block text-sm font-medium text-gray-700 mb-2">
            Select .txt File
          </label>
          <input
            id="fileInput"
            ref="fileInput"
            type="file"
            accept=".txt"
            @change="handleFileSelect"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <button
          type="submit"
          :disabled="uploading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="uploading">Uploading...</span>
          <span v-else>Upload File</span>
        </button>
      </form>
      
      <!-- Upload Status -->
      <div v-if="uploadStatus" class="mt-4 p-3 rounded-md" :class="uploadStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        {{ uploadStatus.message }}
      </div>
    </div>
    
    <!-- Outgoing Files Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Outgoing Files (Ready to Process)</h2>
      
      <div class="mb-4">
        <label for="dataProcessorOutgoing" class="block text-sm font-medium text-gray-700 mb-2">
          Data Processor
        </label>
        <select
          id="dataProcessorOutgoing"
          v-model="selectedProcessorId"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option disabled value="">Please select a processor</option>
          <option v-for="p in participants" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>
      
      <div v-if="loadingOutgoing" class="text-center py-4">
        <svg class="animate-spin mx-auto h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">Loading files...</p>
      </div>
      
      <!-- Outgoing Files List -->
      <div v-else-if="outgoingFiles.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">
          Files ready for processing ({{ outgoingFiles.length }})
        </h3>
        
        <div v-for="file in outgoingFiles" :key="file.filename" class="border border-gray-200 rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-medium text-gray-800">{{ file.filename }}</h4>
            <span class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</span>
          </div>
          
          <div class="text-sm text-gray-600 mb-3">
            Modified: {{ formatDate(file.modified) }}
          </div>
          
          <button
            @click="processFile(file)"
            :disabled="processingFiles.includes(file.filename)"
            class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="processingFiles.includes(file.filename)">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Process File</span>
          </button>
        </div>
      </div>
      
      <!-- No Outgoing Files Message -->
      <div v-else-if="hasSearchedOutgoing" class="text-center py-8 text-gray-500">
        <div class="text-6xl mb-4">📤</div>
        <p>No .txt files found for this data processor.</p>
      </div>
      
      <!-- Outgoing Status -->
      <div v-if="outgoingStatus" class="mt-4 p-3 rounded-md" :class="outgoingStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        {{ outgoingStatus.message }}
      </div>
    </div>
    
    <!-- Read Files Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Processed Files (Incoming)</h2>
      
      <div class="mb-4">
        <label for="dataProcessorRead" class="block text-sm font-medium text-gray-700 mb-2">
          Data Processor
        </label>
        <select
          id="dataProcessorRead"
          v-model="selectedProcessorId"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option disabled value="">Please select a processor</option>
          <option v-for="p in participants" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>
      
      <div v-if="reading" class="text-center py-4">
        <svg class="animate-spin mx-auto h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">Loading processed files...</p>
      </div>
      
      <!-- Files List -->
      <div v-else-if="files.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">
          Processed files ({{ files.length }})
        </h3>
        
        <div v-for="file in files" :key="file.filename" class="border border-gray-200 rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-medium text-gray-800">{{ file.filename }}</h4>
            <span class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</span>
          </div>
          
          <div class="text-sm text-gray-600 mb-3">
            Modified: {{ formatDate(file.modified) }}
          </div>
          
          <div class="bg-gray-50 rounded p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Content Preview</span>
              <button
                @click="toggleFileContent(file.filename)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                {{ expandedFiles.includes(file.filename) ? 'Hide' : 'Show' }}
              </button>
            </div>
            
            <div v-if="expandedFiles.includes(file.filename)" class="bg-white border rounded p-3 max-h-40 overflow-y-auto">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ file.content }}</pre>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Files Message -->
      <div v-else-if="hasSearched" class="text-center py-8 text-gray-500">
        <div class="text-6xl mb-4">📁</div>
        <p>No .txt files found for this data processor.</p>
      </div>
      
      <!-- Read Status -->
      <div v-if="readStatus" class="mt-4 p-3 rounded-md" :class="readStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        {{ readStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const fileInput = ref(null)
const uploading = ref(false)
const reading = ref(false)
const loadingOutgoing = ref(false)
const hasSearched = ref(false)
const hasSearchedOutgoing = ref(false)
const expandedFiles = ref([])
const processingFiles = ref([])
const participants = ref([])

const selectedProcessorId = ref('')
const uploadForm = ref({
  file: null
})

const uploadStatus = ref(null)
const outgoingStatus = ref(null)
const readStatus = ref(null)
const files = ref([])
const outgoingFiles = ref([])

onMounted(async () => {
  try {
    const data = await $fetch('/api/participants')
    participants.value = data
  } catch (error) {
    console.error('Failed to load participants', error)
    uploadStatus.value = { message: 'Could not load data processors.', type: 'error' }
  }
})

// Watch for changes to the selected processor and load files for both sections automatically
watch(selectedProcessorId, (newId) => {
  if (newId) {
    loadOutgoingFiles()
    readFiles()
  }
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'text/plain') {
    uploadForm.value.file = file
  } else if (file && !file.type.includes('text/plain')) {
    alert('Please select a .txt file')
    event.target.value = ''
  } else {
    uploadForm.value.file = file
  }
}

const uploadFile = async () => {
  if (!uploadForm.value.file) {
    showUploadStatus('Please select a file', 'error')
    return
  }

  uploading.value = true
  uploadStatus.value = null

  try {
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('processorId', selectedProcessorId.value)

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    showUploadStatus(`File uploaded successfully! Saved to: ${response.path}`, 'success')
    
    // Reset form
    uploadForm.value.file = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // Auto-load outgoing files for the same processor
    await loadOutgoingFiles()
    
  } catch (error) {
    console.error('Upload error:', error)
    const message = error.data?.statusMessage || 'Upload failed. Please try again.'
    showUploadStatus(message, 'error')
  } finally {
    uploading.value = false
  }
}

const loadOutgoingFiles = async () => {
  if (!selectedProcessorId.value) {
    showOutgoingStatus('Please select a Data Processor', 'error')
    return
  }

  loadingOutgoing.value = true
  outgoingStatus.value = null
  hasSearchedOutgoing.value = true
  outgoingFiles.value = [] // Clear previous results

  try {
    const response = await $fetch(`/api/outgoing-files?processorId=${encodeURIComponent(selectedProcessorId.value)}`)
    
    outgoingFiles.value = response.files
    
    if (response.files.length === 0) {
      // Don't show a status message for an empty list unless it's a manual search
    } else {
      // Optional: show count on success
    }
    
  } catch (error) {
    console.error('Load outgoing error:', error)
    const message = error.data?.statusMessage || 'Failed to load outgoing files. Please try again.'
    showOutgoingStatus(message, 'error')
    outgoingFiles.value = []
  } finally {
    loadingOutgoing.value = false
  }
}

const processFile = async (file) => {
  processingFiles.value.push(file.filename)
  outgoingStatus.value = null

  try {
    const response = await $fetch('/api/process-file', {
      method: 'POST',
      body: {
        processorId: selectedProcessorId.value,
        filename: file.filename
      }
    })

    showOutgoingStatus(`File "${file.filename}" processed successfully!`, 'success')
    
    // Remove the file from the outgoing list and reload processed files
    await Promise.all([loadOutgoingFiles(), readFiles()])
    
  } catch (error) {
    console.error('Process error:', error)
    const message = error.data?.statusMessage || 'Failed to process file. Please try again.'
    showOutgoingStatus(message, 'error')
  } finally {
    processingFiles.value = processingFiles.value.filter(f => f !== file.filename)
  }
}

const readFiles = async () => {
  if (!selectedProcessorId.value) {
    showReadStatus('Please select a Data Processor', 'error')
    return
  }

  reading.value = true
  readStatus.value = null
  hasSearched.value = true
  files.value = [] // Clear previous results

  try {
    const response = await $fetch(`/api/read-files?processorId=${encodeURIComponent(selectedProcessorId.value)}`)
    
    files.value = response.files
    expandedFiles.value = [] // Reset expanded files
    
    if (response.files.length === 0) {
      // Silence success message for empty lists to avoid clutter
    } else {
      // Optional: show status on success
    }
    
  } catch (error) {
    console.error('Read error:', error)
    const message = error.data?.statusMessage || 'Failed to read files. Please try again.'
    showReadStatus(message, 'error')
    files.value = []
  } finally {
    reading.value = false
  }
}

const toggleFileContent = (filename) => {
  const index = expandedFiles.value.indexOf(filename)
  if (index > -1) {
    expandedFiles.value.splice(index, 1)
  } else {
    expandedFiles.value.push(filename)
  }
}

const showUploadStatus = (message, type) => {
  uploadStatus.value = { message, type }
  setTimeout(() => {
    uploadStatus.value = null
  }, 5000)
}

const showOutgoingStatus = (message, type) => {
  outgoingStatus.value = { message, type }
  setTimeout(() => {
    outgoingStatus.value = null
  }, 5000)
}

const showReadStatus = (message, type) => {
  readStatus.value = { message, type }
  setTimeout(() => {
    readStatus.value = null
  }, 5000)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8fafc;
}

pre {
  font-family: 'Courier New', monospace;
}
</style> 