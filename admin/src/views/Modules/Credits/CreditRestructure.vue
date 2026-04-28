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
                  <div class="relative">
                    <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 px-4 text-gray-500 dark:text-gray-400 text-xl font-medium">$</span>
                    <input
                      type="number"
                      v-model="newLoanAmount"
                      placeholder="Ej. 30000"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-xl"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                    Tipo de Crédito Nuevo
                  </label>
                  <select
                    v-model="newLoanType"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-lg"
                  >
                    <option value="Tradicional">Crédito Tradicional</option>
                    <option value="Personalizado">Crédito Personalizado (36 semanas)</option>
                  </select>
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
                
                <div v-if="newLoanAmount > 0" class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Nuevo Total a Pagar:</span>
                    <span class="font-medium text-black dark:text-white">{{ formatCurrency(newTotalToPay) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Nuevo Pago Semanal (x{{ currentWeeks }}):</span>
                    <span class="font-medium text-brand-600 dark:text-brand-500">{{ formatCurrency(newWeeklyPayment) }}</span>
                  </div>
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
import jsPDF from 'jspdf'

const route = useRoute()
const router = useRouter()
const { userName, isEmpleados } = useAuth()
const isLoading = ref(true)
const credit = ref(null)
const incomes = ref([])

// Form state
const newLoanAmount = ref(0)
const newLoanType = ref('Tradicional')

const currentWeeks = computed(() => newLoanType.value === 'Personalizado' ? 36 : 12)
const currentInterestRate = computed(() => newLoanType.value === 'Personalizado' ? 125 : 50)

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
    } catch {
      return []
    }
  } else {
    schedule = [...credit.value.payment_schedule]
  }

  if (schedule.length === 0) return schedule

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Only extend ONCE during the credit lifetime
  const alreadyExtended = schedule.length > (credit.value.weeks || 12)
  if (alreadyExtended) return schedule

  let cumulativeExpected = 0
  const sortedIncomes = [...incomes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  for (const payment of schedule) {
    const [py, pm, pd] = payment.date.split('-').map(Number)
    const dueDate = new Date(py, pm - 1, pd, 23, 59, 59, 999)
    cumulativeExpected += Number(payment.amount)

    if (today > dueDate) {
      const paidByDue = sortedIncomes
        .filter(i => new Date(i.created_at) <= dueDate)
        .reduce((sum, i) => sum + Number(i.amount), 0)

      if (paidByDue < cumulativeExpected) {
        const lastPayment = schedule[schedule.length - 1]
        const [ly, lm, ld] = lastPayment.date.split('-').map(Number)
        const lastDate = new Date(ly, lm - 1, ld)
        lastDate.setDate(lastDate.getDate() + 7)
        const pad = (n) => n.toString().padStart(2, '0')
        schedule.push({
          amount: lastPayment.amount,
          date: `${lastDate.getFullYear()}-${pad(lastDate.getMonth() + 1)}-${pad(lastDate.getDate())}`,
          week: schedule.length + 1
        })
        break
      }
    }
  }

  return schedule
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
  const currentDate = new Date(firstDate);
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

const newTotalToPay = computed(() => newLoanAmount.value * (1 + (currentInterestRate.value / 100)))
const newWeeklyPayment = computed(() => currentWeeks.value > 0 ? newTotalToPay.value / currentWeeks.value : 0)

const numberToWords = (num) => {
  const ones = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
    'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
  const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  const hundreds = ['', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
    'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

  if (num === 0) return 'CERO'
  const integer = Math.floor(num)
  const cents = Math.round((num - integer) * 100)

  const convert = (n) => {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' Y ' + ones[n % 10] : '')
    if (n === 100) return 'CIEN'
    const h = Math.floor(n / 100)
    const rest = n % 100
    let word = hundreds[h]
    if (h === 1 && rest > 0) word = 'CIENTO'
    return word + (rest !== 0 ? ' ' + convert(rest) : '')
  }

  const convertThousands = (n) => {
    if (n >= 1000) {
      const th = Math.floor(n / 1000)
      const rest = n % 1000
      const thWord = th === 1 ? 'MIL' : convert(th) + ' MIL'
      return thWord + (rest !== 0 ? ' ' + convert(rest) : '')
    }
    return convert(n)
  }

  return convertThousands(integer) + ' ' + String(cents).padStart(2, '0') + '/100 M.N.'
}

const buildPagare = () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()

  const amount = newLoanAmount.value
  const amountWords = numberToWords(amount)
  const now = new Date()
  const day = now.getDate()
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  const PRIMARY  = [0, 0, 0]
  const DARK     = [20, 20, 20]
  const GRAY     = [100, 100, 100]
  const LIGHTBG  = [245, 245, 245]
  const BORDER   = [200, 200, 200]
  const LINE     = [170, 170, 170]

  const setFont = (style = 'normal', size = 10, color = DARK) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const hline = (x1, y1, x2, y2, color = LINE, w = 0.3) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(w)
    doc.line(x1, y1, x2, y2)
  }
  const fillRect = (x, y, w, h, fill, border) => {
    if (fill)   doc.setFillColor(...fill)
    if (border) doc.setDrawColor(...border)
    else        doc.setDrawColor(255, 255, 255)
    doc.rect(x, y, w, h, fill && border ? 'FD' : fill ? 'F' : 'D')
  }
  const signLine = (x, y, w = 55) => hline(x, y, x + w, y, DARK, 0.4)

  const mx = 16
  const mr = pageW - mx

  let y = 8

  fillRect(0, y, pageW, 18, PRIMARY, PRIMARY)
  setFont('bold', 16, [255, 255, 255])
  doc.text('PAGARÉ', mx, y + 12)
  setFont('normal', 8, [220, 220, 220])
  doc.text('Zamora, Michoacán', mr, y + 7, { align: 'right' })
  setFont('bold', 8, [220, 220, 220])
  doc.text(`No. ${Date.now().toString().slice(-6)}`, mr, y + 13, { align: 'right' })
  y += 22

  fillRect(mx, y, pageW - mx * 2, 12, LIGHTBG, BORDER)
  setFont('bold', 8, GRAY)
  doc.text('LUGAR Y FECHA', mx + 3, y + 4.5)
  setFont('normal', 9, DARK)
  doc.text(`En la ciudad de Zamora, Mich., a ${day} de ${month} de ${year}.`, mx + 3, y + 10)
  y += 16

  setFont('bold', 9, GRAY)
  doc.text('BUENO POR:', mx, y)
  y += 6
  fillRect(mx, y, pageW - mx * 2, 12, [255, 255, 255], BORDER)
  const amtFmt = `$${Number(amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  setFont('bold', 11, PRIMARY)
  doc.text(amtFmt, mx + 3, y + 8)
  setFont('normal', 8.5, DARK)
  doc.text(`(${amountWords})`, mx + 32, y + 8, { maxWidth: pageW - mx * 2 - 36 })
  y += 16

  setFont('bold', 9, PRIMARY)
  doc.text('PROMESA DE PAGO', mx, y)
  hline(mx, y + 1, mr, y + 1, PRIMARY, 0.5)
  y += 6
  setFont('normal', 9, DARK)

  let acreedor = 'FINANCIERA ZAMORA'
  if (isEmpleados.value) {
    acreedor = 'MARÍA CRISTINA VERDUZCO ÁLVAREZ'
  } else {
    acreedor = userName.value ? userName.value.toUpperCase() : 'FINANCIERA ZAMORA'
  }

  const promText = `Debo y pagaré incondicionalmente a la orden de ${acreedor}, la cantidad de ${amtFmt} (${amountWords}), en moneda nacional.`
  const promLines = doc.splitTextToSize(promText, pageW - mx * 2)
  doc.text(promLines, mx, y)
  y += promLines.length * 5 + 3

  fillRect(mx, y, pageW - mx * 2, 14, LIGHTBG, BORDER)
  setFont('bold', 8, GRAY)
  doc.text('TIPO DE CRÉDITO', mx + 3, y + 4.5)
  doc.text('PAGO SEMANAL', mx + 80, y + 4.5)
  doc.text('TOTAL A PAGAR', mx + 140, y + 4.5)
  setFont('bold', 10, PRIMARY)
  doc.text(newLoanType.value || 'Tradicional', mx + 3, y + 11)
  doc.text(`$${Number(newWeeklyPayment.value).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, mx + 80, y + 11)
  doc.text(`$${Number(newTotalToPay.value).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, mx + 140, y + 11)
  y += 18

  setFont('bold', 9, PRIMARY)
  doc.text('INTERESES', mx, y)
  hline(mx, y + 1, mr, y + 1, PRIMARY, 0.5)
  y += 6
  setFont('normal', 9, DARK)
  const intText = 'La cantidad adeudada causará intereses ordinarios a razón del 20% mensual. En caso de mora, causará intereses moratorios a razón del 20% mensual, desde el día siguiente al vencimiento y hasta la total liquidación.'
  const intLines = doc.splitTextToSize(intText, pageW - mx * 2)
  doc.text(intLines, mx, y)
  y += intLines.length * 5 + 3

  setFont('bold', 9, PRIMARY)
  doc.text('JURISDICCIÓN', mx, y)
  hline(mx, y + 1, mr, y + 1, PRIMARY, 0.5)
  y += 6
  setFont('normal', 8.5, DARK)
  const jurText = 'Este pagaré es de naturaleza mercantil conforme a la Ley General de Títulos y Operaciones de Crédito. Para su interpretación y cumplimiento, las partes se someten a las leyes y tribunales competentes de la ciudad de Zamora, Michoacán, renunciando a cualquier otro fuero.'
  const jurLines = doc.splitTextToSize(jurText, pageW - mx * 2)
  doc.text(jurLines, mx, y)
  y += jurLines.length * 4.5 + 5

  signLine(mx, y + 6)
  setFont('bold', 8, GRAY)
  doc.text('FIRMA DEL DEUDOR', mx, y + 11)
  setFont('normal', 8, DARK)
  doc.text(credit.value.client_name || '', mx, y + 16)

  const divY = 142
  hline(0, divY, pageW, divY, [150, 150, 150], 0.8)
  setFont('normal', 7, [180, 180, 180])
  doc.text('✂  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─', mx, divY + 4)

  let ey = divY + 8

  fillRect(0, ey, pageW, 10, PRIMARY, PRIMARY)
  setFont('bold', 10, [255, 255, 255])
  doc.text('DATOS COMPLEMENTARIOS (DEUDOR Y AVAL)', mx, ey + 6.5)
  ey += 14

  const fieldW = pageW - mx * 2

  setFont('bold', 9, PRIMARY)
  doc.text('I. DATOS DEL DEUDOR', mx, ey)
  hline(mx, ey + 1, mx + 40, ey + 1, PRIMARY, 0.4)
  ey += 6

  const deudorFields = [
    ['Nombre completo:', credit.value.client_name || ''],
    ['Domicilio:', credit.value.client_address || ''],
  ]

  deudorFields.forEach(([label, value]) => {
    setFont('bold', 7, GRAY)
    doc.text(label, mx, ey)
    ey += 4
    fillRect(mx, ey, fieldW, 7, [255, 255, 255], BORDER)
    setFont('normal', 8, DARK)
    doc.text(value, mx + 2, ey + 4.5, { maxWidth: fieldW - 4 })
    ey += 9
  })

  setFont('bold', 7, GRAY)
  doc.text('Teléfono:', mx, ey)
  doc.text('Firma del Deudor:', mx + 80, ey)
  ey += 4
  fillRect(mx, ey, 60, 7, [255, 255, 255], BORDER)
  setFont('normal', 8, DARK)
  doc.text(credit.value.client_phone || '', mx + 2, ey + 4.5)
  signLine(mx + 80, ey + 7, fieldW - 80)
  ey += 12

  setFont('bold', 9, PRIMARY)
  doc.text('II. DATOS DEL AVAL', mx, ey)
  hline(mx, ey + 1, mx + 35, ey + 1, PRIMARY, 0.4)
  ey += 5

  setFont('italic', 7.5, GRAY)
  const avalDisclaimer = 'Por medio del presente, el suscrito se constituye como aval solidario, obligándose en los mismos términos que el deudor principal.'
  const disclaimerLines = doc.splitTextToSize(avalDisclaimer, fieldW)
  doc.text(disclaimerLines, mx, ey)
  ey += disclaimerLines.length * 4 + 3

  const avalFields = [
    ['Nombre completo del Aval:', credit.value.guarantor_name || ''],
    ['Domicilio del Aval:', credit.value.guarantor_address || ''],
  ]

  avalFields.forEach(([label, value]) => {
    setFont('bold', 7, GRAY)
    doc.text(label, mx, ey)
    ey += 4
    fillRect(mx, ey, fieldW, 7, [255, 255, 255], BORDER)
    setFont('normal', 8, DARK)
    doc.text(value, mx + 2, ey + 4.5, { maxWidth: fieldW - 4 })
    ey += 9
  })

  setFont('bold', 7, GRAY)
  doc.text('Teléfono Aval:', mx, ey)
  doc.text('Firma del Aval:', mx + 80, ey)
  ey += 4
  fillRect(mx, ey, 60, 7, [255, 255, 255], BORDER)
  setFont('normal', 8, DARK)
  doc.text(credit.value.guarantor_phone || '', mx + 2, ey + 4.5)
  signLine(mx + 80, ey + 7, fieldW - 80)

  hline(mx, pageH - 11, mr, pageH - 11, BORDER, 0.3)
  setFont('normal', 7, GRAY)
  doc.text('Documento generado electrónicamente. Válido como título de crédito con valor legal.', pageW / 2, pageH - 6, { align: 'center' })

  return doc
}

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
      weeks: currentWeeks.value,
      interest_rate: currentInterestRate.value,
      old_debt: oldDebt.value,
      net_delivery: netToReceive.value,
      guarantor_name: credit.value.guarantor_name,
      guarantor_phone: credit.value.guarantor_phone,
      guarantor_address: credit.value.guarantor_address,
      user: userName.value || 'admin',
      loan_type: newLoanType.value
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

    const data = await response.json()

    const doc = buildPagare()
    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank')

    router.push(`/creditos/${data.new_credit.id}`)
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

const getFileUrl = (path) => {
  if (!path) return '#'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`
}
</script>
