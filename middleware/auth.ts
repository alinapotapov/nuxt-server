export default defineNuxtRouteMiddleware((to) => {
    const { loggedIn } = useUserSession()

    if (to.path === '/file-management' && !loggedIn.value) {
        return navigateTo('/api/auth/keycloak', { external: true })
    }
}) 