<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Nueva Aportación
      </h2>
    </div>

    <ComponentCard>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Aportación -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Monto de Aportación
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                v-model="formData.amount"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[50px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          <!-- Fecha -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Fecha
            </label>
            <input
              type="date"
              v-model="formData.date"
              required
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <router-link
            to="/proveedores"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 focus:outline-hidden focus:ring-3 focus:ring-brand-500/50"
          >
            Registrar Aportación
          </button>
        </div>
      </form>
    </ComponentCard>

    <div class="mb-6 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
            Historial de Aportaciones
        </h2>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('date')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('amount')">
                 <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(contribution, index) in contributions"
              :key="index"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(contribution.date) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-success-600">
                  {{ formatCurrency(contribution.amount) }}
                </p>
              </td>
            </tr>
            <tr v-if="contributions.length === 0">
              <td colspan="2" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                No hay aportaciones registradas aún.
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
import ComponentCard from '@/components/common/ComponentCard.vue'
import { reactive, ref, computed } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'

const formData = reactive({
  amount: '',
  date: new Date().toISOString().split('T')[0]
})

// Simulación de historial inicial
const contributionsHistory = ref([
    { date: '2025-01-05', amount: 50000 },
    { date: '2025-01-01', amount: 150000 }
])

const sortKey = ref('date')
const sortOrder = ref('desc') // Default sorts by date descending

const contributions = computed(() => {
  return [...contributionsHistory.value].sort((a, b) => {
    if (!sortKey.value) return 0
    let aValue = a[sortKey.value]
    let bValue = b[sortKey.value]

    // Special handling for dates if needed, but string comparison works for ISO dates
    // For amounts (numbers), standard comparison works

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

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
}

const handleSubmit = () => {
    // Agregar al historial local
    contributionsHistory.value.unshift({
        date: formData.date,
        amount: parseFloat(formData.amount)
    })
    
    // Limpiar form
    formData.amount = ''
    formData.date = new Date().toISOString().split('T')[0]
    
    alert('Aportación registrada correctamente')
}
</script>
