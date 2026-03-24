<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Proveedores
      </h2>
      <!-- Botón "Nuevo Proveedor": solo visible para Admin y Sucursal (NO Empleados) -->
      <button
        v-if="!isEmpleados"
        @click="createProvider"
        class="inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        <span>
          <PlusIcon class="w-5 h-5" />
        </span>
        Nuevo Proveedor
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nombre</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Teléfono</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Inversión Total</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Capital Disponible</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha de Alta</p>
              </th>
              <!-- Columna "Para empleados": SOLO visible para Administrador -->
              <th v-if="isAdmin" class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Para empleados</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="provider in paginatedProviders"
              :key="provider.id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium">{{ provider.name }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ provider.phone || '-' }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatCurrency(provider.total_invested) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-bold" :class="provider.total_capital < 0 ? 'text-red-500' : 'text-green-600'">
                  {{ formatCurrency(provider.total_capital) }}
                </p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(provider.created_at) }}</p>
              </td>
              <!-- Switch "Para empleados": SOLO visible para Administrador -->
              <td v-if="isAdmin" class="px-5 py-4 sm:px-6">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    :checked="provider.visible_empleados"
                    @change="toggleVisibleEmpleados(provider)"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700
                           peer-checked:after:translate-x-full peer-checked:after:border-white
                           after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                           after:bg-white after:border-gray-300 after:border after:rounded-full
                           after:h-5 after:w-5 after:transition-all dark:border-gray-600
                           peer-checked:bg-blue-600 transition-colors"
                  ></div>
                </label>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center space-x-3.5">
                  <button class="hover:text-primary" title="Aportaciones" @click="viewContributions(provider.id)">
                    <BanknoteIcon class="w-5 h-5 text-green-600 transition-colors" />
                  </button>
                  <button class="hover:text-primary" title="Editar" @click="editProvider(provider.id)">
                    <PencilIcon class="w-5 h-5 text-yellow-500 transition-colors" />
                  </button>
                  <button class="hover:text-primary" title="Eliminar" @click="deleteProvider(provider.id)">
                    <TrashIcon class="w-5 h-5 text-red-600 transition-colors" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="providers.length === 0 && !isLoading">
              <td :colspan="isAdmin ? 7 : 6" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                No hay proveedores registrados.
              </td>
            </tr>
            <tr v-if="isLoading">
              <td :colspan="isAdmin ? 7 : 6" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                Cargando...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 dark:border-gray-800">
        <div class="flex flex-1 justify-between sm:hidden">
          <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-meta-4 dark:border-strokedark dark:text-white">Anterior</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-meta-4 dark:border-strokedark dark:text-white">Siguiente</button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-400">
              Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, providers.length) }}</span> de <span class="font-medium">{{ providers.length }}</span> resultados
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-strokedark dark:hover:bg-meta-4">
                <span class="sr-only">Anterior</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-strokedark dark:hover:bg-meta-4">
                <span class="sr-only">Siguiente</span>
                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Plus as PlusIcon, Pencil as PencilIcon, Trash2 as TrashIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Banknote as BanknoteIcon } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isAdmin, isEmpleados, userRole } = useAuth()

const providers = ref([])
const isLoading = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

const createProvider = () => {
  router.push('/proveedores/nuevo')
}

const viewContributions = (id) => {
  router.push(`/proveedores/aportaciones/${id}`)
}

const editProvider = (id) => {
  router.push(`/proveedores/editar/${id}`)
}

const deleteProvider = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este proveedor?')) return

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/providers/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error al eliminar')

    providers.value = providers.value.filter(p => p.id !== id)
    if (paginatedProviders.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al eliminar proveedor')
  }
}

const toggleVisibleEmpleados = async (provider) => {
  const newValue = !provider.visible_empleados
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/providers/${provider.id}/visible-empleados`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: newValue })
    })
    if (!response.ok) throw new Error('Error al actualizar')
    // Update local state
    provider.visible_empleados = newValue
  } catch (error) {
    console.error('Error:', error)
    alert('Error al actualizar visibilidad del proveedor')
  }
}

const fetchProviders = async () => {
  isLoading.value = true
  try {
    // Si es Empleado, solo traer los marcados como visibles
    const rol = userRole.value
    const url = rol === 'Empleado'
      ? `${import.meta.env.VITE_API_URL}/providers?rol=Empleado`
      : `${import.meta.env.VITE_API_URL}/providers`

    const response = await fetch(url)
    if (!response.ok) throw new Error('Error fetching providers')
    providers.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProviders()
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Pagination Logic
const totalPages = computed(() => Math.ceil(providers.value.length / itemsPerPage))

const paginatedProviders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return providers.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>
