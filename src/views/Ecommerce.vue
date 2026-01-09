<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- First Row: 3 columns -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Card 1: Créditos activos -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
              <DollarSign class="h-6 w-6" />
            </div>
          </div>
          <div>
            <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              37
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Créditos Activos
            </span>
          </div>
        </div>

        <!-- Card 2: Montos Cobrados del Mes -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500">
               <HandCoins class="h-6 w-6" />
            </div>
          </div>
          <div>
            <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $80,345.00
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Montos Cobrados del Mes
            </span>
          </div>
        </div>

        <!-- Card 3: Ingresos netos del mes -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-500">
              <TrendingUp class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $40,177.50
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ingresos Netos del Mes
            </span>
          </div>
        </div>
      </div>

      <!-- Second Row: 2 columns -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Card 4: Monto en circulación -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500">
              <Activity class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $123,456.00
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Monto en Circulación
            </span>
          </div>
        </div>

        <!-- Card 5: Monto disponible -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500">
              <Briefcase class="h-6 w-6" />
            </div>
          </div>
          <div>
             <h4 class="text-title-md2 font-bold text-gray-800 dark:text-white">
              $750,123.00
            </h4>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Monto Disponible
            </span>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { DollarSign, HandCoins, TrendingUp, Activity, Briefcase } from 'lucide-vue-next'
</script>
