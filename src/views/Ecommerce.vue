<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- First Row: 3 columns -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Card 1: Créditos activos -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
              <DollarSign class="h-6 w-6" />
            </div>
          </div>
          <div>
            <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              37
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Créditos Activos
            </span>
          </div>
        </div>

        <!-- Card 2: Montos Cobrados del Mes -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500">
               <HandCoins class="h-6 w-6" />
            </div>
          </div>
          <div>
            <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $80,345.00
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Montos Cobrados del Mes
            </span>
          </div>
        </div>

        <!-- Card 3: Ganancias netas del mes -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-500">
              <TrendingUp class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $40,177.50
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ganancias Netas del Mes
            </span>
          </div>
        </div>
      </div>

      <!-- Second Row: 2 columns -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Card 4: Monto en circulación -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500">
              <Activity class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $123,456.00
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Monto en Circulación
            </span>
          </div>
        </div>

        <!-- Card 5: Monto disponible -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500">
              <Briefcase class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $750,123.00
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Monto Disponible
            </span>
          </div>
        </div>

        <!-- Card 6: Clientes por cobrar -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500">
              <User class="h-6 w-6" />
            </div>
          </div>
          <div>
            <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              14
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Clientes por cobrar
            </span>
          </div>
        </div>
      </div>

      <!-- Table Card: Clientes Morosos -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 class="mb-5 text-lg font-bold text-gray-800 dark:text-white">Clientes Morosos</h3>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left sm:px-6">
                  <div class="flex items-center gap-1.5">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nombre</p>
                  </div>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                   <div class="flex items-center gap-1.5">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Teléfono</p>
                  </div>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                   <div class="flex items-center gap-1.5">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Deuda Total</p>
                  </div>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                   <div class="flex items-center gap-1.5">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Regulariza con</p>
                  </div>
                </th>
                 <th class="px-5 py-3 text-left sm:px-6">
                   <div class="flex items-center gap-1.5">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha de Pago Vencido</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(client, index) in paginatedMorosos"
                :key="index"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium">{{ client.name }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ client.phone }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-red-600">{{ formatCurrency(client.amountOwed) }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium">{{ formatCurrency(client.regularizeAmount) }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-red-500 text-theme-sm dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded w-fit">{{ formatDate(client.dueDate) }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
             <div class="flex flex-1 justify-between sm:hidden">
              <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Anterior</button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Siguiente</button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, morosos.length) }}</span> de <span class="font-medium">{{ morosos.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-white/5">
                    <span class="sr-only">Anterior</span>
                    <ChevronLeft class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-white/5">
                    <span class="sr-only">Siguiente</span>
                    <ChevronRight class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, computed } from 'vue'
import { DollarSign, HandCoins, TrendingUp, Activity, Briefcase, User, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const itemsPerPage = 10
const currentPage = ref(1)

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const morosos = ref([
  { name: 'Roberto Sánchez', phone: '55 1234 5678', amountOwed: 15400.50, regularizeAmount: 1500.00, dueDate: '2025-12-15' },
  { name: 'Elena Torres', phone: '55 8765 4321', amountOwed: 8200.00, regularizeAmount: 850.00, dueDate: '2025-11-20' },
  { name: 'Miguel Ángel Ruiz', phone: '55 4567 8901', amountOwed: 25000.00, regularizeAmount: 2500.00, dueDate: '2026-01-05' },
  { name: 'Patricia Morales', phone: '55 1122 3344', amountOwed: 3450.75, regularizeAmount: 350.00, dueDate: '2025-12-30' },
  { name: 'Javier Castillo', phone: '55 9988 7766', amountOwed: 12000.00, regularizeAmount: 1200.00, dueDate: '2025-10-10' },
  { name: 'Gabriela Mendoza', phone: '55 5544 3322', amountOwed: 6700.25, regularizeAmount: 680.00, dueDate: '2025-12-05' },
  { name: 'Fernando Vara', phone: '55 6677 8899', amountOwed: 18900.00, regularizeAmount: 1950.00, dueDate: '2026-01-08' },
  { name: 'Lucía Jiménez', phone: '55 2233 4455', amountOwed: 5600.50, regularizeAmount: 580.00, dueDate: '2025-11-25' },
  { name: 'Alejandro Castro', phone: '55 7788 9900', amountOwed: 45000.00, regularizeAmount: 4500.00, dueDate: '2025-09-15' },
  { name: 'Rosa Ortiz', phone: '55 0011 2233', amountOwed: 2100.00, regularizeAmount: 250.00, dueDate: '2026-01-10' },
  { name: 'Héctor Ramírez', phone: '55 3344 5566', amountOwed: 10500.80, regularizeAmount: 1100.00, dueDate: '2025-12-20' },
  { name: 'Mónica Vega', phone: '55 8899 0011', amountOwed: 9250.00, regularizeAmount: 950.00, dueDate: '2025-11-05' },
  { name: 'Ricardo Silva', phone: '55 1212 3434', amountOwed: 30000.00, regularizeAmount: 3100.00, dueDate: '2025-10-25' },
  { name: 'Verónica Gil', phone: '55 5656 7878', amountOwed: 4200.00, regularizeAmount: 450.00, dueDate: '2026-01-02' }
])

const totalPages = computed(() => Math.ceil(morosos.value.length / itemsPerPage))

const paginatedMorosos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return morosos.value.slice(start, end)
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
