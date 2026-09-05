import { Outlet, ScrollRestoration } from 'react-router-dom'
import Analytics from '@/components/Analytics'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="w-full max-w-full flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <CustomCursor />
      <ScrollRestoration />
      <Analytics />
    </div>
  )
}
