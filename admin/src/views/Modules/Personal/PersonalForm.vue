<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        {{ isEditing ? 'Editar Bien Personal' : 'Nuevo Bien Personal' }}
      </h2>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <form @submit.prevent="saveItem">

        <!-- Objeto -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción del Bien
          </label>
          <input
            type="text"
            v-model="itemObject"
            placeholder="Ej. Camioneta Lobo Negra"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <!-- Uploader -->
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Archivos Adjuntos
            <span class="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">
              (Imágenes, PDF, Excel, Word — hasta 10 MB por archivo)
            </span>
          </label>

          <!-- Drop zone -->
          <div
            class="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/50"
            :class="{ 'border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20': dragover }"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
            @drop.prevent="onDrop"
          >
            <input
              type="file"
              multiple
              class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              @change="onFileChange"
              accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.pdf,.doc,.docx,.xls,.xlsx"
            />
            <div class="flex flex-col items-center">
              <UploadCloudIcon class="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />
              <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Haz clic para seleccionar o arrastra y suelta aquí
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG, HEIC, GIF, WEBP, PDF, DOC, DOCX, XLS, XLSX
              </p>
            </div>
          </div>

          <!-- Existing files (edit mode) -->
          <ul v-if="existingFiles.length > 0" class="mt-4 flex flex-col gap-2">
            <li
              v-for="(f, i) in existingFiles"
              :key="'existing-' + i"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex items-center gap-3 min-w-0">
                <component :is="fileIcon(f)" class="h-5 w-5 flex-shrink-0 text-brand-500" />
                <a
                  :href="f.url"
                  target="_blank"
                  class="truncate text-sm font-medium text-gray-700 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  {{ f.name }}
                </a>
                <span class="text-xs text-gray-400 flex-shrink-0">Guardado</span>
              </div>
              <button
                @click.prevent="removeExistingFile(i)"
                class="ml-3 flex-shrink-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title="Quitar"
              >
                <Trash2Icon class="h-4 w-4" />
              </button>
            </li>
          </ul>

          <!-- New files queued for upload -->
          <ul v-if="newFiles.length > 0" class="mt-2 flex flex-col gap-2">
            <li
              v-for="(f, i) in newFiles"
              :key="'new-' + i"
              class="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-900 dark:bg-brand-900/20"
            >
              <div class="flex items-center gap-3 min-w-0">
                <FileIcon class="h-5 w-5 flex-shrink-0 text-brand-500" />
                <span class="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{{ f.name }}</span>
                <span class="text-xs text-brand-500 flex-shrink-0">Nuevo</span>
              </div>
              <button
                @click.prevent="removeNewFile(i)"
                class="ml-3 flex-shrink-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <Trash2Icon class="h-4 w-4" />
              </button>
            </li>
          </ul>
        </div>

        <!-- Error message -->
        <p v-if="errorMsg" class="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {{ errorMsg }}
        </p>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$router.push('/personal')"
            class="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            :disabled="isSaving"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!itemObject.trim() || isSaving"
            class="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving">Guardando...</span>
            <span v-else>Guardar Bien</span>
          </button>
        </div>

      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  UploadCloud as UploadCloudIcon,
  File as FileIcon,
  FileText,
  FileSpreadsheet,
  Image,
  Trash2 as Trash2Icon,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEditing = ref(false)
const isSaving = ref(false)
const itemObject = ref('')
const dragover = ref(false)
const errorMsg = ref('')

// Files already stored on the server (edit mode)
const existingFiles = ref([])
// New files the user just added (not yet uploaded)
const newFiles = ref([])  // Array of { name, file: File }

// ── Load item when editing ──────────────────────────────────────────────────
onMounted(async () => {
  if (!route.params.id) return
  isEditing.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/personal/${route.params.id}`)
    if (!res.ok) throw new Error('No se encontró el bien')
    const data = await res.json()
    itemObject.value = data.object
    existingFiles.value = Array.isArray(data.files) ? data.files : []
  } catch (err) {
    errorMsg.value = err.message
  }
})

// ── File icon selector ──────────────────────────────────────────────────────
const fileIcon = (f) => {
  const fmt = (f.format || '').toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(fmt) || f.resource_type === 'image') return Image
  if (['xls', 'xlsx'].includes(fmt)) return FileSpreadsheet
  return FileText
}

// ── Drop & input handlers ───────────────────────────────────────────────────
const onDrop = (e) => {
  dragover.value = false
  addFiles(Array.from(e.dataTransfer.files))
}

const onFileChange = (e) => {
  addFiles(Array.from(e.target.files))
  e.target.value = ''
}

const addFiles = (files) => {
  for (const file of files) {
    newFiles.value.push({ name: file.name, file })
  }
}

const removeExistingFile = (i) => existingFiles.value.splice(i, 1)
const removeNewFile = (i) => newFiles.value.splice(i, 1)

// ── Save ────────────────────────────────────────────────────────────────────
const saveItem = async () => {
  if (!itemObject.value.trim()) return
  errorMsg.value = ''
  isSaving.value = true

  try {
    const formData = new FormData()
    formData.append('object', itemObject.value.trim())

    // Tell the server which existing files to keep
    formData.append('existingFiles', JSON.stringify(existingFiles.value))

    // Append each new file
    for (const { file } of newFiles.value) {
      formData.append('files', file)
    }

    const url = isEditing.value
      ? `${import.meta.env.VITE_API_URL}/personal/${route.params.id}`
      : `${import.meta.env.VITE_API_URL}/personal`

    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await fetch(url, { method, body: formData })
    const json = await res.json()

    if (!res.ok) throw new Error(json.error || 'Error al guardar')

    router.push('/personal')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isSaving.value = false
  }
}
</script>
