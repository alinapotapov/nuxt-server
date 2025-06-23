/*import { defineEventHandler, getQuery, sendRedirect } from 'h3'

//import { setUserSession } from '#auth-utils'

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event)
  if (!code) {
    // Redirect to Keycloak
    const redirectUrl = `http://localhost:8080/realms/master/broker/keycloak-oidc/endpoint`
    return sendRedirect(event, redirectUrl)
  }

  // Handle callback
  try {
    // Exchange code for token
    // In a real app, you would make a POST request to Keycloak's token endpoint
    // and then get user info from the userinfo endpoint
    const user = { email: 'test@example.com' } // Placeholder

    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  } catch (error) {
    console.error('Keycloak OAuth error:', error)
    return sendRedirect(event, '/?error=1')
  }
}) */