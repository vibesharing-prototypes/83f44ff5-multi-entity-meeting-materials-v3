'use client'

import { useEffect, useRef, useState } from 'react'
import { BOOK_BUILDING_ITEMS } from '@/components/data'
import { useProtoState } from '@/components/ProtoStateContext'
import { useAgentActivity, type AgentJob } from '@/components/AgentActivityContext'

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
    headline: 'All quiet — nothing requires your attention today.',
    subtext: "Agents are monitoring all entities and nothing is pressing. A good time to explore features you haven't tried yet — like batch pack creation or the cross-entity consistency check.",
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

const JOB_DURATION = 30_000
const MIN_STEP_MS = 2_000

function generateSchedule(stepCount: number): number[] {
  if (stepCount === 0) return []
  const extra = JOB_DURATION - stepCount * MIN_STEP_MS
  const weights = Array.from({ length: stepCount }, () => Math.random())
  const totalW = weights.reduce((a, b) => a + b, 0)
  let cum = 0
  return weights.map(w => { cum += Math.round(MIN_STEP_MS + (w / totalW) * extra); return cum })
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2l4 4-4 4" />
    </svg>
  )
}

function AgentProgressWidget({ job, onDismiss }: { job: AgentJob; onDismiss: () => void }) {
  const isDone = job.status === 'done'
  const steps = job.workflowSteps ?? []

  // Generate random schedule and derive initial completed count — exactly once
  const [init] = useState(() => {
    const schedule = generateSchedule(steps.length)
    const elapsed = Date.now() - job.startedAt
    const completed = isDone
      ? steps.length
      : Math.min(schedule.filter(t => elapsed >= t).length, Math.max(0, steps.length - 1))
    return { schedule, completed }
  })

  const scheduleRef = useRef(init.schedule)
  const runConfigRef = useRef({ fromStep: init.completed, startedAt: job.startedAt })

  const [completedCount, setCompletedCount] = useState(init.completed)
  const [justCompleted, setJustCompleted] = useState<number | null>(null)
  const [stoppedAtStep, setStoppedAtStep] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [runKey, setRunKey] = useState(0)

  const isStopped = stoppedAtStep !== null
  // If the external job.status flipped to 'done' but user has stopped, keep stopped state
  const showDone = isDone && !isStopped

  function handleStop() {
    setStoppedAtStep(completedCount)
  }

  function handleResume() {
    const resumeFrom = stoppedAtStep ?? completedCount
    const offset = resumeFrom > 0 ? (scheduleRef.current[resumeFrom - 1] ?? 0) : 0
    runConfigRef.current = { fromStep: resumeFrom, startedAt: Date.now() - offset }
    setStoppedAtStep(null)
    setCompletedCount(resumeFrom)
    setRunKey(k => k + 1)
  }

  function handleRestart() {
    runConfigRef.current = { fromStep: 0, startedAt: Date.now() }
    setStoppedAtStep(null)
    setCompletedCount(0)
    setRunKey(k => k + 1)
  }

  // Set up per-step timers; re-runs when stopped state clears or runKey changes
  useEffect(() => {
    if (isDone || isStopped) return
    const { fromStep, startedAt } = runConfigRef.current
    const schedule = scheduleRef.current
    const now = Date.now()
    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = fromStep; i < steps.length; i++) {
      const delay = startedAt + schedule[i] - now
      if (delay <= 0) { setCompletedCount(c => Math.max(c, i + 1)); continue }
      const idx = i
      timers.push(setTimeout(() => {
        setCompletedCount(idx + 1)
        setJustCompleted(idx)
        setTimeout(() => setJustCompleted(p => (p === idx ? null : p)), 750)
      }, delay))
    }
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone, isStopped, runKey, steps.length])

  const currentStepIndex = showDone ? steps.length - 1 : completedCount

  return (
    <div className="w-full">
      {/* Label */}
      <div className="mb-3">
        <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${
          showDone
            ? 'text-emerald-600 dark:text-emerald-500'
            : isStopped
            ? 'text-rose-500 dark:text-rose-400'
            : 'text-slate-500 dark:text-zinc-600'
        }`}>
          {showDone ? 'Task Complete' : isStopped ? 'Process Interrupted' : 'Agent Working'}
        </span>
      </div>

      {/* Milestone stepper */}
      <div className="flex items-center w-full mb-3">
        {steps.map((_, i) => {
          const isComplete = i < completedCount
          const isCurrent = !showDone && !isStopped && i === completedCount
          const isStoppedAt = isStopped && i === stoppedAtStep
          const isJustCompleted = i === justCompleted
          return (
            <div key={i} className="flex items-center" style={{ flex: i < steps.length - 1 ? '1 1 0' : '0 0 auto' }}>
              <div className="relative flex-shrink-0">
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-amber-400 dark:bg-amber-500 animate-ping opacity-40" />
                )}
                <div className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isJustCompleted ? 'step-pop' : ''
                } ${
                  isComplete
                    ? 'bg-emerald-500 dark:bg-emerald-600 shadow-sm'
                    : isStoppedAt
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 dark:border-rose-600'
                    : isCurrent
                    ? 'bg-amber-400 dark:bg-amber-500'
                    : 'bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700'
                }`}>
                  {isComplete && (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                  {isStoppedAt && (
                    <svg className="w-3 h-3 text-rose-500 dark:text-rose-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                  )}
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-white" />}
                  {!isComplete && !isCurrent && !isStoppedAt && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                  )}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      i < completedCount ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-transparent'
                    }`}
                    style={{ width: i < completedCount ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Running footer */}
      {!showDone && !isStopped && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-snug">
            {steps[currentStepIndex] ?? ''}
          </span>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <button
              onClick={handleStop}
              className="text-[11px] text-slate-500 dark:text-zinc-700 hover:text-rose-500 dark:hover:text-rose-500 underline underline-offset-2 transition-colors"
            >
              Stop
            </button>
            <span className="text-[10px] text-slate-500 dark:text-zinc-600 tabular-nums">
              {Math.min(completedCount + 1, steps.length)}/{steps.length}
            </span>
          </div>
        </div>
      )}

      {/* Stopped footer */}
      {isStopped && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                <XIcon />
                Interrupted at: {steps[stoppedAtStep!] ?? ''}
              </span>
              <button
                onClick={() => setShowDetails(v => !v)}
                className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
            <button
              onClick={onDismiss}
              className="text-[11px] text-slate-500 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleResume}
              className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
            >
              Resume from here
            </button>
            <span className="text-[10px] text-slate-400 dark:text-zinc-700">·</span>
            <button
              onClick={handleRestart}
              className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
            >
              Restart from beginning
            </button>
          </div>
          {showDetails && (
            <div className="mt-2.5 pl-0.5 space-y-1.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  {i < (stoppedAtStep ?? 0) ? (
                    <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  ) : i === stoppedAtStep ? (
                    <svg className="w-3 h-3 text-rose-400 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                  ) : (
                    <span className="w-3 h-3 flex-shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-700" />
                    </span>
                  )}
                  <span className={
                    i < (stoppedAtStep ?? 0)
                      ? 'text-slate-500 dark:text-zinc-400'
                      : i === stoppedAtStep
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-slate-500 dark:text-zinc-600'
                  }>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Done footer */}
      {showDone && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckIcon />
                All steps complete — {job.entityShortName}
              </span>
              <button
                onClick={() => setShowDetails(v => !v)}
                className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
            <button
              onClick={onDismiss}
              className="text-[11px] text-slate-500 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
          {showDetails && (
            <div className="mt-2.5 pl-0.5 space-y-1.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                  <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AgentActivityBanner() {
  const state = useProtoState()
  const cfg = CONFIGS[state]
  const items = BOOK_BUILDING_ITEMS.filter(i => i.states.includes(state))
  const total = items.length

  const agentActivity = useAgentActivity()
  const jobs = agentActivity?.jobs ?? []
  const activeJob = jobs.find(j => j.status === 'running') ?? jobs.find(j => j.status === 'done')

  const headline = cfg.headline.replace('{total}', String(total))
  const metrics = cfg.metrics.map(m => ({
    ...m,
    value: m.value.replace('{total}', String(total)),
  }))

  return (
    <div className="relative">
      {/* Glow overlay */}
      <div className={`hero-glow ${cfg.glowClass}`} aria-hidden />

      <div className="relative px-8 pt-8 pb-7">
        {/* Status pill */}
        <div className="flex justify-center mb-5">
          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.04em] ${cfg.pillText} ${cfg.pillBorder} ${cfg.pillBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.pillDot}`} />
            {cfg.pillLabel}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-center text-[2.5rem] font-light tracking-[-0.02em] text-slate-900 dark:text-white leading-[1.15] mb-3">
          {headline}
        </h2>

        {/* Subtext */}
        <p className="text-center text-[13px] text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-7">
          {cfg.subtext}
        </p>

        {/* Metrics */}
        <div className="flex justify-center gap-4 mb-7">
          {metrics.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center w-28 h-20 rounded-xl border ${m.boxClass}`}
            >
              <span className={`text-3xl font-bold leading-none mb-1.5 ${m.numClass}`}>{m.value}</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-zinc-700 mb-5" />

        {/* Bottom section: progress widget or static workflow */}
        {activeJob ? (
          <AgentProgressWidget
            job={activeJob}
            onDismiss={() => agentActivity!.removeJob(activeJob.id)}
          />
        ) : cfg.workflow ? (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-zinc-600">
              Response Workflow
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {cfg.workflow.map((step, i) => {
                const isComplete = i < cfg.wfComplete
                const isCurrent = i === cfg.wfCurrent

                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        isComplete
                          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          : isCurrent
                          ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          : 'border-slate-200 dark:border-zinc-800 bg-transparent text-slate-500 dark:text-zinc-600'
                      }`}
                    >
                      {isComplete && (
                        <span className="text-emerald-500 dark:text-emerald-400">
                          <CheckIcon />
                        </span>
                      )}
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      )}
                      {step}
                    </div>
                    {i < cfg.workflow!.length - 1 && (
                      <span className="text-slate-400 dark:text-zinc-700">
                        <ChevronRight />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-[11px] tracking-[0.04em] text-slate-400 dark:text-zinc-600">
            No items require review. Agents are running normally.
          </p>
        )}
      </div>
    </div>
  )
}
