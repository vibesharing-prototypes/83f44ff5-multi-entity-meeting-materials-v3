'use client'

import { BOOK_BUILDING_ITEMS, PLANNING_SUGGESTIONS } from '@/components/data'
import { useProtoState } from '@/components/ProtoStateContext'

type ProtoState = 'calm' | 'busy' | 'critical'

interface MetricDef {
  value: string
  label: string
  numClass: string
  boxClass: string
}

interface StateConfig {
  pillLabel: string
  pillDot: string
  pillText: string
  pillBorder: string
  pillBg: string
  glowClass: string
  cardBorder: string
  headline: string
  subtext: string
  metrics: MetricDef[]
  workflow: string[] | null
  wfComplete: number
  wfCurrent: number
}

const CONFIGS: Record<ProtoState, StateConfig> = {
  calm: {
    pillLabel: 'Agents Monitoring — All Clear',
    pillDot: 'bg-emerald-400',
    pillText: 'text-emerald-700 dark:text-emerald-300',
    pillBorder: 'border-emerald-200 dark:border-emerald-800/60',
    pillBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    glowClass: 'hero-glow-calm',
    cardBorder: 'border-slate-200 dark:border-zinc-800',
    headline: 'Nothing urgent — but plenty you can get ahead on.',
    subtext: '',
    metrics: [
      { value: '8', label: 'Entities Active', numClass: 'text-blue-600 dark:text-blue-400', boxClass: 'border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30' },
      { value: '3', label: 'Packs Approved', numClass: 'text-emerald-600 dark:text-emerald-400', boxClass: 'border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30' },
      { value: '0', label: 'Items Pending', numClass: 'text-slate-500 dark:text-zinc-400', boxClass: 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30' },
    ],
    workflow: null,
    wfComplete: 0,
    wfCurrent: -1,
  },
  busy: {
    pillLabel: 'Action Required',
    pillDot: 'bg-amber-400',
    pillText: 'text-amber-700 dark:text-amber-300',
    pillBorder: 'border-amber-200 dark:border-amber-800/60',
    pillBg: 'bg-amber-50 dark:bg-amber-950/50',
    glowClass: 'hero-glow-busy',
    cardBorder: 'border-amber-200/60 dark:border-amber-900/40',
    headline: '{total} items are waiting for review.',
    subtext: 'Several items are time-sensitive. Review flagged documents before your next board meeting.',
    metrics: [
      { value: '{total}', label: 'Pending Review', numClass: 'text-amber-600 dark:text-amber-400', boxClass: 'border-amber-100 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30' },
      { value: '2', label: 'High Priority', numClass: 'text-red-600 dark:text-red-400', boxClass: 'border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30' },
      { value: '4', label: 'Entities Affected', numClass: 'text-blue-600 dark:text-blue-400', boxClass: 'border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30' },
    ],
    workflow: ['Flagged', 'In Review', 'Approved', 'Published'],
    wfComplete: 0,
    wfCurrent: 1,
  },
  critical: {
    pillLabel: 'Agents Detected Emerging Risks',
    pillDot: 'bg-red-400',
    pillText: 'text-red-700 dark:text-red-300',
    pillBorder: 'border-red-200 dark:border-red-900/60',
    pillBg: 'bg-red-50 dark:bg-red-950/60',
    glowClass: 'hero-glow-critical',
    cardBorder: 'border-red-200/60 dark:border-red-900/50',
    headline: '{total} risks require disclosure review.',
    subtext: 'Your monitoring agents detected emerging risks that may not be adequately disclosed in current SEC filings or Board meeting materials. Review recommended before the Feb 28 Board meeting.',
    metrics: [
      { value: '1', label: 'Critical', numClass: 'text-red-600 dark:text-red-400', boxClass: 'border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30' },
      { value: '2', label: 'High', numClass: 'text-amber-600 dark:text-amber-400', boxClass: 'border-amber-100 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30' },
      { value: '3', label: 'Filings Affected', numClass: 'text-blue-600 dark:text-blue-400', boxClass: 'border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30' },
    ],
    workflow: ['Risk Detected', 'Assess & Prioritize', 'Draft Updates', 'Legal Review', 'Notify Board', 'File/Disclose'],
    wfComplete: 0,
    wfCurrent: 1,
  },
}


export default function AgentActivityBanner() {
  const state = useProtoState()
  const cfg = CONFIGS[state]
  const items = BOOK_BUILDING_ITEMS.filter(i => i.states.includes(state))
  const suggestions = PLANNING_SUGGESTIONS.filter(s => s.states.includes(state))
  const total = items.length

  const headline = cfg.headline.replace('{total}', String(total))

  // Build a dynamic subtext for calm state from actual data
  const subtext = state === 'calm'
    ? `${items.length} book building item${items.length !== 1 ? 's' : ''} and ${suggestions.length} planning suggestion${suggestions.length !== 1 ? 's' : ''} ready to review — from missing agenda sections and upcoming quarter prep to presenter updates and regulatory changes.`
    : cfg.subtext
  const metrics = cfg.metrics.map(m => ({
    ...m,
    value: m.value.replace('{total}', String(total)),
  }))

  return (
    <div>
      <div className="px-8 pt-8 pb-7">
        {/* Status pill */}
        <div className="flex justify-center mb-5">
          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.04em] ${cfg.pillText} ${cfg.pillBorder} ${cfg.pillBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.pillDot}`} />
            {cfg.pillLabel}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-center text-[2.5rem] font-light tracking-[-0.02em] text-slate-800 dark:text-zinc-100 leading-[1.15] mb-3">
          {headline}
        </h2>

        {/* Subtext */}
        <p className="text-center text-[13px] text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-7">
          {subtext}
        </p>

        {/* Metrics */}
        <div className="flex justify-center gap-4">
          {metrics.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center w-28 h-20 rounded-xl border ${m.boxClass}`}
            >
              <span className={`text-3xl font-semibold leading-none mb-1.5 ${m.numClass}`}>{m.value}</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">{m.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
