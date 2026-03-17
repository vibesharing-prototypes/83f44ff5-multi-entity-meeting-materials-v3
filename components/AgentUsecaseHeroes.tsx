import React from 'react'

const HEROES = [
  {
    eyebrow: 'Batch Board Pack Creation',
    title: 'One click.\nEvery entity.\nAll packs ready.',
    body: 'Replicates last quarter\'s structure across all entities, pulling in updated financials and refreshed regulatory disclosures — first drafts ready before you open them.',
    cta: 'Preview batch run',
    accent: 'blue',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="7" rx="1.5" />
        <rect x="11" y="3" width="6" height="7" rx="1.5" />
        <rect x="3" y="12" width="6" height="5" rx="1.5" />
        <rect x="11" y="12" width="6" height="5" rx="1.5" />
      </svg>
    ),
    detail: [
      { label: 'Entities', value: '12' },
      { label: 'Auto-filled', value: '94%' },
      { label: 'Regs checked', value: '38' },
    ],
  },
  {
    eyebrow: 'Regulatory Monitoring',
    title: 'Never miss a\nfiling window\nor rule change.',
    body: 'Continuously monitors FCA, Companies House, HMRC and sector-specific bodies — surfacing changes mapped to affected entities with suggested edits already drafted.',
    cta: 'See active monitors',
    accent: 'violet',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v4l2.5 2.5" />
      </svg>
    ),
    detail: [
      { label: 'Sources', value: '24' },
      { label: 'Changes', value: '7' },
      { label: 'Impacted', value: '5' },
    ],
  },
  {
    eyebrow: 'Cross-Entity Consistency',
    title: 'Catch conflicts\nbefore the\nboard does.',
    body: 'Compares officer lists, signatory authorities and standing resolutions across entities — flagging inconsistencies before any pack is distributed.',
    cta: 'Run consistency check',
    accent: 'emerald',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10l4 4 8-8" />
        <circle cx="10" cy="10" r="7" />
      </svg>
    ),
    detail: [
      { label: 'Checks run', value: '140' },
      { label: 'Conflicts', value: '3' },
      { label: 'Resolved', value: '2' },
    ],
  },
]

const ACCENT = {
  blue: {
    bar: 'bg-blue-500',
    eyebrow: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-500 dark:text-blue-400',
    value: 'text-blue-700 dark:text-blue-300',
    cta: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200',
    ctaBorder: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
  },
  violet: {
    bar: 'bg-violet-500',
    eyebrow: 'text-violet-600 dark:text-violet-400',
    icon: 'text-violet-500 dark:text-violet-400',
    value: 'text-violet-700 dark:text-violet-300',
    cta: 'text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200',
    ctaBorder: 'border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
  },
  emerald: {
    bar: 'bg-emerald-500',
    eyebrow: 'text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-500 dark:text-emerald-400',
    value: 'text-emerald-700 dark:text-emerald-300',
    cta: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200',
    ctaBorder: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600',
  },
}

export default function AgentUsecaseHeroes() {
  return (
    <div className="mt-12 mb-6">
      <div className="flex items-center gap-3 mb-7">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-zinc-700" />
        <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-500 dark:text-zinc-500 uppercase">What agents can do for you</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-zinc-700" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {HEROES.map((hero) => {
          const s = ACCENT[hero.accent as keyof typeof ACCENT]
          return (
            <div
              key={hero.eyebrow}
              className="relative rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-zinc-700 transition-colors group"
            >
              {/* Accent top bar */}
              <div className={`h-0.5 w-full ${s.bar} opacity-70`} />

              <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
                {/* Icon + eyebrow */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={s.icon}>{hero.icon}</span>
                  <span className={`text-[10px] font-semibold tracking-widest uppercase ${s.eyebrow}`}>{hero.eyebrow}</span>
                </div>

                {/* Title */}
                <h3 className="font-sans font-semibold text-[1.1rem] leading-[1.25] text-slate-900 dark:text-zinc-100 mb-3 whitespace-pre-line">
                  {hero.title}
                </h3>

                {/* Body */}
                <p className="text-[11.5px] text-slate-500 dark:text-zinc-400 leading-relaxed flex-1">
                  {hero.body}
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800 my-4" />

                {/* Stats */}
                <div className="flex gap-0 mb-4">
                  {hero.detail.map((d, i) => (
                    <div key={d.label} className={`flex-1 ${i > 0 ? 'border-l border-slate-100 dark:border-zinc-800 pl-3' : 'pr-3'}`}>
                      <div className={`text-lg font-semibold tabular-nums leading-none ${s.value}`}>{d.value}</div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">{d.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className={`self-start text-[11px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all ${s.cta} ${s.ctaBorder}`}>
                  {hero.cta}
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
