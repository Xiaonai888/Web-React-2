const RECOVERY_VERSION = '20260818-1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim()

    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))

    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })

    await self.registration.unregister()

    await Promise.all(clients.map((client) => {
      const url = new URL(client.url)

      if (url.origin !== self.location.origin) return Promise.resolve()

      if (url.searchParams.get('__shadow_sw_reset') === RECOVERY_VERSION) {
        return Promise.resolve()
      }

      url.searchParams.set('__shadow_sw_reset', RECOVERY_VERSION)
      return client.navigate(url.href)
    }))
  })())
})
