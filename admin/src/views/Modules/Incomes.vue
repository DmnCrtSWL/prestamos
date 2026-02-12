<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Caja (Ingresos)
        </h2>
        
        <!-- Filters Inline -->
        <div class="flex flex-wrap items-center gap-2">
            <div class="flex gap-2 bg-gray-100 dark:bg-meta-4 p-1 rounded-full">
                <button 
                    @click="setFilter('today')"
                    :class="['px-4 py-1.5 rounded-full text-sm font-medium transition', filterType === 'today' ? 'bg-white text-black shadow-sm dark:bg-boxdark dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white']"
                >
                    Hoy
                </button>
                <button 
                    @click="setFilter('specific')"
                    :class="['px-4 py-1.5 rounded-full text-sm font-medium transition', filterType === 'specific' ? 'bg-white text-black shadow-sm dark:bg-boxdark dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white']"
                >
                    Día
                </button>
                 <button 
                    @click="setFilter('range')"
                    :class="['px-4 py-1.5 rounded-full text-sm font-medium transition', filterType === 'range' ? 'bg-white text-black shadow-sm dark:bg-boxdark dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white']"
                >
                    Rango
                </button>
                <button 
                    @click="setFilter('all')"
                    :class="['px-4 py-1.5 rounded-full text-sm font-medium transition', filterType === 'all' ? 'bg-white text-black shadow-sm dark:bg-boxdark dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white']"
                >
                    Todos
                </button>
            </div>

            <div v-if="filterType === 'specific'" class="flex items-center gap-2">
                 <input 
                    type="date" 
                    v-model="customDate"
                    class="rounded-full border border-stroke bg-transparent py-1.5 px-4 outline-none text-sm transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                 />
                 <button @click="applyFilters" class="p-2 rounded-full bg-primary text-white hover:bg-opacity-90">
                    <SearchIcon class="w-4 h-4" />
                 </button>
            </div>

            <div v-if="filterType === 'range'" class="flex items-center gap-2">
                 <input 
                    type="date" 
                    v-model="startDate"
                    class="rounded-full border border-stroke bg-transparent py-1.5 px-4 outline-none text-sm transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                 />
                 <span class="text-gray-500">-</span>
                 <input 
                    type="date" 
                    v-model="endDate"
                    class="rounded-full border border-stroke bg-transparent py-1.5 px-4 outline-none text-sm transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                 />
                 <button @click="applyFilters" class="p-2 rounded-full bg-primary text-white hover:bg-opacity-90">
                    <SearchIcon class="w-4 h-4" />
                 </button>
            </div>
        </div>
      </div>

      <button
        @click="createIncome"
        class="inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
        <span>
            <PlusIcon class="w-5 h-5" />
        </span>
        Nuevo Ingreso
      </button>
    </div>

    <!-- Removed separate Filter Card -->

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Folio</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Crédito</p>
              </th>
               <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Cliente</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Forma de Pago</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(income, index) in paginatedIncomes"
              :key="income.id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-mono">{{ income.folio }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">#{{ income.credit_id }}</p>
              </td>
               <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ income.client_name }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                 <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    income.payment_method === 'cash'
                      ? 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500',
                  ]"
                >
                  {{ income.payment_method === 'cash' ? 'Efectivo' : 'Transferencia' }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-bold">{{ formatCurrency(income.amount) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(income.created_at) }}</p>
              </td>
            </tr>
            <tr v-if="incomes.length === 0 && !isLoading">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay movimientos registrados para este periodo.
                </td>
            </tr>
             <tr v-if="isLoading">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
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
                Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, incomes.length) }}</span> de <span class="font-medium">{{ incomes.length }}</span> resultados
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
import { Plus as PlusIcon, Search as SearchIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

const router = useRouter()
const incomes = ref([])
const isLoading = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

// Filter state
const filterType = ref('today') // 'today', 'specific', 'range', 'all'
const customDate = ref('')
const startDate = ref('')
const endDate = ref('')

// Initialize dates
const today = new Date().toISOString().split('T')[0]
customDate.value = today
startDate.value = today
endDate.value = today

const setFilter = (type) => {
    filterType.value = type
    currentPage.value = 1 // Reset pagination on filter change
    if (type === 'today') {
        fetchIncomes()
    }
}

const createIncome = () => {
    router.push('/caja/nuevo')
}

const fetchIncomes = async () => {
    isLoading.value = true
    try {
        let url = `${import.meta.env.VITE_API_URL}/incomes`
        
        let queryParams = []
        
        if (filterType.value === 'today') {
            const todayStr = new Date().toISOString().split('T')[0]
            queryParams.push(`startDate=${todayStr}`)
            queryParams.push(`endDate=${todayStr}`)
        } else if (filterType.value === 'specific' && customDate.value) {
            queryParams.push(`startDate=${customDate.value}`)
            queryParams.push(`endDate=${customDate.value}`)
        } else if (filterType.value === 'range' && startDate.value && endDate.value) {
            queryParams.push(`startDate=${startDate.value}`)
            queryParams.push(`endDate=${endDate.value}`)
        }
        // 'all' sends no dates, returning everything
        
        if (queryParams.length > 0) {
            url += '?' + queryParams.join('&')
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Error fetching incomes')
        incomes.value = await response.json()
        currentPage.value = 1 // Reset to first page on new data
    } catch (error) {
        console.error('Error:', error)
         // Graceful error handling in UI implied by empty state or alert
    } finally {
        isLoading.value = false
    }
}

const applyFilters = () => {
    fetchIncomes()
}

// Pagination Logic
const totalPages = computed(() => Math.ceil(incomes.value.length / itemsPerPage))

const paginatedIncomes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return incomes.value.slice(start, end)
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

onMounted(() => {
    fetchIncomes() // Initial fetch (defaults to today)
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
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
