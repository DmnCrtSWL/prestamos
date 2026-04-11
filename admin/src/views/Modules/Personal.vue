<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Personal
      </h2>
      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-center font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          Agregar Nuevo
        </button>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">ID</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Objeto</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ item.id }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ item.object }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <button
                    @click="viewItem(item)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
                    title="Ver"
                  >
                    <Eye class="h-5 w-5" />
                  </button>
                  <button
                    @click="editItem(item)"
                    class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Editar"
                  >
                    <Edit class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteItem(item)"
                    class="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                    title="Eliminar"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="3" class="px-5 py-8 text-center sm:px-6 text-gray-500 dark:text-gray-400">
                No hay registros. Haz clic en "Agregar Nuevo" para comenzar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Eye, Edit, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const items = ref([])
const isLoading = ref(false)

const fetchItems = async () => {
  isLoading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/personal`)
    if (!res.ok) throw new Error('Error al cargar bienes personales')
    items.value = await res.json()
  } catch (err) {
    console.error(err)
    alert('Error al cargar los bienes: ' + err.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchItems)

const openAddModal = () => {
  router.push('/personal/nuevo')
}

const viewItem = (item) => {
  router.push(`/personal/${item.id}`)
}

const editItem = (item) => {
  router.push(`/personal/editar/${item.id}`)
}

const deleteItem = async (item) => {
  if (!confirm(`¿Eliminar "${item.object}" (ID: ${item.id})?`)) return
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/personal/${item.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar')
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (err) {
    alert('Error al eliminar: ' + err.message)
  }
}
</script>
