// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { testI18n } from './i18nPlugin'
import RoomPicker from '../src/components/RoomPicker/RoomNameEditForm.vue'
// Note: RoomPicker.vue imports @iconify/vue which needs special handling in jsdom

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock axios
const mockAxiosGet = vi.fn()
const mockAxiosPut = vi.fn()
const mockAxiosPost = vi.fn()
const mockAxiosDelete = vi.fn()

vi.mock('axios', () => ({
  default: {
    get: (...args: any[]) => mockAxiosGet(...args),
    put: (...args: any[]) => mockAxiosPut(...args),
    post: (...args: any[]) => mockAxiosPost(...args),
    delete: (...args: any[]) => mockAxiosDelete(...args),
  },
}))

// Mock config
vi.mock('../src/config/config', () => ({
  default: {
    baseUrl: 'http://test-api/',
    appAdmin: 'admin',
    authP: '',
    key: '',
    defProfilePicUrl: '',
    joinRoomLink: 'http://test-app/join?',
    confirmemailLink: '',
    joinRoomPath: '',
    clientID: '',
    requestsUrl: '',
    requestsBaseUrl: '',
  },
}))

// Mock useUpdateUserData
vi.mock('../src/composables/useUpdateUserData', () => ({
  default: vi.fn(),
}))

// Mock useGetSongs to prevent errors
vi.mock('../src/composables/useGetSongs', () => ({
  default: vi.fn().mockResolvedValue([]),
}))

// Mock @iconify/vue Icon component — renders icon prop as data-icon attribute for testability
const IconStub = {
  props: ['icon'],
  template: '<span :data-icon="icon" class="icon-stub"></span>',
}

import { useAppStore } from '../src/stores/app'

// Use numeric-parseable IDs since forgetRoom uses parseInt(room.id)
const adminRoom = { id: '1', name: 'Admin Room', adminId: '1' }
const nonAdminRoom = { id: '2', name: 'Other Room', adminId: '99' }

/**
 * Helper: creates a fresh Pinia store with default mock user data.
 */
function createStoreWithUser(user: any = { id: 1, username: 'admin', rooms: [] }) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useAppStore()
  store.setUserLogged(user)
  store.setXToken('test-token')
  return { pinia, store }
}

// ─── T9: Invalid name shows error, does not call API ──────────────────
describe('RoomNameEditForm — T9: invalid name shows error', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
    mockAxiosPut.mockReset()
  })

  it('submitting with an invalid name shows error and does not call the API', async () => {
    const { pinia, store } = createStoreWithUser()
    store.setModal({
      visible: true,
      editingRoomId: '1',
      currentRoomName: 'TestRoom',
    })

    const wrapper = mount(RoomPicker, {
      global: {
        plugins: [pinia, testI18n],
      },
    })

    // Set an invalid name (too short, under 5 chars)
    const input = wrapper.find('[data-testid="room-name-input"]')
    await input.setValue('ab')
    await flushPromises()

    // Submit the form
    const form = wrapper.find('form')
    await form.trigger('submit')
    await flushPromises()

    // Error should be displayed
    const errorSpan = wrapper.find('.error-span')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toContain('Nombre de sala no válido')

    // API should NOT have been called
    expect(mockAxiosPut).not.toHaveBeenCalled()
  })
})

// ─── T10: Valid name sends correct PUT request ──────────────────────
describe('RoomNameEditForm — T10: valid name calls PUT request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
    mockAxiosPut.mockReset()
  })

  it('submitting with a valid name sends correct PUT request', async () => {
    mockAxiosPut.mockResolvedValueOnce({
      status: 200,
      data: {},
    })

    const { pinia, store } = createStoreWithUser()
    store.setModal({
      visible: true,
      editingRoomId: '1',
      currentRoomName: 'TestRoom',
    })

    const wrapper = mount(RoomPicker, {
      global: {
        plugins: [pinia, testI18n],
      },
    })

    // Set a valid room name
    const input = wrapper.find('[data-testid="room-name-input"]')
    await input.setValue('NewRoomName')
    await flushPromises()

    // Submit the form
    const form = wrapper.find('form')
    await form.trigger('submit')
    await flushPromises()

    // API should have been called with correct data
    expect(mockAxiosPut).toHaveBeenCalledWith(
      'http://test-api/rooms/1/1',
      { name: 'NewRoomName' },
      {
        headers: {
          Accept: 'application/json',
          Bearer: 'test-token',
        },
      },
    )
  })
})

// ─── T11: Successful PUT shows success modal and refreshes user data ──
describe('RoomNameEditForm — T11: success response', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
    mockAxiosPut.mockReset()
  })

  it('successful PUT response shows success modal and refreshes user data', async () => {
    const userData = { id: 1, username: 'admin', rooms: [{ id: 'room1', name: 'NewRoomName', adminId: '1' }] }
    mockAxiosPut.mockResolvedValueOnce({
      status: 200,
      data: {},
    })
    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: userData,
    })

    const { pinia, store } = createStoreWithUser()
    store.setModal({
      visible: true,
      editingRoomId: '1',
      currentRoomName: 'TestRoom',
    })

    const wrapper = mount(RoomPicker, {
      global: {
        plugins: [pinia, testI18n],
      },
    })

    const input = wrapper.find('[data-testid="room-name-input"]')
    await input.setValue('NewRoomName')
    await flushPromises()

    const form = wrapper.find('form')
    await form.trigger('submit')
    await flushPromises()

    // Verify success modal was set
    expect(store.modal.visible).toBe(true)
    expect(store.modal.message).toBe('Actualización correcta')
    expect(store.modal.status).toBe('success')

    // Verify user data was refreshed
    expect(store.userLogged).toEqual(userData)
  })
})

// ─── T12: Failed PUT shows error modal ────────────────────────────────
describe('RoomNameEditForm — T12: failed PUT response', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
    mockAxiosPut.mockReset()
  })

  it('failed PUT response shows error modal with API error message', async () => {
    const apiError = {
      response: {
        status: 400,
        data: { message: 'Error en la actualización' },
      },
    }
    mockAxiosPut.mockRejectedValueOnce(apiError)

    const { pinia, store } = createStoreWithUser()
    store.setModal({
      visible: true,
      editingRoomId: '1',
      currentRoomName: 'TestRoom',
    })

    const wrapper = mount(RoomPicker, {
      global: {
        plugins: [pinia, testI18n],
      },
    })

    const input = wrapper.find('[data-testid="room-name-input"]')
    await input.setValue('NewRoomName')
    await flushPromises()

    const form = wrapper.find('form')
    await form.trigger('submit')
    await flushPromises()

    // Verify error modal was set
    expect(store.modal.visible).toBe(true)
    expect(store.modal.status).toBe('error')
    expect(store.modal.message).toBe('Error en la actualización')
  })
})

// ─── T13: Cancel/exit closes modal without API calls ──────────────────
describe('RoomNameEditForm — T13: cancel closes modal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
    mockAxiosPut.mockReset()
  })

  it('clicking cancel closes the modal without API calls', async () => {
    const { pinia, store } = createStoreWithUser()
    store.setModal({
      visible: true,
      editingRoomId: '1',
      currentRoomName: 'TestRoom',
    })

    const wrapper = mount(RoomPicker, {
      global: {
        plugins: [pinia, testI18n],
      },
    })

    // Find and click the cancel button
    const cancelButton = wrapper.find('[data-testid="cancel-edit-room-name-btn"]')
    expect(cancelButton.exists()).toBe(true)
    await cancelButton.trigger('click')
    await flushPromises()

    // Modal should be cleared
    expect(store.modal.visible).toBeFalsy()

    // No API calls should have been made
    expect(mockAxiosPut).not.toHaveBeenCalled()
  })
})

// Import RoomPicker for the rendering tests
import RoomPickerParent from '../src/components/RoomPicker/RoomPicker.vue'

describe('RoomPicker — T7: pencil button opens edit modal for admin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
    mockAxiosPut.mockReset()
  })

  it('clicking the edit-room-name button opens the edit modal', async () => {
    const { pinia, store } = createStoreWithUser()

    const wrapper = mount(RoomPickerParent, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
      props: {
        rooms: [adminRoom],
      },
    })

    // Find the edit-room-name-btn (pencil button)
    const editBtn = wrapper.find('[data-testid="edit-room-name-btn"]')
    expect(editBtn.exists()).toBe(true)

    await editBtn.trigger('click')
    await flushPromises()

    // Modal should be visible with the edit form component
    expect(store.modal.visible).toBe(true)
    expect(store.modal.editingRoomId).toBe('1')
    expect(store.modal.currentRoomName).toBe('Admin Room')
  })
})

describe('RoomPicker — T8: pencil button not rendered for non-admin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edit-room-name button is not rendered for rooms where user is not admin', async () => {
    const { pinia } = createStoreWithUser({ id: 1, username: 'user', rooms: [] })

    const wrapper = mount(RoomPickerParent, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
      props: {
        rooms: [nonAdminRoom],
      },
    })

    // No admin-only buttons should be rendered for this room
    const editBtn = wrapper.find('[data-testid="edit-room-name-btn"]')
    expect(editBtn.exists()).toBe(false)

    const deleteBtn = wrapper.find('[data-testid="delete-room-btn"]')
    expect(deleteBtn.exists()).toBe(false)

    const forgetBtn = wrapper.find('[data-testid="forget-room-btn"]')
    expect(forgetBtn.exists()).toBe(false)
  })

  it('non-admin user sees only room-name and share buttons', async () => {
    const { pinia } = createStoreWithUser({ id: 1, username: 'user', rooms: [] })

    const wrapper = mount(RoomPickerParent, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
      props: {
        rooms: [nonAdminRoom],
      },
    })

    const allButtons = wrapper.findAll('button')
    // Only room-name + share buttons = 2
    expect(allButtons.length).toBe(2)
  })
})

describe('RoomPicker — T14: forget-room button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosPost.mockReset()
  })

  it('forget-room button opens confirm modal for admin user', async () => {
    const { pinia, store } = createStoreWithUser()

    const wrapper = mount(RoomPickerParent, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
      props: {
        rooms: [adminRoom],
      },
    })

    // Find the forget-room button
    const forgetBtn = wrapper.find('[data-testid="forget-room-btn"]')
    expect(forgetBtn.exists()).toBe(true)

    // The inline handler calls event.preventDefault() first, but
    // clicking in test env should still trigger the modal set
    await forgetBtn.trigger('click')
    await flushPromises()

    // Modal should be visible with confirm dialog
    expect(store.modal.visible).toBe(true)
    expect(store.modal.confirm).toBe(true)
    expect(store.modal.message).toContain('olvidar la sala')
  })

  it('forget-room button is distinct from pencil (edit) button', async () => {
    const { pinia } = createStoreWithUser()

    const wrapper = mount(RoomPickerParent, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
      props: {
        rooms: [adminRoom],
      },
    })

    const editBtn = wrapper.find('[data-testid="edit-room-name-btn"]')
    const forgetBtn = wrapper.find('[data-testid="forget-room-btn"]')

    expect(editBtn.exists()).toBe(true)
    expect(forgetBtn.exists()).toBe(true)
    expect(editBtn.element).not.toBe(forgetBtn.element)
  })

  it('forget room confirm modal onaccept calls forgetRoom', async () => {
    mockAxiosPost.mockResolvedValueOnce({ status: 204 })

    const { pinia, store } = createStoreWithUser()

    const wrapper = mount(RoomPickerParent, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
      props: {
        rooms: [adminRoom],
      },
    })

    // Click forget button to open confirm modal
    const forgetBtn = wrapper.find('[data-testid="forget-room-btn"]')
    await forgetBtn.trigger('click')
    await flushPromises()

    // The modal should have an onaccept callback
    expect(store.modal.onaccept).toBeDefined()

    // Simulate clicking "Accept" on the confirm modal
    await store.modal.onaccept!()
    await flushPromises()

    // forgetRoom should call axios.post to remove-user
    expect(mockAxiosPost).toHaveBeenCalledWith(
      'http://test-api/rooms/remove-user',
      { userId: 1, roomId: 1 },
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          Bearer: 'test-token',
        }),
      }),
    )
  })
})