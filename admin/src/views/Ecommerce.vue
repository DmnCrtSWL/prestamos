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
              {{ stats.creditosActivos }}
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Créditos Activos
            </span>
          </div>
        </div>

        <!-- Card 2: Montos Cobrados -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500">
               <HandCoins class="h-6 w-6" />
            </div>
          </div>
          <div>
            <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              {{ formatCurrency(stats.montosCobradosMes) }}
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Montos Cobrados
            </span>
          </div>
        </div>

        <!-- Card 3: Ganancias netas -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-500">
              <TrendingUp class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              {{ formatCurrency(stats.gananciasNetasMes) }}
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ganancias Netas
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
              {{ formatCurrency(stats.montoCirculacion) }}
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
              {{ formatCurrency(stats.montoDisponible) }}
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
              {{ stats.clientesPorCobrar }}
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
                  <th class="px-5 py-3 text-right sm:px-6">
                     <div class="flex items-center justify-end gap-1.5">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto Vencido</p>
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
                  <td class="px-5 py-4 text-right sm:px-6">
                    <p class="text-red-500 text-theme-sm dark:text-red-400 font-medium">{{ formatCurrency(client.amountOwed) }}</p>
                  </td>
                </tr>
                <tr v-if="morosos.length === 0">
                  <td colspan="2" class="px-5 py-8 text-center text-gray-400 text-sm">Sin clientes morosos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="morosos.length > 0" class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div class="flex flex-1 justify-between sm:hidden">
              <button @click="prevPageMorosos" :disabled="currentPageMorosos === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Anterior</button>
              <button @click="nextPageMorosos" :disabled="currentPageMorosos === totalPagesMorosos" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Siguiente</button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span class="font-medium">{{ (currentPageMorosos - 1) * itemsPerPageMorosos + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPageMorosos * itemsPerPageMorosos, morosos.length) }}</span> de <span class="font-medium">{{ morosos.length }}</span> resultados
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
                <tr v-if="proximosIngresos.length === 0">
                  <td colspan="4" class="px-5 py-8 text-center text-gray-400 text-sm">Sin ingresos próximos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="proximosIngresos.length > 0" class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div class="flex flex-1 justify-between sm:hidden">
              <button @click="prevPageIngresos" :disabled="currentPageIngresos === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Anterior</button>
              <button @click="nextPageIngresos" :disabled="currentPageIngresos === totalPagesIngresos" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Siguiente</button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span class="font-medium">{{ (currentPageIngresos - 1) * itemsPerPageIngresos + 1 }}</span> a <span class="font-medium">{{ Math.min(currentPageIngresos * itemsPerPageIngresos, proximosIngresos.length) }}</span> de <span class="font-medium">{{ proximosIngresos.length }}</span> resultados
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
import { ref, computed, onMounted } from 'vue'
import { DollarSign, HandCoins, TrendingUp, Activity, Briefcase, User, ChevronLeft, ChevronRight, Eye } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const { isAdmin, userName, token } = useAuth()
const API_URL = import.meta.env.VITE_API_URL

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = ref({
  creditosActivos: 0,
  montosCobradosMes: 0,
  gananciasNetasMes: 0,
  montoCirculacion: 0,
  montoDisponible: 0,
  clientesPorCobrar: 0
})

const morosos = ref([])
const proximosIngresos = ref([])

// Misma lógica que Credits.vue
const isLiquidado = (credit) => {
  if (credit.status === 'completed') return true
  return Number(credit.paid_amount || 0) >= Number(credit.total_to_pay || 0)
}

const fetchCreditosActivosYCobros = async () => {
  try {
    let credits = []
    let incomes = []

    // Obtener créditos
    const resCredits = await fetch(`${API_URL}/credits`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    if (resCredits.ok) {
      credits = await resCredits.json()
    }

    // Obtener ingresos
    const resIncomes = await fetch(`${API_URL}/incomes`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    if (resIncomes.ok) {
      incomes = await resIncomes.json()
    }

    // Obtener proveedores
    let providers = []
    const resProviders = await fetch(`${API_URL}/providers`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    if (resProviders.ok) {
      providers = await resProviders.json()
    }

    // Filtrar por usuario (dueño del crédito)
    const misCreditos = isAdmin.value ? credits : credits.filter(c => c.user === userName.value)
    
    // 2. Montos Cobrados (Suma de los ingresos cobrados por este usuario/admin)
    const misIngresos = isAdmin.value ? incomes : incomes.filter(i => i.user === userName.value)
    stats.value.montosCobradosMes = misIngresos.reduce((acc, current) => acc + Number(current.amount || 0), 0)

    // Agrupamos todos los pagos históricos por cada crédito
    const pagosPorCredito = {}
    incomes.forEach(inc => {
      if (!pagosPorCredito[inc.credit_id]) pagosPorCredito[inc.credit_id] = 0
      pagosPorCredito[inc.credit_id] += Number(inc.amount || 0)
    })

    // 3. Ganancias Netas (Utilidad: lo cobrado que exceda el dinero prestado)
    let gananciasTotales = 0
    // Calculamos ganancia sobre "mis créditos"
    misCreditos.forEach(credit => {
      const pagado = pagosPorCredito[credit.id] || 0
      const capital = Number(credit.loan_amount || 0)
      if (pagado > capital) {
        gananciasTotales += (pagado - capital) // Todo el excedente es utilidad (interés, recargo, etc)
      }
    })
    
    stats.value.gananciasNetasMes = gananciasTotales

    // 1. Créditos Activos (sin liquidar), 4. Monto en Circulación y 6. Clientes por cobrar (morosos)
    let activosCount = 0
    let montoCirculacion = 0
    const morososMap = new Map()
    const morososClientIds = new Set()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    misCreditos.forEach(credit => {
      const pagado = pagosPorCredito[credit.id] || 0
      const totalAPagar = Number(credit.total_to_pay || 0)
      
      // Determinamos si está liquidado usando los pagos reales
      const isLiquidated = credit.status === 'completed' || pagado >= totalAPagar

      if (!isLiquidated) {
        activosCount++
        
        let isMoroso = false
        let expectedPayment = 0

        if (credit.loan_type === '10% Semanal') {
          // Para 10% Semanal, se cobra los sábados
          const startDate = new Date(credit.created_at)
          let currentSat = new Date(startDate)
          const dayOfWeek = currentSat.getDay()
          const daysUntilNextSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek)
          currentSat.setDate(currentSat.getDate() + daysUntilNextSaturday)
          currentSat.setHours(0, 0, 0, 0)

          const interestPerWeek = Number(credit.loan_amount || 0) * 0.10

          while (currentSat < today) {
            expectedPayment += interestPerWeek
            currentSat.setDate(currentSat.getDate() + 7)
          }

          if (pagado < expectedPayment - 0.01) { // 0.01 de tolerancia
            isMoroso = true
          }
        } else {
          // Para los demás, sumamos los pagos vencidos en su calendario
          if (credit.payment_schedule && Array.isArray(credit.payment_schedule)) {
            credit.payment_schedule.forEach(pmt => {
              // Asumimos formato YYYY-MM-DD
              const pmtDate = new Date(pmt.date + 'T00:00:00')
              if (pmtDate < today) {
                expectedPayment += Number(pmt.amount || 0)
              }
            })
            if (pagado < expectedPayment - 0.01) {
              isMoroso = true
            }
          }
        }

        if (isMoroso && credit.client_id) {
          morososClientIds.add(credit.client_id)
          const overdue = expectedPayment - pagado
          if (morososMap.has(credit.client_id)) {
            morososMap.get(credit.client_id).amountOwed += overdue
          } else {
            morososMap.set(credit.client_id, {
              name: credit.client_name || `Cliente #${credit.client_id}`,
              amountOwed: overdue
            })
          }
        }

        // Monto en circulación
        const deudaRestante = credit.loan_type === '10% Semanal'
          ? Number(credit.loan_amount || 0)
          : Math.max(0, totalAPagar - pagado)
          
        montoCirculacion += deudaRestante
      }
    })

    stats.value.creditosActivos = activosCount
    stats.value.montoCirculacion = montoCirculacion
    stats.value.clientesPorCobrar = morososClientIds.size
    morosos.value = Array.from(morososMap.values()).sort((a, b) => b.amountOwed - a.amountOwed)

    // 5. Monto Disponible (Suma del capital disponible de todos los proveedores que puede ver el usuario)
    stats.value.montoDisponible = providers.reduce((acc, current) => acc + Number(current.total_capital || 0), 0)

  } catch (err) {
    console.error('Error cargando datos del dashboard:', err)
  }
}

onMounted(fetchCreditosActivosYCobros)

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Pagination ────────────────────────────────────────────────────────────────
const itemsPerPageMorosos = 5
const itemsPerPageIngresos = 10
const currentPageMorosos = ref(1)
const currentPageIngresos = ref(1)

const totalPagesMorosos = computed(() => Math.ceil(morosos.value.length / itemsPerPageMorosos))
const paginatedMorosos = computed(() => {
  const start = (currentPageMorosos.value - 1) * itemsPerPageMorosos
  return morosos.value.slice(start, start + itemsPerPageMorosos)
})
const nextPageMorosos = () => { if (currentPageMorosos.value < totalPagesMorosos.value) currentPageMorosos.value++ }
const prevPageMorosos = () => { if (currentPageMorosos.value > 1) currentPageMorosos.value-- }

const totalPagesIngresos = computed(() => Math.ceil(proximosIngresos.value.length / itemsPerPageIngresos))
const paginatedIngresos = computed(() => {
  const start = (currentPageIngresos.value - 1) * itemsPerPageIngresos
  return proximosIngresos.value.slice(start, start + itemsPerPageIngresos)
})
const nextPageIngresos = () => { if (currentPageIngresos.value < totalPagesIngresos.value) currentPageIngresos.value++ }
const prevPageIngresos = () => { if (currentPageIngresos.value > 1) currentPageIngresos.value-- }
</script>
