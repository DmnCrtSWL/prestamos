<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h2 class="text-title-md2 font-bold text-black dark:text-white">
            Aportaciones
            </h2>
            <p v-if="provider" class="text-sm text-gray-500 dark:text-gray-400">
                Proveedor: <span class="font-medium text-black dark:text-white">{{ provider.name }}</span>
            </p>
        </div>
        <button
          @click="router.back()"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white/10"
        >
          Volver
        </button>
      </div>

      <!-- Add Contribution Form -->
      <div class="mb-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">
            Nueva Aportación
          </h3>
        </div>
        <form @submit.prevent="submitContribution">
          <div class="p-6.5">
            <div class="flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/3">
                    <label class="mb-2.5 block text-black dark:text-white">
                        Monto <span class="text-meta-1">*</span>
                    </label>
                    <input
                        type="number"
                        v-model="form.amount"
                        required
                        step="0.01"
                        placeholder="0.00"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div class="w-full xl:w-1/3">
                    <label class="mb-2.5 block text-black dark:text-white">
                        Fecha <span class="text-meta-1">*</span>
                    </label>
                    <input
                        type="date"
                        v-model="form.payment_date"
                        required
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>
                
                 <div class="w-full xl:w-1/3">
                    <label class="mb-2.5 block text-black dark:text-white">
                        Nota
                    </label>
                    <input
                        type="text"
                        v-model="form.note"
                        placeholder="Opcional"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>
            </div>

            <button
              type="submit"
              class="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 xl:w-auto xl:px-8"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Guardando...' : 'Agregar Aportación' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Contributions List -->
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
          <h3 class="font-medium text-black dark:text-white">
            Historial de Aportaciones
          </h3>
          <p v-if="provider" class="text-sm font-medium">
            Capital Final: <span class="text-success text-lg">{{ formatCurrency(totalCapital) }}</span>
          </p>
        </div>
        <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
                <thead>
                    <tr class="bg-gray-2 text-left dark:bg-meta-4">
                        <th class="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                            Fecha
                        </th>
                        <th class="py-4 px-4 font-medium text-black dark:text-white">
                            Monto
                        </th>
                        <th class="py-4 px-4 font-medium text-black dark:text-white">
                            Nota
                        </th>
                        <th class="py-4 px-4 font-medium text-black dark:text-white">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                     <!-- Initial Contribution Row -->
                    <tr v-if="provider && provider.initial_contribution > 0">
                         <td class="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                             <p class="text-black dark:text-white">{{ formatDate(provider.created_at) }}</p>
                             <span class="text-xs text-gray-500">Fecha Alta</span>
                        </td>
                         <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p class="text-success font-bold dark:text-success">{{ formatCurrency(provider.initial_contribution) }}</p>
                             <span class="text-xs text-gray-500">Inicial</span>
                        </td>
                         <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p class="text-black dark:text-white">Aportación Inicial (Registro)</p>
                        </td>
                         <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <span class="text-xs italic text-gray-400">No editable</span>
                        </td>
                    </tr>

                    <!-- Dynamic Contributions -->
                    <tr v-for="contribution in contributions" :key="contribution.id">
                        <td class="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                             <p class="text-black dark:text-white">{{ formatDate(contribution.payment_date) }}</p>
                        </td>
                        <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p class="text-success font-bold dark:text-success">{{ formatCurrency(contribution.amount) }}</p>
                        </td>
                        <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p class="text-black dark:text-white">{{ contribution.note || '-' }}</p>
                        </td>
                        <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div class="flex items-center space-x-3.5">
                                <button class="hover:text-primary" @click="deleteContribution(contribution.id)">
                                     <TrashIcon class="w-5 h-5 text-red-600 transition-colors" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="contributions.length === 0 && (!provider || provider.initial_contribution == 0)">
                        <td colspan="4" class="py-5 text-center text-gray-500">
                            No hay aportaciones registradas.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Trash2 as TrashIcon } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const providerId = route.params.id

const provider = ref(null)
const contributions = ref([])
const isSubmitting = ref(false)

const form = ref({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    note: ''
})

const fetchProvider = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/providers/${providerId}`)
        if (!response.ok) throw new Error('Error fetching provider')
        provider.value = await response.json()
    } catch (error) {
        console.error('Error:', error)
         router.push('/proveedores')
    }
}

const fetchContributions = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/providers/${providerId}/contributions`)
        if (!response.ok) throw new Error('Error fetching contributions')
        contributions.value = await response.json()
    } catch (error) {
        console.error('Error:', error)
    }
}

const submitContribution = async () => {
    isSubmitting.value = true
    try {
        const response = await fetch(`http://localhost:3000/api/providers/${providerId}/contributions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        })

        if (!response.ok) throw new Error('Error saving contribution')

        // Reset form and reload
        form.value.amount = ''
        form.value.note = ''
        form.value.payment_date = new Date().toISOString().split('T')[0]
        
        await fetchContributions()
        // Optionally refresh provider to get updated total if backend provided it, but we calculate locally too
    } catch (error) {
        console.error('Error:', error)
        alert('Error al guardar aportación')
    } finally {
        isSubmitting.value = false
    }
}

const deleteContribution = async (id) => {
    if(!confirm('¿Eliminar esta aportación?')) return

    try {
        const response = await fetch(`http://localhost:3000/api/providers/${providerId}/contributions/${id}`, {
            method: 'DELETE'
        })
         if (!response.ok) throw new Error('Error deleting contribution')
         await fetchContributions()
    } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar')
    }
}

const totalCapital = computed(() => {
    if (!provider.value) return 0
    let total = parseFloat(provider.value.initial_contribution || 0)
    contributions.value.forEach(c => {
        total += parseFloat(c.amount || 0)
    })
    return total
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  // Handle simple dates (YYYY-MM-DD from input) vs ISO strings
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString // fallback
  
  // Use UTC methods for dates coming from backend as simple dates or handle timezone
  // For simplicity using locale string, expecting browser local time
  return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  })
}

onMounted(async () => {
    await fetchProvider()
    await fetchContributions()
})
</script>
