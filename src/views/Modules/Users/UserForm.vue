<template>
  <AdminLayout>


      <ComponentCard title="Nuevo Usuario">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            <!-- Correo -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Correo
              </label>
              <input
                type="email"
                v-model="formData.email"
                required
                placeholder="Ingresa el correo electrónico"
                class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Teléfono
              </label>
              <input
                type="tel"
                v-model="formData.phone"
                @input="errors.phone = ''"
                required
                placeholder="Ingresa los 10 dígitos del teléfono"
                class="dark:bg-gray-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                :class="errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-300 focus:border-brand-300 dark:border-gray-700'"
              />
              <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
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
              Guardar Usuario
            </button>
          </div>
        </form>
      </ComponentCard>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  role: '' // Inicialmente vacío pero requerido en el select
})

const errors = reactive({
  phone: ''
})

const isSubmitting = ref(false)

const validateForm = () => {
  let isValid = true
  errors.phone = ''

  // Validar Teléfono: debe ser exactamente 10 dígitos numéricos
  const phonePattern = /^\d{10}$/
  if (!phonePattern.test(formData.phone)) {
    errors.phone = 'El teléfono debe tener exactamente 10 dígitos numéricos.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    // Local mock for creating user
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Local mode: User created with data:', formData)
    
    // Simulate success
    alert('Usuario guardado exitosamente (Local)')
    router.push('/usuarios')
  } catch (error) {
    console.error(error)
    alert('Error: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>
