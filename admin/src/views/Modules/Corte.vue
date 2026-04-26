<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-title-md2 font-bold text-black dark:text-white">Corte de Rendimientos</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comisiones, salarios y rendimiento por proveedor
        </p>
      </div>
      <button
        v-if="report"
        @click="generatePDF"
        :disabled="pdfLoading"
        class="flex items-center gap-2 h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <svg v-if="!pdfLoading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        {{ pdfLoading ? 'Generando PDF…' : 'Descargar PDF' }}
      </button>
    </div>

    <!-- Filtros -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Proveedor</label>
          <select
            v-model="selectedProvider"
            class="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">TODOS</option>
            <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>

        <!-- User filter: dropdown for admins, label for others -->
        <div v-if="isAdmin" class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Usuario</label>
          <select
            v-model="selectedUser"
            class="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">TODOS</option>
            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.nombre }}</option>
          </select>
        </div>
        <div v-else class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Usuario</label>
          <div class="h-10 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            {{ user?.nombre || '—' }}
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Desde</label>
          <input
            type="date"
            v-model="startDate"
            class="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Hasta</label>
          <input
            type="date"
            v-model="endDate"
            class="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        <button
          @click="fetchCorte"
          :disabled="loading || !startDate || !endDate"
          class="h-10 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Calculando…' : 'Generar Corte' }}
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      {{ error }}
    </div>

    <!-- Resultados -->
    <template v-if="report">
      <!-- Resumen global -->
      <div v-if="!selectedProvider" class="mb-6 rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-900/20">
        <h3 class="mb-4 text-sm font-bold text-brand-800 dark:text-brand-300">Resumen General — Todos los Proveedores</h3>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">Total Aportaciones</p>
            <p class="mt-1 text-base font-bold text-gray-800 dark:text-white">{{ formatCurrency(report.summary.total_contributions) }}</p>
          </div>
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">Comisión (9%)</p>
            <p class="mt-1 text-base font-bold text-orange-600">-{{ formatCurrency(report.summary.total_commission) }}</p>
          </div>
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">Salarios en Período</p>
            <p class="mt-1 text-base font-bold text-orange-600">-{{ formatCurrency(report.summary.total_salary) }}</p>
          </div>
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">Total Fondeado</p>
            <p class="mt-1 text-base font-bold text-gray-700 dark:text-gray-200">{{ formatCurrency(report.summary.total_funded) }}</p>
          </div>
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">G. Admin Retenidos</p>
            <p class="mt-1 text-base font-bold text-gray-500 dark:text-gray-400">{{ formatCurrency(report.summary.total_retention) }}</p>
          </div>
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">Esperado a Recuperar</p>
            <p class="mt-1 text-base font-bold text-green-600">{{ formatCurrency(report.summary.total_expected_return) }}</p>
          </div>
          <div class="rounded-lg bg-white p-3 shadow-theme-xs dark:bg-gray-900">
            <p class="text-xs text-gray-400">Cobrado hasta Ahora</p>
            <p class="mt-1 text-base font-bold text-blue-600">{{ formatCurrency(report.summary.total_collected) }}</p>
          </div>
          <div class="rounded-lg border-2 border-brand-400 bg-brand-500 p-3">
            <p class="text-xs text-brand-100">Rendimiento Neto Est.</p>
            <p class="mt-1 text-base font-bold text-white">{{ formatCurrency(report.summary.net_yield) }}</p>
          </div>
        </div>
      </div>

      <!-- Por proveedor -->
      <div v-for="pReport in report.providers" :key="pReport.provider.id" class="mb-6">
        <div
          class="flex cursor-pointer items-center justify-between rounded-t-xl border border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800"
          @click="toggleProvider(pReport.provider.id)"
        >
          <h3 class="font-bold text-gray-800 dark:text-white">{{ pReport.provider.name }}</h3>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Rendimiento est.:
              <strong :class="pReport.net_yield >= 0 ? 'text-green-600' : 'text-red-500'">
                {{ formatCurrency(pReport.net_yield) }}
              </strong>
            </span>
            <ChevronDownIcon :class="['h-5 w-5 text-gray-400 transition-transform duration-200', expanded[pReport.provider.id] ? 'rotate-180' : '']" />
          </div>
        </div>

        <div v-if="expanded[pReport.provider.id]" class="rounded-b-xl border border-t-0 border-gray-200 bg-white dark:border-gray-700 dark:bg-white/[0.03]">
          <div class="divide-y divide-gray-100 dark:divide-gray-700">

            <!-- 1. Aportaciones -->
            <div class="p-5">
              <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">1. Aportaciones en el Período</h4>
              <div v-if="pReport.contributions.length === 0" class="text-sm italic text-gray-400">Sin aportaciones registradas en este período.</div>
              <template v-else>
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-100 dark:border-gray-700">
                      <th class="pb-2 text-left text-xs font-medium text-gray-400">Fecha</th>
                      <th class="pb-2 text-left text-xs font-medium text-gray-400">Nota</th>
                      <th class="pb-2 text-right text-xs font-medium text-gray-400">Monto</th>
                      <th class="pb-2 text-right text-xs font-medium text-gray-400">Comisión (9%)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                    <tr v-for="c in pReport.contributions" :key="c.id">
                      <td class="py-2 text-gray-600 dark:text-gray-300">{{ formatDate(c.effective_date || c.payment_date) }}</td>
                      <td class="py-2 text-gray-500 dark:text-gray-400">{{ c.note || '—' }}</td>
                      <td class="py-2 text-right font-medium text-gray-800 dark:text-white">{{ formatCurrency(c.amount) }}</td>
                      <td class="py-2 text-right text-orange-600 dark:text-orange-400">-{{ formatCurrency(c.amount * 0.09) }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="mt-3 flex flex-wrap justify-end gap-6 border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
                  <div>Total aportaciones: <strong class="ml-1 text-gray-800 dark:text-white">{{ formatCurrency(pReport.total_contributions) }}</strong></div>
                  <div>Comisión total (9%): <strong class="ml-1 text-orange-600">-{{ formatCurrency(pReport.commission) }}</strong></div>
                </div>
              </template>
            </div>

            <!-- 2. Salarios -->
            <div class="p-5">
              <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">2. Salarios en el Período (cada sábado $3,000)</h4>
              <div v-if="pReport.salary_weeks.length === 0" class="text-sm italic text-gray-400">Sin sábados en este período.</div>
              <template v-else>
                <div class="flex flex-wrap gap-2">
                  <div v-for="week in pReport.salary_weeks" :key="week.date" class="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm dark:border-orange-800 dark:bg-orange-900/20">
                    <span class="text-gray-600 dark:text-gray-300">{{ formatDate(week.date) }}</span>
                    <span class="ml-2 font-medium text-orange-700 dark:text-orange-400">-{{ formatCurrency(week.amount) }}</span>
                  </div>
                </div>
                <div class="mt-3 flex justify-end border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
                  Total salarios: <strong class="ml-2 text-orange-600">-{{ formatCurrency(pReport.total_salary) }}</strong>
                </div>
              </template>
            </div>

            <!-- 3. Créditos -->
            <div class="p-5">
              <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">3. Cartera de Créditos Fondeados</h4>
              <div v-if="pReport.credits.length === 0" class="text-sm italic text-gray-400">Sin créditos fondeados por este proveedor.</div>
              <template v-else>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr class="border-b border-gray-100 dark:border-gray-700">
                        <th class="pb-2 text-left text-xs font-medium text-gray-400">Cliente</th>
                        <th class="pb-2 text-left text-xs font-medium text-gray-400">Tipo</th>
                        <th class="pb-2 text-right text-xs font-medium text-gray-400">Fondeado</th>
                        <th class="pb-2 text-right text-xs font-medium text-gray-400">A Recuperar</th>
                        <th class="pb-2 text-right text-xs font-medium text-gray-400">G. Admin</th>
                        <th class="pb-2 text-right text-xs font-medium text-gray-400">Cobrado</th>
                        <th class="pb-2 text-center text-xs font-medium text-gray-400">Estatus</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                      <tr v-for="c in pReport.credits" :key="c.credit_id">
                        <td class="py-2 text-gray-700 dark:text-gray-300">{{ c.client_name }}</td>
                        <td class="py-2 text-xs text-gray-500 dark:text-gray-400">{{ c.loan_type }}</td>
                        <td class="py-2 text-right font-medium text-gray-800 dark:text-white">{{ formatCurrency(c.funded_amount) }}</td>
                        <td class="py-2 text-right font-medium text-green-700 dark:text-green-400">{{ formatCurrency(c.expected_return) }}</td>
                        <td class="py-2 text-right text-gray-500 dark:text-gray-400">{{ formatCurrency(c.retention_share) }}</td>
                        <td class="py-2 text-right text-blue-600 dark:text-blue-400">{{ formatCurrency(c.paid_amount) }}</td>
                        <td class="py-2 text-center">
                          <span :class="statusClass(c.status)" class="inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                            {{ statusLabel(c.status) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="border-t-2 border-gray-200 text-sm font-semibold dark:border-gray-600">
                        <td class="pt-3 text-gray-600 dark:text-gray-300" colspan="2">Totales</td>
                        <td class="pt-3 text-right text-gray-800 dark:text-white">{{ formatCurrency(pReport.total_funded) }}</td>
                        <td class="pt-3 text-right text-green-700 dark:text-green-400">{{ formatCurrency(pReport.total_expected_return) }}</td>
                        <td class="pt-3 text-right text-gray-500 dark:text-gray-400">{{ formatCurrency(pReport.total_retention) }}</td>
                        <td class="pt-3 text-right text-blue-600 dark:text-blue-400">{{ formatCurrency(pReport.total_collected) }}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </template>
            </div>

            <!-- 4. Rendimiento -->
            <div class="p-5">
              <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">4. Rendimiento Estimado</h4>
              <div class="max-w-sm space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Total esperado a recuperar</span>
                  <span class="font-medium text-gray-800 dark:text-white">{{ formatCurrency(pReport.total_expected_return) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Menos comisión (9%)</span>
                  <span class="text-orange-600">-{{ formatCurrency(pReport.commission) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Menos salarios en período</span>
                  <span class="text-orange-600">-{{ formatCurrency(pReport.total_salary) }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                  <span class="font-semibold text-gray-700 dark:text-gray-200">Rendimiento Neto Estimado</span>
                  <span :class="pReport.net_yield >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'" class="text-base font-bold">
                    {{ formatCurrency(pReport.net_yield) }}
                  </span>
                </div>
                <div class="flex justify-between border-t border-gray-100 pt-2 text-xs dark:border-gray-700">
                  <span class="text-gray-400">Cobrado hasta ahora</span>
                  <span class="font-medium text-blue-600 dark:text-blue-400">{{ formatCurrency(pReport.total_collected) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-if="report.providers.length === 0" class="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-white/[0.03]">
        No se encontraron proveedores para el período seleccionado.
      </div>
    </template>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ChevronDownIcon } from '@/icons'
import { useAuth } from '@/composables/useAuth'

const { token, user, isAdmin } = useAuth()
const API_URL = import.meta.env.VITE_API_URL

const providers = ref([])
const users = ref([])
const selectedProvider = ref('')
const selectedUser = ref('')
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const pdfLoading = ref(false)
const error = ref('')
const report = ref(null)
const expanded = reactive({})

// Default: current month
const today = new Date()
const y = today.getFullYear()
const mo = String(today.getMonth() + 1).padStart(2, '0')
const d = String(today.getDate()).padStart(2, '0')
endDate.value = `${y}-${mo}-${d}`
startDate.value = `${y}-${mo}-01`

// ─── Data fetching ────────────────────────────────────────────────────────────

const fetchProviders = async () => {
  try {
    const res = await fetch(`${API_URL}/providers`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (res.ok) providers.value = await res.json()
  } catch { /* optional */ }
}

const fetchUsers = async () => {
  if (!isAdmin.value) return
  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (res.ok) users.value = await res.json()
  } catch { /* optional */ }
}

const fetchCorte = async () => {
  if (!startDate.value || !endDate.value) return
  loading.value = true
  error.value = ''
  report.value = null

  try {
    const params = new URLSearchParams({ start_date: startDate.value, end_date: endDate.value })
    if (selectedProvider.value) params.append('provider_id', selectedProvider.value)
    if (isAdmin.value && selectedUser.value) params.append('user_id', selectedUser.value)

    const res = await fetch(`${API_URL}/corte?${params}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Error al obtener corte')
    }
    report.value = await res.json()
    for (const p of report.value.providers) expanded[p.provider.id] = true
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const toggleProvider = (id) => { expanded[id] = !expanded[id] }

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(Number(v) || 0)

const formatDate = (val) => {
  if (!val) return '—'
  const date = new Date(String(val).substring(0, 10) + 'T12:00:00')
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusLabel = (s) => ({
  pending: 'Pendiente', approved: 'Aprobado', active: 'Activo',
  completed: 'Completado', rejected: 'Rechazado', defaulted: 'Moroso',
}[s] ?? s)

const statusClass = (s) => ({
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  defaulted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}[s] ?? 'bg-gray-100 text-gray-600')

// ─── PDF Generation ───────────────────────────────────────────────────────────

const loadLogoAsBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve({ data: canvas.toDataURL('image/png'), ratio: img.naturalWidth / img.naturalHeight })
    }
    img.onerror = () => resolve(null)
    img.src = url
  })

const generatePDF = async () => {
  if (!report.value) return
  pdfLoading.value = true

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

    const PW = doc.internal.pageSize.getWidth()   // 215.9 mm
    const PH = doc.internal.pageSize.getHeight()  // 279.4 mm
    const M = 14       // page margin
    const CW = PW - M * 2   // content width ≈ 187.9 mm
    const HEADER_H = 28     // reserved header zone (mm)
    const FOOTER_H = 10     // reserved footer zone (mm)

    // Colors [R, G, B]
    const NAVY     = [15,  40,  80]
    const BLUE     = [37,  99, 235]
    const BLUE_L   = [219, 234, 254]
    const ORANGE   = [194,  65,  12]
    const GREEN    = [21, 128,  61]
    const GRAY_D   = [55,  65,  81]
    const GRAY_L   = [156, 163, 175]
    const WHITE    = [255, 255, 255]
    const ALT_ROW  = [247, 249, 252]
    const LINE_CLR = [210, 218, 230]

    // Load logo from public folder
    const logo = await loadLogoAsBase64('/logo.png')

    // ── Header drawn on every page ───────────────────────────────────────────
    const drawPageHeader = () => {
      // Thin top accent bar
      doc.setFillColor(...NAVY)
      doc.rect(0, 0, PW, 4, 'F')

      // Logo
      if (logo) {
        const logoW = 22
        const logoH = logoW / logo.ratio
        const logoY = 4 + (HEADER_H - 4 - logoH) / 2
        doc.addImage(logo.data, 'PNG', M, logoY, logoW, logoH)
      }

      // Title block
      const txX = logo ? M + 26 : M
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.text('Corte de Rendimientos', txX, 13)

      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRAY_D)
      doc.text(`Periodo: ${formatDate(startDate.value)}  a  ${formatDate(endDate.value)}`, txX, 19)

      // Generated info aligned right
      const genText = `Generado: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`
      doc.setFontSize(7)
      doc.setTextColor(...GRAY_L)
      doc.text(genText, PW - M, 19, { align: 'right' })

      // Divider line
      doc.setDrawColor(...LINE_CLR)
      doc.setLineWidth(0.4)
      doc.line(M, HEADER_H, PW - M, HEADER_H)

      doc.setTextColor(0, 0, 0) // reset
    }

    // ── Footer (two-pass after all content) ──────────────────────────────────
    const drawFooters = () => {
      const total = doc.internal.getNumberOfPages()
      for (let i = 1; i <= total; i++) {
        doc.setPage(i)
        doc.setDrawColor(...LINE_CLR)
        doc.setLineWidth(0.3)
        doc.line(M, PH - FOOTER_H + 2, PW - M, PH - FOOTER_H + 2)
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...GRAY_L)
        doc.text(`Pagina ${i} de ${total}`, PW / 2, PH - 5, { align: 'center' })
        doc.text('Confidencial', M, PH - 5)
        doc.setTextColor(0, 0, 0)
      }
    }

    // ── Common autoTable config ───────────────────────────────────────────────
    const tableBase = () => ({
      margin: { left: M, right: M, top: HEADER_H + 2, bottom: FOOTER_H + 4 },
      didDrawPage: drawPageHeader,
      styles: { fontSize: 7.5, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 }, font: 'helvetica', textColor: GRAY_D },
      headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 7, cellPadding: { top: 3, bottom: 3, left: 3, right: 3 } },
      alternateRowStyles: { fillColor: ALT_ROW },
      tableLineColor: LINE_CLR,
      tableLineWidth: 0.25,
    })

    // ── Helpers ───────────────────────────────────────────────────────────────
    let currentY = HEADER_H + 4

    const ensureSpace = (needed) => {
      if (currentY + needed > PH - FOOTER_H - 4) {
        doc.addPage()
        drawPageHeader()
        currentY = HEADER_H + 4
      }
    }

    const sectionLabel = (text) => {
      ensureSpace(8)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...GRAY_L)
      doc.text(text.toUpperCase(), M, currentY + 4)
      doc.setTextColor(0, 0, 0)
      currentY += 7
    }

    const currency = formatCurrency

    // ─────────────────────────────────────────────────────────────────────────
    // Draw first page header
    drawPageHeader()

    // ── SUMMARY (when all providers) ─────────────────────────────────────────
    if (!selectedProvider.value && report.value.providers.length > 1) {
      const s = report.value.summary

      // Banner
      ensureSpace(10)
      doc.setFillColor(...NAVY)
      doc.roundedRect(M, currentY, CW, 8, 1, 1, 'F')
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...WHITE)
      doc.text('Resumen General — Todos los Proveedores', M + 4, currentY + 5.5)
      doc.setTextColor(0, 0, 0)
      currentY += 11

      autoTable(doc, {
        ...tableBase(),
        startY: currentY,
        body: [
          [
            { content: 'Total Aportaciones en Periodo', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: currency(s.total_contributions), styles: { halign: 'right', fontStyle: 'bold' } },
            { content: 'Comision Total (9%)', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: `-${currency(s.total_commission)}`, styles: { halign: 'right', textColor: ORANGE } },
          ],
          [
            { content: 'Salarios en Periodo', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: `-${currency(s.total_salary)}`, styles: { halign: 'right', textColor: ORANGE } },
            { content: 'Total Fondeado en Creditos', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: currency(s.total_funded), styles: { halign: 'right' } },
          ],
          [
            { content: 'Gastos Admin Retenidos', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: currency(s.total_retention), styles: { halign: 'right' } },
            { content: 'Cobrado hasta Ahora', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: currency(s.total_collected), styles: { halign: 'right', textColor: [37, 99, 235] } },
          ],
          [
            { content: 'Esperado a Recuperar (con intereses)', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: currency(s.total_expected_return), styles: { halign: 'right', textColor: GREEN, fontStyle: 'bold' } },
            { content: 'RENDIMIENTO NETO ESTIMADO', styles: { fontStyle: 'bold', fillColor: s.net_yield >= 0 ? [220, 252, 231] : [254, 226, 226], textColor: s.net_yield >= 0 ? GREEN : [185, 28, 28] } },
            { content: currency(s.net_yield), styles: { halign: 'right', fontStyle: 'bold', fontSize: 9, fillColor: s.net_yield >= 0 ? [220, 252, 231] : [254, 226, 226], textColor: s.net_yield >= 0 ? GREEN : [185, 28, 28] } },
          ],
        ],
        columnStyles: {
          0: { cellWidth: CW * 0.305 },
          1: { cellWidth: CW * 0.195 },
          2: { cellWidth: CW * 0.305 },
          3: { cellWidth: CW * 0.195 },
        },
      })
      currentY = doc.lastAutoTable.finalY + 8
    }

    // ── PER-PROVIDER SECTIONS ─────────────────────────────────────────────────
    for (let pi = 0; pi < report.value.providers.length; pi++) {
      const pr = report.value.providers[pi]

      // Force new page for every provider after the first
      if (pi > 0) {
        doc.addPage()
        drawPageHeader()
        currentY = HEADER_H + 4
      }

      // ── Provider banner ──────────────────────────────────────────────────
      ensureSpace(10)
      doc.setFillColor(...NAVY)
      doc.roundedRect(M, currentY, CW, 9, 1.5, 1.5, 'F')

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...WHITE)
      doc.text(pr.provider.name, M + 4, currentY + 6.2)

      // Net yield badge right side
      const badge = `Rendimiento: ${currency(pr.net_yield)}`
      doc.setFontSize(8.5)
      doc.setTextColor(...(pr.net_yield >= 0 ? [134, 239, 172] : [252, 165, 165]))
      doc.text(badge, PW - M - 3, currentY + 6.2, { align: 'right' })
      doc.setTextColor(0, 0, 0)
      currentY += 13

      // ── 1. Aportaciones ──────────────────────────────────────────────────
      sectionLabel('1. Aportaciones en el Periodo')

      if (pr.contributions.length === 0) {
        ensureSpace(7)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(...GRAY_L)
        doc.text('Sin aportaciones registradas en este periodo.', M + 2, currentY + 4)
        currentY += 8
      } else {
        const contribBody = pr.contributions.map(c => [
          formatDate(c.effective_date || c.payment_date),
          c.note || '—',
          { content: currency(c.amount), styles: { halign: 'right' } },
          { content: `-${currency(c.amount * 0.09)}`, styles: { halign: 'right', textColor: ORANGE } },
        ])
        // Totals row
        contribBody.push([
          { content: 'TOTALES', colSpan: 2, styles: { fontStyle: 'bold', fillColor: BLUE_L, textColor: NAVY } },
          { content: currency(pr.total_contributions), styles: { halign: 'right', fontStyle: 'bold', fillColor: BLUE_L } },
          { content: `-${currency(pr.commission)}`, styles: { halign: 'right', fontStyle: 'bold', textColor: ORANGE, fillColor: BLUE_L } },
        ])

        autoTable(doc, {
          ...tableBase(),
          startY: currentY,
          head: [['Fecha', 'Nota / Concepto', 'Monto', 'Comision (9%)']],
          body: contribBody,
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 36, halign: 'right' },
            3: { cellWidth: 36, halign: 'right' },
          },
        })
        currentY = doc.lastAutoTable.finalY + 5
      }

      // ── 2. Salarios ──────────────────────────────────────────────────────
      sectionLabel('2. Salarios en el Periodo (cada sabado $3,000)')

      if (pr.salary_weeks.length === 0) {
        ensureSpace(7)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(...GRAY_L)
        doc.text('Sin sabados en este periodo.', M + 2, currentY + 4)
        currentY += 8
      } else {
        const salBody = pr.salary_weeks.map(w => [
          formatDate(w.date),
          'Salario semanal del encargado',
          { content: `-${currency(w.amount)}`, styles: { halign: 'right', textColor: ORANGE } },
        ])
        salBody.push([
          { content: `${pr.salary_weeks.length} semana(s)`, styles: { fontStyle: 'bold', fillColor: [255, 247, 237], textColor: ORANGE } },
          { content: 'TOTAL SALARIOS', styles: { fontStyle: 'bold', fillColor: [255, 247, 237], textColor: ORANGE } },
          { content: `-${currency(pr.total_salary)}`, styles: { halign: 'right', fontStyle: 'bold', fillColor: [255, 247, 237], textColor: ORANGE } },
        ])

        autoTable(doc, {
          ...tableBase(),
          startY: currentY,
          head: [['Sabado', 'Concepto', 'Monto']],
          body: salBody,
          columnStyles: {
            0: { cellWidth: 36 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 40, halign: 'right' },
          },
        })
        currentY = doc.lastAutoTable.finalY + 5
      }

      // ── 3. Cartera de créditos ───────────────────────────────────────────
      sectionLabel('3. Cartera de Creditos Fondeados')

      if (pr.credits.length === 0) {
        ensureSpace(7)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(...GRAY_L)
        doc.text('Sin creditos fondeados por este proveedor.', M + 2, currentY + 4)
        currentY += 8
      } else {
        const creditBody = pr.credits.map(c => [
          c.client_name,
          c.loan_type || '—',
          { content: currency(c.funded_amount), styles: { halign: 'right' } },
          { content: currency(c.expected_return), styles: { halign: 'right', textColor: GREEN } },
          { content: currency(c.retention_share), styles: { halign: 'right' } },
          { content: currency(c.paid_amount), styles: { halign: 'right', textColor: [37, 99, 235] } },
          { content: statusLabel(c.status), styles: { halign: 'center' } },
        ])
        creditBody.push([
          { content: 'TOTALES', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 250, 240], textColor: NAVY } },
          { content: currency(pr.total_funded), styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 250, 240] } },
          { content: currency(pr.total_expected_return), styles: { halign: 'right', fontStyle: 'bold', textColor: GREEN, fillColor: [240, 250, 240] } },
          { content: currency(pr.total_retention), styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 250, 240] } },
          { content: currency(pr.total_collected), styles: { halign: 'right', fontStyle: 'bold', textColor: [37, 99, 235], fillColor: [240, 250, 240] } },
          { content: '', styles: { fillColor: [240, 250, 240] } },
        ])

        autoTable(doc, {
          ...tableBase(),
          startY: currentY,
          head: [['Cliente', 'Tipo', 'Fondeado', 'A Recuperar', 'G. Admin', 'Cobrado', 'Estatus']],
          body: creditBody,
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 22 },
            2: { cellWidth: 29, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 23, halign: 'right' },
            5: { cellWidth: 29, halign: 'right' },
            6: { cellWidth: 22, halign: 'center' },
          },
        })
        currentY = doc.lastAutoTable.finalY + 5
      }

      // ── 4. Rendimiento neto ──────────────────────────────────────────────
      sectionLabel('4. Rendimiento Estimado')
      ensureSpace(40)

      const isPositive = pr.net_yield >= 0
      const yieldFill = isPositive ? [220, 252, 231] : [254, 226, 226]
      const yieldColor = isPositive ? GREEN : [185, 28, 28]

      autoTable(doc, {
        ...tableBase(),
        startY: currentY,
        body: [
          [
            { content: 'Total esperado a recuperar (con intereses)', styles: { fontStyle: 'bold', textColor: GRAY_D } },
            { content: currency(pr.total_expected_return), styles: { halign: 'right', textColor: GREEN, fontStyle: 'bold' } },
          ],
          [
            { content: 'Menos: Comision del encargado (9% sobre aportaciones)', styles: { textColor: GRAY_D } },
            { content: `-${currency(pr.commission)}`, styles: { halign: 'right', textColor: ORANGE } },
          ],
          [
            { content: 'Menos: Salarios en el periodo', styles: { textColor: GRAY_D } },
            { content: `-${currency(pr.total_salary)}`, styles: { halign: 'right', textColor: ORANGE } },
          ],
          [
            { content: 'RENDIMIENTO NETO ESTIMADO', styles: { fontStyle: 'bold', fontSize: 9, fillColor: yieldFill, textColor: yieldColor } },
            { content: currency(pr.net_yield), styles: { halign: 'right', fontStyle: 'bold', fontSize: 10, fillColor: yieldFill, textColor: yieldColor } },
          ],
          [
            { content: '(Referencia) Cobrado hasta ahora', styles: { fontSize: 7, textColor: GRAY_L } },
            { content: currency(pr.total_collected), styles: { halign: 'right', fontSize: 7, textColor: [37, 99, 235] } },
          ],
        ],
        columnStyles: {
          0: { cellWidth: CW * 0.72 },
          1: { cellWidth: CW * 0.28, halign: 'right' },
        },
      })
      currentY = doc.lastAutoTable.finalY + 6
    }

    // ── Page footers (two-pass) ───────────────────────────────────────────────
    drawFooters()

    // ── Save ─────────────────────────────────────────────────────────────────
    const filename = selectedProvider.value
      ? `corte-proveedor-${startDate.value}-${endDate.value}.pdf`
      : `corte-general-${startDate.value}-${endDate.value}.pdf`
    doc.save(filename)

  } catch (e) {
    console.error('PDF error:', e)
    error.value = 'Error al generar PDF: ' + e.message
  } finally {
    pdfLoading.value = false
  }
}

onMounted(() => { fetchProviders(); fetchUsers() })
</script>
