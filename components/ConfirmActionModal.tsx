'use client'

import { ENTITIES } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'

export interface ConfirmActionModalProps {
  entityIds: number[]
  title: string
  description: string
  affectedSection?: string
  proposedEdit?: string
  actionLabel: string
  badgeLabel: string
  badgeClasses: string
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmActionModal({
  entityIds,
  title,
  description,
  affectedSection,
  proposedEdit,
  actionLabel,
  badgeLabel,
  badgeClasses,
  onConfirm,
  onClose,
}: ConfirmActionModalProps) {
  const entities = entityIds.map(id => ENTITIES.find(e => e.id === id)!).filter(Boolean)
  const n = entities.length

  function handleConfirm() {
    onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-[3px]" />

      <div
        className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25)] w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'confirmModalIn 220ms cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* ── Top bar ───────────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${badgeClasses}`}>
                  {badgeLabel}
                </span>
                <span className="text-[12px] text-slate-400 dark:text-zinc-500">
                  {n} {n === 1 ? 'board pack' : 'board packs'} will be updated
                </span>
              </div>
              <h2 className="text-[22px] font-semibold text-slate-900 dark:text-zinc-100 leading-[1.25]">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center mt-0.5"
              aria-label="Close"
            >
              <svg className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto">

          {/* Entity list */}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
              Affected entities
            </p>
            <div className="rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
              {entities.map(entity => (
                <div key={entity.id} className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-zinc-900">
                  <EntityLogo entity={entity} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-slate-900 dark:text-zinc-100 leading-snug">
                      {entity.name}
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      {entity.country}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                      Next board
                    </p>
                    <p className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">
                      {entity.nextBoard}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What will change */}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
              What will change
            </p>
            <p className="text-[14px] text-slate-600 dark:text-zinc-300 leading-relaxed">
              {description}
            </p>

            {affectedSection && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                <svg className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="2" width="10" height="12" rx="1.5" />
                  <path d="M6 6h4M6 9h4M6 12h2" />
                </svg>
                <span className="text-[12px] font-medium text-slate-600 dark:text-zinc-300">
                  Section: {affectedSection}
                </span>
              </div>
            )}

            {proposedEdit && (
              <div className="mt-4 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200 dark:border-zinc-700">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                  Proposed edit
                </p>
                <p className="text-[13px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {proposedEdit}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="px-8 py-5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-800/30">
          <button
            onClick={onClose}
            className="text-[14px] text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[14px] font-semibold rounded-xl hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors"
          >
            {actionLabel} · {n} {n === 1 ? 'pack' : 'packs'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  )
}
