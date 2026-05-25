import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/usuarios',
      name: 'Users',
      component: () => import('../views/Modules/Users.vue'),
      meta: {
        title: 'Usuarios',
      },
    },
    {
      path: '/usuarios/nuevo',
      name: 'NewUser',
      component: () => import('../views/Modules/Users/UserForm.vue'),
      meta: {
        title: 'Nuevo Usuario',
      },
    },
    {
      path: '/simulador',
      name: 'Simulador',
      component: () => import('../views/Modules/Simulator.vue'),
      meta: {
        title: 'Simulador',
      },
    },
    {
      path: '/proveedores',
      name: 'Proveedores',
      component: () => import('../views/Modules/Providers.vue'),
      meta: {
        title: 'Proveedores',
      },
    },
    {
      path: '/proveedores/nuevo',
      name: 'NewProvider',
      component: () => import('../views/Modules/Providers/ProviderForm.vue'),
      meta: {
        title: 'Nuevo Proveedor',
      },
    },
    {
      path: '/proveedores/aportaciones/:id',
      name: 'ProviderContributions',
      component: () => import('../views/Modules/Providers/Contributions.vue'),
      meta: {
        title: 'Aportaciones',
      },
    },
    {
      path: '/clientes',
      name: 'Clientes',
      component: () => import('../views/Modules/Clients.vue'),
      meta: {
        title: 'Clientes',
      },
    },
    {
      path: '/clientes/nuevo',
      name: 'NewClient',
      component: () => import('../views/Modules/Clients/ClientForm.vue'),
      meta: {
        title: 'Nuevo Cliente',
      },
    },
    {
      path: '/reestructuracion',
      name: 'Reestructuracion',
      component: () => import('../views/Modules/Restructuring.vue'),
      meta: {
        title: 'Reestructuración',
      },
    },

    // Rutas anteriores para referencia o borrado futuro
    {
      path: '/ecommerce',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/creditos/aprobar',
      name: 'CreditApproval',
      component: () => import('../views/Modules/Credits/CreditApproval.vue'),
      meta: {
        title: 'Formalización de Crédito',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
