<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          {{ isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
        </h2>
        <button
          @click="router.back()"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white/10"
        >
          Cancelar
        </button>
      </div>

      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">
            Información del Proveedor
          </h3>
        </div>
        <form @submit.prevent="submitForm">
          <div class="p-6.5">
            <div class="mb-4.5">
              <label class="mb-2.5 block text-black dark:text-white">
                Nombre Completo <span class="text-meta-1">*</span>
              </label>
              <input
                type="text"
                v-model="form.name"
                required
                placeholder="Ingrese el nombre del proveedor"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div class="mb-4.5">
              <label class="mb-2.5 block text-black dark:text-white">
                Teléfono
              </label>
              <input
                type="text"
                v-model="form.phone"
                placeholder="Ingrese el teléfono"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div class="mb-4.5">
              <label class="mb-2.5 block text-black dark:text-white">
                Aportación Inicial
              </label>
              <input
                type="number"
                v-model="form.initial_contribution"
                placeholder="0.00"
                step="0.01"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <button
              type="submit"
              class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Proveedor' : 'Crear Proveedor') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const isEditing = computed(() => route.params.id !== undefined)

const form = ref({
    name: '',
    phone: '',
    initial_contribution: 0
})

const fetchProvider = async () => {
    if (!isEditing.value) return
    
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/providers/${route.params.id}`)
        if (!response.ok) throw new Error('Error fetching provider')
        const data = await response.json()
        form.value = {
            name: data.name,
            phone: data.phone,
            initial_contribution: data.initial_contribution
        }
    } catch (error) {
        console.error('Error:', error)
        alert('Error al cargar datos del proveedor')
        router.push('/proveedores')
    }
}

const submitForm = async () => {
    isLoading.value = true
    try {
        const url = isEditing.value 
            ? `${import.meta.env.VITE_API_URL}/providers/${route.params.id}`
            : `${import.meta.env.VITE_API_URL}/providers`
            
        const method = isEditing.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form.value)
        })

        if (!response.ok) throw new Error('Error saving provider')

        router.push('/proveedores')
    } catch (error) {
        console.error('Error:', error)
        alert('Error al guardar proveedor')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchProvider()
})
</script>
