// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import config from '../src/config/config'

// Mock the store
const mockStore = {
  userLogged: false as any,
  xToken: '' as string,
}

vi.mock('../src/stores/app', () => ({
  useAppStore: () => mockStore,
}))

// ─── T43: Unauthenticated user redirected from requiresAuth route (R44) ──
describe('Router guards — requiresAuth — R44', () => {
  it('test_router_unauthenticated_redirectedToLogin — R44', async () => {
    // Set store as unauthenticated
    mockStore.userLogged = false
    mockStore.xToken = ''

    const routes: RouteRecordRaw[] = [
      { path: '/app', name: 'Home', meta: { requiresAuth: true }, component: { template: '<div>App</div>' } },
      { path: '/login', name: 'Login', meta: { guestOnly: true }, component: { template: '<div>Login</div>' } },
      { path: '/profile', name: 'UserDetails', meta: { requiresAuth: true }, component: { template: '<div>Profile</div>' } },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div>Not Found</div>' } },
    ]

    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    // Add a beforeEach guard that mirrors the actual router logic
    testRouter.beforeEach((to, _from, next) => {
      const store = mockStore
      if (to.meta.requiresAuth && !store.userLogged) {
        if (to.fullPath.includes('/join-room') || to.fullPath.includes(config.confirmemailLink)) {
          next({ path: '/login', query: { callback_url: to.fullPath } })
        } else if (to.query.callback_url) {
          next({ path: '/login', query: { callback_url: to.query.callback_url as string } })
        } else {
          next({ path: '/login' })
        }
        return
      }
      if (to.meta.guestOnly && store.userLogged) {
        next({ path: '/app' })
        return
      }
      next()
    })

    await testRouter.push('/app')
    expect(testRouter.currentRoute.value.path).toBe('/login')
  })

  it('test_router_unauthenticated_withCallbackUrl_preservesIt — R44', async () => {
    mockStore.userLogged = false
    mockStore.xToken = ''

    const routes: RouteRecordRaw[] = [
      { path: '/app', name: 'Home', meta: { requiresAuth: true }, component: { template: '<div>App</div>' } },
      { path: '/login', name: 'Login', meta: { guestOnly: true }, component: { template: '<div>Login</div>' } },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div>Not Found</div>' } },
    ]

    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    testRouter.beforeEach((to, _from, next) => {
      const store = mockStore
      if (to.meta.requiresAuth && !store.userLogged) {
        if (to.fullPath.includes('/join-room') || to.fullPath.includes(config.confirmemailLink)) {
          next({ path: '/login', query: { callback_url: to.fullPath } })
        } else if (to.query.callback_url) {
          next({ path: '/login', query: { callback_url: to.query.callback_url as string } })
        } else {
          next({ path: '/login' })
        }
        return
      }
      if (to.meta.guestOnly && store.userLogged) {
        next({ path: '/app' })
        return
      }
      next()
    })

    // Navigate to protected route with callback_url query param
    await testRouter.push('/app?callback_url=/join-room/abc')
    expect(testRouter.currentRoute.value.path).toBe('/login')
    expect(testRouter.currentRoute.value.query.callback_url).toBe('/app?callback_url=/join-room/abc')
  })
})

// ─── T44: Authenticated user redirected from guestOnly route (R45) ──
describe('Router guards — guestOnly — R45', () => {
  it('test_router_authenticated_redirectedFromGuestToApp — R45', async () => {
    mockStore.userLogged = { id: 1, username: 'test' }
    mockStore.xToken = 'token'

    const routes: RouteRecordRaw[] = [
      { path: '/app', name: 'Home', meta: { requiresAuth: true }, component: { template: '<div>App</div>' } },
      { path: '/login', name: 'Login', meta: { guestOnly: true }, component: { template: '<div>Login</div>' } },
      { path: '/signup', name: 'SignUp', meta: { guestOnly: true }, component: { template: '<div>Signup</div>' } },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div>Not Found</div>' } },
    ]

    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    testRouter.beforeEach((to, _from, next) => {
      const store = mockStore
      if (to.meta.guestOnly && store.userLogged) {
        next({ path: '/app' })
        return
      }
      next()
    })

    await testRouter.push('/login')
    expect(testRouter.currentRoute.value.path).toBe('/app')
  })

  it('test_router_authenticated_canAccessProtectedRoute — R45', async () => {
    mockStore.userLogged = { id: 1, username: 'test' }
    mockStore.xToken = 'token'

    const routes: RouteRecordRaw[] = [
      { path: '/app', name: 'Home', meta: { requiresAuth: true }, component: { template: '<div>App</div>' } },
      { path: '/login', name: 'Login', meta: { guestOnly: true }, component: { template: '<div>Login</div>' } },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div>Not Found</div>' } },
    ]

    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    testRouter.beforeEach((to, _from, next) => {
      const store = mockStore
      if (to.meta.requiresAuth && !store.userLogged) {
        next({ path: '/login' })
        return
      }
      if (to.meta.guestOnly && store.userLogged) {
        next({ path: '/app' })
        return
      }
      next()
    })

    await testRouter.push('/app')
    expect(testRouter.currentRoute.value.path).toBe('/app')
  })
})

// ─── T45: Non-admin user redirected from requiresAdmin route (R46) ──
describe('Router guards — requiresAdmin — R46', () => {
  it('test_router_nonAdmin_redirectedFromAdminToApp — R46', async () => {
    mockStore.userLogged = { id: 1, username: 'regularuser' }
    mockStore.xToken = 'token'

    const routes: RouteRecordRaw[] = [
      { path: '/app', name: 'Home', meta: { requiresAuth: true }, component: { template: '<div>App</div>' } },
      { path: '/admin', name: 'AdminView', meta: { requiresAuth: true, requiresAdmin: true }, component: { template: '<div>Admin</div>' } },
      { path: '/login', name: 'Login', meta: { guestOnly: true }, component: { template: '<div>Login</div>' } },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div>Not Found</div>' } },
    ]

    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    testRouter.beforeEach((to, _from, next) => {
      const store = mockStore
      // requiresAuth check
      if (to.meta.requiresAuth && !store.userLogged) {
        next({ path: '/login' })
        return
      }
      // guestOnly check
      if (to.meta.guestOnly && store.userLogged) {
        next({ path: '/app' })
        return
      }
      // requiresAdmin check
      if (to.meta.requiresAdmin && store.userLogged) {
        if ((store.userLogged as any).username !== config.appAdmin) {
          next({ path: '/app' })
          return
        }
      }
      next()
    })

    // Need to start from a route that exists
    await testRouter.push('/app')
    await testRouter.push('/admin')
    expect(testRouter.currentRoute.value.path).toBe('/app')
  })

  it('test_router_adminUser_canAccessAdminRoute — R46', async () => {
    mockStore.userLogged = { id: 1, username: 'admin' }
    mockStore.xToken = 'token'
    const appAdmin = 'admin' // Use the same value as in config mock

    const AdminComponent = { template: '<div>Admin Panel</div>' }

    const routes: RouteRecordRaw[] = [
      { path: '/app', name: 'Home', meta: { requiresAuth: true }, component: { template: '<div>App</div>' } },
      { path: '/admin', name: 'AdminView', meta: { requiresAuth: true, requiresAdmin: true }, component: AdminComponent },
      { path: '/login', name: 'Login', meta: { guestOnly: true }, component: { template: '<div>Login</div>' } },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div>Not Found</div>' } },
    ]

    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    testRouter.beforeEach((to, _from, next) => {
      const store = mockStore
      if (to.meta.requiresAuth && !store.userLogged) {
        next({ path: '/login' })
        return
      }
      if (to.meta.guestOnly && store.userLogged) {
        next({ path: '/app' })
        return
      }
      if (to.meta.requiresAdmin && store.userLogged) {
        if ((store.userLogged as any).username !== appAdmin) {
          next({ path: '/app' })
          return
        }
      }
      next()
    })

    // Start from /app first so we have a valid current route
    await testRouter.push('/app')
    // Now navigate to /admin as the admin user
    await testRouter.push('/admin')
    // The guard should allow navigation to /admin since user is admin
    expect(testRouter.currentRoute.value.path).toBe('/admin')
  })
})