import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface AuthUser {
    id: number
    nombre: string
    usuario: string
    rol: string
}

const token = ref<string | null>(localStorage.getItem('auth_token'))
const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export function useAuth() {
    const router = useRouter()

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.rol === 'Administrador')
    const userRole = computed(() => user.value?.rol || null)
    const userName = computed(() => user.value?.nombre || '')

    const login = async (usuario: string, password: string): Promise<void> => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión')
        }

        token.value = data.token
        user.value = data.user
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
    }

    const logout = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        router.push('/signin')
    }

    return {
        token,
        user,
        isAuthenticated,
        isAdmin,
        userRole,
        userName,
        login,
        logout,
    }
}
