<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <button 
          @click="router.back()" 
          class="p-2 rounded-lg hover:bg-gray-100 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Fondeo de Crédito
        </h2>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
    </div>

    <div v-else-if="error" class="p-6 text-center text-red-500 bg-red-50 rounded-xl dark:bg-red-900/10">
      {{ error }}
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Credit Info Card -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-boxdark">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
             <p class="text-sm text-gray-500 mb-1">Folio del Crédito</p>
             <p class="text-lg font-semibold text-black dark:text-white">#{{ credit?.id }}</p>
          </div>
          <div>
             <p class="text-sm text-gray-500 mb-1">Cliente</p>
             <p class="text-lg font-semibold text-black dark:text-white">{{ credit?.client_name }}</p>
          </div>
          <div>
             <p class="text-sm text-gray-500 mb-1">Usuario</p>
             <p class="text-lg font-semibold text-black dark:text-white">{{ credit?.user || 'N/A' }}</p>
          </div>
           <div>
             <p class="text-sm text-gray-500 mb-1">Cantidad Aprobada</p>
             <p class="text-xl font-bold text-brand-600 dark:text-brand-400">{{ formatCurrency(credit?.loan_amount) }}</p>
          </div>
        </div>
      </div>

      <!-- Funding Stats & Actions -->
      <div class="sticky top-20 z-10 flex flex-col sm:flex-row justify-between items-center rounded-xl bg-white p-4 border border-gray-200 shadow-lg dark:bg-boxdark dark:border-gray-700">
         <div class="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
            <div class="flex items-center gap-3">
               <div class="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <DollarSign class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm text-gray-500">Asignado</p>
                  <p class="text-xl font-bold" :class="isMatch ? 'text-green-600 dark:text-green-400' : 'text-orange-500'">
                     {{ formatCurrency(totalAllocated) }}
                  </p>
               </div>
            </div>

            <div v-if="!isMatch" class="hidden sm:block text-sm text-orange-500 font-medium">
               Faltan: {{ formatCurrency(remainingAmount) }}
            </div>
         </div>

         <div class="flex items-center gap-4 w-full sm:w-auto justify-end">
             <div class="text-right hidden sm:block">
                <p class="text-xs text-gray-500">Total Requerido</p>
                <p class="text-lg font-semibold text-black dark:text-white">{{ formatCurrency(credit?.loan_amount) }}</p>
             </div>
             <button 
                @click="saveFunding"
                :disabled="!isMatch || isSaving"
                class="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-theme-xs"
            >
                {{ isSaving ? 'Guardando...' : 'Guardar Fondeo' }}
             </button>
         </div>
      </div>

      <!-- Providers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="provider in providers" :key="provider.id" 
             class="relative rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-boxdark"
             :class="[
               allocations[provider.id] > 0 
                 ? 'border-blue-500 ring-1 ring-blue-500/20 dark:border-blue-400' 
                 : 'border-gray-200 dark:border-gray-800'
             ]"
        >
          <div class="flex justify-between items-start mb-4">
             <h3 class="font-semibold text-lg text-black dark:text-white truncate pr-2">{{ provider.name }}</h3>
             <span class="shrink-0 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium">
                Disponible
             </span>
          </div>
          
          <p class="text-2xl font-bold text-gray-800 dark:text-white mb-5">
             {{ formatCurrency(provider.available_amount) }}
          </p>
          
          <div class="relative group">
             <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none text-lg">$</span>
             <input 
                type="number" 
                v-model.number="allocations[provider.id]"
                min="0"
                :max="provider.available_amount"
                @wheel.prevent
                class="w-full pl-8 pr-4 py-3 rounded-lg border bg-gray-50 border-gray-200 text-lg font-medium text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="0.00"
             />
          </div>
          
          <!-- Helper text showing allocation percentage if > 0 -->
          <div v-if="allocations[provider.id] > 0" class="mt-2 text-right">
             <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
               {{ Math.round((allocations[provider.id] / credit.loan_amount) * 100) }}% del crédito
             </p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ArrowLeft, DollarSign } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const creditId = route.params.id

const credit = ref(null)
const providers = ref([])
const allocations = ref({}) // Dictionary: providerId -> amount
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref(null)

// Initialize logic
const init = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits/${creditId}/funding-info`)
    if (!response.ok) throw new Error('Error al cargar información')
    
    const data = await response.json()
    credit.value = data.credit
    providers.value = data.providers.map(p => ({
        ...p,
        available_amount: Number(p.available_amount)
    }))
    
    // Initialize allocations with existing fundings
    allocations.value = {} // Reset
    // Prefill with 0 for all providers for reactivity
    providers.value.forEach(p => {
        allocations.value[p.id] = 0
    })

    if (data.fundings && data.fundings.length > 0) {
       data.fundings.forEach(f => {
           if (allocations.value[f.provider_id] !== undefined) {
               allocations.value[f.provider_id] = Number(f.amount)
           }
       })
    }
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(init)

// Computeds
const totalAllocated = computed(() => {
    return Object.values(allocations.value).reduce((sum, amount) => sum + (Number(amount) || 0), 0)
})

const remainingAmount = computed(() => {
    if (!credit.value) return 0
    return Math.max(0, Number(credit.value.loan_amount) - totalAllocated.value)
})

const isMatch = computed(() => {
    if (!credit.value) return false
    // Use epsilon for float comparison
    return Math.abs(totalAllocated.value - Number(credit.value.loan_amount)) < 0.01
})

// Actions
const saveFunding = async () => {
   if (!isMatch.value) return
   
   try {
     isSaving.value = true
     
     // Prepare payload: filtered list of allocations > 0
     const payloadAllocations = Object.entries(allocations.value)
        .filter(([_, amount]) => Number(amount) > 0)
        .map(([providerId, amount]) => ({
            provider_id: Number(providerId),
            amount: Number(amount)
        }))

     const response = await fetch(`${import.meta.env.VITE_API_URL}/credits/${creditId}/fund`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ allocations: payloadAllocations })
     })

     if (!response.ok) {
         const errorData = await response.json()
         throw new Error(errorData.error || 'Error al guardar fondeo')
     }

     alert('Fondeo guardado exitosamente')
     router.push('/creditos')

   } catch (err) {
     alert(err.message)
   } finally {
     isSaving.value = false
   }
}

// Helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value || 0)
}
</script>
