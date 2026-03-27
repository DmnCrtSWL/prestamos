<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Personal
      </h2>
    </div>

    <!-- Placeholder Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-20 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] flex items-center justify-center">
      <div class="text-center">
        <div class="mb-4 flex justify-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
            <LockIcon class="h-8 w-8" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
          Sección en despliegue
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Esta función estará disponible próximamente para administradores.
        </p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { LockIcon } from '@/icons'
</script>
