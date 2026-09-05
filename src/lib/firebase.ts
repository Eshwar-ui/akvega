/**
 * Firebase bootstrap — Performance Monitoring only.
 *
 * DELIBERATELY NOT ANALYTICS: `index.html` already tags GA4 directly (GTM plus
 * a `gtag('config', 'G-H4KQL6J5NQ')`). Initialising the Firebase Analytics SDK
 * here would issue a second `config` against that same measurement ID and
 * double every event in the property. Custom events ride the existing tag —
 * see lib/analytics.ts. Performance Monitoring has no such overlap: GTM cannot
 * produce it, so this is purely additive.
 *
 * WHY LAZY: measurement is not content. It must never sit on the critical path
 * of a page whose whole pitch is that it feels fast, so the SDK is pulled in
 * via dynamic `import()` and lands in its own chunk, fetched after first paint.
 *
 * WHY GUARDED: returns `null` instead of throwing when config is missing or a
 * blocker kills the request. A site must not break because a measurement
 * script didn't load.
 *
 * WHY OFF IN DEV: local loads would otherwise sit in the same traces as real
 * visitors, and a Vite dev bundle's timings say nothing about production.
 */
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app'
import type { FirebasePerformance } from 'firebase/performance'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/** False when `.env` is missing — the site still runs, just untraced. */
export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId,
)

const collectionEnabled =
  firebaseConfigured && typeof window !== 'undefined' && import.meta.env.PROD

/** Idempotent: React StrictMode double-invokes effects in development. */
function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfigured) return null
  return getApps()[0] ?? initializeApp(firebaseConfig)
}

let performancePromise: Promise<FirebasePerformance | null> | undefined

/**
 * Fire-and-forget. Importing the SDK is the whole integration: it installs the
 * automatic traces — page load, Core Web Vitals (LCP, INP, CLS) and every
 * outbound request — so no caller needs the returned handle.
 */
export function loadPerformance(): Promise<FirebasePerformance | null> {
  performancePromise ??= (async () => {
    const app = getFirebaseApp()
    if (!app || !collectionEnabled) return null

    const { getPerformance } = await import('firebase/performance')
    return getPerformance(app)
  })().catch(() => null)

  return performancePromise
}
