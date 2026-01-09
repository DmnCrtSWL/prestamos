<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Simulador de Préstamos
      </h2>
      <div class="flex flex-wrap gap-3">
        <button
          :disabled="!amount || !isValidAmount"
          class="inline-flex items-center justify-center gap-2.5 rounded-full py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          :class="!amount || !isValidAmount ? 'cursor-not-allowed bg-gray-400 opacity-50' : 'bg-blue-600'"
        >
          <Printer class="w-5 h-5" />
          Imprimir
        </button>
        <button
          :disabled="!amount || !isValidAmount"
          @click="handleContinue"
          class="inline-flex items-center justify-center gap-2.5 rounded-full py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
           :class="!amount || !isValidAmount ? 'cursor-not-allowed bg-gray-400 opacity-50' : 'bg-green-600'"
        >
          <Check class="w-5 h-5 text-current" />
          Continuar
        </button>
      </div>
    </div>

    <ComponentCard>
      <div class="space-y-6">
        <!-- Input de Monto -->
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Monto a Prestar (Mínimo $10,000)
          </label>
          <div class="relative">
            <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              v-model="amount"
              min="10000"
              placeholder="10000.00"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 pl-[50px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              :class="hasError ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : 'border-gray-300 dark:border-gray-700'"
            />
          </div>
          <p v-if="hasError" class="text-xs text-error-500">
            El monto mínimo es de $10,000
          </p>
        </div>

        <!-- Resultados -->
        <div v-if="isValidAmount" class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
            Desglose del Préstamo
          </h4>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Monto Solicitado:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(amount) }}</span>
            </div>

            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Retención (Fija):</span>
              <span class="text-xl font-bold text-error-500">-{{ formatCurrency(retention) }}</span>
            </div>

            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Recibes Neto:</span>
              <span class="text-xl font-bold text-success-600">{{ formatCurrency(netReceived) }}</span>
            </div>

            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-brand-200 dark:border-brand-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Pago Semanal (x12):</span>
              <span class="text-xl font-bold text-brand-600">{{ formatCurrency(weeklyPayment) }}</span>
            </div>
            
             <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:col-span-2 lg:col-span-4">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total a Pagar:</span>
              <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(totalToPay) }}</span>
            </div>
          </div>

          <!-- Tabla de amortización simple -->
          <div class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
             <div class="max-w-full overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
                  <tr>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400"># Semana</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Pago Programado</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Saldo Pendiente</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr v-for="week in 12" :key="week">
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ week }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(weeklyPayment) }}</td>
                    <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {{ formatCurrency(Math.max(0, totalToPay - (weeklyPayment * week))) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Printer } from 'lucide-vue-next'

const router = useRouter()

// Helper para formatear moneda
const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const amount = ref(10000)
const weeks = 12

// Basado en el ejemplo: $10,000 préstamo -> $1,250 pago semanal -> Total $15,000
// Esto implica un interés total del 50% sobre el monto solicitado ($5,000 extra)
const TOTAL_INTEREST_RATE = 1.5 
// Retención de gastos administrativos fija
const FIXED_RETENTION = 1000

const isValidAmount = computed(() => amount.value >= 10000)
const hasError = computed(() => amount.value > 0 && amount.value < 10000)

const retention = computed(() => {
  if (!isValidAmount.value) return 0
  return FIXED_RETENTION
})

const netReceived = computed(() => {
  if (!isValidAmount.value) return 0
  return amount.value - retention.value
})

const totalToPay = computed(() => {
  if (!isValidAmount.value) return 0
  return amount.value * TOTAL_INTEREST_RATE
})

const weeklyPayment = computed(() => {
  if (!isValidAmount.value) return 0
  return totalToPay.value / weeks
})

const handleContinue = () => {
  if (!isValidAmount.value) return
  router.push({
    path: '/creditos/aprobar',
    query: {
      amount: amount.value,
      weeklyPayment: weeklyPayment.value,
      totalToPay: totalToPay.value
    }
  })
}
</script>
