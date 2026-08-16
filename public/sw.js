const RECOVERY_VERSION = '20260810-1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim()
    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })

    await Promise.all(clients.map((client) => {
      const url = new URL(client.url)

      if (url.origin !== self.location.origin) {
        return Promise.resolve()
      }

      if (url.searchParams.get('__shadow_recover') === RECOVERY_VERSION) {
        return Promise.resolve()
      }

      url.searchParams.set('__shadow_recover', RECOVERY_VERSION)
      return client.navigate(url.href)
    }))
  })())
})
