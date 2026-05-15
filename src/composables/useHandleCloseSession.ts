import type { useAppStore } from '../stores/app'

function useHandleCloseSession(store: ReturnType<typeof useAppStore>): void {
  store.closeSession()
}

export default useHandleCloseSession