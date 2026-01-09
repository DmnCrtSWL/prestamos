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
              <div class="col-span-12 md:col-span-6 pt-6 flex flex-row items-center gap-6">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ine"
                    v-model="formData.hasIne"
                    class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/50 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <label for="ine" class="text-sm font-medium text-gray-700 dark:text-gray-400 select-none cursor-pointer">
                    INE
                  </label>
                </div>
                
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="proofOfAddress"
                    v-model="formData.hasAddressProof"
                    class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/50 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <label for="proofOfAddress" class="text-sm font-medium text-gray-700 dark:text-gray-400 select-none cursor-pointer">
                    Comprobante de Domicilio
                  </label>
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

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  hasIne: false,
  hasAddressProof: false
})

const handleSubmit = () => {
  console.log('Form data:', formData)
  // Logic to save client would go here
  alert('Formulario listo. Datos: ' + JSON.stringify(formData))
}
</script>
