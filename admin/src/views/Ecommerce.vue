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

      <!-- Tables Grid: 50/50 on desktop, stacked on mobile -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Table 1: Clientes Morosos -->
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
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Usuario</p>
                    </div>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                     <div class="flex items-center gap-1.5">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Deuda Total</p>
                    </div>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                     <div class="flex items-center gap-1.5">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Pago Vencido</p>
                    </div>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                     <div class="flex items-center gap-1.5">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
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
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ client.username }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-red-600">{{ formatCurrency(client.amountOwed) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-red-500 text-theme-sm dark:text-red-400 font-medium">{{ formatCurrency(client.overduePayment) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <button class="hover:text-primary" title="Ver detalles">
                      <Eye class="w-5 h-5 text-blue-600 transition-colors" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div class="flex flex-1 justify-between sm:hidden">
              <button @click="prevPageMorosos" :disabled="currentPageMorosos === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Anterior</button>
              <button @click="nextPageMorosos" :disabled="currentPageMorosos === totalPagesMorosos" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Siguiente</button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span class="font-medium">{{ (currentPageMorosos - 1) * itemsPerPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPageMorosos * itemsPerPage, morosos.length) }}</span> de <span class="font-medium">{{ morosos.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button @click="prevPageMorosos" :disabled="currentPageMorosos === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-white/5">
                    <span class="sr-only">Anterior</span>
                    <ChevronLeft class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button @click="nextPageMorosos" :disabled="currentPageMorosos === totalPagesMorosos" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-white/5">
                    <span class="sr-only">Siguiente</span>
                    <ChevronRight class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Table 2: Próximos Ingresos -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="mb-5 text-lg font-bold text-gray-800 dark:text-white">Próximos Ingresos</h3>
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
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha de Pago</p>
                    </div>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                     <div class="flex items-center gap-1.5">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Pago</p>
                    </div>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                     <div class="flex items-center gap-1.5">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Estado</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(payment, index) in paginatedIngresos"
                  :key="index"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium">{{ payment.name }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(payment.paymentDate) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400 font-medium text-green-600">{{ formatCurrency(payment.amount) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <span :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                      payment.status === 'Confirmado' ? 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500'
                    ]">
                      {{ payment.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div class="flex flex-1 justify-between sm:hidden">
              <button @click="prevPageIngresos" :disabled="currentPageIngresos === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Anterior</button>
              <button @click="nextPageIngresos" :disabled="currentPageIngresos === totalPagesIngresos" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Siguiente</button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span class="font-medium">{{ (currentPageIngresos - 1) * itemsPerPage + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPageIngresos * itemsPerPage, proximosIngresos.length) }}</span> de <span class="font-medium">{{ proximosIngresos.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button @click="prevPageIngresos" :disabled="currentPageIngresos === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-white/5">
                    <span class="sr-only">Anterior</span>
                    <ChevronLeft class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button @click="nextPageIngresos" :disabled="currentPageIngresos === totalPagesIngresos" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-white/5">
                    <span class="sr-only">Siguiente</span>
                    <ChevronRight class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
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
import { DollarSign, HandCoins, TrendingUp, Activity, Briefcase, User, ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-vue-next'

const itemsPerPage = 10
const currentPageMorosos = ref(1)
const currentPageIngresos = ref(1)

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
  { name: 'Roberto Sánchez', username: 'rsanchez', amountOwed: 15400.50, overduePayment: 1500.00 },
  { name: 'Elena Torres', username: 'etorres', amountOwed: 8200.00, overduePayment: 850.00 },
  { name: 'Miguel Ángel Ruiz', username: 'maruiz', amountOwed: 25000.00, overduePayment: 2500.00 },
  { name: 'Patricia Morales', username: 'pmorales', amountOwed: 3450.75, overduePayment: 350.00 },
  { name: 'Javier Castillo', username: 'jcastillo', amountOwed: 12000.00, overduePayment: 1200.00 },
  { name: 'Gabriela Mendoza', username: 'gmendoza', amountOwed: 6700.25, overduePayment: 680.00 },
  { name: 'Fernando Vara', username: 'fvara', amountOwed: 18900.00, overduePayment: 1950.00 },
  { name: 'Lucía Jiménez', username: 'ljimenez', amountOwed: 5600.50, overduePayment: 580.00 },
  { name: 'Alejandro Castro', username: 'acastro', amountOwed: 45000.00, overduePayment: 4500.00 },
  { name: 'Rosa Ortiz', username: 'rortiz', amountOwed: 2100.00, overduePayment: 250.00 },
  { name: 'Héctor Ramírez', username: 'hramirez', amountOwed: 10500.80, overduePayment: 1100.00 },
  { name: 'Mónica Vega', username: 'mvega', amountOwed: 9250.00, overduePayment: 950.00 },
  { name: 'Ricardo Silva', username: 'rsilva', amountOwed: 30000.00, overduePayment: 3100.00 },
  { name: 'Verónica Gil', username: 'vgil', amountOwed: 4200.00, overduePayment: 450.00 }
])

const proximosIngresos = ref([
  { name: 'Carlos Méndez', paymentDate: '2026-02-15', amount: 2500.00, status: 'Pendiente' },
  { name: 'Ana López', paymentDate: '2026-02-16', amount: 1800.00, status: 'Confirmado' },
  { name: 'Jorge Ramírez', paymentDate: '2026-02-17', amount: 3200.00, status: 'Pendiente' },
  { name: 'María Fernández', paymentDate: '2026-02-18', amount: 1500.00, status: 'Confirmado' },
  { name: 'Pedro Sánchez', paymentDate: '2026-02-19', amount: 2800.00, status: 'Pendiente' },
  { name: 'Laura Martínez', paymentDate: '2026-02-20', amount: 2100.00, status: 'Confirmado' },
  { name: 'Diego Torres', paymentDate: '2026-02-21', amount: 1900.00, status: 'Pendiente' },
  { name: 'Carmen Ruiz', paymentDate: '2026-02-22', amount: 3500.00, status: 'Confirmado' },
  { name: 'Antonio García', paymentDate: '2026-02-23', amount: 2200.00, status: 'Pendiente' },
  { name: 'Isabel Moreno', paymentDate: '2026-02-24', amount: 1700.00, status: 'Confirmado' },
  { name: 'Francisco Díaz', paymentDate: '2026-02-25', amount: 2900.00, status: 'Pendiente' },
  { name: 'Teresa Álvarez', paymentDate: '2026-02-26', amount: 2400.00, status: 'Confirmado' }
])

// Morosos pagination
const totalPagesMorosos = computed(() => Math.ceil(morosos.value.length / itemsPerPage))

const paginatedMorosos = computed(() => {
  const start = (currentPageMorosos.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return morosos.value.slice(start, end)
})

const nextPageMorosos = () => {
  if (currentPageMorosos.value < totalPagesMorosos.value) {
    currentPageMorosos.value++
  }
}

const prevPageMorosos = () => {
  if (currentPageMorosos.value > 1) {
    currentPageMorosos.value--
  }
}

// Próximos Ingresos pagination
const totalPagesIngresos = computed(() => Math.ceil(proximosIngresos.value.length / itemsPerPage))

const paginatedIngresos = computed(() => {
  const start = (currentPageIngresos.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return proximosIngresos.value.slice(start, end)
})

const nextPageIngresos = () => {
  if (currentPageIngresos.value < totalPagesIngresos.value) {
    currentPageIngresos.value++
  }
}

const prevPageIngresos = () => {
  if (currentPageIngresos.value > 1) {
    currentPageIngresos.value--
  }
}
</script>
