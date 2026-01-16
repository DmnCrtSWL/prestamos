<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Lista de Proveedores
      </h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar proveedor..."
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-96"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <router-link
          to="/proveedores/nuevo"
          class="inline-flex items-center justify-center rounded-full bg-blue-600 py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          + Nuevo Proveedor
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
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Proveedor</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('lastContributionAmount')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto última aportación</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('lastContributionDate')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Última Aportación</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('remainingAmount')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto Restante</p>
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
              v-for="(provider, index) in sortedProviders"
              :key="index"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ provider.name }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-green-600">{{ formatCurrency(provider.lastContributionAmount) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ provider.lastContributionDate }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                 <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-brand-600">{{ formatCurrency(provider.remainingAmount) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center space-x-3.5">
                  <router-link to="/proveedores/aportaciones/1" class="hover:text-primary" title="Aportaciones">
                    <CircleDollarSign class="w-5 h-5 text-green-600 transition-colors" />
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
import { CircleDollarSign, Eye, Pencil, Trash2, ArrowUpDown, Search } from 'lucide-vue-next'

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const getRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

const generateRandomRemaining = () => {
    return Math.floor(Math.random() * 490000) + 1000
}

const providers = ref([
  {
    name: 'Proveedor 1',
    lastContributionAmount: 500000.00,
    lastContributionDate: '10-01-2026',
    remainingAmount: 480000.00
  },
  {
    name: 'Proveedor 2',
    lastContributionAmount: 495000.50,
    lastContributionDate: '05-12-2025',
    remainingAmount: 450000.00
  },
  {
    name: 'Proveedor 3',
    lastContributionAmount: 520000.00,
    lastContributionDate: '20-11-2025',
    remainingAmount: 510000.00
  },
  {
    name: 'Proveedor 4',
    lastContributionAmount: 480000.00,
    lastContributionDate: '15-01-2026',
    remainingAmount: 300000.00
  },
  {
    name: 'Proveedor 5',
    lastContributionAmount: 510000.25,
    lastContributionDate: '01-12-2025',
    remainingAmount: 505000.00
  },
  {
    name: 'Proveedor 6',
    lastContributionAmount: 490000.00,
    lastContributionDate: '12-01-2026',
    remainingAmount: 475000.00
  }
])

const sortKey = ref('')
const sortOrder = ref('asc')
const searchQuery = ref('')

const sortedProviders = computed(() => {
  let result = [...providers.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(provider => 
      provider.name.toLowerCase().includes(query)
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
