<template>
  <nav class="bg-white-800 p-4 border-b border-gray-200">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-black text-lg font-bold">
        Face App
      </div>
      <div class="space-x-8 flex items-center">
        <NuxtLink to="/" class="text-black-300 hover:text-blue-500">Home</NuxtLink>
        <NuxtLink to="/file-management" class="text-black-300 hover:text-blue-500">Data Process</NuxtLink>
        <div>
    <div v-if="authState === 'unAuthenticated'">
      <div class="mb-6 text-p2blue-700 text-2xl">Not authenticated.</div>
      <button
        class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="login()"
      >
        Log in
      </button>
    </div>
    <div v-if="authState === 'authenticated'">
      <div class="mb-2 text-p2blue-700 text-2xl">Authenticated</div>
      <div class="mb-6 text-p2blue-700 text-md">
        <div>{{ keycloak.tokenParsed?.email }}</div>
        <div>{{ keycloak.tokenParsed?.sub }}</div>
      </div>
      <button
        class="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        @click="logout()"
      >
        Log out
      </button>
    </div>
    <div>
      <div v-if="authState === 'error'" class="mb-6 text-p2blue-700 text-2xl">
        Authentication Error.
      </div>
    </div>
  </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useKeycloak } from "../composable/useKeycloak";
const { keycloak, authState } = useKeycloak();

function login() {
  keycloak.login();
}

function logout() {
  keycloak.logout();
}
</script> 