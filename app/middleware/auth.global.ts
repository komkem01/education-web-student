export default defineNuxtRouteMiddleware((to) => {
  const authToken = useCookie<string | null>('edu_student_token')
  const activeRole = useCookie<string | null>('edu_active_role')
  const config = useRuntimeConfig()

  const isPublic = to.path === '/' || to.path === '/login'
  const isValidSession = Boolean(authToken.value) && activeRole.value === 'student'

  async function verifySession() {
    if (!authToken.value || activeRole.value !== 'student') return false

    try {
      const res = await $fetch<{ data: { role: string; roles: string[] } }>(`${config.public.apiBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
      })
      const role = res.data.role
      const roles = res.data.roles ?? []
      return role === 'student' || roles.includes('student')
    }
    catch {
      return false
    }
  }

  if (!isValidSession && !isPublic) {
    authToken.value = null
    activeRole.value = null
    return navigateTo('/login')
  }

  if (isValidSession) {
    return verifySession().then((ok) => {
      if (!ok) {
        authToken.value = null
        activeRole.value = null
        return navigateTo('/login')
      }

      if (isPublic) {
        return navigateTo('/home')
      }
    })
  }

  if (isValidSession && isPublic) return navigateTo('/home')
})