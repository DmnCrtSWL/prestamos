<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Simulador de Préstamos
      </h2>
      <div class="flex flex-wrap gap-3">
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
        <!-- Input de Nombre Cliente -->
         <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Nombre del Cliente (Opcional)
          </label>
          <input
            type="text"
            v-model="clientName"
            placeholder="Ej. Juan Pérez"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 border-gray-300 dark:border-gray-700"
          />
        </div>

        <!-- Input de Monto y Tipo de Préstamo -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Input de Monto -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Monto a Prestar (Mínimo $1,000)
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                v-model="amount"
                min="1000"
                placeholder="1000.00"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 pl-[50px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                :class="hasError ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : 'border-gray-300 dark:border-gray-700'"
              />
            </div>
            <p v-if="hasError" class="text-xs text-error-500">
              El monto mínimo es de $1,000
            </p>
          </div>

          <!-- Selector de Tipo -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tipo de Préstamo
            </label>
            <select
              v-model="loanType"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 border-gray-300 dark:border-gray-700"
            >
              <option value="Tradicional">Tradicional</option>
              <option value="10% Semanal">10% Semanal</option>
              <option value="Personalizado">Personalizado</option>
            </select>
          </div>
        </div>

        <!-- ==================== TRADICIONAL ==================== -->
        <div v-if="loanType === 'Tradicional' && isValidAmount" class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
            Desglose del Préstamo
          </h4>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Monto Solicitado:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(amount) }}</span>
            </div>

            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Gastos Administrativos (10%):</span>
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

        <!-- ==================== 10% SEMANAL ==================== -->
        <div v-if="loanType === '10% Semanal' && isValidAmount" class="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950/20">
          <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h4 class="text-lg font-medium text-gray-800 dark:text-white/90">
              Simulador — Crédito 10% Semanal
            </h4>
            <span class="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              Interés semanal sobre saldo
            </span>
          </div>

          <!-- Explicación del tipo de crédito -->
          <div class="mb-5 rounded-lg border border-orange-200 bg-white p-4 dark:border-orange-800 dark:bg-gray-800/60">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Cada semana se genera un interés del <strong>10%</strong> sobre el saldo pendiente.
              Si el pago cubre <em>exactamente</em> el interés generado, el capital no se reduce.
              Cualquier monto pagado <em>por encima</em> del interés abona a capital.
            </p>
          </div>

          <!-- Resumen base -->
          <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Capital Prestado:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(amount) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Interés Semana 1 (10%):</span>
              <span class="text-xl font-bold text-orange-500">{{ formatCurrency(amount * 0.1) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-orange-200 dark:border-orange-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Deuda al finalizar Sem. 1:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(amount * 1.1) }}</span>
            </div>
          </div>

          <!-- Input pago semanal del cliente -->
          <div class="mb-6 space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              ¿Cuánto pagará el cliente cada semana? (mín. {{ formatCurrency(amount * 0.1) }} para no aumentar capital)
            </label>
            <div class="relative max-w-xs">
              <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                v-model.number="weeklyPaySemanal"
                :min="0"
                :placeholder="(amount * 0.1).toFixed(2)"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 pl-[50px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <!-- Aviso si pago es menor al interés -->
            <p v-if="weeklyPaySemanal > 0 && weeklyPaySemanal < amount * 0.1" class="text-xs text-error-500">
              ⚠️ El pago es menor al interés generado ({{ formatCurrency(amount * 0.1) }}). El capital aumentará semana a semana.
            </p>
            <p v-if="weeklyPaySemanal === amount * 0.1" class="text-xs text-orange-500">
              ℹ️ Solo cubre el interés. El capital no baja nunca.
            </p>
            <p v-if="weeklyPaySemanal > amount * 0.1" class="text-xs text-success-600">
              ✅ {{ formatCurrency(weeklyPaySemanal - amount * 0.1) }} se abona a capital en la primera semana.
            </p>
          </div>

          <!-- Advertencia de semanas infinitas si no abona capital -->
          <div v-if="weeklyPaySemanal > 0 && semanalSchedule.length === 0" class="mb-4 rounded-lg border border-orange-300 bg-orange-100 p-4 dark:border-orange-700 dark:bg-orange-900/30">
            <p class="text-sm font-medium text-orange-700 dark:text-orange-300">
              ⚠️ Con ese pago el cliente <strong>nunca liquida</strong> el crédito.
              El capital permanece en {{ formatCurrency(amount) }} indefinidamente.
            </p>
          </div>

          <!-- Tabla proyección semanal -->
          <div v-if="weeklyPaySemanal > 0" class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
            <div class="max-w-full overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
                  <tr>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400"># Semana</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Saldo Inicial</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Interés (10%)</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Total Adeudado</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Pago Cliente</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Abono a Capital</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Saldo Final</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <!-- Filas con amortización real -->
                  <tr
                    v-for="row in semanalSchedule"
                    :key="row.week"
                    :class="row.paid ? 'bg-green-50 dark:bg-green-900/10' : ''"
                  >
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ row.week }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(row.opening) }}</td>
                    <td class="px-4 py-3 text-orange-500 font-medium">{{ formatCurrency(row.interest) }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(row.total) }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(row.payment) }}</td>
                    <td class="px-4 py-3" :class="row.toCapital > 0 ? 'text-success-600 font-medium' : 'text-gray-400'">
                      {{ formatCurrency(row.toCapital) }}
                    </td>
                    <td class="px-4 py-3 font-medium" :class="row.paid ? 'text-success-600' : 'text-gray-800 dark:text-white/90'">
                      {{ row.paid ? '✅ Liquidado' : formatCurrency(row.closing) }}
                    </td>
                  </tr>
                  <!-- Fila resumen si el crédito se liquida -->
                  <tr v-if="semanalSchedule.length > 0 && semanalSchedule[semanalSchedule.length - 1].paid" class="bg-green-50 dark:bg-green-900/20 font-bold">
                    <td colspan="4" class="px-4 py-3 text-success-700 dark:text-success-400">Total pagado en {{ semanalSchedule.length }} semanas</td>
                    <td class="px-4 py-3 text-success-700 dark:text-success-400">{{ formatCurrency(semanalTotalPaid) }}</td>
                    <td class="px-4 py-3 text-success-700 dark:text-success-400">{{ formatCurrency(Number(amount)) }}</td>
                    <td class="px-4 py-3 text-success-700 dark:text-success-400">—</td>
                  </tr>
                  <!-- Fila de "sigue indefinidamente" -->
                  <tr v-if="weeklyPaySemanal <= amount * 0.1 && weeklyPaySemanal > 0">
                    <td colspan="7" class="px-4 py-3 text-center text-orange-500 font-medium italic">
                      … el crédito continúa indefinidamente con el mismo saldo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Estado placeholder cuando no hay pago definido -->
          <div v-if="!weeklyPaySemanal || weeklyPaySemanal <= 0" class="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p class="text-sm text-gray-400 dark:text-gray-500">
              Ingresa el monto de pago semanal para simular el comportamiento del crédito
            </p>
          </div>

          <!-- ── Penalización por Retraso ── -->
          <div class="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
            <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h5 class="font-medium text-gray-800 dark:text-white/90">Penalización por Retraso</h5>
              <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                :class="penaltyPerDay === 100
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'"
              >
                {{ formatCurrency(penaltyPerDay) }} por día de retraso
              </span>
            </div>

            <!-- Regla informativa -->
            <div class="mb-4 rounded-lg border border-red-100 bg-white p-3 dark:border-red-900 dark:bg-gray-800/60">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Tasa aplicada según capital prestado:
                <span class="mx-2 font-medium text-gray-700 dark:text-gray-300">$0–$999 → $50/día</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">$1,000 en adelante → $100/día</span>
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                ⚠️ A diferencia del crédito tradicional, este tipo <strong>no agrega semanas adicionales</strong>.
                Solo se acumula la penalización diaria sobre el saldo pendiente en el momento del pago.
              </p>
            </div>

            <!-- Input días de retraso -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div class="flex-1 space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Días de retraso
                </label>
                <input
                  type="number"
                  v-model.number="daysLate"
                  min="0"
                  placeholder="0"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 border-gray-300 dark:border-gray-700"
                />
              </div>

              <!-- Resumen penalización -->
              <div v-if="daysLate > 0" class="flex flex-1 flex-col gap-3 sm:flex-row">
                <div class="flex flex-1 flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-red-200 dark:border-red-800">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Penalización acumulada</span>
                  <span class="text-xl font-bold text-red-600">{{ formatCurrency(penaltyTotal) }}</span>
                  <span class="text-xs text-gray-400">{{ daysLate }} día(s) × {{ formatCurrency(penaltyPerDay) }}</span>
                </div>
                <div v-if="weeklyPaySemanal > 0" class="flex flex-1 flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Pago total con retraso (sem. 1)</span>
                  <span class="text-xl font-bold text-gray-800 dark:text-white">
                    {{ formatCurrency(Number(amount) * 1.1 + penaltyTotal) }}
                  </span>
                  <span class="text-xs text-gray-400">Interés sem. 1 + penalización</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== PERSONALIZADO ==================== -->
        <div v-if="loanType === 'Personalizado' && isValidAmount" class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
            Crédito Personalizado
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Los detalles de este tipo de crédito se configuran de forma personalizada con el cliente.
          </p>
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
import { Check } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const router = useRouter()

// Helper para formatear moneda
const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value)
}

const amount = ref(10000)
const clientName = ref('')
const loanType = ref('Tradicional')
const weeks = 12

// ==================== TRADICIONAL ====================
const TOTAL_INTEREST_RATE = 1.5

const isValidAmount = computed(() => amount.value >= 1000)
const hasError = computed(() => amount.value > 0 && amount.value < 1000)

const retention = computed(() => {
  if (!isValidAmount.value) return 0
  return amount.value * 0.10
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

// ==================== 10% SEMANAL ====================
// Pago semanal que ingresa el usuario para la simulación
const weeklyPaySemanal = ref(null)

const MAX_SEMANAL_WEEKS = 520 // cap at 10 years to avoid infinite loops

/**
 * Genera la tabla de amortización para el crédito 10% Semanal.
 * Reglas:
 *   - Cada semana: interés = saldo_inicial * 0.10
 *   - total_adeudado = saldo_inicial + interés
 *   - Si pago >= total_adeudado: crédito liquidado en esa semana
 *   - Si pago > interés: abono a capital = pago - interés; saldo_final = saldo_inicial - abono_capital
 *   - Si pago == interés: no abona capital; saldo_final = saldo_inicial
 *   - Si pago < interés: capital crece (raro pero posible); saldo_final = total_adeudado - pago
 * Sólo se genera tabla cuando hay abono a capital (eventual liquidación).
 */
const semanalSchedule = computed(() => {
  const pay = weeklyPaySemanal.value
  if (!pay || pay <= 0 || !isValidAmount.value) return []

  const minInterest = Number(amount.value) * 0.1
  // Si el pago no supera el interés mínimo inicial no hay amortización, return []
  // (El interés varía si el saldo sube, pero para simplificar: si pago <= interés inicial no hay liquidación)
  if (pay <= minInterest) return []

  const rows = []
  let balance = Number(amount.value)

  for (let week = 1; week <= MAX_SEMANAL_WEEKS; week++) {
    const opening = balance
    const interest = opening * 0.1
    const total = opening + interest

    // Pago efectivo: no puede pagar más de lo que debe
    const effectivePay = Math.min(pay, total)
    const toCapital = Math.max(0, effectivePay - interest)
    const closing = Math.max(0, opening - toCapital)
    const paid = effectivePay >= total || closing <= 0.01

    rows.push({
      week,
      opening,
      interest,
      total,
      payment: effectivePay,
      toCapital,
      closing: paid ? 0 : closing,
      paid
    })

    if (paid) break
    balance = closing
  }

  return rows
})

const semanalTotalPaid = computed(() => {
  return semanalSchedule.value.reduce((acc, r) => acc + r.payment, 0)
})

// ==================== PENALIZACIÓN POR RETRASO ====================
// Regla: $0–$999 → $50/día | $1,000+ → $100/día
const daysLate = ref(0)

const penaltyPerDay = computed(() => {
  if (!isValidAmount.value) return 0
  return Number(amount.value) < 1000 ? 50 : 100
})

const penaltyTotal = computed(() => {
  if (!daysLate.value || daysLate.value <= 0) return 0
  return daysLate.value * penaltyPerDay.value
})

// ==================== CONTINUAR ====================
const handleContinue = () => {
  if (!isValidAmount.value) return
  router.push({
    path: '/creditos/aprobar',
    query: {
      amount: amount.value,
      loanType: loanType.value,
      weeklyPayment: loanType.value === 'Tradicional' ? weeklyPayment.value : undefined,
      totalToPay: loanType.value === 'Tradicional' ? totalToPay.value : undefined
    }
  })
}
</script>
