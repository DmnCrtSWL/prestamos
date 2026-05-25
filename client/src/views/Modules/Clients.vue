<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Lista de Clientes
      </h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar cliente..."
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-96"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <router-link
          to="/clientes/nuevo"
          class="inline-flex items-center justify-center rounded-full bg-blue-600 py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          + Nuevo Cliente
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
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('phone')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Teléfono</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('remainingAmount')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Restante por pagar</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
               <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('status')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Estatus</p>
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
              v-for="(client, index) in sortedClients"
              :key="index"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ client.name }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ client.phone }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-brand-600">{{ formatCurrency(client.remainingAmount) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                   getStatusClass(client.status)
                ]">
                  {{ client.status }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center space-x-3.5">
                   <router-link to="/reestructuracion" class="hover:text-primary" title="Reestructuración">
                    <Calculator class="w-5 h-5 text-purple-600 transition-colors" />
                  </router-link>
                  <button class="hover:text-primary" title="Ver">
                    <Eye class="w-5 h-5 text-blue-600 transition-colors" />
                  </button>
                  <button class="hover:text-primary" title="Editar">
                    <Pencil class="w-5 h-5 text-yellow-500 transition-colors" />
                  </button>
                  <button class="hover:text-primary" title="Eliminar">
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
import { ref, computed } from 'vue'
import { Eye, Pencil, Trash2, ArrowUpDown, Search, Calculator } from 'lucide-vue-next'

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Inactivo':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400'
    case 'En tiempo':
      return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
    case 'Moroso':
      return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const generateRandomAmount = () => {
    return Math.floor(Math.random() * 49000) + 1000
}

const clients = ref([
  {
    name: 'Cliente Ejemplo 1',
    phone: '555-123-4567',
    remainingAmount: generateRandomAmount(),
    status: 'En tiempo'
  },
  {
    name: 'Cliente Ejemplo 2',
    phone: '555-987-6543',
    remainingAmount: generateRandomAmount(),
    status: 'Moroso'
  },
   {
    name: 'Cliente Ejemplo 3',
    phone: '555-111-2222',
    remainingAmount: 0,
    status: 'Inactivo'
  },
  {
    name: 'Cliente Ejemplo 4',
    phone: '555-333-4444',
    remainingAmount: generateRandomAmount(),
    status: 'En tiempo'
  },
  {
    name: 'Cliente Ejemplo 5',
    phone: '555-555-5555',
    remainingAmount: generateRandomAmount(),
    status: 'En tiempo'
  },
  {
    name: 'Cliente Ejemplo 6',
    phone: '555-666-7777',
    remainingAmount: generateRandomAmount(),
    status: 'Moroso'
  }
])

const sortKey = ref('')
const sortOrder = ref('asc')
const searchQuery = ref('')

const sortedClients = computed(() => {
  let result = [...clients.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(client => 
      client.name.toLowerCase().includes(query)
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
