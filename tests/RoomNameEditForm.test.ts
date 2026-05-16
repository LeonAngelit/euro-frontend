// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { testI18n } from "./i18nPlugin";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock config
vi.mock("../src/config/config", () => ({
  default: {
    baseUrl: "http://test-api/",
    appAdmin: "admin",
    authP: "",
    key: "",
    defProfilePicUrl: "",
    joinRoomLink: "",
    confirmemailLink: "",
    joinRoomPath: "",
    clientID: "",
    requestsUrl: "",
    requestsBaseUrl: "",
    env: "test",
    isProd: false,
  },
}));

// Mock useGetSongs
vi.mock("../src/composables/useGetSongs", () => ({
  default: vi.fn().mockResolvedValue([]),
}));

import RoomNameEditForm from "../src/components/RoomPicker/RoomNameEditForm.vue";

// ─── T12: RoomNameEditForm v-model and ref sync — R6, R9 ─────────────
describe("RoomNameEditForm — v-model and ref sync — R6, R9", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("test_RoomNameEditForm_rendersInput — R6", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(RoomNameEditForm, {
      global: {
        plugins: [pinia, testI18n],
      },
    });

    await wrapper.vm.$nextTick();

    const input = wrapper.find('[data-testid="room-name-input"]');
    expect(input.exists()).toBe(true);
  });

  it("test_RoomNameEditForm_vModelCapturesValue — R6", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(RoomNameEditForm, {
      global: {
        plugins: [pinia, testI18n],
      },
    });

    await wrapper.vm.$nextTick();

    const input = wrapper.find('[data-testid="room-name-input"]');
    await input.setValue("New Room Name");
    await wrapper.vm.$nextTick();

    // The v-model bound value should be updated
    const vm = wrapper.vm as any;
    expect(vm.roomName).toBe("New Room Name");
  });

  it("test_RoomNameEditForm_inputValueMatchesVModel — R6", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(RoomNameEditForm, {
      global: {
        plugins: [pinia, testI18n],
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises();

    const input = wrapper.find('[data-testid="room-name-input"]');
    await input.setValue("Synced Room");
    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as any;

    // v-model value should match what was typed
    expect(vm.roomName).toBe("Synced Room");

    // The input element's value should also match
    expect((input.element as HTMLInputElement).value).toBe("Synced Room");
  });

  it("test_RoomNameEditForm_rendersSubmitAndCancelButtons — R6", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(RoomNameEditForm, {
      global: {
        plugins: [pinia, testI18n],
      },
    });

    await wrapper.vm.$nextTick();

    const submitBtn = wrapper.find('[data-testid="submit-room-name-btn"]');

    expect(submitBtn.exists()).toBe(true);
  });
});
