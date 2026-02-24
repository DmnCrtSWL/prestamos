<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Reestructuración de Crédito
        </h2>
        <button
          @click="router.back()"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white/10"
        >
          Volver
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center p-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>

      <div v-else-if="credit" class="flex flex-col gap-6">

        <!-- Top row: Client Info + Loan Info -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Client Info -->
          <div class="col-span-12 md:col-span-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 class="font-medium text-black dark:text-white">Información del Cliente</h3>
            </div>
            <div class="p-6.5 grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Nombre</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_name }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Teléfono</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_phone }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">CURP</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_curp || 'N/A' }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Dirección</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_address || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Loan Info -->
          <div class="col-span-12 md:col-span-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center justify-between">
              <h3 class="font-medium text-black dark:text-white">Detalles del Préstamo Actual</h3>
              <span :class="[
                'inline-flex rounded-full px-3 py-1 text-sm font-medium',
                credit.status === 'approved' || credit.status === 'active'
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500'
                  : credit.status === 'rejected' || credit.status === 'defaulted'
                  ? 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
                  : credit.status === 'completed'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500'
                  : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500',
              ]">
                {{ getStatusLabel(credit.status) }}
              </span>
            </div>
            <div class="p-6.5 grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Monto Original</label>
                <div class="text-2xl font-bold text-black dark:text-white">{{ formatCurrency(credit.loan_amount) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Pago Semanal</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(credit.weekly_payment) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Total a Pagar Original</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(credit.total_to_pay) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Plazo Original</label>
                <div class="font-medium text-black dark:text-white">{{ credit.weeks }} semanas</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Saldo Restante</label>
                <div class="font-medium text-red-600">{{ formatCurrency(remainingBalance) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Schedule -->
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
            <h3 class="font-medium text-black dark:text-white">Calendario de Pagos Actuales</h3>
            <div class="text-sm">
              <span class="text-gray-500">Total Pagado: </span>
              <span class="font-bold text-success">{{ formatCurrency(totalPaidAmount) }}</span>
            </div>
          </div>
          <div class="p-6.5 overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-stroke dark:border-strokedark">
                  <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">No.</th>
                  <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                  <th class="py-3 px-2 text-right font-medium text-gray-500 dark:text-gray-400">Monto</th>
                  <th class="py-3 px-2 text-right font-medium text-gray-500 dark:text-gray-400">Pagado</th>
                  <th class="py-3 px-2 text-center font-medium text-gray-500 dark:text-gray-400">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(payment, idx) in scheduleWithPayments"
                  :key="idx"
                  class="border-b border-stroke dark:border-strokedark last:border-0"
                  :class="{ 'bg-green-50/50 dark:bg-green-500/5': payment.paid >= payment.amount }"
                >
                  <td class="py-3 px-2 text-black dark:text-white">{{ payment.number ?? (idx + 1) }}</td>
                  <td class="py-3 px-2 text-black dark:text-white">{{ payment.date }}</td>
                  <td class="py-3 px-2 text-right text-black dark:text-white">{{ formatCurrency(payment.amount) }}</td>
                  <td class="py-3 px-2 text-right font-medium" :class="{'text-success': payment.paid >= payment.amount, 'text-warning': payment.paid > 0 && payment.paid < payment.amount, 'text-gray-400': payment.paid === 0}">
                    {{ formatCurrency(payment.paid) }}
                  </td>
                  <td class="py-3 px-2 text-center">
                    <span v-if="payment.paid >= payment.amount" class="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">Pagado</span>
                    <span v-else-if="payment.paid > 0" class="inline-flex rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400">Parcial</span>
                    <span v-else class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">Pendiente</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const credit = ref(null)
const incomes = ref([])

const fetchData = async () => {
  isLoading.value = true
  try {
    const creditRes = await fetch(`${import.meta.env.VITE_API_URL}/credits/${route.params.id}`)
    if (!creditRes.ok) throw new Error('Error al cargar crédito')
    credit.value = await creditRes.json()

    const incomesRes = await fetch(`${import.meta.env.VITE_API_URL}/incomes?credit_id=${route.params.id}`)
    if (incomesRes.ok) {
      incomes.value = await incomesRes.json()
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al cargar los detalles')
    router.push('/creditos')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const totalPaidAmount = computed(() => {
  return incomes.value.reduce((sum, income) => sum + Number(income.amount), 0)
})

const remainingBalance = computed(() => {
  if (!credit.value) return 0
  return Math.max(0, credit.value.total_to_pay - totalPaidAmount.value)
})

const scheduleWithPayments = computed(() => {
  if (!credit.value || !credit.value.payment_schedule) return []

  let schedule = []
  if (typeof credit.value.payment_schedule === 'string') {
    try {
      schedule = JSON.parse(credit.value.payment_schedule)
    } catch (e) {
      return []
    }
  } else {
    schedule = credit.value.payment_schedule
  }

  let remainingPaid = totalPaidAmount.value

  return schedule.map((item, idx) => {
    const amount = Number(item.amount)
    let paid = 0

    if (remainingPaid >= amount) {
      paid = amount
      remainingPaid -= amount
    } else {
      paid = remainingPaid
      remainingPaid = 0
    }

    return {
      ...item,
      number: item.week ?? (idx + 1),
      paid
    }
  })
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value || 0)
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
</script>
