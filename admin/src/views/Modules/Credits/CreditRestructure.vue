<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Detalles del Crédito
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

        <!-- Top row: Client Info + Old Loan Info -->
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

          <!-- Old Loan Info & Debt -->
          <div class="col-span-12 md:col-span-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center justify-between">
              <h3 class="font-medium text-black dark:text-white">Deuda Actual (Crédito Anterior)</h3>
            </div>
            <div class="p-6.5 grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Total a Pagar Original</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(credit.total_to_pay) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm font-semibold text-red-500">Recargos por Atraso</label>
                <div class="font-bold text-red-600">{{ formatCurrency(penaltyAmount) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Total Esperado</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(Number(credit.total_to_pay) + penaltyAmount) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-green-600">Total Pagado</label>
                <div class="font-medium text-green-600">{{ formatCurrency(totalPaidAmount) }}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-stroke dark:border-strokedark">
                <label class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Saldo Pendiente a Liquidar</label>
                <div class="text-2xl font-bold text-black dark:text-white">{{ formatCurrency(oldDebt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Guarantor Info: row 1 = data, row 2 = documents -->
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Información del Aval</h3>
          </div>
          <div class="p-6.5 space-y-6">
            <!-- Row 1: Aval data -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-4">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Nombre</label>
                <div class="font-medium text-black dark:text-white">{{ credit.guarantor_name || 'N/A' }}</div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Teléfono</label>
                <div class="font-medium text-black dark:text-white">{{ credit.guarantor_phone || 'N/A' }}</div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Dirección</label>
                <div class="font-medium text-black dark:text-white">{{ credit.guarantor_address || 'N/A' }}</div>
              </div>
            </div>

            <!-- Row 2: Documents -->
            <div>
              <h4 class="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Documentos</h4>
              <div class="grid grid-cols-12 gap-3">
                <a
                  v-if="credit.guarantor_ine_front"
                  :href="getFileUrl(credit.guarantor_ine_front)"
                  target="_blank"
                  class="col-span-12 sm:col-span-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <FileText class="h-4 w-4 shrink-0" />
                  Ver INE Frontal
                </a>
                <a
                  v-if="credit.guarantor_ine_back"
                  :href="getFileUrl(credit.guarantor_ine_back)"
                  target="_blank"
                  class="col-span-12 sm:col-span-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <FileText class="h-4 w-4 shrink-0" />
                  Ver INE Reverso
                </a>
                <a
                  v-if="credit.guarantor_address_proof"
                  :href="getFileUrl(credit.guarantor_address_proof)"
                  target="_blank"
                  class="col-span-12 sm:col-span-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <FileText class="h-4 w-4 shrink-0" />
                  Ver Comprobante de Domicilio
                </a>
                <p v-if="!credit.guarantor_ine_front && !credit.guarantor_ine_back && !credit.guarantor_address_proof" class="col-span-12 text-sm text-gray-400 dark:text-gray-500">
                  Sin documentos adjuntos
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Restructuring Form -->
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
            <h3 class="font-medium text-black dark:text-white text-lg">Nuevas Condiciones del Crédito</h3>
          </div>
          <div class="p-6.5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Inputs -->
              <div class="space-y-6">
                <div>
                  <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                    Nuevo Monto a Solicitar
                  </label>
                  <input
                    type="number"
                    v-model="newLoanAmount"
                    placeholder="Ej. 30000"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-xl"
                  />
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                        Plazo (Semanas)
                    </label>
                    <input
                        type="number"
                        v-model="newWeeks"
                        placeholder="12"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                        Interés (%)
                    </label>
                    <input
                        type="number"
                        v-model="newInterestRate"
                        placeholder="20"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
              </div>

              <!-- Summary / Breakdown -->
              <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4 border border-gray-100 dark:border-gray-700">
                <h4 class="font-semibold text-black dark:text-white mb-4 border-b pb-2 dark:border-gray-700">Desglose de Efectivo</h4>
                
                <div class="flex justify-between items-center text-lg">
                  <span class="text-gray-600 dark:text-gray-300">Nuevo Préstamo:</span>
                  <span class="font-medium text-black dark:text-white">{{ formatCurrency(newLoanAmount) }}</span>
                </div>
                
                <div class="flex justify-between items-center text-red-500">
                  <span>Retención (10%):</span>
                  <span>- {{ formatCurrency(newRetention) }}</span>
                </div>

                <div class="flex justify-between items-center text-red-500">
                  <span>Liquidación Crédito Anterior:</span>
                  <span>- {{ formatCurrency(oldDebt) }}</span>
                </div>

                <div class="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span class="font-bold text-gray-800 dark:text-white text-lg">Neto a Entregar:</span>
                  <span class="font-bold text-2xl" :class="isValidRestructure ? 'text-green-600' : 'text-red-500'">
                    {{ formatCurrency(netToReceive) }}
                  </span>
                </div>
                
                <p v-if="!isValidRestructure && newLoanAmount > 0" class="text-sm text-red-500 mt-2 text-right">
                  El monto solicitado no cubre la retención ni la deuda anterior.
                </p>
                <div v-if="isValidRestructure" class="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-300">
                  La **caja** fondeará el monto total de {{ formatCurrency(newLoanAmount) }} y automáticamente registrará el ingreso por {{ formatCurrency(oldDebt) }} para saldar el anterior.
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                @click="submitRestructure"
                :disabled="!isValidRestructure || isSubmittingRestructure || newLoanAmount <= 0"
                class="inline-flex w-full md:w-auto justify-center rounded-lg bg-orange-500 p-3 px-8 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmittingRestructure ? 'Procesando...' : 'Aprobar Reestructuración' }}
              </button>
            </div>
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
import { FileText } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { userName } = useAuth()
const isLoading = ref(true)
const credit = ref(null)
const incomes = ref([])

// Form state
const newLoanAmount = ref(0)
const newWeeks = ref(12)
const newInterestRate = ref(20)
const isSubmittingRestructure = ref(false)

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

const extendedSchedule = computed(() => {
  if (!credit.value || !credit.value.payment_schedule) return []

  let schedule = []
  if (typeof credit.value.payment_schedule === 'string') {
    try {
      schedule = JSON.parse(credit.value.payment_schedule)
    } catch (e) {
      return []
    }
  } else {
    schedule = [...credit.value.payment_schedule] // Clone to avoid mutation
  }

  if (schedule.length === 0) return schedule;

  // Check if first payment was made on time
  const [year, month, day] = schedule[0].date.split('-').map(Number);
  const firstPaymentDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  
  const paidAtFirstDate = incomes.value
    .filter(i => new Date(i.created_at) <= firstPaymentDate)
    .reduce((sum, i) => sum + Number(i.amount), 0);
    
  if (paidAtFirstDate < Number(schedule[0].amount)) {
    // Add one extra week at the end
    const lastPayment = schedule[schedule.length - 1];
    const [ly, lm, ld] = lastPayment.date.split('-').map(Number);
    const lastDate = new Date(ly, lm - 1, ld);
    lastDate.setDate(lastDate.getDate() + 7);
    
    // Format to YYYY-MM-DD
    const pad = (n) => n.toString().padStart(2, '0');
    const newDateStr = `${lastDate.getFullYear()}-${pad(lastDate.getMonth() + 1)}-${pad(lastDate.getDate())}`;
    
    schedule.push({
      amount: lastPayment.amount,
      date: newDateStr,
      week: schedule.length + 1
    });
  }

  return schedule;
})

const penaltyAmount = computed(() => {
  const schedule = extendedSchedule.value;
  if (schedule.length === 0) return 0;

  const [year, month, day] = schedule[0].date.split('-').map(Number);
  const firstDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (today <= firstDate) return 0;

  const sortedIncomes = [...incomes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  let totalPenalty = 0;
  let currentDate = new Date(firstDate);
  currentDate.setDate(currentDate.getDate() + 1); // Start penalty computation the day AFTER the due date
  currentDate.setHours(23, 59, 59, 999);
  
  while (currentDate <= today) {
    const expectedAmount = schedule
      .filter(() => true)
      .reduce((sum, p) => {
        const [py, pm, pd] = p.date.split('-').map(Number);
        const pDate = new Date(py, pm - 1, pd, 23, 59, 59, 999);
        return pDate < currentDate ? sum + Number(p.amount) : sum;
      }, 0);
      
    const endOfDay = new Date(currentDate);
    
    const actualAmount = sortedIncomes
      .filter(i => new Date(i.created_at) <= endOfDay)
      .reduce((sum, i) => sum + Number(i.amount), 0);
      
    const unpaid = expectedAmount - actualAmount;
    
    if (unpaid >= 1000) {
      totalPenalty += 100;
    } else if (unpaid > 0) {
      totalPenalty += 50;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return totalPenalty;
});

// Restructure Calculations
const oldDebt = computed(() => {
  if (!credit.value) return 0
  const expectedTotal = Number(credit.value.total_to_pay) + penaltyAmount.value
  return expectedTotal - totalPaidAmount.value
})

const newRetention = computed(() => newLoanAmount.value * 0.1)

const netToReceive = computed(() => newLoanAmount.value - newRetention.value - oldDebt.value)

const isValidRestructure = computed(() => netToReceive.value > 0)

const submitRestructure = async () => {
  if (!isValidRestructure.value) return;

  if (!confirm(`¿Estás seguro de aprobar esta reestructuración? Se crearán los movimientos en caja correspondientes.`)) {
    return;
  }

  isSubmittingRestructure.value = true
  try {
    const payload = {
      old_credit_id: credit.value.id,
      client_id: credit.value.client_id,
      new_loan_amount: newLoanAmount.value,
      weeks: newWeeks.value,
      interest_rate: newInterestRate.value,
      old_debt: oldDebt.value,
      net_delivery: netToReceive.value,
      guarantor_name: credit.value.guarantor_name,
      guarantor_phone: credit.value.guarantor_phone,
      guarantor_address: credit.value.guarantor_address,
      user: userName.value || 'admin'
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits/restructure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al procesar la reestructuración')
    }

    alert('Reestructuración completada exitosamente')
    router.push('/creditos')
  } catch (error) {
    console.error('Error submitting restructure:', error)
    alert('Error: ' + error.message)
  } finally {
    isSubmittingRestructure.value = false
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getFileUrl = (path) => {
  if (!path) return '#'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`
}
</script>
