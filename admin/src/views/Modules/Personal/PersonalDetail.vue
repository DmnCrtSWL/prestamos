<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="$router.push('/personal')"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Volver"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </button>
        <div>
          <h2 class="text-title-md2 font-bold text-black dark:text-white">
            {{ item?.object || (isLoading ? 'Cargando detalle...' : 'Bien no encontrado') }}
          </h2>
          <p v-if="item" class="text-sm text-gray-500 dark:text-gray-400">
            ID de registro: {{ item.id }}
          </p>
        </div>
      </div>
      <div class="flex gap-2" v-if="item">
        <button 
          @click="$router.push(`/personal/editar/${item.id}`)" 
          class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <EditIcon class="h-4 w-4" />
          Editar Bien
        </button>
      </div>
    </div>

    <!-- Carga -->
    <div v-if="isLoading" class="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="rounded-xl bg-red-50 p-6 text-center dark:bg-red-900/10">
      <h3 class="mb-2 text-lg font-bold text-red-800 dark:text-red-400">Ocurrió un error</h3>
      <p class="text-red-600 dark:text-red-400/80">{{ errorMsg }}</p>
      <button @click="$router.push('/personal')" class="mt-4 text-sm font-semibold text-red-800 hover:underline dark:text-red-400">
        Volver a la lista
      </button>
    </div>

    <!-- Detalle -->
    <div v-else-if="item" class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
          <GalleryHorizontalIcon class="h-5 w-5 text-brand-500" />
          Galería de Archivos Adjuntos
        </h3>
        <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {{ (item.files || []).length }} Archivos
        </span>
      </div>
      
      <div v-if="!item.files || item.files.length === 0" class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center dark:border-gray-700 dark:bg-gray-900/30">
        <UploadCloudIcon class="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p class="text-gray-500 dark:text-gray-400">No hay archivos adjuntos en este bien personal.</p>
        <button @click="$router.push(`/personal/editar/${item.id}`)" class="mt-4 text-sm font-medium text-brand-500 hover:text-brand-600 hover:underline">
          Agregar archivos ahora
        </button>
      </div>

      <div v-else class="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <a 
          v-for="(f, i) in item.files" 
          :key="i"
          :href="f.url" 
          target="_blank"
          :title="'Descargar / Ver ' + f.name"
          class="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
        >
          <!-- Si es imagen, intentamos mostrar una previsualización de fondo (opcional), sino usamos icono -->
          <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-900/30">
            <component :is="fileIcon(f)" class="h-8 w-8" />
          </div>
          
          <p class="w-full truncate text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {{ f.name }}
          </p>
          <div class="mt-1 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <span class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-500">
              <DownloadIcon class="h-3 w-3" /> Abrir
            </span>
          </div>
        </a>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  ArrowLeft as ArrowLeftIcon, 
  Edit as EditIcon,
  Image as ImageIcon,
  FileText as FileTextIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  File as FileIconGen,
  GalleryHorizontal as GalleryHorizontalIcon,
  Download as DownloadIcon,
  UploadCloud as UploadCloudIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const item = ref(null)
const errorMsg = ref('')

onMounted(async () => {
  if (!route.params.id) {
    errorMsg.value = "ID de objeto no proporcionado"
    isLoading.value = false
    return
  }
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/personal/${route.params.id}`)
    if (!res.ok) {
      if (res.status === 404) throw new Error("El bien no fue encontrado o ha sido eliminado.")
      throw new Error("No se pudo cargar la información del bien.")
    }
    item.value = await res.json()
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
})

const fileIcon = (f) => {
  const fmt = (f.format || '').toLowerCase()
  // Imágenes
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(fmt) || f.resource_type === 'image') return ImageIcon
  // Hojas de cálculo
  if (['xls', 'xlsx'].includes(fmt)) return FileSpreadsheetIcon
  // Documentos
  if (['pdf', 'doc', 'docx'].includes(fmt)) return FileTextIcon
  
  return FileIconGen
}
</script>
