<template>
  <AdminLayout>
    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
      <p class="text-sm font-medium text-green-800 dark:text-green-500">{{ successMessage }}</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-500/10">
      <p class="text-sm font-medium text-red-800 dark:text-red-500">{{ errorMessage }}</p>
    </div>

      <ComponentCard :title="isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Nombre
              </label>
              <input
                type="text"
                v-model="formData.name"
                required
                placeholder="Ingresa el nombre completo"
                class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Usuario -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Usuario
              </label>
              <input
                type="text"
                v-model="formData.username"
                required
                placeholder="Ingresa el nombre de usuario"
                class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Password {{ isEditMode ? '(dejar en blanco para mantener actual)' : '' }}
              </label>
              <input
                type="password"
                v-model="formData.password"
                :required="!isEditMode"
                placeholder="Ingresa la contraseña"
                class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Rol -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Rol
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="formData.role"
                  required
                  class="dark:bg-gray-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  :class="{ 'text-gray-800 dark:text-white/90': formData.role, 'text-gray-400': !formData.role }"
                >
                  <option value="" disabled selected>Selecciona un rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Sucursal">Sucursal</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none text-gray-500 dark:text-gray-400">
                   <svg
                    class="stroke-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                      stroke=""
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
             <router-link
              to="/usuarios"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 focus:outline-hidden focus:ring-3 focus:ring-brand-500/50"
            >
              Guardar
            </button>
          </div>
        </form>
      </ComponentCard>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userId = computed(() => route.params.id)
const isEditMode = computed(() => !!userId.value)
const isLoading = ref(false)

const formData = reactive({
  name: '',
  username: '',
  password: '',
  role: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Load user data if in edit mode
const loadUser = async () => {
  if (!isEditMode.value) return
  
  isLoading.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId.value}`)
    
    if (!response.ok) {
      throw new Error('Error al cargar usuario')
    }
    
    const user = await response.json()
    formData.name = user.nombre
    formData.username = user.usuario
    formData.role = user.rol
    // Don't load password
  } catch (error) {
    console.error('Error loading user:', error)
    errorMessage.value = 'Error al cargar usuario: ' + error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUser()
})

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const url = isEditMode.value 
      ? `http://localhost:3000/api/users/${userId.value}`
      : 'http://localhost:3000/api/users'
    
    const method = isEditMode.value ? 'PUT' : 'POST'
    
    const body = {
      nombre: formData.name,
      usuario: formData.username,
      rol: formData.role
    }
    
    // Only include password if provided
    if (formData.password) {
      body.password = formData.password
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `Error al ${isEditMode.value ? 'actualizar' : 'crear'} usuario`)
    }
    
    successMessage.value = `Usuario ${isEditMode.value ? 'actualizado' : 'creado'} exitosamente`
    console.log(`Usuario ${isEditMode.value ? 'actualizado' : 'creado'}:`, data.user)
    
    // Redirect after short delay to show success message
    setTimeout(() => {
      router.push('/usuarios')
    }, 1000)
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} user:`, error)
    errorMessage.value = error.message || `Error al ${isEditMode.value ? 'actualizar' : 'crear'} usuario`
  } finally {
    isSubmitting.value = false
  }
}
</script>
