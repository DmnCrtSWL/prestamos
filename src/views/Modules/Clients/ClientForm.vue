<template>
  <AdminLayout>
    <ComponentCard title="Nuevo Cliente">
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

              <!-- Correo -->
              <div class="col-span-12 md:col-span-4 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Correo
                </label>
                <input
                  type="email"
                  v-model="formData.email"
                  placeholder="Ingresa el correo electrónico"
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
                  Domicilio
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
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- INE Upload -->
                  <div class="rounded-lg border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-white/5">
                    <div class="mb-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                      <Camera v-if="!formData.ineFile" class="h-6 w-6" />
                      <Check v-else class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ formData.ineFile ? formData.ineFile.name : 'INE o Pasaporte' }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Toma una foto o selecciona el archivo
                    </p>
                    <label class="cursor-pointer inline-flex items-center justify-center rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/15">
                      <input type="file" accept="image/*" capture="environment" class="hidden" @change="(e) => handleFileUpload(e, 'ineFile')" />
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
                      <input type="file" accept="image/*" capture="environment" class="hidden" @change="(e) => handleFileUpload(e, 'addressProofFile')" />
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
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 focus:outline-hidden focus:ring-3 focus:ring-brand-500/50"
            >
              Guardar Cliente
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup>
import { reactive } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { Camera, Upload, Check } from 'lucide-vue-next'

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  curp: '',
  address: '',
  ineFile: null,
  addressProofFile: null
})

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    formData[fieldName] = file
  }
}

const handleSubmit = () => {
  console.log('Form data:', formData)
  // Logic to save client would go here
  alert('Formulario listo. Datos: ' + JSON.stringify(formData))
}
</script>
