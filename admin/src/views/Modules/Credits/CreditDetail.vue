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

      <div v-else-if="credit" class="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <!-- Client Info -->
        <div class="flex flex-col gap-9">
          <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 class="font-medium text-black dark:text-white">
                Información del Cliente
              </h3>
            </div>
            <div class="p-6.5">
              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Nombre</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.client_name }}
                </div>
              </div>
              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Teléfono</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.client_phone }}
                </div>
              </div>
              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">CURP</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.client_curp || 'N/A' }}
                </div>
              </div>
              <div>
                <label class="mb-2.5 block text-black dark:text-white">Dirección</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.client_address || 'N/A' }}
                </div>
              </div>
            </div>
          </div>
          
           <!-- Guarantor Info -->
          <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 class="font-medium text-black dark:text-white">
                Información del Aval
              </h3>
            </div>
            <div class="p-6.5">
               <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Nombre</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.guarantor_name }}
                </div>
              </div>
               <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Teléfono</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.guarantor_phone }}
                </div>
              </div>
               <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Dirección</label>
                <div class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {{ credit.guarantor_address }}
                </div>
              </div>
               <!-- Documents Links -->
               <div class="mt-4">
                  <h4 class="mb-3 font-semibold text-black dark:text-white">Documentos</h4>
                  <div class="flex flex-col gap-2">
                    <a
                      v-if="credit.guarantor_ine_front"
                      :href="getFileUrl(credit.guarantor_ine_front)"
                      target="_blank"
                      class="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      <FileText class="h-4 w-4 shrink-0" />
                      Ver INE Frontal
                    </a>
                    <a
                      v-if="credit.guarantor_ine_back"
                      :href="getFileUrl(credit.guarantor_ine_back)"
                      target="_blank"
                      class="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      <FileText class="h-4 w-4 shrink-0" />
                      Ver INE Reverso
                    </a>
                    <a
                      v-if="credit.guarantor_address_proof"
                      :href="getFileUrl(credit.guarantor_address_proof)"
                      target="_blank"
                      class="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      <FileText class="h-4 w-4 shrink-0" />
                      Ver Comprobante de Domicilio
                    </a>
                    <p v-if="!credit.guarantor_ine_front && !credit.guarantor_ine_back && !credit.guarantor_address_proof" class="text-sm text-gray-400 dark:text-gray-500">
                      Sin documentos adjuntos
                    </p>
                  </div>
               </div>

            </div>
          </div>
        </div>

        <!-- Loan Info -->
        <div class="flex flex-col gap-9">
          <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 class="font-medium text-black dark:text-white">
                Detalles del Préstamo
              </h3>
            </div>
            <div class="p-6.5">
              
              <div class="mb-4.5 flex items-center justify-between">
                 <span class="font-medium text-black dark:text-white">Estado:</span>
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

               <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Monto Solicitado</label>
                <div class="w-full text-xl font-bold text-black dark:text-white">
                  {{ formatCurrency(credit.loan_amount) }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4.5">
                <div>
                   <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Retención (10%)</label>
                   <div class="font-medium">{{ formatCurrency(credit.retention_amount) }}</div>
                </div>
                 <div>
                   <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Neto a Recibir</label>
                   <div class="font-medium">{{ formatCurrency(credit.net_received) }}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4.5">
                 <div>
                   <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Pago Semanal</label>
                   <div class="font-medium">{{ formatCurrency(credit.weekly_payment) }}</div>
                </div>
                 <div>
                   <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Total a Pagar</label>
                   <div class="font-medium">{{ formatCurrency(credit.total_to_pay) }}</div>
                </div>
              </div>

               <div class="mb-4.5">
                   <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Semana</label>
                   <div class="font-medium">{{ credit.weeks }} semanas</div>
                </div>

                <div class="mb-4.5">
                   <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Fecha de Creación</label>
                   <div class="font-medium">{{ formatDate(credit.created_at) }}</div>
                </div>
            </div>
          </div>
          
          <!-- Payment Schedule Preview -->
           <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
             <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <h3 class="font-medium text-black dark:text-white">
                Calendario de Pagos
              </h3>
               <div class="text-sm">
                 <span class="text-gray-500">Total Pagado: </span>
                 <span class="font-bold text-success">{{ formatCurrency(totalPaidAmount) }}</span>
               </div>
            </div>
            <div class="p-6.5 max-h-60 overflow-y-auto">
               <table class="w-full text-left text-sm">
                 <thead>
                   <tr class="border-b border-stroke dark:border-strokedark">
                     <th class="py-2">No.</th>
                     <th class="py-2">Fecha</th>
                     <th class="py-2 text-right">Monto</th>
                     <th class="py-2 text-right">Pagado</th>
                     <th class="py-2 text-center">Estado</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr v-for="(payment, idx) in scheduleWithPayments" :key="idx" class="border-b border-stroke dark:border-strokedark last:border-0">
                     <td class="py-2">{{ payment.number }}</td>
                     <td class="py-2">{{ payment.date }}</td>
                     <td class="py-2 text-right">{{ formatCurrency(payment.amount) }}</td>
                     <td class="py-2 text-right font-medium" :class="{'text-success': payment.paid >= payment.amount, 'text-warning': payment.paid > 0 && payment.paid < payment.amount}">
                        {{ formatCurrency(payment.paid) }}
                     </td>
                     <td class="py-2 text-center">
                        <span v-if="payment.paid >= payment.amount" class="text-success text-xs">Pagado</span>
                        <span v-else-if="payment.paid > 0" class="text-warning text-xs">Parcial</span>
                        <span v-else class="text-gray-400 text-xs">Pendiente</span>
                     </td>
                   </tr>
                 </tbody>
               </table>
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

const route = useRoute()
const router = useRouter()
import { FileText } from 'lucide-vue-next'
const isLoading = ref(true)
const credit = ref(null)
const incomes = ref([])

const fetchData = async () => {
  isLoading.value = true
  try {
     // Fetch Credit
    const creditRes = await fetch(`${import.meta.env.VITE_API_URL}/credits/${route.params.id}`)
    if (!creditRes.ok) throw new Error('Error al cargar crédito')
    credit.value = await creditRes.json()

    // Fetch Incomes for this credit
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
  
  return schedule.map(item => {
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
          paid
      }
  })
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
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
</script>
