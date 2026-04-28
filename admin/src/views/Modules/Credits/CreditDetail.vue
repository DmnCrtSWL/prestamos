<template>
  <AdminLayout>
    <div class="mx-auto max-w-270">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-title-md2 font-bold text-black dark:text-white">
            Detalles del Crédito
          </h2>
          <button
            v-if="credit?.is_restructured"
            @click="printPagareRestructurado"
            class="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 transition-colors"
            title="Imprimir Pagaré de Reestructuración"
          >
            <FileDown class="h-4 w-4" />
            Pagaré
          </button>
        </div>
        <button
          @click="router.back()"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white/10"
        >
          Volver
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center p-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>

      <div v-else-if="credit" class="flex flex-col gap-6">

        <!-- Top row: Client Info + Loan Info -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Client Info -->
          <div class="col-span-12 md:col-span-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 class="font-medium text-black dark:text-white">Información del Cliente</h3>
            </div>
            <div class="p-6.5 grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Nombre</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_name }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Teléfono</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_phone }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">CURP</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_curp || 'N/A' }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Dirección</label>
                <div class="font-medium text-black dark:text-white">{{ credit.client_address || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Loan Info -->
          <div class="col-span-12 md:col-span-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center justify-between">
              <h3 class="font-medium text-black dark:text-white">Detalles del Préstamo</h3>
              <span :class="[
                'inline-flex rounded-full px-3 py-1 text-sm font-medium',
                credit.status === 'approved' || credit.status === 'active'
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500'
                  : credit.status === 'rejected' || credit.status === 'defaulted'
                  ? 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
                  : credit.status === 'completed'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500'
                  : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500',
              ]">
                {{ getStatusLabel(credit.status) }}
              </span>
            </div>
            <div class="p-6.5 grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Monto Solicitado</label>
                <div class="text-2xl font-bold text-black dark:text-white">{{ formatCurrency(credit.loan_amount) }}</div>
              </div>
              <!-- Tipo de Crédito -->
              <div class="col-span-2">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Tipo de Crédito</label>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="credit.loan_type === '10% Semanal'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : credit.loan_type === 'Personalizado'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'"
                >
                  {{ credit.loan_type === '10% Semanal' ? 'Semanal 10%' : (credit.loan_type || 'Tradicional') }}
                </span>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Retención (10%)</label>
                <div class="font-medium text-red-600">{{ formatCurrency(credit.retention_amount) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Neto a Recibir</label>
                <div class="font-medium text-green-600">{{ formatCurrency(credit.net_received) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Pago Semanal</label>
                <div class="font-medium text-black dark:text-white">{{ formatCurrency(credit.weekly_payment) }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Total a Pagar Original</label>
                <div class="font-medium text-black dark:text-white">
                  <span v-if="credit.loan_type === '10% Semanal'">Solo Interés Semanal</span>
                  <span v-else>{{ formatCurrency(credit.total_to_pay) }}</span>
                </div>
              </div>
              <div v-if="penaltyAmount > 0">
                <label class="mb-1 block text-sm font-semibold text-red-500">Recargos por Atraso</label>
                <div class="font-bold text-red-600">{{ formatCurrency(penaltyAmount) }}</div>
              </div>
              <div v-if="penaltyAmount > 0">
                <label class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nuevo Total a Pagar</label>
                <div class="font-bold text-black dark:text-white">{{ formatCurrency(Number(credit.total_to_pay) + penaltyAmount) }}</div>
              </div>
              <div v-if="extendedSchedule.length > credit.weeks">
                <label class="mb-1 block text-sm font-semibold text-orange-500">Plazo Actualizado</label>
                <div class="font-bold text-orange-600">{{ extendedSchedule.length }} semanas</div>
              </div>
              <div v-else>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Plazo</label>
                <div class="font-medium text-black dark:text-white">
                  <span v-if="credit.loan_type === '10% Semanal'">Sin límite ({{ credit.weeks || 52 }} sem. proyectadas)</span>
                  <span v-else>{{ credit.weeks }} semanas</span>
                </div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Operado por</label>
                <div class="font-medium text-black dark:text-white">{{ credit.user || 'N/A' }}</div>
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Fecha de Creación</label>
                <div class="font-medium text-black dark:text-white">{{ formatDate(credit.created_at) }}</div>
              </div>
              <div class="col-span-2 border-t border-stroke pt-4 mt-2 dark:border-strokedark">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Fondos Provistos Por</label>
                <div class="font-medium text-black dark:text-white">
                  <span v-if="fundings.length > 0">
                    <span v-for="(funding, index) in fundings" :key="funding.id">
                      {{ funding.provider_name }} <span class="text-sm text-gray-500 dark:text-gray-400">({{ formatCurrency(funding.amount) }})</span><span v-if="index < fundings.length - 1">, &nbsp;</span>
                    </span>
                  </span>
                  <span v-else class="text-orange-500 font-medium">Sin fondear</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Guarantor Info: row 1 = data, row 2 = documents -->
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Información del Aval</h3>
          </div>
          <div class="p-6.5 space-y-6">
            <!-- Row 1: Aval data -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-4">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Nombre</label>
                <div class="font-medium text-black dark:text-white">{{ credit.guarantor_name || 'N/A' }}</div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Teléfono</label>
                <div class="font-medium text-black dark:text-white">{{ credit.guarantor_phone || 'N/A' }}</div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">Dirección</label>
                <div class="font-medium text-black dark:text-white">{{ credit.guarantor_address || 'N/A' }}</div>
              </div>
            </div>

            <!-- Row 2: Documents -->
            <div>
              <h4 class="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Documentos</h4>
              <div class="grid grid-cols-12 gap-3">
                <a
                  v-if="credit.guarantor_ine_front"
                  :href="getFileUrl(credit.guarantor_ine_front)"
                  target="_blank"
                  class="col-span-12 sm:col-span-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <FileText class="h-4 w-4 shrink-0" />
                  Ver INE Frontal
                </a>
                <a
                  v-if="credit.guarantor_ine_back"
                  :href="getFileUrl(credit.guarantor_ine_back)"
                  target="_blank"
                  class="col-span-12 sm:col-span-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <FileText class="h-4 w-4 shrink-0" />
                  Ver INE Reverso
                </a>
                <a
                  v-if="credit.guarantor_address_proof"
                  :href="getFileUrl(credit.guarantor_address_proof)"
                  target="_blank"
                  class="col-span-12 sm:col-span-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <FileText class="h-4 w-4 shrink-0" />
                  Ver Comprobante de Domicilio
                </a>
                <p v-if="!credit.guarantor_ine_front && !credit.guarantor_ine_back && !credit.guarantor_address_proof" class="col-span-12 text-sm text-gray-400 dark:text-gray-500">
                  Sin documentos adjuntos
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Late-payment diagnostic -->
        <div v-if="lateDiagnostic" class="rounded-sm border border-orange-300 bg-orange-50 shadow-default dark:border-orange-700 dark:bg-orange-900/20">
          <div class="border-b border-orange-300 py-4 px-6.5 dark:border-orange-700 flex items-center gap-2">
            <AlertTriangle class="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
            <h3 class="font-medium text-orange-700 dark:text-orange-400">Diagnóstico de Atraso</h3>
          </div>
          <div class="p-6.5 space-y-2 text-sm text-orange-800 dark:text-orange-300">
            <p>
              El <strong>Pago #{{ lateDiagnostic.weekNumber }}</strong>
              (vencimiento: <strong>{{ lateDiagnostic.dueDate }}</strong>)
              es el que activó la extensión a 13 semanas y los recargos.
            </p>
            <p>
              Al cierre de esa fecha se acumulaban
              <strong>{{ formatCurrency(lateDiagnostic.paidByDue) }}</strong> pagados,
              pero se esperaban <strong>{{ formatCurrency(lateDiagnostic.expected) }}</strong>
              — faltaban <strong class="text-red-600">{{ formatCurrency(lateDiagnostic.shortfall) }}</strong>.
            </p>
            <p v-if="lateDiagnostic.lateIncome">
              El siguiente pago registrado fue de
              <strong>{{ formatCurrency(lateDiagnostic.lateIncome.amount) }}</strong>
              el <strong>{{ formatDate(lateDiagnostic.lateIncome.created_at_cdmx || lateDiagnostic.lateIncome.created_at) }}</strong>,
              es decir, <em>después</em> de la fecha de vencimiento del pago #{{ lateDiagnostic.weekNumber }}.
            </p>
          </div>
        </div>

        <!-- Income history with delete -->
        <div v-if="credit.loan_type !== '10% Semanal' && incomes.length > 0" class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Pagos Registrados</h3>
          </div>
          <div class="p-6.5 overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-stroke dark:border-strokedark">
                  <th class="py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Folio</th>
                  <th class="py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                  <th class="py-2 px-2 text-right font-medium text-gray-500 dark:text-gray-400">Monto</th>
                  <th class="py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Método</th>
                  <th class="py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Usuario</th>
                  <th class="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inc in [...incomes].sort((a,b) => new Date(a.created_at) - new Date(b.created_at))"
                    :key="inc.id"
                    class="border-b border-stroke dark:border-strokedark last:border-0">
                  <td class="py-2 px-2 font-mono text-xs text-gray-500 dark:text-gray-400">{{ inc.folio }}</td>
                  <td class="py-2 px-2 text-black dark:text-white">
                    <template v-if="editingIncomeId === inc.id">
                      <div class="flex items-center gap-1">
                        <input
                          type="date"
                          v-model="editingIncomeDate"
                          class="rounded border border-stroke bg-transparent py-0.5 px-2 text-xs outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                        <button @click="saveIncomeDate(inc.id)" class="rounded bg-primary px-2 py-0.5 text-xs text-white hover:bg-opacity-90">Guardar</button>
                        <button @click="editingIncomeId = null" class="rounded px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-meta-4">✕</button>
                      </div>
                    </template>
                    <template v-else>
                      {{ formatDate(inc.created_at_cdmx || inc.created_at) }}
                    </template>
                  </td>
                  <td class="py-2 px-2 text-right font-medium text-green-600">{{ formatCurrency(inc.amount) }}</td>
                  <td class="py-2 px-2 text-gray-500 dark:text-gray-400">{{ inc.payment_method === 'cash' ? 'Efectivo' : 'Transferencia' }}</td>
                  <td class="py-2 px-2 text-gray-500 dark:text-gray-400">{{ inc.user || '-' }}</td>
                  <td class="py-2 px-2 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        @click="startEditDate(inc)"
                        class="inline-flex items-center rounded px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        title="Mover fecha"
                      >
                        Mover
                      </button>
                      <button
                        @click="deleteIncome(inc.id)"
                        :disabled="isDeletingIncome === inc.id"
                        class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40"
                        title="Eliminar pago"
                      >
                        <Trash2 class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Schedule -->
        <div v-if="credit.loan_type !== '10% Semanal'" class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
            <h3 class="font-medium text-black dark:text-white">Calendario de Pagos</h3>
            <div class="text-sm">
              <span class="text-gray-500">Total Pagado: </span>
              <span class="font-bold text-success">{{ formatCurrency(totalPaidAmount) }}</span>
            </div>
          </div>
          <div class="p-6.5 overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-stroke dark:border-strokedark">
                  <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">No.</th>
                  <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                  <th class="py-3 px-2 text-right font-medium text-gray-500 dark:text-gray-400">Monto</th>
                  <th class="py-3 px-2 text-right font-medium text-gray-500 dark:text-gray-400">Pagado</th>
                  <th class="py-3 px-2 text-center font-medium text-gray-500 dark:text-gray-400">Estado</th>
                  <th class="py-3 px-2 text-center font-medium text-gray-500 dark:text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(payment, idx) in scheduleWithPayments"
                  :key="idx"
                  class="border-b border-stroke dark:border-strokedark last:border-0"
                  :class="{ 'bg-green-50/50 dark:bg-green-500/5': payment.paid >= payment.amount }"
                >
                  <td class="py-3 px-2 text-black dark:text-white">{{ payment.number ?? (idx + 1) }}</td>
                  <td class="py-3 px-2 text-black dark:text-white">{{ payment.date }}</td>
                  <td class="py-3 px-2 text-right text-black dark:text-white">
                    <div class="flex flex-col items-end">
                      <span>{{ formatCurrency(payment.amount) }}</span>
                      <span v-if="payment.amount > payment.originalAmount" class="text-[10px] text-red-500 font-medium mt-0.5" title="Incluye recargos por atraso">
                        (+{{ formatCurrency(payment.amount - payment.originalAmount) }} multas)
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-right font-medium" :class="{'text-success': payment.paid >= payment.amount, 'text-warning': payment.paid > 0 && payment.paid < payment.amount, 'text-gray-400': payment.paid === 0}">
                    {{ formatCurrency(payment.paid) }}
                  </td>
                  <td class="py-3 px-2 text-center">
                    <span v-if="payment.paid >= payment.amount" class="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">Pagado</span>
                    <span v-else-if="payment.paid > 0" class="inline-flex rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400">Parcial</span>
                    <span v-else class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">Pendiente</span>
                  </td>
                  <td class="py-3 px-2">
                    <div class="flex items-center justify-end gap-2 pr-4 w-full">
                      <button
                        @click="openPayModal(payment, idx)"
                        :disabled="payment.paid >= payment.amount"
                        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        :class="payment.paid >= payment.amount
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'"
                      >
                        <CreditCard class="h-3.5 w-3.5" />
                        Pagar
                      </button>

                      <button
                        v-if="(payment.number ?? (idx + 1)) >= 5"
                        @click="router.push(`/reestructuracion/${credit.id}`)"
                        :disabled="!canRestructure"
                        class="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        :class="!canRestructure
                          ? 'cursor-not-allowed bg-orange-500/50 text-white/50 dark:bg-orange-600/50'
                          : 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700'"
                        title="Reestructuración"
                      >
                        <Calculator class="h-3.5 w-3.5" />
                      </button>
                      
                      <!-- Placeholder invisible para alinear el botón de pagar con los de abajo -->
                      <button
                        v-else
                        class="invisible inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                      >
                        <Calculator class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- NEW 10% SEMANAL TABLA Y TARJETAS -->
        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pagado:</span>
              <span class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(totalPagadoSemanal10) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total en Intereses:</span>
              <span class="text-xl font-bold text-red-500">{{ formatCurrency(totalInteresSemanal10) }}</span>
            </div>
            <div class="flex flex-col gap-1 rounded-lg bg-white p-4 shadow-sm border border-blue-200 dark:border-blue-800 dark:bg-boxdark">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Final:</span>
              <span class="flex items-center gap-1 text-xl font-bold text-blue-600 dark:text-blue-400">
                <span v-if="isLiquidadoSemanal10" class="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                  <span class="inline-block rounded-md bg-green-500 text-white text-[10px] px-1.5 py-0.5">✔</span> Liquidado
                </span>
                <span v-else>{{ formatCurrency(saldoFinalSemanal10) }}</span>
              </span>
            </div>
          </div>

          <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <h3 class="font-medium text-black dark:text-white">Desglose Semanal 10%</h3>
            </div>
            <div class="p-6.5 overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-stroke dark:border-strokedark">
                    <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">No:</th>
                    <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Deuda (Saldo Inicial)</th>
                    <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Siguiente Pago</th>
                    <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Monto Abono</th>
                    <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400 border-l border-stroke pl-2 ml-1">Para Interés</th>
                    <th class="py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Para Capital</th>
                    <th class="py-3 px-2 text-center font-medium text-gray-500 dark:text-gray-400">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, idx) in semanal10Table"
                    :key="idx"
                    class="border-b border-stroke dark:border-strokedark last:border-0"
                    :class="row.paid ? 'bg-green-50/30 dark:bg-green-500/5' : (row.isPending ? 'bg-amber-50/30 dark:bg-amber-500/5' : 'bg-red-50/30 dark:bg-red-500/5')"
                  >
                    <td class="py-3 px-2 text-black dark:text-white">{{ row.week }}</td>
                    <td class="py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">{{ formatCurrency(row.opening) }}</td>
                    <td class="py-3 px-2 text-black dark:text-white">
                      {{ row.date }}
                      <span v-if="!row.paid && !row.isPending" class="text-xs text-red-500 block">Capitaliza +10%</span>
                      <span v-if="row.isPending" class="text-xs text-amber-500 block">Siguiente Pago</span>
                    </td>
                    <td class="py-3 px-2 text-black dark:text-white font-medium">
                      <span v-if="row.paid" class="text-green-600">+ {{ formatCurrency(row.payment) }}</span>
                      <span v-else class="text-gray-400">—</span>
                    </td>
                    <td class="py-3 pl-4 text-black dark:text-white border-l border-stroke">
                      <span v-if="row.interest > 0">{{ formatCurrency(row.interest) }}</span>
                      <span v-else>—</span>
                    </td>
                    <td class="py-3 px-2" :class="row.toCapital > 0 ? 'text-green-600 font-medium' : (row.toCapital < 0 ? 'text-red-500 font-medium' : 'text-gray-400')">
                      <span v-if="row.toCapital !== 0">{{ formatCurrency(row.toCapital) }}</span>
                      <span v-else>—</span>
                    </td>
                    <td class="py-3 px-2 text-center">
                      <button
                        v-if="row.isPending"
                        @click="openPayModalSemanal10(row)"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        <CreditCard class="h-3.5 w-3.5" /> Pagar
                      </button>
                      <span v-else-if="row.paid" class="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
                        Abono Registrado
                      </span>
                      <span v-else class="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400">
                        Interés Agregado
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Quick Pay Modal -->
    <div v-if="showPayModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showPayModal = false">
      <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <!-- Header -->
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-primary/10 p-2.5">
              <CreditCard class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-800 dark:text-white">Registrar Pago</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Semana {{ selectedPayment?.number ?? (selectedPaymentIdx + 1) }} · {{ selectedPayment?.date }}</p>
            </div>
          </div>
          <button @click="showPayModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Credit info banner -->
        <div class="mb-5 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Crédito</p>
          <p class="font-semibold text-black dark:text-white">{{ credit?.client_name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Monto esperado: <span class="font-medium text-black dark:text-white">{{ formatCurrency(selectedPayment?.amount) }}</span></p>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Payment method -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago</label>
            <div class="relative">
              <select
                v-model="payForm.payment_method"
                class="w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 outline-none focus:border-primary dark:border-gray-600 dark:text-white dark:bg-gray-900"
              >
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
              </select>
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
              </span>
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
            <input
              type="number"
              v-model="payForm.amount"
              step="0.01"
              min="0"
              :placeholder="selectedPayment?.amount"
              class="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 outline-none focus:border-primary dark:border-gray-600 dark:text-white dark:bg-gray-900"
              required
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex gap-3">
          <button
            @click="showPayModal = false"
            class="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            @click="submitPayment"
            :disabled="isSubmittingPay"
            class="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isSubmittingPay ? 'Guardando...' : 'Registrar Pago' }}
          </button>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { FileText, CreditCard, X, Calculator, AlertTriangle, Trash2, FileDown } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import jsPDF from 'jspdf'

const route = useRoute()
const router = useRouter()
const { userName, isEmpleados } = useAuth()
const isLoading = ref(true)
const credit = ref(null)
const incomes = ref([])
const fundings = ref([])

// Quick pay modal state
const showPayModal = ref(false)
const selectedPayment = ref(null)
const selectedPaymentIdx = ref(0)
const isSubmittingPay = ref(false)
const payForm = ref({
  payment_method: 'cash',
  amount: ''
})

const fetchData = async () => {
  isLoading.value = true
  try {
    const creditRes = await fetch(`${import.meta.env.VITE_API_URL}/credits/${route.params.id}`)
    if (!creditRes.ok) throw new Error('Error al cargar crédito')
    credit.value = await creditRes.json()

    const incomesRes = await fetch(`${import.meta.env.VITE_API_URL}/incomes?credit_id=${route.params.id}`)
    if (incomesRes.ok) {
      incomes.value = await incomesRes.json()
    }

    const fundingRes = await fetch(`${import.meta.env.VITE_API_URL}/credits/${route.params.id}/funding-info`)
    if (fundingRes.ok) {
      const fData = await fundingRes.json()
      fundings.value = fData.fundings || []
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al cargar los detalles')
    router.push('/creditos')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value || 0)
}

const numberToWords = (num) => {
  const ones = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
    'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
  const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  const hundreds = ['', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
    'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

  if (num === 0) return 'CERO'
  const integer = Math.floor(num)
  const cents = Math.round((num - integer) * 100)

  const convert = (n) => {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' Y ' + ones[n % 10] : '')
    if (n === 100) return 'CIEN'
    const h = Math.floor(n / 100)
    const rest = n % 100
    let word = hundreds[h]
    if (h === 1 && rest > 0) word = 'CIENTO'
    return word + (rest !== 0 ? ' ' + convert(rest) : '')
  }

  const convertThousands = (n) => {
    if (n >= 1000) {
      const th = Math.floor(n / 1000)
      const rest = n % 1000
      const thWord = th === 1 ? 'MIL' : convert(th) + ' MIL'
      return thWord + (rest !== 0 ? ' ' + convert(rest) : '')
    }
    return convert(n)
  }

  return convertThousands(integer) + ' ' + String(cents).padStart(2, '0') + '/100 M.N.'
}

const printPagareRestructurado = () => {
  if (!credit.value) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()

  const amount = Number(credit.value.loan_amount)
  const amountWords = numberToWords(amount)
  const now = new Date()
  const day = now.getDate()
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  const PRIMARY  = [0, 0, 0]
  const DARK     = [20, 20, 20]
  const GRAY     = [100, 100, 100]
  const LIGHTBG  = [245, 245, 245]
  const BORDER   = [200, 200, 200]
  const LINE     = [170, 170, 170]

  const setFont = (style = 'normal', size = 10, color = DARK) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const hline = (x1, y1, x2, y2, color = LINE, w = 0.3) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(w)
    doc.line(x1, y1, x2, y2)
  }
  const fillRect = (x, y, w, h, fill, border) => {
    if (fill)   doc.setFillColor(...fill)
    if (border) doc.setDrawColor(...border)
    else        doc.setDrawColor(255, 255, 255)
    doc.rect(x, y, w, h, fill && border ? 'FD' : fill ? 'F' : 'D')
  }
  const signLine = (x, y, w = 55) => hline(x, y, x + w, y, DARK, 0.4)

  const mx = 16
  const mr = pageW - mx

  let y = 8

  fillRect(0, y, pageW, 18, PRIMARY, PRIMARY)
  setFont('bold', 16, [255, 255, 255])
  doc.text('PAGARÉ', mx, y + 12)
  setFont('normal', 8, [220, 220, 220])
  doc.text('Zamora, Michoacán', mr, y + 7, { align: 'right' })
  setFont('bold', 8, [220, 220, 220])
  doc.text(`No. ${Date.now().toString().slice(-6)}`, mr, y + 13, { align: 'right' })
  y += 22

  fillRect(mx, y, pageW - mx * 2, 12, LIGHTBG, BORDER)
  setFont('bold', 8, GRAY)
  doc.text('LUGAR Y FECHA', mx + 3, y + 4.5)
  setFont('normal', 9, DARK)
  doc.text(`En la ciudad de Zamora, Mich., a ${day} de ${month} de ${year}.`, mx + 3, y + 10)
  y += 16

  setFont('bold', 9, GRAY)
  doc.text('BUENO POR:', mx, y)
  y += 6
  fillRect(mx, y, pageW - mx * 2, 12, [255, 255, 255], BORDER)
  const amtFmt = `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  setFont('bold', 11, PRIMARY)
  doc.text(amtFmt, mx + 3, y + 8)
  setFont('normal', 8.5, DARK)
  doc.text(`(${amountWords})`, mx + 32, y + 8, { maxWidth: pageW - mx * 2 - 36 })
  y += 16

  setFont('bold', 9, PRIMARY)
  doc.text('PROMESA DE PAGO', mx, y)
  hline(mx, y + 1, mr, y + 1, PRIMARY, 0.5)
  y += 6
  setFont('normal', 9, DARK)

  let acreedor = 'FINANCIERA ZAMORA'
  if (isEmpleados.value) {
    acreedor = 'MARÍA CRISTINA VERDUZCO ÁLVAREZ'
  } else {
    acreedor = userName.value ? userName.value.toUpperCase() : 'FINANCIERA ZAMORA'
  }

  const promText = `Debo y pagaré incondicionalmente a la orden de ${acreedor}, la cantidad de ${amtFmt} (${amountWords}), en moneda nacional.`
  const promLines = doc.splitTextToSize(promText, pageW - mx * 2)
  doc.text(promLines, mx, y)
  y += promLines.length * 5 + 3

  fillRect(mx, y, pageW - mx * 2, 14, LIGHTBG, BORDER)
  setFont('bold', 8, GRAY)
  doc.text('TIPO DE CRÉDITO', mx + 3, y + 4.5)
  doc.text('PAGO SEMANAL', mx + 80, y + 4.5)
  doc.text('TOTAL A PAGAR', mx + 140, y + 4.5)
  setFont('bold', 10, PRIMARY)
  doc.text(credit.value.loan_type || 'Tradicional', mx + 3, y + 11)
  doc.text(`$${Number(credit.value.weekly_payment).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, mx + 80, y + 11)
  doc.text(`$${Number(credit.value.total_to_pay).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, mx + 140, y + 11)
  y += 18

  setFont('bold', 9, PRIMARY)
  doc.text('INTERESES', mx, y)
  hline(mx, y + 1, mr, y + 1, PRIMARY, 0.5)
  y += 6
  setFont('normal', 9, DARK)
  const intText = 'La cantidad adeudada causará intereses ordinarios a razón del 20% mensual. En caso de mora, causará intereses moratorios a razón del 20% mensual, desde el día siguiente al vencimiento y hasta la total liquidación.'
  const intLines = doc.splitTextToSize(intText, pageW - mx * 2)
  doc.text(intLines, mx, y)
  y += intLines.length * 5 + 3

  setFont('bold', 9, PRIMARY)
  doc.text('JURISDICCIÓN', mx, y)
  hline(mx, y + 1, mr, y + 1, PRIMARY, 0.5)
  y += 6
  setFont('normal', 8.5, DARK)
  const jurText = 'Este pagaré es de naturaleza mercantil conforme a la Ley General de Títulos y Operaciones de Crédito. Para su interpretación y cumplimiento, las partes se someten a las leyes y tribunales competentes de la ciudad de Zamora, Michoacán, renunciando a cualquier otro fuero.'
  const jurLines = doc.splitTextToSize(jurText, pageW - mx * 2)
  doc.text(jurLines, mx, y)
  y += jurLines.length * 4.5 + 5

  signLine(mx, y + 6)
  setFont('bold', 8, GRAY)
  doc.text('FIRMA DEL DEUDOR', mx, y + 11)
  setFont('normal', 8, DARK)
  doc.text(credit.value.client_name || '', mx, y + 16)

  const divY = 142
  hline(0, divY, pageW, divY, [150, 150, 150], 0.8)
  setFont('normal', 7, [180, 180, 180])
  doc.text('✂  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─', mx, divY + 4)

  let ey = divY + 8

  fillRect(0, ey, pageW, 10, PRIMARY, PRIMARY)
  setFont('bold', 10, [255, 255, 255])
  doc.text('DATOS COMPLEMENTARIOS (DEUDOR Y AVAL)', mx, ey + 6.5)
  ey += 14

  const fieldW = pageW - mx * 2

  setFont('bold', 9, PRIMARY)
  doc.text('I. DATOS DEL DEUDOR', mx, ey)
  hline(mx, ey + 1, mx + 40, ey + 1, PRIMARY, 0.4)
  ey += 6

  const deudorFields = [
    ['Nombre completo:', credit.value.client_name || ''],
    ['Domicilio:', credit.value.client_address || ''],
  ]

  deudorFields.forEach(([label, value]) => {
    setFont('bold', 7, GRAY)
    doc.text(label, mx, ey)
    ey += 4
    fillRect(mx, ey, fieldW, 7, [255, 255, 255], BORDER)
    setFont('normal', 8, DARK)
    doc.text(value, mx + 2, ey + 4.5, { maxWidth: fieldW - 4 })
    ey += 9
  })

  setFont('bold', 7, GRAY)
  doc.text('Teléfono:', mx, ey)
  doc.text('Firma del Deudor:', mx + 80, ey)
  ey += 4
  fillRect(mx, ey, 60, 7, [255, 255, 255], BORDER)
  setFont('normal', 8, DARK)
  doc.text(credit.value.client_phone || '', mx + 2, ey + 4.5)
  signLine(mx + 80, ey + 7, fieldW - 80)
  ey += 12

  setFont('bold', 9, PRIMARY)
  doc.text('II. DATOS DEL AVAL', mx, ey)
  hline(mx, ey + 1, mx + 35, ey + 1, PRIMARY, 0.4)
  ey += 5

  setFont('italic', 7.5, GRAY)
  const avalDisclaimer = 'Por medio del presente, el suscrito se constituye como aval solidario, obligándose en los mismos términos que el deudor principal.'
  const disclaimerLines = doc.splitTextToSize(avalDisclaimer, fieldW)
  doc.text(disclaimerLines, mx, ey)
  ey += disclaimerLines.length * 4 + 3

  const avalFields = [
    ['Nombre completo del Aval:', credit.value.guarantor_name || ''],
    ['Domicilio del Aval:', credit.value.guarantor_address || ''],
  ]

  avalFields.forEach(([label, value]) => {
    setFont('bold', 7, GRAY)
    doc.text(label, mx, ey)
    ey += 4
    fillRect(mx, ey, fieldW, 7, [255, 255, 255], BORDER)
    setFont('normal', 8, DARK)
    doc.text(value, mx + 2, ey + 4.5, { maxWidth: fieldW - 4 })
    ey += 9
  })

  setFont('bold', 7, GRAY)
  doc.text('Teléfono Aval:', mx, ey)
  doc.text('Firma del Aval:', mx + 80, ey)
  ey += 4
  fillRect(mx, ey, 60, 7, [255, 255, 255], BORDER)
  setFont('normal', 8, DARK)
  doc.text(credit.value.guarantor_phone || '', mx + 2, ey + 4.5)
  signLine(mx + 80, ey + 7, fieldW - 80)

  hline(mx, pageH - 11, mr, pageH - 11, BORDER, 0.3)
  setFont('normal', 7, GRAY)
  doc.text('Documento generado electrónicamente. Válido como título de crédito con valor legal.', pageW / 2, pageH - 6, { align: 'center' })

  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
}

/* --- COMPUTADOS PARA 10% SEMANAL --- */

const semanal10Table = computed(() => {
  if (!credit.value || credit.value.loan_type !== '10% Semanal') return [];

  const incomesSorted = [...incomes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  const rows = [];
  let balance = Number(credit.value.loan_amount);
  
  const startDate = new Date(credit.value.created_at || Date.now());
  
  // Find first Saturday
  const findNextSaturday = (fromDate) => {
    const d = new Date(fromDate);
    const dayOfWeek = d.getDay();
    const daysUntilNextSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);
    d.setDate(d.getDate() + daysUntilNextSaturday);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const today = new Date();
  const events = [];

  // 1. Generate Payment Events
  for (const inc of incomesSorted) {
    events.push({
      type: 'PAYMENT',
      date: new Date(inc.created_at),
      amount: Number(inc.amount),
      id: inc.id
    });
  }

  // 2. Generate Saturday Due Events
  // Generate all Saturdays from startDate until today (plus one future Saturday to serve as next due date)
  let currentSat = findNextSaturday(startDate);
  // We need the next Saturday after all events, so let's generate up to today + 7 days just in case
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  
  while (currentSat <= maxDate) {
    events.push({
      type: 'DUE',
      date: new Date(currentSat)
    });
    currentSat.setDate(currentSat.getDate() + 7);
  }

  // Sort ALL events chronologically
  events.sort((a, b) => a.date - b.date);

  let currentWeekNum = 1;
  let nextDueDate = events.find(e => e.type === 'DUE')?.date || findNextSaturday(startDate);

  for (const event of events) {
    // If the event is in the future (after today) and it's a DUE event, 
    // it shouldn't trigger an interest charge yet, it just sets the pending nextDueDate.
    if (event.date > today && event.type === 'DUE') {
      nextDueDate = event.date;
      break; 
    }

    if (event.type === 'DUE') {
      const interest = balance * 0.10;
      const closing = balance + interest;
      
      rows.push({
        week: currentWeekNum++,
        date: event.date.toISOString().split('T')[0] + ' (Vencido)',
        opening: balance,
        interest: interest,
        total: closing,
        payment: 0,
        toCapital: -interest, // Represent added debt
        closing: closing,
        paid: false,
        isLiquidated: false
      });
      balance = closing;
      
      // Update next due date to the next week
      nextDueDate = new Date(event.date);
      nextDueDate.setDate(nextDueDate.getDate() + 7);

    } else if (event.type === 'PAYMENT') {
      // In this model, they just pay against the balance.
      // If we want to show it as covering interest, maybe we don't separate it mid-week.
      const closing = Math.max(0, balance - event.amount);
      const isLiquidated = closing <= 0.01;

      rows.push({
        week: currentWeekNum++,
        date: event.date.toISOString().split('T')[0] + ' (Abono)',
        opening: balance,
        interest: 0, 
        total: balance,
        payment: event.amount,
        toCapital: event.amount,
        closing: isLiquidated ? 0 : closing,
        paid: true,
        income_id: event.id,
        isLiquidated: isLiquidated
      });

      balance = isLiquidated ? 0 : closing;
      
      if (isLiquidated) break;
    }
  }

  // Finally, add the one PENDING row for the UI, looking forward to nextDueDate
  if (balance > 0.01) {
    const interest = balance * 0.10;
    rows.push({
      week: currentWeekNum,
      date: nextDueDate.toISOString().split('T')[0],
      opening: balance,
      interest: interest,
      total: balance + interest,
      payment: 0,
      toCapital: 0,
      closing: balance, // pending
      paid: false,
      isPending: true,
      isLiquidated: false
    });
  }

  return rows;
});

const totalPagadoSemanal10 = computed(() => {
  return incomes.value.reduce((sum, inc) => sum + Number(inc.amount), 0);
});

const totalInteresSemanal10 = computed(() => {
  return semanal10Table.value.filter(r => r.interest > 0 && !r.isPending).reduce((sum, r) => sum + r.interest, 0);
});

const isLiquidadoSemanal10 = computed(() => {
  if (semanal10Table.value.length === 0) return false;
  const lastRow = semanal10Table.value[semanal10Table.value.length - 1];
  return lastRow.paid && lastRow.isLiquidated;
});

const saldoFinalSemanal10 = computed(() => {
  if (semanal10Table.value.length === 0) return credit.value?.loan_amount || 0;
  const lastRow = semanal10Table.value[semanal10Table.value.length - 1];
  return lastRow.isPending ? lastRow.opening : lastRow.closing;
});

const openPayModalSemanal10 = (row) => {
  if (!credit.value || Number(credit.value.funded_amount) <= 0) {
    const goToFunding = confirm('Crédito no fondeado, favor de asignar fondos.\n\n¿Deseas ir a la pantalla de fondeo ahora?')
    if (goToFunding) {
      router.push(`/creditos/${credit.value.id}/fondear`)
    }
    return
  }
  selectedPayment.value = {
    number: row.week,
    date: row.date.replace(' (Vencido)', '').replace(' (Abono)', ''),
    amount: row.interest || row.opening * 0.1, // Suggested payment is the interest
    opening: row.opening,
    isSemanal10: true
  }
  payForm.value = {
    payment_method: 'cash',
    amount: selectedPayment.value.amount
  }
  showPayModal.value = true
}

/* --- COMPUTADOS PARA TRADICIONAL --- */

const totalPaidAmount = computed(() => {
  return incomes.value.reduce((sum, income) => sum + Number(income.amount), 0)
})

const extendedSchedule = computed(() => {
  if (!credit.value || !credit.value.payment_schedule) return []

  let schedule = []
  if (typeof credit.value.payment_schedule === 'string') {
    try {
      schedule = JSON.parse(credit.value.payment_schedule)
    } catch (e) {
      return []
    }
  } else {
    schedule = [...credit.value.payment_schedule]
  }

  // Guard: must be a real array (10% Semanal credits store an object, not an array)
  if (!Array.isArray(schedule) || schedule.length === 0) return []

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // The schedule can only be extended ONCE during the credit's life.
  // If the stored schedule is already longer than credit.weeks, extension already happened.
  const alreadyExtended = schedule.length > (credit.value.weeks || 12)
  if (alreadyExtended) return schedule

  // Check payments in order. If any due date has passed and cumulative paid < expected, extend once.
  let cumulativeExpected = 0
  const sortedIncomes = [...incomes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  for (const payment of schedule) {
    const [py, pm, pd] = payment.date.split('-').map(Number)
    const dueDate = new Date(py, pm - 1, pd, 23, 59, 59, 999)
    cumulativeExpected += Number(payment.amount)

    if (today > dueDate) {
      // How much was paid on or before this due date?
      const paidByDue = sortedIncomes
        .filter(i => new Date(i.created_at) <= dueDate)
        .reduce((sum, i) => sum + Number(i.amount), 0)

      if (paidByDue < cumulativeExpected) {
        // Missed this payment — extend by one week (only once)
        const lastPayment = schedule[schedule.length - 1]
        const [ly, lm, ld] = lastPayment.date.split('-').map(Number)
        const lastDate = new Date(ly, lm - 1, ld)
        lastDate.setDate(lastDate.getDate() + 7)
        const pad = (n) => n.toString().padStart(2, '0')
        schedule.push({
          amount: lastPayment.amount,
          date: `${lastDate.getFullYear()}-${pad(lastDate.getMonth() + 1)}-${pad(lastDate.getDate())}`,
          week: schedule.length + 1
        })
        break // Only extend once
      }
    }
  }

  return schedule
})

const penaltyAmount = computed(() => {
  const schedule = extendedSchedule.value
  if (schedule.length === 0) return 0

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const sortedIncomes = [...incomes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  // Find the first past-due date to begin counting
  const [fy, fm, fd] = schedule[0].date.split('-').map(Number)
  const firstDueDate = new Date(fy, fm - 1, fd, 23, 59, 59, 999)
  if (today <= firstDueDate) return 0

  let totalPenalty = 0

  // Iterate each calendar day ONCE from the day after the first due date to today.
  // This avoids double-counting that occurs when looping per-payment.
  let currentDate = new Date(firstDueDate)
  currentDate.setDate(currentDate.getDate() + 1)
  currentDate.setHours(23, 59, 59, 999)

  while (currentDate <= today) {
    const expectedAmount = schedule.reduce((sum, p) => {
      const [py, pm, pd] = p.date.split('-').map(Number)
      const pDate = new Date(py, pm - 1, pd, 23, 59, 59, 999)
      return pDate < currentDate ? sum + Number(p.amount) : sum
    }, 0)

    const actualAmount = sortedIncomes
      .filter(i => new Date(i.created_at) <= currentDate)
      .reduce((sum, i) => sum + Number(i.amount), 0)

    const unpaid = expectedAmount - actualAmount

    if (unpaid >= 1000) {
      totalPenalty += 100
    } else if (unpaid > 0) {
      totalPenalty += 50
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return totalPenalty
})

const scheduleWithPayments = computed(() => {
  const schedule = extendedSchedule.value;
  let remainingPaid = totalPaidAmount.value
  let penaltyToApply = penaltyAmount.value

  const processedSchedule = schedule.map((item, idx) => {
    const originalAmount = Number(item.amount)
    let amountWithPenalty = originalAmount
    
    let paid = 0

    if (remainingPaid >= originalAmount) {
      paid = originalAmount
      remainingPaid -= originalAmount
    } else {
      paid = remainingPaid
      remainingPaid = 0
    }

    return {
      ...item,
      number: item.week ?? (idx + 1),
      originalAmount,
      amount: amountWithPenalty,
      paid
    }
  })

  // Apply penalty to the first unpaid payment
  if (penaltyToApply > 0) {
    const firstUnpaid = processedSchedule.find(p => p.paid < p.originalAmount)
    if (firstUnpaid) {
      firstUnpaid.amount = firstUnpaid.originalAmount + penaltyToApply
    }
  }

  return processedSchedule
})

const openPayModal = (payment, idx) => {
  // Guard: credit must be funded before accepting payments
  if (!credit.value || Number(credit.value.funded_amount) <= 0) {
    const goToFunding = confirm('Crédito no fondeado, favor de asignar fondos.\n\n¿Deseas ir a la pantalla de fondeo ahora?')
    if (goToFunding) {
      router.push(`/creditos/${credit.value.id}/fondear`)
    }
    return
  }
  selectedPayment.value = payment
  selectedPaymentIdx.value = idx
  payForm.value = {
    payment_method: 'cash',
    amount: payment.amount - payment.paid // Pre-fill with remaining amount
  }
  showPayModal.value = true
}

const submitPayment = async () => {
  let payAmount = Number(payForm.value.amount);
  if (!payAmount || payAmount <= 0) {
    alert('Por favor ingresa un monto válido')
    return
  }

  isSubmittingPay.value = true
  try {
    const payload = {
      credit_id: credit.value.id,
      client_id: credit.value.client_id,
      payment_method: payForm.value.payment_method,
      amount: payAmount,
      user: userName.value || 'admin'
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/incomes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al registrar pago')
    }
    
    // Liquidar crédito de forma simulada vía actualización si se cubre el saldo restante (para 10% Semanal o general)
    if (credit.value.loan_type === '10% Semanal') {
      const currentBalance = selectedPayment.value?.opening || 0;
      const currentInterest = currentBalance * 0.1;
      const amountToCapital = Math.max(0, payAmount - currentInterest);
      const newBalance = Math.max(0, currentBalance - amountToCapital);
      
      if (newBalance <= 0.01 && credit.value.status !== 'completed') {
        const updateParams = new FormData();
        updateParams.append('status', 'completed');
        await fetch(`${import.meta.env.VITE_API_URL}/credits/${credit.value.id}`, {
          method: 'PUT',
          body: updateParams
        });
      }
    } else {
      // Logic para tradicional... 
      // Se podría revisar si lo pagado >= total_to_pay, etc. pero esto es una verificación adicional.
    }

    showPayModal.value = false
    // Refresh data to update payment status
    await fetchData()
  } catch (error) {
    console.error('Error submitting payment:', error)
    alert('Error: ' + error.message)
  } finally {
    isSubmittingPay.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'approved': 'Aprobado',
    'rejected': 'Rechazado',
    'active': 'Activo',
    'completed': 'Completado',
    'defaulted': 'Vencido'
  }
  return labels[status] || status
}

const getFileUrl = (path) => {
  if (!path) return '#'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`
}

const isPdf = (path) => {
  return path && path.toLowerCase().endsWith('.pdf')
}

const canRestructure = computed(() => {
  if (!scheduleWithPayments.value || scheduleWithPayments.value.length < 5) return false;

  const payment5 = scheduleWithPayments.value.find(p => (p.number ?? (scheduleWithPayments.value.indexOf(p) + 1)) === 5) || scheduleWithPayments.value[4];
  if (!payment5) return false;

  return payment5.paid >= payment5.amount;
});

// Identifies which scheduled payment caused the 13-week extension and late fees
const lateDiagnostic = computed(() => {
  if (!credit.value || credit.value.loan_type === '10% Semanal') return null;

  let schedule = [];
  const raw = credit.value.payment_schedule;
  if (typeof raw === 'string') {
    try { schedule = JSON.parse(raw); } catch { return null; }
  } else if (Array.isArray(raw)) {
    schedule = [...raw];
  }
  if (!Array.isArray(schedule) || schedule.length === 0) return null;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sortedIncomes = [...incomes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  let cumulativeExpected = 0;

  for (let i = 0; i < schedule.length; i++) {
    const payment = schedule[i];
    const [py, pm, pd] = payment.date.split('-').map(Number);
    const dueDate = new Date(py, pm - 1, pd, 23, 59, 59, 999);
    cumulativeExpected += Number(payment.amount);

    if (today > dueDate) {
      const paidByDue = sortedIncomes
        .filter(inc => new Date(inc.created_at) <= dueDate)
        .reduce((sum, inc) => sum + Number(inc.amount), 0);

      if (paidByDue < cumulativeExpected) {
        // First income registered AFTER this due date is likely the late/missing payment
        const lateIncome = sortedIncomes.find(inc => new Date(inc.created_at) > dueDate);
        return {
          weekNumber: payment.week ?? (i + 1),
          dueDate: payment.date,
          paidByDue,
          expected: cumulativeExpected,
          shortfall: cumulativeExpected - paidByDue,
          lateIncome: lateIncome || null,
        };
      }
    }
  }
  return null;
});

const isDeletingIncome = ref(null);
const editingIncomeId = ref(null);
const editingIncomeDate = ref('');

const startEditDate = (inc) => {
  editingIncomeId.value = inc.id;
  // Pre-fill with the income's current CDMX date
  const d = new Date(inc.created_at_cdmx || inc.created_at);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  editingIncomeDate.value = `${y}-${m}-${day}`;
};

const saveIncomeDate = async (incomeId) => {
  if (!editingIncomeDate.value) return;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/incomes/${incomeId}/date`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: editingIncomeDate.value })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error');
    editingIncomeId.value = null;
    await fetchData();
  } catch (e) {
    alert('Error al actualizar fecha: ' + e.message);
  }
};

const deleteIncome = async (incomeId) => {
  if (!confirm('¿Eliminar este pago del historial? Esta acción no se puede deshacer.')) return;
  isDeletingIncome.value = incomeId;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/incomes/${incomeId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error((await res.json()).error || 'Error');
    await fetchData();
  } catch (e) {
    alert('Error al eliminar: ' + e.message);
  } finally {
    isDeletingIncome.value = null;
  }
};
</script>
