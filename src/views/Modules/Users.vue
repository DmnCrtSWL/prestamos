<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Lista de Usuarios
      </h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar usuario..."
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-96"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <router-link
          to="/usuarios/nuevo"
          class="inline-flex items-center justify-center rounded-full bg-blue-600 py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          + Nuevo Usuario
        </router-link>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('name')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nombre</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('registrationDate')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha de Registro</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('email')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Correo</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('phone')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Teléfono</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('role')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Rol</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(user, index) in sortedUsers"
              :key="index"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.name }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(user.created_at) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.email }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.phone }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                   user.role === 'Administrador' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-500' : 'bg-gray-50 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400'
                ]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center space-x-3.5">
                  <button class="hover:text-primary" title="Ver">
                    <Eye class="w-5 h-5 text-blue-600 transition-colors" />
                  </button>
                  <button class="hover:text-primary" title="Editar">
                    <Pencil class="w-5 h-5 text-yellow-500 transition-colors" />
                  </button>
                  <button class="hover:text-primary" title="Eliminar" @click="deleteUser(user.id)">
                    <Trash2 class="w-5 h-5 text-red-600 transition-colors" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { Eye, Pencil, Trash2, ArrowUpDown, Search } from 'lucide-vue-next'

const users = ref([])
const sortKey = ref('')
const sortOrder = ref('asc')
const searchQuery = ref('')
const loading = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Error al cargar usuarios')
    users.value = await response.json()
  } catch (error) {
    console.error(error)
    alert('Error obteniendo usuarios')
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return
  try {
    const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Error al eliminar')
    users.value = users.value.filter(u => u.id !== id)
    alert('Usuario eliminado')
  } catch (error) {
    console.error(error)
    alert('No se pudo eliminar el usuario')
  }
}

onMounted(() => {
  fetchUsers()
})

const sortedUsers = computed(() => {
  let result = [...users.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }

  return result.sort((a, b) => {
    if (!sortKey.value) return 0
    let aValue = a[sortKey.value]
    let bValue = b[sortKey.value]

    // Convert strings to lower case for comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
</script>
