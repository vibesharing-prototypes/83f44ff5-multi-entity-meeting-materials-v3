'use client'

import { useEffect, useState } from 'react'

export type RedirectDestination = 'smart-book-builder' | 'forward-planner'

const DEST_CONFIG: Record<RedirectDestination, { toolName: string; module: string }> = {
  'smart-book-builder': { toolName: 'Smart Book Builder', module: 'Board Pack Editor' },
  'forward-planner':    { toolName: 'Forward Planner',    module: 'Meeting Planner'   },
}

const STEPS = [
  { label: 'Verifying identity via Single Sign-On' },
  { label: 'Establishing encrypted connection (TLS 1.3)' },
  { label: 'Exchanging session token (OAuth 2.0 + PKCE)' },
  { label: 'Loading your workspace' },
]

const STEP_INTERVALS = [650, 1250, 1950, 2600] // ms from open

export default function RedirectModal({
  destination,
  onClose,
}: {
  destination: RedirectDestination
  onClose: () => void
}) {
  const { toolName, module: mod } = DEST_CONFIG[destination]
  const [completedSteps, setCompletedSteps] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    STEP_INTERVALS.forEach((ms, i) => {
      timers.push(setTimeout(() => setCompletedSteps(i + 1), ms))
    })
    timers.push(setTimeout(() => setIsDone(true), 3100))
    timers.push(setTimeout(onClose, 4000))
    return () => timers.forEach(clearTimeout)
  }, [onClose])

  const progress = isDone ? 100 : (completedSteps / STEPS.length) * 100

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/65 backdrop-blur-[3px]" />

      <div
        className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'confirmModalIn 200ms cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Progress bar — top edge */}
        <div className="h-1 bg-slate-100 dark:bg-zinc-800">
          <div
            className="h-full bg-slate-800 dark:bg-zinc-200 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-8 pt-7 pb-7">
          {/* App icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-[18px] bg-slate-900 dark:bg-zinc-100 flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white dark:text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 3v18" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h3 className="text-center text-[18px] font-semibold text-slate-900 dark:text-zinc-100 leading-snug mb-1">
            Opening {toolName}
          </h3>
          <p className="text-center text-[12px] text-slate-400 dark:text-zinc-500 mb-7">
            Boards NextGen · {mod}
          </p>

          {/* Step list */}
          <div className="space-y-3 mb-7">
            {STEPS.map((step, i) => {
              const done   = i < completedSteps
              const active = !isDone && i === completedSteps
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    done   ? 'bg-emerald-500'
                    : active ? 'bg-amber-400'
                    : 'bg-slate-100 dark:bg-zinc-800'
                  }`}>
                    {done ? (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 5l2 2 4-4" />
                      </svg>
                    ) : active ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                    )}
                  </div>
                  <span className={`text-[13px] transition-colors ${
                    done   ? 'text-slate-400 dark:text-zinc-500'
                    : active ? 'text-slate-800 dark:text-zinc-100 font-medium'
                    : 'text-slate-300 dark:text-zinc-700'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          {isDone ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l3.5 3.5L13 5" />
              </svg>
              <span className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
                Redirecting now…
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-600">
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="5" width="10" height="6" rx="1" />
                  <path d="M3.5 5V3.5a2.5 2.5 0 015 0V5" />
                </svg>
                Secure authenticated redirect
              </span>
              <button
                onClick={onClose}
                className="text-[12px] text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
