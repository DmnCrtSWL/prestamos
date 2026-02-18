<template>
  <AdminLayout>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Cargando...</p>
    </div>

    <div v-else-if="error" class="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-500/10">
      <p class="text-sm font-medium text-red-800 dark:text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="client">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Detalle de Cliente
        </h2>
        <div class="flex gap-3">
          <router-link
            :to="`/clientes/${client.id}/editar`"
            class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-blue-700"
          >
            <Pencil class="mr-2 h-4 w-4" />
            Editar
          </router-link>
          <router-link
            to="/clientes"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            Volver
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Información Personal -->
        <ComponentCard title="Información Personal">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre Completo</label>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ client.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Teléfono</label>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ client.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CURP</label>
              <p class="text-base font-medium text-gray-900 dark:text-white uppercase">{{ client.curp }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Domicilio</label>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ client.address }}</p>
            </div>
          </div>
        </ComponentCard>

        <!-- Información del Sistema -->
        <ComponentCard title="Información del Sistema">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Alta</label>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(client.created_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Última Actualización</label>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(client.updated_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Usuario que dio de Alta</label>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ client.user || 'No especificado' }}</p>
            </div>
          </div>
        </ComponentCard>

        <!-- Documentos -->
        <ComponentCard title="Documentos" class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">INE Frontal</label>
              <div v-if="client.ine_front" class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div v-if="isPdf(client.ine_front)" class="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-800">
                   <FileText class="h-16 w-16 text-gray-400" />
                   <span class="ml-2 font-medium text-gray-500">Documento PDF</span>
                </div>
                <img v-else :src="getFileUrl(client.ine_front)" alt="INE Frontal" class="w-full h-48 object-cover" />
                
                <a :href="getFileUrl(client.ine_front)" target="_blank" class="block p-2 text-center text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-white/5">
                  Ver documento
                </a>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">No disponible</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">INE Reverso</label>
              <div v-if="client.ine_back" class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div v-if="isPdf(client.ine_back)" class="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-800">
                   <FileText class="h-16 w-16 text-gray-400" />
                   <span class="ml-2 font-medium text-gray-500">Documento PDF</span>
                </div>
                <img v-else :src="getFileUrl(client.ine_back)" alt="INE Reverso" class="w-full h-48 object-cover" />

                <a :href="getFileUrl(client.ine_back)" target="_blank" class="block p-2 text-center text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-white/5">
                  Ver documento
                </a>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">No disponible</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Comprobante de Domicilio</label>
              <div v-if="client.comprobant" class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div v-if="isPdf(client.comprobant)" class="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-800">
                   <FileText class="h-16 w-16 text-gray-400" />
                   <span class="ml-2 font-medium text-gray-500">Documento PDF</span>
                </div>
                <img v-else :src="getFileUrl(client.comprobant)" alt="Comprobante" class="w-full h-48 object-cover" />

                <a :href="getFileUrl(client.comprobant)" target="_blank" class="block p-2 text-center text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-white/5">
                  Ver documento
                </a>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">No disponible</p>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { Pencil, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const client = ref(null)
const loading = ref(true)
const error = ref('')

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const fetchClient = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/clients/${route.params.id}`)
    
    if (!response.ok) {
      throw new Error('Cliente no encontrado')
    }
    
    client.value = await response.json()
  } catch (err) {
    console.error('Error fetching client:', err)
    error.value = err.message || 'Error al cargar el cliente'
  } finally {
    loading.value = false
  }
}

const getFileUrl = (path) => {
    if (!path) return '#'
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`
}

const isPdf = (path) => {
    return path && path.toLowerCase().endsWith('.pdf')
}

onMounted(() => {
  fetchClient()
})
</script>
