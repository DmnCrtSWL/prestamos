<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Formalización de Crédito
      </h2>
    </div>

    <ComponentCard title="Aprobar Crédito">
      <form @submit.prevent="openApproveModal">
        <div class="space-y-6">
          
          <!-- Selección de Cliente -->
          <div>
            <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Selección de Cliente
            </h4>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div class="col-span-12 md:col-span-6 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Buscar Cliente
                </label>
                <div class="relative">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Escribe el nombre del cliente..."
                    class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <div v-if="searchQuery && filteredClients.length > 0 && !selectedClient" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <ul class="max-h-60 overflow-y-auto">
                      <li
                        v-for="client in filteredClients"
                        :key="client.name"
                        @click="selectClient(client)"
                        class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                      >
                        {{ client.name }} - {{ client.phone }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="col-span-12 md:col-span-6 space-y-1.5" v-if="selectedClient">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Cliente Seleccionado
                </label>
                <div class="h-11 flex items-center px-4 rounded-lg bg-brand-50 border border-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20 text-brand-700 dark:text-brand-400 text-sm font-medium">
                  {{ selectedClient.name }}
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-800" />
          
          <!-- Resumen del Crédito (Datos del Simulador) -->
           <div>
            <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Detalles del Crédito
            </h4>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Monto Solicitado</span>
                <span class="block text-lg font-bold text-gray-800 dark:text-white">{{ formatCurrency(creditDetails.amount) }}</span>
              </div>
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Pago Semanal</span>
                <span class="block text-lg font-bold text-brand-600">{{ formatCurrency(creditDetails.weeklyPayment) }}</span>
              </div>
               <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Total a Pagar</span>
                <span class="block text-lg font-bold text-gray-800 dark:text-white">{{ formatCurrency(creditDetails.totalToPay) }}</span>
              </div>
              <!-- Tipo de Crédito -->
              <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                :class="creditDetails.loanType === '10% Semanal'
                  ? 'bg-orange-50 dark:bg-orange-950/20'
                  : 'bg-gray-50 dark:bg-gray-800'"
              >
                <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Tipo de Crédito</span>
                <span class="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="creditDetails.loanType === '10% Semanal'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : creditDetails.loanType === 'Personalizado'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'"
                >
                  {{ creditDetails.loanType || 'Tradicional' }}
                </span>
              </div>
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-4">
                <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Calificación del Cliente</span>
                <div class="flex items-center gap-2 mt-1">
                  <component 
                    :is="clientRating.icon" 
                    class="w-6 h-6" 
                    :class="clientRating.color"
                  />
                   <span class="text-sm font-medium" :class="clientRating.color">
                     {{ clientRating.text }}
                   </span>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-800" />

          <!-- Información del Aval -->
          <div>
            <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Información del Aval
            </h4>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-12">
              <!-- Nombre Aval -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nombre
                </label>
                <input
                  type="text"
                  v-model="avalData.name"
                  required
                  placeholder="Ingresa el nombre completo"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Teléfono Aval -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Teléfono
                </label>
                <input
                  type="tel"
                  v-model="avalData.phone"
                  required
                  placeholder="Ingresa el teléfono"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Correo Aval -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Correo
                </label>
                <input
                  type="email"
                  v-model="avalData.email"
                  placeholder="Ingresa el correo electrónico"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Domicilio Aval -->
              <div class="col-span-12 md:col-span-6 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Domicilio
                </label>
                <input
                  type="text"
                  v-model="avalData.address"
                  required
                  placeholder="Ingresa el domicilio"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Documentos Aval -->
              <div class="col-span-12 md:col-span-6 pt-6 flex flex-row items-center gap-6">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="avalIne"
                    v-model="avalData.hasIne"
                    class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/50 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <label for="avalIne" class="text-sm font-medium text-gray-700 dark:text-gray-400 select-none cursor-pointer">
                    INE
                  </label>
                </div>
                
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="avalProofOfAddress"
                    v-model="avalData.hasAddressProof"
                    class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/50 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <label for="avalProofOfAddress" class="text-sm font-medium text-gray-700 dark:text-gray-400 select-none cursor-pointer">
                    Comprobante de Domicilio
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="mt-6 flex justify-end gap-3">
            <router-link
              to="/simulador"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Cancelar
            </router-link>
            <button
              type="button"
              @click="printPagare"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <Printer class="w-4 h-4" />
              Imprimir Pagaré
            </button>
            <button
              type="button"
              @click="handleReject"
              :disabled="!selectedClient"
              class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 focus:outline-hidden focus:ring-3 focus:ring-red-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Rechazar Crédito
            </button>
            <button
              type="submit"
              :disabled="!selectedClient"
              class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-green-700 focus:outline-hidden focus:ring-3 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Aprobar Crédito
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>

    <!-- ============================================================ -->
    <!-- MODAL DE CONFIRMACIÓN DE APROBACIÓN -->
    <!-- ============================================================ -->
    <Teleport to="body">
      <div
        v-if="showApproveModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showApproveModal = false" />

        <!-- Modal Card -->
        <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">Confirmar Aprobación</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Revise los datos antes de continuar</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-4">
            <!-- Resumen -->
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Cliente:</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedClient?.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Monto:</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ formatCurrency(creditDetails.amount) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Tipo:</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ creditDetails.loanType }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Aval:</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ avalData.name || '—' }}</span>
              </div>
            </div>

            <!-- Indicador de pagaré -->
            <div
              class="flex items-center gap-3 rounded-xl border p-4 transition-all duration-300"
              :class="pagareWasPrinted
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'"
            >
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                :class="pagareWasPrinted ? 'bg-green-100 dark:bg-green-900/40' : 'bg-amber-100 dark:bg-amber-900/40'"
              >
                <CheckCircle v-if="pagareWasPrinted" class="w-4 h-4 text-green-600 dark:text-green-400" />
                <AlertCircle v-else class="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p class="text-sm font-medium" :class="pagareWasPrinted ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'">
                  {{ pagareWasPrinted ? 'Pagaré impreso correctamente' : 'Pagaré pendiente de impresión' }}
                </p>
                <p class="text-xs" :class="pagareWasPrinted ? 'text-green-600/70 dark:text-green-400/70' : 'text-amber-600/70 dark:text-amber-400/70'">
                  {{ pagareWasPrinted ? 'Ya puedes confirmar la aprobación' : 'Debes imprimir el pagaré antes de aprobar' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 flex flex-col gap-3">
            <!-- Botón imprimir pagaré -->
            <button
              type="button"
              @click="printPagare"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Printer class="w-4 h-4" />
              {{ pagareWasPrinted ? 'Reimprimir Pagaré' : 'Imprimir Pagaré' }}
            </button>

            <div class="flex gap-3">
              <button
                type="button"
                @click="showApproveModal = false"
                class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                :disabled="!pagareWasPrinted"
                @click="handleApprove"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                :class="pagareWasPrinted
                  ? 'bg-green-600 hover:bg-green-700 shadow-sm cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-400 dark:text-gray-500'"
              >
                <CheckCircle class="w-4 h-4" />
                Confirmar Aprobación
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { Printer, Smile, Meh, Frown, CheckCircle, AlertCircle } from 'lucide-vue-next'
import jsPDF from 'jspdf'

const route = useRoute()
const router = useRouter()

// Estado del modal de aprobación
const showApproveModal = ref(false)
const pagareWasPrinted = ref(false)

// Datos del Aval
const avalData = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  hasIne: false,
  hasAddressProof: false
})

// Detalles del Crédito recibidos desde el simulador
const creditDetails = reactive({
  amount: 0,
  weeklyPayment: 0,
  totalToPay: 0,
  loanType: 'Tradicional'
})

onMounted(() => {
  if (route.query.amount) {
    creditDetails.amount = Number(route.query.amount)
    creditDetails.weeklyPayment = Number(route.query.weeklyPayment)
    creditDetails.totalToPay = Number(route.query.totalToPay)
    creditDetails.loanType = route.query.loanType || 'Tradicional'
  }
})

// Búsqueda de cliente
const searchQuery = ref('')
const selectedClient = ref(null)

const mockClients = [
  { name: 'Cliente Ejemplo 1', phone: '555-123-4567', address: 'Calle Morelos 12, Zamora, Mich.', status: 'En tiempo' },
  { name: 'Cliente Ejemplo 2', phone: '555-987-6543', address: 'Av. Juárez 45, Zamora, Mich.', status: 'Moroso' },
  { name: 'Cliente Ejemplo 3', phone: '555-111-2222', address: 'Blvd. López Mateos 78, Zamora, Mich.', status: 'Inactivo' },
  { name: 'Cliente Ejemplo 4', phone: '555-333-4444', address: 'Calle Hidalgo 22, Zamora, Mich.', status: 'En tiempo' },
  { name: 'Cliente Ejemplo 5', phone: '555-555-5555', address: 'Calle Independencia 9, Zamora, Mich.', status: 'En tiempo' },
  { name: 'Cliente Ejemplo 6', phone: '555-666-7777', address: 'Priv. Las Flores 3, Zamora, Mich.', status: 'Moroso' }
]

const filteredClients = computed(() => {
  if (!searchQuery.value) return []
  return mockClients.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const clientRating = computed(() => {
  if (!selectedClient.value) return { text: 'N/A', color: 'text-gray-400', icon: Meh }
  const status = selectedClient.value.status
  if (status === 'En tiempo') return { text: 'Pago puntual', color: 'text-green-500', icon: Smile }
  if (status === 'Moroso') return { text: 'Cliente moroso', color: 'text-red-500', icon: Frown }
  return { text: 'Puede mejorar', color: 'text-yellow-500', icon: Meh }
})

const selectClient = (client) => {
  selectedClient.value = client
  searchQuery.value = client.name
}

// Helpers
const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const numberToWords = (num) => {
  const ones = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
    'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
  const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  const hundreds = ['', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
    'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

  if (num === 0) return 'CERO'

  let result = ''
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

  result = convertThousands(integer)
  return result + ' ' + String(cents).padStart(2, '0') + '/100 M.N.'
}

const getFormattedDate = () => {
  const now = new Date()
  const day = now.getDate()
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  return { day, month, year }
}

// ============================================================
// GENERACIÓN DEL PAGARÉ EN PDF — CARTA, DOS SECCIONES
// ============================================================
const printPagare = () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

  const pageW = doc.internal.pageSize.getWidth()   // 215.9 mm
  const pageH = doc.internal.pageSize.getHeight()  // 279.4 mm

  const client = selectedClient.value
  const amount = creditDetails.amount
  const amountWords = numberToWords(amount)
  const { day, month, year } = getFormattedDate()

  // ── Paleta ──────────────────────────────────────────────
  const colorPrimary  = [30, 90, 160]   // azul institucional
  const colorDark     = [20, 20, 20]
  const colorGray     = [100, 100, 100]
  const colorLightBg  = [245, 247, 250]
  const colorBorder   = [200, 210, 220]
  const colorLine     = [170, 185, 200]

  // ── Helpers ─────────────────────────────────────────────
  const setFont = (style = 'normal', size = 10, color = colorDark) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const line2 = (x1, y1, x2, y2, color = colorLine, w = 0.3) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(w)
    doc.line(x1, y1, x2, y2)
  }
  const rect2 = (x, y, w, h, fillColor, borderColor) => {
    if (fillColor) doc.setFillColor(...fillColor)
    if (borderColor) doc.setDrawColor(...borderColor)
    else doc.setDrawColor(0, 0, 0, 0)
    doc.rect(x, y, w, h, fillColor && borderColor ? 'FD' : fillColor ? 'F' : 'D')
  }
  const labelValue = (doc, label, value, x, y, labelW = 40) => {
    setFont('bold', 9, colorGray)
    doc.text(label, x, y)
    setFont('normal', 10, colorDark)
    doc.text(value || '___________________________', x + labelW, y)
  }
  const signatureLine = (x, y, w = 55) => {
    line2(x, y, x + w, y, colorDark, 0.4)
  }

  // =================================================================
  // SECCIÓN 1 — PAGARÉ  (mitad superior: y = 8 a 135)
  // =================================================================
  let sy = 8  // start y
  const sectionH = 133 // height of this half
  const mx = 16  // left margin
  const mr = pageW - 16  // right edge

  // — Fondo de encabezado
  rect2(0, sy, pageW, 18, colorPrimary, colorPrimary)

  setFont('bold', 16, [255, 255, 255])
  doc.text('PAGARÉ', mx, sy + 12)

  // número de folio (cosmético)
  setFont('normal', 8, [200, 220, 255])
  doc.text('Zamora, Michoacán', mr, sy + 7, { align: 'right' })
  setFont('bold', 8, [200, 220, 255])
  doc.text(`No. ${Date.now().toString().slice(-6)}`, mr, sy + 13, { align: 'right' })

  sy += 22

  // — Lugar y fecha
  rect2(mx, sy, pageW - mx * 2, 12, colorLightBg, colorBorder)
  setFont('bold', 8, colorGray)
  doc.text('LUGAR Y FECHA', mx + 3, sy + 4.5)
  setFont('normal', 9, colorDark)
  doc.text(
    `En la ciudad de Zamora, Mich.,  a  ${day}  de  ${month}  de  ${year}.`,
    mx + 3, sy + 10
  )

  sy += 16

  // — Bueno por
  setFont('bold', 9, colorGray)
  doc.text('BUENO POR:', mx, sy)
  sy += 6

  rect2(mx, sy, pageW - mx * 2, 12, [255, 255, 255], colorBorder)
  setFont('bold', 11, colorPrimary)
  const amountFmt = `$${Number(amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  doc.text(amountFmt, mx + 3, sy + 8)
  setFont('normal', 8.5, colorDark)
  const wordsStr = `(${amountWords})`
  doc.text(wordsStr, mx + 30, sy + 8, { maxWidth: pageW - mx * 2 - 34 })

  sy += 16

  // — Promesa de pago
  setFont('bold', 9, colorPrimary)
  doc.text('PROMESA DE PAGO', mx, sy)
  line2(mx, sy + 1, mr, sy + 1, colorPrimary, 0.5)
  sy += 6

  const orden = 'FINANCIERA ZAMORA'  // denominación del acreedor — puedes parametrizar
  setFont('normal', 9, colorDark)
  const promesaText = `Debo y pagaré incondicionalmente a la orden de ${orden}, la cantidad de ${amountFmt} (${amountWords}), en moneda nacional.`
  const promesaLines = doc.splitTextToSize(promesaText, pageW - mx * 2)
  doc.text(promesaLines, mx, sy)
  sy += promesaLines.length * 5 + 3

  // — Tipo de crédito y pagos
  rect2(mx, sy, pageW - mx * 2, 14, colorLightBg, colorBorder)
  setFont('bold', 8, colorGray)
  doc.text('TIPO DE CRÉDITO', mx + 3, sy + 4.5)
  doc.text('PAGO SEMANAL', mx + 70, sy + 4.5)
  doc.text('TOTAL A PAGAR', mx + 130, sy + 4.5)
  setFont('bold', 10, colorPrimary)
  doc.text(creditDetails.loanType || 'Tradicional', mx + 3, sy + 11)
  doc.text(
    creditDetails.weeklyPayment
      ? `$${Number(creditDetails.weeklyPayment).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
      : '—',
    mx + 70, sy + 11
  )
  doc.text(
    creditDetails.totalToPay
      ? `$${Number(creditDetails.totalToPay).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
      : '—',
    mx + 130, sy + 11
  )

  sy += 18

  // — Intereses
  setFont('bold', 9, colorPrimary)
  doc.text('INTERESES', mx, sy)
  line2(mx, sy + 1, mr, sy + 1, colorPrimary, 0.5)
  sy += 6

  const intRate = creditDetails.loanType === '10% Semanal' ? '10' : '20'
  const morRate = creditDetails.loanType === '10% Semanal' ? '10' : '20'
  setFont('normal', 9, colorDark)
  const interesText = `La cantidad adeudada causará intereses ordinarios a razón del ${intRate}% mensual. En caso de mora, causará intereses moratorios a razón del ${morRate}% mensual, desde el día siguiente al vencimiento y hasta la total liquidación.`
  const interesLines = doc.splitTextToSize(interesText, pageW - mx * 2)
  doc.text(interesLines, mx, sy)
  sy += interesLines.length * 5 + 3

  // — Jurisdicción
  setFont('bold', 9, colorPrimary)
  doc.text('JURISDICCIÓN', mx, sy)
  line2(mx, sy + 1, mr, sy + 1, colorPrimary, 0.5)
  sy += 6

  setFont('normal', 8.5, colorDark)
  const jurisText = 'Este pagaré es de naturaleza mercantil conforme a la Ley General de Títulos y Operaciones de Crédito. Para su interpretación y cumplimiento, las partes se someten a las leyes y tribunales competentes de la ciudad de Zamora, Michoacán, renunciando a cualquier otro fuero.'
  const jurisLines = doc.splitTextToSize(jurisText, pageW - mx * 2)
  doc.text(jurisLines, mx, sy)
  sy += jurisLines.length * 4.5 + 5

  // — Firma del deudor
  signatureLine(mx, sy + 6)
  setFont('bold', 8, colorGray)
  doc.text('FIRMA DEL DEUDOR', mx, sy + 11)
  if (client) {
    setFont('normal', 8, colorDark)
    doc.text(client.name, mx, sy + 16)
  }

  // ── Divisor de secciones ──────────────────────────────────────────
  const divY = 145
  line2(0, divY, pageW, divY, [150, 170, 200], 0.8)

  // --- línea de recorte zig-zag simulada ---
  setFont('normal', 7, [180, 180, 180])
  doc.text('✂  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─', mx, divY + 4)

  // =================================================================
  // SECCIÓN 2 — DATOS DEL DEUDOR Y AVAL  (mitad inferior: y = 152 a 270)
  // =================================================================
  let ey = divY + 10
  const hMid = pageW / 2  // center x

  // — Encabezado sec. 2
  rect2(0, ey, pageW, 14, colorPrimary, colorPrimary)
  setFont('bold', 11, [255, 255, 255])
  doc.text('DATOS DEL DEUDOR', mx, ey + 10)
  setFont('normal', 8, [200, 220, 255])
  doc.text('Datos del Aval  ▶', mr, ey + 10, { align: 'right' })

  ey += 18

  // — Columna izquierda: Datos del Deudor
  const colW = (pageW - mx * 2 - 8) / 2
  const col1x = mx
  const col2x = mx + colW + 8

  // Deudor
  setFont('bold', 8, colorPrimary)
  doc.text('DATOS DEL DEUDOR', col1x, ey)
  line2(col1x, ey + 1, col1x + colW, ey + 1, colorPrimary, 0.4)
  ey += 7

  const deudorFields = [
    ['Nombre completo:', client?.name || ''],
    ['Domicilio:', client?.address || ''],
    ['Teléfono:', client?.phone || ''],
  ]

  deudorFields.forEach(([label, value]) => {
    setFont('bold', 8, colorGray)
    doc.text(label, col1x, ey)
    ey += 5
    rect2(col1x, ey, colW, 8, [255, 255, 255], colorBorder)
    setFont('normal', 9, colorDark)
    doc.text(value, col1x + 2, ey + 5.5, { maxWidth: colW - 4 })
    ey += 11
  })

  // Firma del deudor (col 1)
  ey += 4
  signatureLine(col1x, ey + 6, colW - 4)
  setFont('bold', 8, colorGray)
  doc.text('FIRMA DEL DEUDOR', col1x, ey + 11)
  if (client) {
    setFont('normal', 7.5, colorDark)
    doc.text(client.name, col1x, ey + 16)
  }

  // — Columna derecha: Datos del Aval
  let ay = divY + 10 + 18

  setFont('bold', 8, colorPrimary)
  doc.text('DATOS DEL AVAL', col2x, ay)
  line2(col2x, ay + 1, col2x + colW, ay + 1, colorPrimary, 0.4)
  ay += 7

  // Texto aval solidario
  setFont('italic', 8, colorGray)
  const avalText = 'Por medio del presente, el suscrito se constituye como aval solidario, obligándose en los mismos términos que el deudor principal.'
  const avalTextLines = doc.splitTextToSize(avalText, colW)
  doc.text(avalTextLines, col2x, ay)
  ay += avalTextLines.length * 4.5 + 5

  const avalFields = [
    ['Nombre completo:', avalData.name],
    ['Domicilio:', avalData.address],
    ['Teléfono:', avalData.phone],
  ]

  avalFields.forEach(([label, value]) => {
    setFont('bold', 8, colorGray)
    doc.text(label, col2x, ay)
    ay += 5
    rect2(col2x, ay, colW, 8, [255, 255, 255], colorBorder)
    setFont('normal', 9, colorDark)
    doc.text(value || '', col2x + 2, ay + 5.5, { maxWidth: colW - 4 })
    ay += 11
  })

  // Firma del aval
  ay += 4
  signatureLine(col2x, ay + 6, colW - 4)
  setFont('bold', 8, colorGray)
  doc.text('FIRMA DEL AVAL', col2x, ay + 11)
  if (avalData.name) {
    setFont('normal', 7.5, colorDark)
    doc.text(avalData.name, col2x, ay + 16)
  }

  // — Pie de página
  const footerY = pageH - 8
  line2(mx, footerY - 3, mr, footerY - 3, colorBorder, 0.3)
  setFont('normal', 7, colorGray)
  doc.text('Documento generado electrónicamente. Válido como título de crédito con valor legal.', pageW / 2, footerY, { align: 'center' })

  // — Imprimir
  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')

  pagareWasPrinted.value = true
}

// Abrir modal de confirmación
const openApproveModal = () => {
  if (!selectedClient.value) return
  pagareWasPrinted.value = false
  showApproveModal.value = true
}

// Confirmar aprobación
const handleApprove = () => {
  if (!selectedClient.value || !pagareWasPrinted.value) return
  showApproveModal.value = false
  console.log('Aprobando crédito', {
    client: selectedClient.value,
    aval: avalData,
    credit: creditDetails
  })
  router.push('/clientes')
}

// Rechazar
const handleReject = () => {
  if (!selectedClient.value) return
  const confirmReject = confirm('¿Estás seguro de RECHAZAR este crédito?')
  if (!confirmReject) return
  router.push('/simulador')
}
</script>
