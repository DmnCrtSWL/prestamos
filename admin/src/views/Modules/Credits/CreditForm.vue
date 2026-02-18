<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Editar Crédito
        </h2>
        <button
          @click="router.back()"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white/10"
        >
          Cancelar
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center p-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>

      <div v-else class="grid grid-cols-1 gap-9">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">
              Información del Crédito - {{ credit.client_name }}
            </h3>
          </div>
          
          <form @submit.prevent="updateCredit" class="p-6.5">
            
            <div class="mb-4.5">
              <label class="mb-2.5 block text-black dark:text-white">
                Estatus del Crédito
              </label>
              <div class="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  v-model="form.status"
                  class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="defaulted">Vencido</option>
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
                Nombre del Aval
              </label>
              <input
                type="text"
                v-model="form.guarantor_name"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div class="mb-4.5">
               <label class="mb-2.5 block text-black dark:text-white">
                Teléfono del Aval
              </label>
              <input
                type="text"
                v-model="form.guarantor_phone"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div class="mb-4.5">
               <label class="mb-2.5 block text-black dark:text-white">
                Dirección del Aval
              </label>
              <textarea
                v-model="form.guarantor_address"
                rows="3"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ></textarea>
            </div>
             
             <!-- File Inputs (Optional override) -->
            <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Actualizar INE Frente (Opcional)</label>
                <input type="file" accept="image/*,application/pdf" @change="handleFileUpload($event, 'guarantor_ine_front')" class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary" />
                 <p v-if="credit.guarantor_ine_front" class="mt-1 text-sm text-gray-500">Documento actual: <a :href="getFileUrl(credit.guarantor_ine_front)" target="_blank" class="text-primary hover:underline">Ver</a></p>
            </div>
             
            <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Actualizar INE Reverso (Opcional)</label>
                <input type="file" accept="image/*,application/pdf" @change="handleFileUpload($event, 'guarantor_ine_back')" class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary" />
                <p v-if="credit.guarantor_ine_back" class="mt-1 text-sm text-gray-500">Documento actual: <a :href="getFileUrl(credit.guarantor_ine_back)" target="_blank" class="text-primary hover:underline">Ver</a></p>
            </div>

             <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Actualizar Comprobante Domicilio (Opcional)</label>
                <input type="file" accept="image/*,application/pdf" @change="handleFileUpload($event, 'guarantor_address_proof')" class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary" />
                <p v-if="credit.guarantor_address_proof" class="mt-1 text-sm text-gray-500">Documento actual: <a :href="getFileUrl(credit.guarantor_address_proof)" target="_blank" class="text-primary hover:underline">Ver</a></p>
            </div>


            <button
              class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              type="submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const isSubmitting = ref(false)
const credit = ref(null)

const form = ref({
    status: '',
    guarantor_name: '',
    guarantor_phone: '',
    guarantor_address: '',
    guarantor_ine_front: null,
    guarantor_ine_back: null,
    guarantor_address_proof: null
})

const fetchCredit = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/credits/${route.params.id}`)
    if (!response.ok) throw new Error('Error al cargar crédito')
    credit.value = await response.json()
    
    // Initialize form with fetched data
    form.value.status = credit.value.status
    form.value.guarantor_name = credit.value.guarantor_name
    form.value.guarantor_phone = credit.value.guarantor_phone
    form.value.guarantor_address = credit.value.guarantor_address

  } catch (error) {
    console.error('Error:', error)
    alert('Error al cargar los detalles del crédito')
    router.push('/creditos')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCredit()
})

const handleFileUpload = (event, fieldName) => {
    const file = event.target.files[0]
    if (file) {
        form.value[fieldName] = file
    }
}

const updateCredit = async () => {
    isSubmitting.value = true
    try {
        const formData = new FormData()
        formData.append('status', form.value.status)
        formData.append('guarantor_name', form.value.guarantor_name)
        formData.append('guarantor_phone', form.value.guarantor_phone)
        formData.append('guarantor_address', form.value.guarantor_address)
        
        if (form.value.guarantor_ine_front) formData.append('guarantor_ine_front', form.value.guarantor_ine_front)
        if (form.value.guarantor_ine_back) formData.append('guarantor_ine_back', form.value.guarantor_ine_back)
        if (form.value.guarantor_address_proof) formData.append('guarantor_address_proof', form.value.guarantor_address_proof)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/credits/${route.params.id}`, {
            method: 'PUT',
            body: formData
        })

        if (!response.ok) {
             const errorData = await response.json()
             throw new Error(errorData.error || 'Error al actualizar crédito')
        }
        
        alert('Crédito actualizado correctamente')
        router.push('/creditos')

    } catch (error) {
        console.error('Error updating credit:', error)
        alert('Error: ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}

const getFileUrl = (path) => {
    if (!path) return '#'
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`
}
</script>
