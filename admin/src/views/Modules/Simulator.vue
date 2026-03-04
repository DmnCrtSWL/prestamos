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
        <!-- Nombre Cliente -->
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

        <!-- Monto + Tipo -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Monto a Prestar (Mínimo $1,000)
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">$</span>
              <input
                type="number"
                v-model="amount"
                min="1000"
                placeholder="1000.00"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 pl-[50px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                :class="hasError ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : 'border-gray-300 dark:border-gray-700'"
              />
            </div>
            <p v-if="hasError" class="text-xs text-error-500">El monto mínimo es de $1,000</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Tipo de Préstamo</label>
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
          <h4 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Desglose del Préstamo</h4>
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
                    <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ formatCurrency(Math.max(0, totalToPay - (weeklyPayment * week))) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================== 10% SEMANAL ==================== -->
        <div v-if="loanType === '10% Semanal' && isValidAmount" class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">Desglose del Préstamo — 10% Semanal</h4>

          <!-- Resumen base -->
          <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Capital Prestado:</span>
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
              <span class="text-sm text-gray-500 dark:text-gray-400">Interés por semana (10%):</span>
              <span class="text-xl font-bold text-brand-600">{{ formatCurrency(amount * 0.1) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Pago mínimo semanal:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(amount * 0.1) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-brand-200 dark:border-brand-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Plazo:</span>
              <span class="text-xl font-bold text-brand-600">Sin límite</span>
            </div>
          </div>

          <!-- Input: pago semanal -->
          <div class="mb-6 max-w-sm space-y-1.5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              ¿Cuánto pagará el cliente cada semana?
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">$</span>
              <input
                type="number"
                v-model.number="weeklyPaySemanal"
                min="0"
                :placeholder="`${(amount * 0.1).toFixed(2)}`"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 pl-[50px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <p v-if="weeklyPaySemanal > 0 && weeklyPaySemanal <= amount * 0.1" class="text-xs text-gray-500">
              Solo cubre el interés — el capital no baja nunca.
            </p>
            <p v-if="weeklyPaySemanal > amount * 0.1" class="text-xs text-success-600">
              ✅ {{ formatCurrency(weeklyPaySemanal - amount * 0.1) }} abona a capital la primera semana.
            </p>
          </div>

          <!-- Tabla de simulación -->
          <div v-if="semanalTable.length > 0" class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
            <div class="max-w-full overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
                  <tr>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400"># Semana</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Saldo Inicial</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Interés (10%)</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Total Adeudado</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Pago del Cliente</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Abono a Capital</th>
                    <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Saldo Final</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr
                    v-for="row in semanalTable"
                    :key="row.week"
                    :class="row.paid ? 'bg-success-50 dark:bg-success-900/10' : ''"
                  >
                    <td class="px-4 py-3 font-medium text-gray-800 dark:text-white/90">{{ row.week }}</td>
                    <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ formatCurrency(row.opening) }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(row.interest) }}</td>
                    <td class="px-4 py-3 font-medium text-gray-800 dark:text-white/90">{{ formatCurrency(row.total) }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(row.payment) }}</td>
                    <td class="px-4 py-3" :class="row.toCapital > 0 ? 'text-success-600 font-medium' : 'text-gray-400'">{{ formatCurrency(row.toCapital) }}</td>
                    <td class="px-4 py-3 font-medium" :class="row.paid ? 'text-success-600' : 'text-gray-800 dark:text-white/90'">
                      {{ row.paid ? '✅ Liquidado' : formatCurrency(row.closing) }}
                    </td>
                  </tr>


                </tbody>
              </table>
            </div>
          </div>

          <!-- Placeholder si no hay pago ingresado -->
          <div v-if="!weeklyPaySemanal || weeklyPaySemanal <= 0"
            class="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p class="text-sm text-gray-400 dark:text-gray-500">Ingresa el monto de pago semanal para ver la proyección</p>
          </div>

          <!-- Totales -->
          <div v-if="semanalTable.length > 0" class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total Pagado:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(semanalTotalPaid) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Total en Intereses:</span>
              <span class="text-xl font-bold text-error-500">{{ formatCurrency(semanalTotalInterest) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 border border-brand-200 dark:border-brand-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">Saldo Final:</span>
              <span class="text-xl font-bold text-brand-600">
                {{ lastRowPaid ? '✅ Liquidado' : formatCurrency(semanalTable[semanalTable.length - 1]?.closing ?? 0) }}
              </span>
            </div>
          </div>
        </div>

        <!-- ==================== PERSONALIZADO (36 Semanas) ==================== -->
        <div v-if="loanType === 'Personalizado' && isValidAmount" class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Desglose del Préstamo — Personalizado (36 semanas)</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Capital Prestado</span>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(amount) }}</span>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-800 border border-error-100 dark:border-error-900/30 shadow-sm relative overflow-hidden group">
              <div class="absolute inset-0 bg-error-50 dark:bg-error-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Retención Administ. (10%)</span>
              <span class="text-xl font-bold text-error-600 dark:text-error-500 relative z-10">-{{ formatCurrency(retention) }}</span>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-800 border border-success-100 dark:border-success-900/30 shadow-sm relative overflow-hidden group">
              <div class="absolute inset-0 bg-success-50 dark:bg-success-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Recibes Neto</span>
              <span class="text-xl font-bold text-success-600 dark:text-success-500 relative z-10">{{ formatCurrency(netReceived) }}</span>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pago Semanal (Mitad)</span>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(personalizadoWeeklyPayment) }}</span>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-800 border border-brand-100 dark:border-brand-900/30 shadow-sm md:col-span-2 lg:col-span-4 flex items-center justify-between">
              <div>
                <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total a Pagar Original (36 semanas)</span>
                <span class="text-2xl font-black text-brand-600 dark:text-brand-500">{{ formatCurrency(personalizadoTotalToPay) }}</span>
              </div>
            </div>
          </div>

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
                  <tr v-for="row in personalizadoPaginatedRows" :key="row.week">
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ row.week }}</td>
                    <td class="px-4 py-3 text-gray-800 dark:text-white/90">{{ formatCurrency(row.payment) }}</td>
                    <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ formatCurrency(row.balance) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination Controls -->
            <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-800 sm:px-6">
              <div class="flex flex-1 justify-between sm:hidden">
                <button @click="personalizadoPrevPage" :disabled="personalizadoCurrentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50">Anterior</button>
                <button @click="personalizadoNextPage" :disabled="personalizadoCurrentPage === personalizadoTotalPages" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50">Siguiente</button>
              </div>
              <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-400">
                    Mostrando del <span class="font-medium">{{ ((personalizadoCurrentPage - 1) * 10) + 1 }}</span> al <span class="font-medium">{{ Math.min(personalizadoCurrentPage * 10, 36) }}</span> de <span class="font-medium">36</span> semanas
                  </p>
                </div>
                <div>
                  <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button @click="personalizadoPrevPage" :disabled="personalizadoCurrentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700 disabled:opacity-50">
                      <span class="sr-only">Anterior</span>
                      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
                    </button>
                    <!-- Current Page Indicator -->
                    <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 dark:text-white dark:ring-gray-600 focus:z-20 focus:outline-offset-0">Página {{ personalizadoCurrentPage }} de {{ personalizadoTotalPages }}</span>
                    <button @click="personalizadoNextPage" :disabled="personalizadoCurrentPage === personalizadoTotalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700 disabled:opacity-50">
                      <span class="sr-only">Siguiente</span>
                      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </ComponentCard>

    <!-- Botón Continuar ABAJO -->
    <div v-if="isValidAmount" class="mt-6 flex justify-end">
      <button
        @click="handleContinue"
        class="inline-flex items-center justify-center gap-2.5 rounded-full py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 bg-green-600"
      >
        <Check class="w-5 h-5 text-current" />
        Continuar
      </button>
    </div>

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

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(value)
}

const amount    = ref(10000)
const clientName = ref('')
const loanType  = ref('Tradicional')
const weeks     = 12

// ==================== COMUNES ====================
const isValidAmount = computed(() => amount.value >= 1000)
const hasError      = computed(() => amount.value > 0 && amount.value < 1000)
const retention     = computed(() => isValidAmount.value ? amount.value * 0.10 : 0)
const netReceived   = computed(() => isValidAmount.value ? amount.value - retention.value : 0)

// ==================== TRADICIONAL ====================
const TOTAL_INTEREST_RATE = 1.5
const totalToPay    = computed(() => isValidAmount.value ? amount.value * TOTAL_INTEREST_RATE : 0)
const weeklyPayment = computed(() => isValidAmount.value ? totalToPay.value / weeks : 0)

// ==================== PERSONALIZADO ====================
const personalizadoWeeklyPayment = computed(() => weeklyPayment.value / 2)
const personalizadoTotalToPay = computed(() => personalizadoWeeklyPayment.value * 36)

const personalizadoCurrentPage = ref(1)
const personalizadoTotalPages = computed(() => Math.ceil(36 / 10))

const personalizadoPaginatedRows = computed(() => {
  if (!isValidAmount.value) return []
  const start = (personalizadoCurrentPage.value - 1) * 10
  const end = Math.min(start + 10, 36)
  const rows = []
  for (let week = start + 1; week <= end; week++) {
    rows.push({
      week,
      payment: personalizadoWeeklyPayment.value,
      balance: Math.max(0, personalizadoTotalToPay.value - (personalizadoWeeklyPayment.value * week))
    })
  }
  return rows
})

const personalizadoNextPage = () => {
  if (personalizadoCurrentPage.value < personalizadoTotalPages.value) {
    personalizadoCurrentPage.value++
  }
}

const personalizadoPrevPage = () => {
  if (personalizadoCurrentPage.value > 1) {
    personalizadoCurrentPage.value--
  }
}

// ==================== 10% SEMANAL ====================
const weeklyPaySemanal = ref(null)      // weekly payment the client makes
const MAX_WEEKS        = 520

const semanalTable = computed(() => {
  if (!isValidAmount.value) return []
  const pay = weeklyPaySemanal.value && weeklyPaySemanal.value > 0 ? weeklyPaySemanal.value : 0
  if (pay <= 0) return []

  const rows = []
  let balance = Number(amount.value)

  for (let week = 1; week <= MAX_WEEKS; week++) {
    const opening    = balance
    const interest   = opening * 0.1
    const total      = opening + interest
    const effectivePay = Math.min(pay, total)
    const toCapital  = Math.max(0, effectivePay - interest)
    const closing    = Math.max(0, opening - toCapital)
    const paid       = effectivePay >= total || closing <= 0.01

    rows.push({ week, opening, interest, total, payment: effectivePay, toCapital, closing: paid ? 0 : closing, paid })
    if (paid) break
    balance = closing
  }
  return rows
})

const lastRowPaid           = computed(() => semanalTable.value[semanalTable.value.length - 1]?.paid ?? false)
const semanalTotalPaid     = computed(() => semanalTable.value.reduce((s, r) => s + r.payment, 0))
const semanalTotalInterest  = computed(() => semanalTable.value.reduce((s, r) => s + r.interest, 0))

// ==================== CONTINUAR ====================
const handleContinue = () => {
  if (!isValidAmount.value) return
  
  let finalWeeklyPay = undefined;
  let finalTotalPay = undefined;
  
  if (loanType.value === 'Tradicional') {
    finalWeeklyPay = weeklyPayment.value;
    finalTotalPay = totalToPay.value;
  } else if (loanType.value === '10% Semanal') {
    finalWeeklyPay = weeklyPaySemanal.value && weeklyPaySemanal.value > 0
      ? weeklyPaySemanal.value
      : amount.value * 0.1
    finalTotalPay = amount.value  // saldo restante = capital prestado
  } else if (loanType.value === 'Personalizado') {
    finalWeeklyPay = personalizadoWeeklyPayment.value;
    finalTotalPay = personalizadoTotalToPay.value;
  }

  router.push({
    path: '/creditos/aprobar',
    query: {
      amount: amount.value,
      loanType: loanType.value,
      retention: retention.value,
      netReceived: netReceived.value,
      weeklyPayment: finalWeeklyPay,
      totalToPay: finalTotalPay
    }
  })
}
</script>
