import Section from '@/components/Section'
import TechStack from '@/components/TechStack'

export default function Services() {
  return (
    <Section title="Services">
      <p className="type-lede text-ink-muted">
        Placeholder — replace with real capabilities.
      </p>

      {/*
        Mounted here because the page was an empty placeholder and a stack
        belongs on it. Move it wherever it earns its place — TechStack is
        self-contained.
      */}
      <div id="stack" className="mt-20">
        <h2 className="type-page-title">
          What we build with.
        </h2>
        <p className="type-body mt-4 max-w-[52ch] text-ink-muted">
          Placeholder set — confirm every mark below is a tool Akvega actually
          uses before this page goes live.
        </p>
        <div className="mt-12">
          <TechStack />
        </div>
      </div>
    </Section>
  )
}
