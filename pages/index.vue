//import { useServerFunctions } from "#build/server-fn-client"

<script setup lang="ts">
const uploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  const result = await res.json()
  alert(`Upload result: ${result.message}`)
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">File Management System</h1>
      <p class="text-xl text-gray-600">Upload and manage .txt files with processor-based organization</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <!-- Upload Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center mb-4">
          <div class="text-4xl mb-2">📤</div>
          <h2 class="text-xl font-semibold text-gray-700">Upload Data</h2>
        </div>
        <p class="text-gray-600 mb-4">
          Upload .txt files for processing.
        </p>
        <NuxtLink
          to="/file-management"
          class="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Uploading
        </NuxtLink>
      </div>

      <!-- Read Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center mb-4">
          <div class="text-4xl mb-2">📖</div>
          <h2 class="text-xl font-semibold text-gray-700">Read Files</h2>
        </div>
        <p class="text-gray-600 mb-4">
          Read processed files. View file contents and metadata.
        </p>
        <NuxtLink
          to="/file-management"
          class="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          View Files
        </NuxtLink>
      </div>
    </div>
   </div>
</template>
