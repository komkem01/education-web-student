export default defineNuxtRouteMiddleware((to) => {
  const authToken = useCookie<string | null>('edu_student_token')
  const activeRole = useCookie<string | null>('edu_active_role')

  const isPublic = to.path === '/' || to.path === '/login'
  const isValidSession = Boolean(authToken.value) && activeRole.value === 'student'

  if (!isValidSession && !isPublic) {
    authToken.value = null
    activeRole.value = null
    return navigateTo('/login')
  }

  if (isValidSession && isPublic) {
    return navigateTo('/home')
  }
})