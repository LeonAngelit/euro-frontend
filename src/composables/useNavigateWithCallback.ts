import type { Router } from 'vue-router'

function useNavigateWithCallback(router: Router, destination: string): void {
  let callbackUrl = ''
  if (window.location.href.includes('callback_url')) {
    callbackUrl = '?callback_url=' + window.location.href.split('callback_url=')[1]
  }
  router.push(destination + callbackUrl)
}

export default useNavigateWithCallback