<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Registrar Nuevo Ingreso
        </h2>
        <button
          @click="router.back()"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white/10"
        >
          Cancelar
        </button>
      </div>

      <div class="grid grid-cols-1 gap-9">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">
              Detalles del Ingreso
            </h3>
          </div>
          
          <form @submit.prevent="submitIncome" class="p-6.5">
            
            <div class="mb-4.5 relative">
              <label class="mb-2.5 block text-black dark:text-white">
                Buscar Crédito (Cliente o ID)
              </label>
              <input
                type="text"
                v-model="searchQuery"
                @input="onSearchInput"
                placeholder="Escribe el nombre del cliente o ID..."
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              
              <!-- Autocomplete Results -->
              <div v-if="showResults && filteredCredits.length > 0" class="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                 <div 
                    v-for="credit in filteredCredits" 
                    :key="credit.id"
                    @click="selectCredit(credit)"
                    class="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors border-b border-stroke dark:border-strokedark last:border-0"
                 >
                    <p class="font-medium text-black dark:text-white">{{ credit.client_name }}</p>
                    <p class="text-sm text-gray-500">ID: #{{ credit.id }} - Deuda: {{ formatCurrency(credit.total_to_pay) }}</p>
                 </div>
              </div>
              <div v-else-if="showResults && searchQuery && filteredCredits.length === 0" class="absolute z-50 left-0 right-0 mt-1 rounded-md border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <p class="text-gray-500 text-center">No se encontraron créditos.</p>
              </div>
            </div>

            <div class="mb-4.5">
               <label class="mb-2.5 block text-black dark:text-white">
                Crédito Seleccionado
              </label>
              <div v-if="selectedCreditId" class="w-full rounded border-[1.5px] border-primary bg-primary/5 py-3 px-5 font-medium text-black dark:text-white">
                 ID: #{{ selectedCreditId }} - {{ selectedClientName }}
              </div>
              <div v-else class="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-gray-500 dark:border-form-strokedark dark:bg-form-input/50">
                 Ningún crédito seleccionado
              </div>
            </div>

            <!-- Removed Client Input as it's redundant with the selected credit display above, but keeping hidden field logic if needed for form submission context, essentially merged into the display above -->

            <div class="mb-4.5">
              <label class="mb-2.5 block text-black dark:text-white">
                Método de Pago
              </label>
              <div class="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  v-model="form.payment_method"
                  class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                >
                  <option value="cash">Efectivo (Cash)</option>
                  <option value="transfer">Transferencia (Transfer)</option>
                </select>
                <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                   <svg
                    class="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>

             <div class="mb-4.5">
               <label class="mb-2.5 block text-black dark:text-white">
                Monto
              </label>
              <input
                type="number"
                v-model="form.amount"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <button
              class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              type="submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Guardando...' : 'Registrar Ingreso' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { userName } = useAuth()
const isLoadingCredits = ref(false)
const isSubmitting = ref(false)
const credits = ref([])
const selectedCreditId = ref('')
const searchQuery = ref('')
const showResults = ref(false)

const form = ref({
    payment_method: 'cash',
    amount: ''
})

const fetchActiveCredits = async () => {
  isLoadingCredits.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits`)
    if (!response.ok) throw new Error('Error al cargar créditos')
    credits.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
    alert('Error al cargar lista de créditos')
  } finally {
    isLoadingCredits.value = false
  }
}

onMounted(() => {
  fetchActiveCredits()
})

const filteredCredits = computed(() => {
    if (!searchQuery.value) return []
    const query = searchQuery.value.toLowerCase()
    return credits.value.filter(credit => 
        credit.client_name.toLowerCase().includes(query) || 
        String(credit.id).includes(query)
    ).slice(0, 5) // Limit to 5 results
})

const onSearchInput = () => {
    showResults.value = true
}

const selectCredit = (credit) => {
    selectedCreditId.value = credit.id
    searchQuery.value = '' // Clear search or keep name? Usually clear or set to name. Let's keep empty to show "Selected" block clearly.
    showResults.value = false
}

const selectedClientName = computed(() => {
    const credit = credits.value.find(c => c.id === selectedCreditId.value)
    return credit ? credit.client_name : ''
})

const submitIncome = async () => {
    if (!selectedCreditId.value) {
        alert('Por favor selecciona un crédito')
        return
    }

    const credit = credits.value.find(c => c.id === selectedCreditId.value)
    if (!credit) return

    isSubmitting.value = true
    try {
        const payload = {
            credit_id: selectedCreditId.value,
            client_id: credit.client_id, 
            payment_method: form.value.payment_method,
            amount: form.value.amount,
            user: userName.value || 'admin'
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/incomes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
             const errorData = await response.json()
             throw new Error(errorData.error || 'Error al registrar ingreso')
        }
        
        alert('Ingreso registrado exitosamente')
        router.push('/caja')

    } catch (error) {
        console.error('Error submitting income:', error)
        alert('Error: ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}
</script>
