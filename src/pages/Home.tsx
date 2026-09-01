import Hero from '@/components/hero/Hero'
import Approach from '@/components/sections/Approach'
import Capabilities from '@/components/sections/Capabilities'
import CallToAction from '@/components/sections/CallToAction'
import Faq from '@/components/sections/Faq'
import Process from '@/components/sections/Process'
import Services from '@/components/sections/Services'
import TechStackShowcase from '@/components/sections/TechStackShowcase'

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Services />
      <TechStackShowcase />
      <Approach />
      <Process />
      <Faq />
      <CallToAction />
    </>
  )
}
