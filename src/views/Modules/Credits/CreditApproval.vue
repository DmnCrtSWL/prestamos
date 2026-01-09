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
                   <div class="flex">
                      <Star 
                        v-for="i in 5" 
                        :key="i" 
                        class="w-4 h-4" 
                        :class="i <= clientRating.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'" 
                      />
                   </div>
                   <span class="text-sm font-medium" :class="selectedClient ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'">
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
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

import { Printer, Star, AlertTriangle, CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

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
  totalToPay: 0
})

onMounted(() => {
  // Cargar datos del simulador desde query params
  if (route.query.amount) {
    creditDetails.amount = Number(route.query.amount)
    creditDetails.weeklyPayment = Number(route.query.weeklyPayment)
    creditDetails.totalToPay = Number(route.query.totalToPay)
  }
})

// Lógica de búsqueda de cliente (Mock Data)
const searchQuery = ref('')
const selectedClient = ref(null)

// Datos Mock de clientes (mismos que en Clients.vue para consistencia)
const mockClients = [
  { name: 'Cliente Ejemplo 1', phone: '555-123-4567', status: 'En tiempo' },
  { name: 'Cliente Ejemplo 2', phone: '555-987-6543', status: 'Moroso' },
  { name: 'Cliente Ejemplo 3', phone: '555-111-2222', status: 'Inactivo' },
  { name: 'Cliente Ejemplo 4', phone: '555-333-4444', status: 'En tiempo' },
  { name: 'Cliente Ejemplo 5', phone: '555-555-5555', status: 'En tiempo' },
  { name: 'Cliente Ejemplo 6', phone: '555-666-7777', status: 'Moroso' }
]

const filteredClients = computed(() => {
  if (!searchQuery.value) return []
  return mockClients.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const clientRating = computed(() => {
  if (!selectedClient.value) return { text: 'N/A', color: 'text-gray-400', icon: Star, stars: 0 }
  
  const status = selectedClient.value.status
  if (status === 'En tiempo') return { text: 'Excelente', color: 'text-yellow-400', icon: CheckCircle, stars: 5 }
  if (status === 'Moroso') return { text: 'Riesgo Alto', color: 'text-red-500', icon: AlertTriangle, stars: 1 }
  if (status === 'Inactivo') return { text: 'Sin Historial', color: 'text-gray-500', icon: Star, stars: 0 }
  
  return { text: 'Regular', color: 'text-yellow-400', icon: Star, stars: 3 }
})

const selectClient = (client) => {
  selectedClient.value = client
  searchQuery.value = client.name // Mostrar nombre en input
  // Ocultar dropdown handled by logic inside template using filteredClients condition or click outside
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
