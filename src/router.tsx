import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

/**
 * Home is imported eagerly — it is the entry point for nearly every visit, and
 * splitting it would only add a round trip before the hero paints. NotFound is
 * eager because it doubles as the router's `errorElement`, which has to be able
 * to render when a chunk fetch is the thing that failed.
 *
 * The rest are lazy. Home already pulls in GSAP with the Flip and ScrollTrigger
 * plugins; keeping the secondary pages out of that chunk means a visitor
 * landing on /contact never downloads the homepage's animation machinery.
 */
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Services = lazy(() => import('@/pages/Services'))
const Work = lazy(() => import('@/pages/Work'))

/**
 * Deliberately blank rather than a spinner. These chunks are small and the
 * header and footer stay on screen throughout, so a flashing placeholder would
 * be more disruptive than the gap it fills. `min-h-dvh` holds the footer down
 * so it does not jump up and back during the swap.
 */
function PageFallback({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-dvh" />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <PageFallback><About /></PageFallback> },
      { path: 'work', element: <PageFallback><Work /></PageFallback> },
      { path: 'services', element: <PageFallback><Services /></PageFallback> },
      { path: 'contact', element: <PageFallback><Contact /></PageFallback> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
