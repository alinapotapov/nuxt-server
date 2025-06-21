import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
  runtimeConfig: {
    oauth: {
      keycloak: {
        clientId: process.env.NUXT_OAUTH_KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_KEYCLOAK_CLIENT_SECRET,
        issuer: process.env.NUXT_OAUTH_KEYCLOAK_ISSUER,
      }
    },
    session: {
      name: 'nuxt-session',
      password: process.env.NUXT_SESSION_PASSWORD || 'fallback-password'
    }
  },
})
