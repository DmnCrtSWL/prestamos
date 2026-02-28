<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Lista de Créditos
      </h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar crédito..."
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-96"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('client')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Cliente</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('amount')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Tipo</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('weeklyPayment')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Pago Semanal</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('remainingAmount')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Restante</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('nextPaymentDate')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Próximo Pago</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('status')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Estatus</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('user')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Usuario</p>
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
              v-for="(credit, index) in sortedCredits"
              :key="index"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ credit.client_name }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatCurrency(credit.loan_amount) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="credit.loan_type === '10% Semanal'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : credit.loan_type === 'Personalizado'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'"
                >
                  {{ credit.loan_type || 'Tradicional' }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatCurrency(credit.weekly_payment) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatCurrency(credit.total_to_pay) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(credit.created_at) }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    credit.status === 'approved' || credit.status === 'active'
                      ? 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500'
                      : credit.status === 'rejected' || credit.status === 'defaulted'
                      ? 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
                      : credit.status === 'completed'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500'
                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500',
                  ]"
                >
                  {{ getStatusLabel(credit.status) }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ credit.user || '-' }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewCredit(credit)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
                    title="Ver detalles"
                  >
                    <Eye class="h-5 w-5" />
                  </button>
                  <button
                    v-if="isAdmin"
                    @click="editCredit(credit)"
                    class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Editar"
                  >
                    <Edit class="h-5 w-5" />
                  </button>

                  <button
                    @click="viewCreditFunding(credit)"
                    class="text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
                    :title="credit.funded_amount >= credit.loan_amount ? 'Fondeado' : 'Fondear Crédito'"
                  >
                    <Check v-if="credit.funded_amount >= credit.loan_amount" class="h-5 w-5" />
                    <User v-else class="h-5 w-5" />
                  </button>

                  <button
                    @click="restructureCredit(credit)"
                    :disabled="!canRestructureCredit(credit)"
                    class="transition-colors"
                    :class="!canRestructureCredit(credit)
                      ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                      : 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400'"
                    title="Reestructuración"
                  >
                    <Calculator class="h-5 w-5" />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Search, ArrowUpDown, Eye, Edit, User, Check, Calculator } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isAdmin } = useAuth()

const searchQuery = ref('')
const sortColumn = ref('created_at')
const sortDirection = ref('desc')
const credits = ref([])
const isLoading = ref(false)

// Fetch credits from API
const fetchCredits = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits`)
    if (!response.ok) {
      throw new Error('Error al cargar créditos')
    }
    credits.value = await response.json()
  } catch (error) {
    console.error('Error fetching credits:', error)
    alert('Error al cargar créditos: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCredits()
})

const filteredCredits = computed(() => {
  if (!searchQuery.value) return credits.value
  
  const query = searchQuery.value.toLowerCase()
  return credits.value.filter((credit) =>
    credit.client_name?.toLowerCase().includes(query) ||
    credit.client_phone?.includes(query) ||
    credit.guarantor_name?.toLowerCase().includes(query)
  )
})

const sortedCredits = computed(() => {
  const sorted = [...filteredCredits.value]
  
  sorted.sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'approved': 'Aprobado',
    'rejected': 'Rechazado',
    'active': 'Activo',
    'completed': 'Completado',
    'defaulted': 'Vencido'
  }
  return labels[status] || status
}

const viewCredit = (credit) => {
  router.push(`/creditos/${credit.id}`)
}

const editCredit = (credit) => {
  router.push(`/creditos/${credit.id}/editar`)
}

const viewCreditFunding = (credit) => {
  router.push(`/creditos/${credit.id}/fondear`)
}

const restructureCredit = (credit) => {
  router.push(`/reestructuracion/${credit.id}`)
}

const canRestructureCredit = (credit) => {
  // 10% Semanal cannot be restructured (business rule)
  if (credit.loan_type === '10% Semanal') return false
  return Number(credit.paid_amount || 0) >= (Number(credit.weekly_payment || 0) * 5)
}
</script>
