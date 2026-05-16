// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { testI18n } from './i18nPlugin'
import Modal from '../src/components/Modal/Modal.vue'

// ─── T31: Modal CSS class application (R32) ───────────────────────────
describe('Modal — status CSS classes — R32', () => {
  it('test_Modal_successStatus_appliesSuccessModalClass — R32', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Modal, {
      props: { status: 'success', message: 'Success!' },
      global: { plugins: [pinia, testI18n] },
    })

    const modalDiv = wrapper.find('.modal')
    expect(modalDiv.classes()).toContain('success-modal')
  })

  it('test_Modal_errorStatus_appliesErrorModalClass — R32', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Modal, {
      props: { status: 'error', message: 'Error occurred' },
      global: { plugins: [pinia, testI18n] },
    })

    const modalDiv = wrapper.find('.modal')
    expect(modalDiv.classes()).toContain('error-modal')
  })

  it('test_Modal_noStatus_appliesNoStatusClass — R32', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Modal, {
      props: { message: 'Plain message' },
      global: { plugins: [pinia, testI18n] },
    })

    const modalDiv = wrapper.find('.modal')
    expect(modalDiv.classes()).not.toContain('success-modal')
    expect(modalDiv.classes()).not.toContain('error-modal')
  })
})

// ─── T32: Modal confirm buttons (R33) ─────────────────────────────────
describe('Modal — confirm buttons — R33', () => {
  it('test_Modal_confirmTrue_displaysAcceptAndCancelButtons — R33', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const onAccept = vi.fn()
    const onClick = vi.fn()

    const wrapper = mount(Modal, {
      props: {
        message: 'Are you sure?',
        confirm: true,
        onaccept: onAccept,
        onclick: onClick,
      },
      global: { plugins: [pinia, testI18n] },
    })

    expect(wrapper.find('.action-btn').exists()).toBe(true)
    expect(wrapper.find('.action-delete-btn').exists()).toBe(true)
    expect(wrapper.find('.action-btn').text()).toBe('Aceptar')
    expect(wrapper.find('.action-delete-btn').text()).toBe('Cancelar')
  })

  it('test_Modal_acceptButton_callsOnaccept — R33', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const onAccept = vi.fn()
    const onClick = vi.fn()

    const wrapper = mount(Modal, {
      props: {
        message: 'Proceed?',
        confirm: true,
        onaccept: onAccept,
        onclick: onClick,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.find('.action-btn').trigger('click')
    expect(onAccept).toHaveBeenCalledOnce()
  })

  it('test_Modal_cancelButton_callsOnclick — R33', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const onAccept = vi.fn()
    const onClick = vi.fn()

    const wrapper = mount(Modal, {
      props: {
        message: 'Proceed?',
        confirm: true,
        onaccept: onAccept,
        onclick: onClick,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.find('.action-delete-btn').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('test_Modal_confirmFalse_doesNotShowActionButtons — R33', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Modal, {
      props: { message: 'Just info' },
      global: { plugins: [pinia, testI18n] },
    })

    expect(wrapper.find('.action-btn').exists()).toBe(false)
    expect(wrapper.find('.action-delete-btn').exists()).toBe(false)
  })
})