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
              <h3 class="font-medium text-black dark:text-white">Detalles del Préstamo</h3>
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
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Monto Solicitado</label>
                <div class="text-2xl font-bold text-black dark:text-white">{{ formatCurrency(credit.loan_amount) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Retención (10%)</label>
                <div class="font-medium text-red-600">{{ formatCurrency(credit.retention_amount) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Neto a Recibir</label>
                <div class="font-medium text-green-600">{{ formatCurrency(credit.net_received) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Pago Semanal</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(credit.weekly_payment) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Total a Pagar Original</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(credit.total_to_pay) }}</div>
              </div>
              <div v-if="penaltyAmount > 0">
                <label class="mb-1 block text-sm font-semibold text-red-500">Recargos por Atraso</label>
                <div class="font-bold text-red-600">{{ formatCurrency(penaltyAmount) }}</div>
              </div>
              <div v-if="penaltyAmount > 0">
                <label class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nuevo Total a Pagar</label>
                <div class="font-bold text-black dark:text-white">{{ formatCurrency(Number(credit.total_to_pay) + penaltyAmount) }}</div>
              </div>
              <div v-if="extendedSchedule.length > credit.weeks">
                <label class="mb-1 block text-sm font-semibold text-orange-500">Plazo Actualizado</label>
                <div class="font-bold text-orange-600">{{ extendedSchedule.length }} semanas</div>
              </div>
              <div v-else>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Plazo</label>
                <div class="font-medium text-black dark:text-white">{{ credit.weeks }} semanas</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Operado por</label>
                <div class="font-medium text-black dark:text-white">{{ credit.user || 'N/A' }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Fecha de Creación</label>
                <div class="font-medium text-black dark:text-white">{{ formatDate(credit.created_at) }}</div>
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

        <!-- Payment Schedule -->
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
            <h3 class="font-medium text-black dark:text-white">Calendario de Pagos</h3>
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
                  <th class="py-3 px-2 text-center font-medium text-gray-500 dark:text-gray-400">Acciones</th>
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
                  <td class="py-3 px-2 text-right text-black dark:text-white">
                    <div class="flex flex-col items-end">
                      <span>{{ formatCurrency(payment.amount) }}</span>
                      <span v-if="payment.amount > payment.originalAmount" class="text-[10px] text-red-500 font-medium mt-0.5" title="Incluye recargos por atraso">
                        (+{{ formatCurrency(payment.amount - payment.originalAmount) }} multas)
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-right font-medium" :class="{'text-success': payment.paid >= payment.amount, 'text-warning': payment.paid > 0 && payment.paid < payment.amount, 'text-gray-400': payment.paid === 0}">
                    {{ formatCurrency(payment.paid) }}
                  </td>
                  <td class="py-3 px-2 text-center">
                    <span v-if="payment.paid >= payment.amount" class="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">Pagado</span>
                    <span v-else-if="payment.paid > 0" class="inline-flex rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400">Parcial</span>
                    <span v-else class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">Pendiente</span>
                  </td>
                  <td class="py-3 px-2">
                    <div class="flex items-center justify-end gap-2 pr-4 w-full">
                      <button
                        @click="openPayModal(payment, idx)"
                        :disabled="payment.paid >= payment.amount"
                        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        :class="payment.paid >= payment.amount
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'"
                      >
                        <CreditCard class="h-3.5 w-3.5" />
                        Pagar
                      </button>

                      <button
                        v-if="(payment.number ?? (idx + 1)) >= 5"
                        @click="router.push(`/reestructuracion/${credit.id}`)"
                        :disabled="!canRestructure"
                        class="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        :class="!canRestructure
                          ? 'cursor-not-allowed bg-orange-500/50 text-white/50 dark:bg-orange-600/50'
                          : 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700'"
                        title="Reestructuración"
                      >
                        <Calculator class="h-3.5 w-3.5" />
                      </button>
                      
                      <!-- Placeholder invisible para alinear el botón de pagar con los de abajo -->
                      <button
                        v-else
                        class="invisible inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                      >
                        <Calculator class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- Quick Pay Modal -->
    <div v-if="showPayModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showPayModal = false">
      <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <!-- Header -->
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-primary/10 p-2.5">
              <CreditCard class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-800 dark:text-white">Registrar Pago</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Semana {{ selectedPayment?.number ?? (selectedPaymentIdx + 1) }} · {{ selectedPayment?.date }}</p>
            </div>
          </div>
          <button @click="showPayModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Credit info banner -->
        <div class="mb-5 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Crédito</p>
          <p class="font-semibold text-black dark:text-white">{{ credit?.client_name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Monto esperado: <span class="font-medium text-black dark:text-white">{{ formatCurrency(selectedPayment?.amount) }}</span></p>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Payment method -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago</label>
            <div class="relative">
              <select
                v-model="payForm.payment_method"
                class="w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 outline-none focus:border-primary dark:border-gray-600 dark:text-white dark:bg-gray-900"
              >
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
              </select>
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
              </span>
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
            <input
              type="number"
              v-model="payForm.amount"
              step="0.01"
              min="0"
              :placeholder="selectedPayment?.amount"
              class="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 outline-none focus:border-primary dark:border-gray-600 dark:text-white dark:bg-gray-900"
              required
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex gap-3">
          <button
            @click="showPayModal = false"
            class="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            @click="submitPayment"
            :disabled="isSubmittingPay"
            class="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isSubmittingPay ? 'Guardando...' : 'Registrar Pago' }}
          </button>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { FileText, CreditCard, X, Calculator } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { userName } = useAuth()
const isLoading = ref(true)
const credit = ref(null)
const incomes = ref([])

// Quick pay modal state
const showPayModal = ref(false)
const selectedPayment = ref(null)
const selectedPaymentIdx = ref(0)
const isSubmittingPay = ref(false)
const payForm = ref({
  payment_method: 'cash',
  amount: ''
})

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
  // Need to parse the first date properly (local time)
  // Assuming schedule[0].date is YYYY-MM-DD
  const [year, month, day] = schedule[0].date.split('-').map(Number);
  const firstPaymentDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  
  const paidAtFirstDate = incomes.value
    .filter(i => new Date(i.created_at) <= firstPaymentDate)
    .reduce((sum, i) => sum + Number(i.amount), 0);
    
  // Only extend the schedule if today is already past the first payment due date
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (today > firstPaymentDate && paidAtFirstDate < Number(schedule[0].amount)) {
    // Add one extra week at the end
    const lastPayment = schedule[schedule.length - 1];
    const [ly, lm, ld] = lastPayment.date.split('-').map(Number);
    const lastDate = new Date(ly, lm - 1, ld);
    lastDate.setDate(lastDate.getDate() + 7);
    
    // Format to YYYY-MM-DD
    const pad = (n) => n.toString().padStart(2, '0');
    const newDateStr = `${lastDate.getFullYear()}-${pad(lastDate.getMonth() + 1)}-${pad(lastDate.getDate())}`;
    
    schedule.push({
      amount: lastPayment.amount, // Same weekly amount
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
      .filter(() => true) // Evaluate all
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

const scheduleWithPayments = computed(() => {
  const schedule = extendedSchedule.value;
  let remainingPaid = totalPaidAmount.value
  let penaltyToApply = penaltyAmount.value

  const processedSchedule = schedule.map((item, idx) => {
    const originalAmount = Number(item.amount)
    let amountWithPenalty = originalAmount
    
    let paid = 0

    if (remainingPaid >= originalAmount) {
      paid = originalAmount
      remainingPaid -= originalAmount
    } else {
      paid = remainingPaid
      remainingPaid = 0
    }

    return {
      ...item,
      number: item.week ?? (idx + 1),
      originalAmount,
      amount: amountWithPenalty,
      paid
    }
  })

  // Apply penalty to the first unpaid payment
  if (penaltyToApply > 0) {
    const firstUnpaid = processedSchedule.find(p => p.paid < p.originalAmount)
    if (firstUnpaid) {
      firstUnpaid.amount = firstUnpaid.originalAmount + penaltyToApply
    }
  }

  return processedSchedule
})

const openPayModal = (payment, idx) => {
  selectedPayment.value = payment
  selectedPaymentIdx.value = idx
  payForm.value = {
    payment_method: 'cash',
    amount: payment.amount - payment.paid // Pre-fill with remaining amount
  }
  showPayModal.value = true
}

const submitPayment = async () => {
  if (!payForm.value.amount || Number(payForm.value.amount) <= 0) {
    alert('Por favor ingresa un monto válido')
    return
  }

  isSubmittingPay.value = true
  try {
    const payload = {
      credit_id: credit.value.id,
      client_id: credit.value.client_id,
      payment_method: payForm.value.payment_method,
      amount: payForm.value.amount,
      user: userName.value || 'admin'
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

    showPayModal.value = false
    // Refresh data to update payment status
    await fetchData()
  } catch (error) {
    console.error('Error submitting payment:', error)
    alert('Error: ' + error.message)
  } finally {
    isSubmittingPay.value = false
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

const getFileUrl = (path) => {
  if (!path) return '#'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`
}

const isPdf = (path) => {
  return path && path.toLowerCase().endsWith('.pdf')
}

const canRestructure = computed(() => {
  if (!scheduleWithPayments.value || scheduleWithPayments.value.length < 5) return false;
  
  const payment5 = scheduleWithPayments.value.find(p => (p.number ?? (scheduleWithPayments.value.indexOf(p) + 1)) === 5) || scheduleWithPayments.value[4];
  if (!payment5) return false;
  
  return payment5.paid >= payment5.amount;
});
</script>
