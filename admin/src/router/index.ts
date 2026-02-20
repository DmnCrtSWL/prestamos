import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // Public routes
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Iniciar Sesión', public: true },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Registro', public: true },
    },

    // Protected routes (all roles)
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/simulador',
      name: 'Simulador',
      component: () => import('../views/Modules/Simulator.vue'),
      meta: { title: 'Simulador', requiresAuth: true },
    },
    {
      path: '/clientes',
      name: 'Clientes',
      component: () => import('../views/Modules/Clients.vue'),
      meta: { title: 'Clientes', requiresAuth: true },
    },
    {
      path: '/clientes/nuevo',
      name: 'NewClient',
      component: () => import('../views/Modules/Clients/ClientForm.vue'),
      meta: { title: 'Nuevo Cliente', requiresAuth: true },
    },
    {
      path: '/clientes/:id/editar',
      name: 'EditClient',
      component: () => import('../views/Modules/Clients/ClientForm.vue'),
      meta: { title: 'Editar Cliente', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/clientes/:id',
      name: 'ViewClient',
      component: () => import('../views/Modules/Clients/ClientDetail.vue'),
      meta: { title: 'Detalle de Cliente', requiresAuth: true },
    },
    {
      path: '/creditos',
      name: 'Creditos',
      component: () => import('../views/Modules/Credits.vue'),
      meta: { title: 'Créditos', requiresAuth: true },
    },
    {
      path: '/creditos/:id/fondear',
      name: 'CreditFunding',
      component: () => import('../views/Modules/Credits/CreditFunding.vue'),
      meta: { title: 'Fondeo de Crédito', requiresAuth: true },
    },
    {
      path: '/creditos/aprobar',
      name: 'CreditApproval',
      component: () => import('../views/Modules/Credits/CreditApproval.vue'),
      meta: { title: 'Formalización de Crédito', requiresAuth: true },
    },
    {
      path: '/creditos/:id',
      name: 'CreditDetail',
      component: () => import('../views/Modules/Credits/CreditDetail.vue'),
      meta: { title: 'Detalles de Crédito', requiresAuth: true },
    },
    {
      path: '/creditos/:id/editar',
      name: 'CreditEdit',
      component: () => import('../views/Modules/Credits/CreditForm.vue'),
      meta: { title: 'Editar Crédito', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/caja',
      name: 'Incomes',
      component: () => import('../views/Modules/Incomes.vue'),
      meta: { title: 'Caja', requiresAuth: true },
    },
    {
      path: '/caja/nuevo',
      name: 'NewIncome',
      component: () => import('../views/Modules/Incomes/IncomeForm.vue'),
      meta: { title: 'Nuevo Ingreso', requiresAuth: true },
    },
    {
      path: '/reestructuracion',
      name: 'Reestructuracion',
      component: () => import('../views/Modules/Restructuring.vue'),
      meta: { title: 'Reestructuración', requiresAuth: true },
    },

    // Admin-only routes
    {
      path: '/usuarios',
      name: 'Users',
      component: () => import('../views/Modules/Users.vue'),
      meta: { title: 'Usuarios', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/usuarios/nuevo',
      name: 'NewUser',
      component: () => import('../views/Modules/Users/UserForm.vue'),
      meta: { title: 'Nuevo Usuario', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/usuarios/editar/:id',
      name: 'EditUser',
      component: () => import('../views/Modules/Users/UserForm.vue'),
      meta: { title: 'Editar Usuario', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/proveedores',
      name: 'Proveedores',
      component: () => import('../views/Modules/Providers.vue'),
      meta: { title: 'Proveedores', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/proveedores/nuevo',
      name: 'NewProvider',
      component: () => import('../views/Modules/Providers/ProviderForm.vue'),
      meta: { title: 'Nuevo Proveedor', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/proveedores/editar/:id',
      name: 'EditProvider',
      component: () => import('../views/Modules/Providers/ProviderForm.vue'),
      meta: { title: 'Editar Proveedor', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/proveedores/aportaciones/:id',
      name: 'ProviderContributions',
      component: () => import('../views/Modules/Providers/Contributions.vue'),
      meta: { title: 'Aportaciones', requiresAuth: true, requiresAdmin: true },
    },

    // Misc / legacy
    {
      path: '/ecommerce',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: { title: 'eCommerce Dashboard', requiresAuth: true },
    },
    {
      path: '/debug',
      name: 'Debug',
      component: () => import('../views/DebugEnv.vue'),
      meta: { title: 'Debug', hidden: true, requiresAuth: true },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Admin'} | Prestamos`

  const token = localStorage.getItem('auth_token')
  const userRaw = localStorage.getItem('auth_user')
  const user = userRaw ? JSON.parse(userRaw) : null

  // Redirect to signin if not authenticated and route requires auth
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Signin' })
  }

  // Redirect to dashboard if already logged in and trying to access signin
  if (to.meta.public && token) {
    return next({ name: 'Dashboard' })
  }

  // Block Sucursal from admin-only routes
  if (to.meta.requiresAdmin && user?.rol !== 'Administrador') {
    return next({ name: 'Dashboard' })
  }

  next()
})
