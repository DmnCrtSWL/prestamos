<template>
  <AdminLayout>
    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
      <p class="text-sm font-medium text-green-800 dark:text-green-500">{{ successMessage }}</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-500/10">
      <p class="text-sm font-medium text-red-800 dark:text-red-500">{{ errorMessage }}</p>
    </div>

    <ComponentCard :title="isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          
          <!-- Información del Cliente -->
          <div>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-12">
              <!-- Nombre -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nombre
                </label>
                <input
                  type="text"
                  v-model="formData.name"
                  required
                  placeholder="Ingresa el nombre completo"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Teléfono -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Teléfono
                </label>
                <input
                  type="tel"
                  v-model="formData.phone"
                  required
                  placeholder="Ingresa el teléfono"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- CURP -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  CURP
                </label>
                <input
                  type="text"
                  v-model="formData.curp"
                  required
                  placeholder="Ingresa la CURP"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 uppercase"
                />
              </div>

              <!-- Domicilio -->
              <div class="col-span-12 md:col-span-6 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Domicilio Completo
                </label>
                <input
                  type="text"
                  v-model="formData.address"
                  required
                  placeholder="Ingresa el domicilio"
                  class="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- Documentos -->
              <div class="col-span-12 space-y-4 pt-4">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">Documentos</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- INE Frontal Upload -->
                  <div class="rounded-lg border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-white/5">
                    <div class="mb-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                      <Camera v-if="!formData.ineFrontalFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ formData.ineFrontalFile ? formData.ineFrontalFile.name : 'INE Frontal' }}
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
                      <Camera v-if="!formData.ineReversoFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ formData.ineReversoFile ? formData.ineReversoFile.name : 'INE Reverso' }}
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
                      <Camera v-if="!formData.addressProofFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                       {{ formData.addressProofFile ? formData.addressProofFile.name : 'Comprobante de Domicilio' }}
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
              to="/clientes"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Cancelar
            </router-link>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 focus:outline-hidden focus:ring-3 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar Cliente' }}
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { Camera, Upload, Check } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { userName } = useAuth()

const clientId = computed(() => route.params.id)
const isEditMode = computed(() => !!clientId.value)

const formData = reactive({
  name: '',
  phone: '',
  curp: '',
  address: '',
  ineFrontalFile: null,
  ineReversoFile: null,
  addressProofFile: null
})

const isSubmitting = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Load client data if in edit mode
const loadClientData = async () => {
  if (!isEditMode.value) return
  
  isLoading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/clients/${clientId.value}`)
    if (!response.ok) {
      throw new Error('Cliente no encontrado')
    }
    
    const client = await response.json()
    formData.name = client.name
    formData.phone = client.phone
    formData.curp = client.curp
    formData.address = client.address
    // Note: We don't load the image files, they will remain null unless user uploads new ones
  } catch (error) {
    console.error('Error loading client:', error)
    errorMessage.value = error.message || 'Error al cargar cliente'
  } finally {
    isLoading.value = false
  }
}

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    formData[fieldName] = file
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Create FormData for multipart/form-data request
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('curp', formData.curp.toUpperCase())
    formDataToSend.append('address', formData.address)
    // Only send user when creating (not editing)
    if (!isEditMode.value && userName.value) {
      formDataToSend.append('user', userName.value)
    }
    
    // Append image files if they exist
    if (formData.ineFrontalFile) {
      formDataToSend.append('ine_front', formData.ineFrontalFile)
    }
    if (formData.ineReversoFile) {
      formDataToSend.append('ine_back', formData.ineReversoFile)
    }
    if (formData.addressProofFile) {
      formDataToSend.append('comprobant', formData.addressProofFile)
    }
    
    const url = isEditMode.value 
      ? `${import.meta.env.VITE_API_URL}/clients/${clientId.value}`
      : `${import.meta.env.VITE_API_URL}/clients`
    
    const method = isEditMode.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method: method,
      body: formDataToSend
      // Don't set Content-Type header - browser will set it automatically with boundary
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `Error al ${isEditMode.value ? 'actualizar' : 'crear'} cliente`)
    }
    
    successMessage.value = isEditMode.value 
      ? 'Cliente actualizado exitosamente'
      : 'Cliente creado exitosamente'
    console.log('Cliente guardado:', data.client)
    
    // Redirect after short delay to show success message
    setTimeout(() => {
      router.push('/clientes')
    }, 1500)
  } catch (error) {
    console.error('Error saving client:', error)
    errorMessage.value = error.message || `Error al ${isEditMode.value ? 'actualizar' : 'crear'} cliente`
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadClientData()
})
</script>
