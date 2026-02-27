<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Formalización de Crédito
      </h2>
    </div>

    <ComponentCard title="Aprobar Crédito">
      <form @submit.prevent="handleApprove">
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
                  <!-- Mock Dropdown functionality could be implemented here or just search filter -->
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
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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

              <!-- Domicilio Aval -->
              <div class="col-span-12 md:col-span-6 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Domicilio Completo
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
              <div class="col-span-12 space-y-4 pt-4">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">Documentos del Aval</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- INE Frontal Upload -->
                  <div class="rounded-lg border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-white/5">
                    <div class="mb-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                      <Camera v-if="!avalData.ineFrontalFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ avalData.ineFrontalFile ? avalData.ineFrontalFile.name : 'INE Frontal' }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Toma una foto o selecciona el archivo
                    </p>
                    <label class="cursor-pointer inline-flex items-center justify-center rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/15">
                      <input type="file" accept="image/*,application/pdf" class="hidden" @change="(e) => handleFileUpload(e, 'ineFrontalFile')" />
                      <Upload class="mr-2 h-4 w-4" />
                      Seleccionar
                    </label>
                  </div>

                  <!-- INE Reverso Upload -->
                  <div class="rounded-lg border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-white/5">
                    <div class="mb-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                      <Camera v-if="!avalData.ineReversoFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ avalData.ineReversoFile ? avalData.ineReversoFile.name : 'INE Reverso' }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Toma una foto o selecciona el archivo
                    </p>
                    <label class="cursor-pointer inline-flex items-center justify-center rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/15">
                      <input type="file" accept="image/*,application/pdf" class="hidden" @change="(e) => handleFileUpload(e, 'ineReversoFile')" />
                      <Upload class="mr-2 h-4 w-4" />
                      Seleccionar
                    </label>
                  </div>

                  <!-- Comprobante de Domicilio Upload -->
                  <div class="rounded-lg border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-white/5">
                    <div class="mb-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                      <Camera v-if="!avalData.addressProofFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                       {{ avalData.addressProofFile ? avalData.addressProofFile.name : 'Comprobante de Domicilio' }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Toma una foto o selecciona el archivo
                    </p>
                    <label class="cursor-pointer inline-flex items-center justify-center rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/15">
                      <input type="file" accept="image/*,application/pdf" class="hidden" @change="(e) => handleFileUpload(e, 'addressProofFile')" />
                      <Upload class="mr-2 h-4 w-4" />
                      Seleccionar
                    </label>
                  </div>
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
              @click="handleReject"
              :disabled="!selectedClient"
              class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 focus:outline-hidden focus:ring-3 focus:ring-red-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Rechazar Crédito
            </button>
            <button
              type="button"
              @click="showApprovalModal = true"
              :disabled="!selectedClient"
              class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-green-700 focus:outline-hidden focus:ring-3 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Aprobar Crédito
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>

    <!-- Modal de Aprobación -->
    <div v-if="showApprovalModal" class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <!-- Header -->
        <div class="mb-4 flex items-center gap-3">
          <div class="rounded-full bg-yellow-100 p-3 dark:bg-yellow-500/15">
            <AlertTriangle class="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Aprobación de Crédito
          </h3>
        </div>


        <!-- Content -->
        <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Para aprobar el crédito es necesario imprimir el pagaré.
        </p>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button
            type="button"
            @click="printPagareFromModal"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            <Printer class="h-4 w-4" />
            Imprimir Pagaré
          </button>
          <button
            type="button"
            @click="confirmApproval"
            :disabled="!pagarePrinted"
            class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-green-700 focus:outline-hidden focus:ring-3 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continuar
          </button>

          <button
            type="button"
            @click="showApprovalModal = false"
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useAuth } from '@/composables/useAuth'

import { Printer, Smile, Meh, Frown, Camera, Check, Upload, AlertTriangle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { userName } = useAuth()

// Datos del Aval
const avalData = reactive({
  name: '',
  phone: '',
  address: '',
  ineFrontalFile: null,
  ineReversoFile: null,
  addressProofFile: null
})

// Modal state
const showApprovalModal = ref(false)
const pagarePrinted = ref(false)
const isSubmitting = ref(false)

// Detalles del Crédito recibidos desde el simulador
const creditDetails = reactive({
  amount: 0,
  weeklyPayment: 0,
  totalToPay: 0
})

onMounted(() => {
  // Cargar datos del simulador desde query params
  if (route.query.amount) {
    creditDetails.amount = Number(route.query.amount)
    creditDetails.weeklyPayment = Number(route.query.weeklyPayment)
    creditDetails.totalToPay = Number(route.query.totalToPay)
  }
  // Fetch real clients from API
  fetchClients()
})

// Lógica de búsqueda de cliente (Real Data from API)
const searchQuery = ref('')
const selectedClient = ref(null)
const clients = ref([])
const isLoadingClients = ref(false)

// Fetch clients from API
const fetchClients = async () => {
  isLoadingClients.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/clients`)
    if (!response.ok) {
      throw new Error('Error al cargar clientes')
    }
    clients.value = await response.json()
  } catch (error) {
    console.error('Error fetching clients:', error)
    alert('Error al cargar clientes: ' + error.message)
  } finally {
    isLoadingClients.value = false
  }
}

const filteredClients = computed(() => {
  if (!searchQuery.value) return []
  return clients.value.filter(c => 
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.phone.includes(searchQuery.value) ||
    c.curp.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const clientRating = computed(() => {
  if (!selectedClient.value) return { text: 'N/A', color: 'text-gray-400', icon: Meh }
  
  // For now, default to good rating since we don't have status in clients table yet
  return { text: 'Cliente nuevo', color: 'text-green-500', icon: Smile }
})

const selectClient = (client) => {
  selectedClient.value = client
  searchQuery.value = client.name
}

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    avalData[fieldName] = file
  }
}

// Helpers
const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

// Actions
const printPagare = () => {
  alert('Imprimiendo Pagaré para ' + (selectedClient.value?.name || 'Cliente') + ' por ' + formatCurrency(creditDetails.amount))
}

const printPagareFromModal = () => {
  alert('Imprimiendo Pagaré para ' + (selectedClient.value?.name || 'Cliente') + ' por ' + formatCurrency(creditDetails.amount))
  pagarePrinted.value = true
}

const confirmApproval = async () => {
  if (!selectedClient.value || !pagarePrinted.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Calculate retention and net received
    const retentionAmount = creditDetails.amount * 0.10
    const netReceived = creditDetails.amount - retentionAmount
    
    // Generate payment schedule (12 weekly payments starting on next Saturday)
    const paymentSchedule = []
    const startDate = new Date()
    // Find next Saturday (dayOfWeek: 0=Sun, 6=Sat)
    const dayOfWeek = startDate.getDay()
    const daysUntilNextSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek)
    const firstPaymentDate = new Date(startDate)
    firstPaymentDate.setDate(startDate.getDate() + daysUntilNextSaturday)
    firstPaymentDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < 12; i++) {
      const paymentDate = new Date(firstPaymentDate)
      paymentDate.setDate(firstPaymentDate.getDate() + (i * 7)) // week 1 = first Saturday, week 2 = +7, ...
      paymentSchedule.push({
        week: i + 1,
        date: paymentDate.toISOString().split('T')[0],
        amount: creditDetails.weeklyPayment,
        status: 'pending'
      })
    }
    
    // Create FormData for multipart/form-data request
    const formData = new FormData()
    formData.append('client_id', selectedClient.value.id)
    formData.append('loan_amount', creditDetails.amount)
    formData.append('retention_amount', retentionAmount)
    formData.append('net_received', netReceived)
    formData.append('weekly_payment', creditDetails.weeklyPayment)
    formData.append('total_to_pay', creditDetails.totalToPay)
    formData.append('weeks', 12)
    formData.append('user', userName.value || 'admin') // Real logged-in user
    formData.append('guarantor_name', avalData.name)
    formData.append('guarantor_phone', avalData.phone)
    formData.append('guarantor_address', avalData.address)
    formData.append('payment_schedule', JSON.stringify(paymentSchedule))
    formData.append('status', 'approved')
    
    // Append guarantor images
    if (avalData.ineFrontalFile) {
      formData.append('guarantor_ine_front', avalData.ineFrontalFile)
    }
    if (avalData.ineReversoFile) {
      formData.append('guarantor_ine_back', avalData.ineReversoFile)
    }
    if (avalData.addressProofFile) {
      formData.append('guarantor_address_proof', avalData.addressProofFile)
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al aprobar crédito')
    }
    
    console.log('Crédito aprobado:', data.credit)
    alert('¡Crédito Aprobado exitosamente!')
    showApprovalModal.value = false
    pagarePrinted.value = false
    router.push(`/creditos/${data.credit.id}/fondear`)
  } catch (error) {
    console.error('Error approving credit:', error)
    alert('Error al aprobar crédito: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleApprove = () => {
  if (!selectedClient.value) return
  console.log('Aprobando crédito', {
    client: selectedClient.value,
    aval: avalData,
    credit: creditDetails
  })
  alert('Crédito Aprobado exitosamente!')
  router.push('/clientes')
}

const handleReject = () => {
  if (!selectedClient.value) return
  const confirmReject = confirm('¿Estás seguro de RECHAZAR este crédito?')
  if (!confirmReject) return
  
  console.log('Rechazando crédito', {
     client: selectedClient.value,
     reason: 'Rechazo manual'
  })
  alert('Crédito Rechazado.')
  router.push('/simulador')
}
</script>
