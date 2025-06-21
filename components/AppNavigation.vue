<template>
  <nav class="bg-white-800 p-4 border-b border-gray-200">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-black text-lg font-bold">
        Face App
      </div>
      <div class="space-x-8 flex items-center">
        <NuxtLink to="/" class="text-black-300 hover:text-blue-500">Home</NuxtLink>
        <NuxtLink to="/file-management" class="text-black-300 hover:text-blue-500">Data Process</NuxtLink>
        <div v-if="loggedIn">
          <span class="text-gray-700 mr-4">{{ user?.email }}</span>
          <button @click="clear" class="text-black-300 hover:text-blue-500">Logout</button>
        </div>
        <a v-else href="/api/auth/keycloak" class="text-black-300 hover:text-blue-500">Login</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
const { loggedIn, user, clear } = useUserSession()
</script> 