<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Lista de Créditos
      </h2>
      <div class="flex items-center gap-3">
        <select
          v-model="selectedProvider"
          class="dark:bg-dark-900 h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          <option value="">TODOS</option>
          <option v-for="provider in providers" :key="provider.id" :value="provider.name">
            {{ provider.name }}
          </option>
        </select>

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
        <table class="min-w-full whitespace-nowrap">
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
              <th class="px-5 py-3 text-left sm:px-6 cursor-pointer" @click="sortBy('statusInfo.sortValue')">
                <div class="flex items-center gap-1.5">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Por Pagar</p>
                  <ArrowUpDown class="h-4 w-4 text-gray-400" />
                </div>
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
                <div class="flex flex-col gap-1">
                  <span class="font-medium"
                    :class="[
                      credit.statusInfo.color === 'red' ? 'text-red-600 dark:text-red-400' : 
                      credit.statusInfo.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-gray-600 dark:text-gray-400'
                    ]"
                  >
                    {{ formatCurrency(credit.statusInfo.debt) }}
                  </span>
                  <span class="text-[10px] uppercase font-bold"
                    :class="[
                      credit.statusInfo.color === 'red' ? 'text-red-500' : 
                      credit.statusInfo.color === 'yellow' ? 'text-yellow-500' : 
                      'text-gray-400'
                    ]"
                  >
                    {{ credit.statusInfo.label }}
                  </span>
                </div>
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
                <span v-if="isLiquidado(credit)" class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-500">
                  Liquidado
                </span>
                <span v-else
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
                    @click="openPayModal(credit)"
                    :disabled="isLiquidado(credit)"
                    class="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Registrar Pago"
                  >
                    Pagar
                  </button>
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
                    :disabled="isLiquidado(credit)"
                    class="transition-colors"
                    :class="isLiquidado(credit) ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-600' : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
                    title="Editar"
                  >
                    <Edit class="h-5 w-5" />
                  </button>

                  <button
                    @click="viewCreditFunding(credit)"
                    :disabled="isLiquidado(credit)"
                    class="transition-colors"
                    :class="isLiquidado(credit) ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-600' : 'text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400'"
                    :title="credit.funded_amount >= credit.loan_amount ? 'Fondeado' : 'Fondear Crédito'"
                  >
                    <Check v-if="credit.funded_amount >= credit.loan_amount" class="h-5 w-5" />
                    <User v-else class="h-5 w-5" />
                  </button>

                  <button
                    @click="restructureCredit(credit)"
                    :disabled="!canRestructureCredit(credit) || isLiquidado(credit)"
                    class="transition-colors"
                    :class="(!canRestructureCredit(credit) || isLiquidado(credit))
                      ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-600'
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

    <!-- Payment Modal -->
    <div
      v-if="showPayModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Registrar Pago</h3>
        
        <form @submit.prevent="submitPayment" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto a Pagar
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model="payForm.amount"
                type="number"
                step="0.01"
                min="0.01"
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-4 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Método de Pago
            </label>
            <select
              v-model="payForm.payment_method"
              class="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="showPayModal = false"
              class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmittingPay"
              class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {{ isSubmittingPay ? 'Procesando...' : 'Confirmar Pago' }}
            </button>
          </div>
        </form>
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
const { isAdmin, token } = useAuth()

const searchQuery = ref('')
const sortColumn = ref('created_at')
const sortDirection = ref('desc')
const credits = ref([])
const providers = ref([])
const selectedProvider = ref('')
const isLoading = ref(false)

// Pay Modal variables
const showPayModal = ref(false)
const selectedCredit = ref(null)
const payForm = ref({
  payment_method: 'cash',
  amount: 0
})
const isSubmittingPay = ref(false)

const getCreditStatus = (credit) => {
  if (isLiquidado(credit)) return { color: 'gray', label: 'Al corriente', sortValue: 3, debt: 0 }
  if (!credit.payment_schedule) return { color: 'gray', label: 'Sin calendario', sortValue: 3, debt: 0 }
  
  let schedule = []
  try {
    schedule = typeof credit.payment_schedule === 'string' ? JSON.parse(credit.payment_schedule) : credit.payment_schedule
  } catch (e) {
    return { color: 'gray', label: 'Error', sortValue: 3, debt: 0 }
  }

  if (!Array.isArray(schedule) || schedule.length === 0) return { color: 'gray', label: 'Sin pagos', sortValue: 3, debt: 0 }

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const paid = Number(credit.paid_amount || 0)
  let expectedToDate = 0
  let nextPaymentAmount = 0
  let nextPaymentDate = null

  for (const payment of schedule) {
    const [py, pm, pd] = payment.date.split('-').map(Number)
    const dueDate = new Date(py, pm - 1, pd, 23, 59, 59, 999)

    if (dueDate <= today) {
      expectedToDate += Number(payment.amount)
    } else {
      if (!nextPaymentDate) {
        nextPaymentDate = dueDate
        nextPaymentAmount = Number(payment.amount)
      }
    }
  }

  if (paid < expectedToDate) {
    return { color: 'red', label: 'Atrasado', sortValue: 1, debt: expectedToDate - paid }
  }

  if (paid < expectedToDate + nextPaymentAmount) {
    return { color: 'yellow', label: 'En periodo de pago', sortValue: 2, debt: (expectedToDate + nextPaymentAmount) - paid }
  }

  return { color: 'gray', label: 'Al corriente', sortValue: 3, debt: 0 }
}

// Fetch credits from API
const fetchCredits = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
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

const fetchProviders = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/providers`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    if (response.ok) {
      providers.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching providers:', error)
  }
}

onMounted(() => {
  fetchCredits()
  fetchProviders()
})

const filteredCredits = computed(() => {
  let result = credits.value.map(credit => {
    return {
      ...credit,
      statusInfo: getCreditStatus(credit)
    }
  })

  // Filter by provider
  if (selectedProvider.value) {
    result = result.filter((credit) => 
      credit.provider_names?.includes(selectedProvider.value)
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((credit) =>
      credit.client_name?.toLowerCase().includes(query) ||
      credit.client_phone?.includes(query) ||
      credit.guarantor_name?.toLowerCase().includes(query) ||
      credit.provider_names?.toLowerCase().includes(query)
    )
  }
  
  return result
})

const sortedCredits = computed(() => {
  const sorted = [...filteredCredits.value]
  
  sorted.sort((a, b) => {
    let aVal = sortColumn.value.includes('.') ? sortColumn.value.split('.').reduce((o, i) => o[i], a) : a[sortColumn.value]
    let bVal = sortColumn.value.includes('.') ? sortColumn.value.split('.').reduce((o, i) => o[i], b) : b[sortColumn.value]
    
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

const isLiquidado = (credit) => {
  if (credit.status === 'completed') return true
  if (credit.loan_type === '10% Semanal') return credit.status === 'completed'
  // Para los tradicionales consideramos liquidado cuando el total pagado es mayor o igual al total a pagar
  return Number(credit.paid_amount || 0) >= Number(credit.total_to_pay || 0)
}

const canRestructureCredit = (credit) => {
  // 10% Semanal cannot be restructured (business rule)
  if (credit.loan_type === '10% Semanal') return false
  return Number(credit.paid_amount || 0) >= (Number(credit.weekly_payment || 0) * 5)
}

const openPayModal = (credit) => {
  if (Number(credit.funded_amount) <= 0) {
    const goToFunding = confirm('Crédito no fondeado, favor de asignar fondos.\n\n¿Deseas ir a la pantalla de fondeo ahora?')
    if (goToFunding) {
      router.push(`/creditos/${credit.id}/fondear`)
    }
    return
  }
  selectedCredit.value = credit
  payForm.value = {
    payment_method: 'cash',
    amount: credit.statusInfo.debt > 0 ? credit.statusInfo.debt : credit.weekly_payment
  }
  showPayModal.value = true
}

const submitPayment = async () => {
  let payAmount = Number(payForm.value.amount);
  if (!payAmount || payAmount <= 0) {
    alert('Por favor ingresa un monto válido')
    return
  }

  isSubmittingPay.value = true
  try {
    const payload = {
      credit_id: selectedCredit.value.id,
      client_id: selectedCredit.value.client_id,
      payment_method: payForm.value.payment_method,
      amount: payAmount,
      user: selectedCredit.value.user || 'admin'
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/incomes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al registrar pago')
    }
    
    if (selectedCredit.value.loan_type === '10% Semanal') {
      const currentBalance = Number(selectedCredit.value.loan_amount) - Number(selectedCredit.value.paid_amount)
      const currentInterest = currentBalance * 0.1;
      const amountToCapital = Math.max(0, payAmount - currentInterest);
      const newBalance = Math.max(0, currentBalance - amountToCapital);
      
      if (newBalance <= 0.01 && selectedCredit.value.status !== 'completed') {
        const updateParams = new FormData();
        updateParams.append('status', 'completed');
        await fetch(`${import.meta.env.VITE_API_URL}/credits/${selectedCredit.value.id}`, {
          method: 'PUT',
          body: updateParams
        });
      }
    }

    showPayModal.value = false
    await fetchCredits() // refresh table
  } catch (error) {
    console.error('Error submitting payment:', error)
    alert('Error al registrar pago: ' + error.message)
  } finally {
    isSubmittingPay.value = false
  }
}
</script>
