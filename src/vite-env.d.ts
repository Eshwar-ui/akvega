/// <reference types="vite/client" />

/**
 * Typed build-time config for Firebase Performance Monitoring.
 *
 * Every value here is a *public* Firebase web identifier — the SDK ships them
 * to the browser by design, and access is governed by security rules and
 * API-key restrictions, not by hiding these strings. They live in `.env` so a
 * different Firebase project can be pointed at without touching code.
 *
 * There is no measurement-ID entry: GA4 is tagged directly in index.html
 * (GTM + gtag), not through the Firebase SDK. See lib/analytics.ts.
 */
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
