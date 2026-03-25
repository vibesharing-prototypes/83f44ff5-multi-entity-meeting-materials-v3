'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Entity } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import { SECTIONS, type SectionType, type Section } from '@/components/sections'

type SectionStatus = 'complete' | 'in-progress' | 'pending'

function getSectionStatuses(completion: number): SectionStatus[] {
  const completedCount = Math.floor((completion / 100) * SECTIONS.length)
  return SECTIONS.map((_, i) => {
    if (i < completedCount) return 'complete'
    if (i === completedCount) return 'in-progress'
    return 'pending'
  })
}

function StatusBadge({ status }: { status: SectionStatus }) {
  if (status === 'complete') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6l3 3 5-5" />
        </svg>
        Complete
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        In progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
      Pending
    </span>
  )
}

// ─── Thumbnail mini-previews ────────────────────────────────────────────────

function MiniPreview({ type, faded }: { type: SectionType; faded: boolean }) {
  const bar = (w: string, h = 'h-1', dark = false) => (
    <div className={`${h} ${w} rounded-sm ${faded ? 'bg-slate-100 dark:bg-zinc-700' : dark ? 'bg-slate-300 dark:bg-zinc-600' : 'bg-slate-200 dark:bg-zinc-700'}`} />
  )
  const sep = () => <div className={`h-px w-full bg-gradient-to-r from-transparent ${faded ? 'via-slate-100 dark:via-zinc-700' : 'via-slate-200 dark:via-zinc-700'} to-transparent`} />

  switch (type) {
    case 'cover':
      return (
        <div className="flex flex-col items-center gap-1 py-1">
          {bar('w-4/5', 'h-1.5', true)}
          {bar('w-3/5')}
          <div className="h-1" />
          {bar('w-3/4')}
          {bar('w-1/2')}
          <div className="h-1" />
          {bar('w-2/5')}
        </div>
      )

    case 'agenda':
      return (
        <div className="space-y-1">
          {bar('w-2/5', 'h-1.5', true)}
          {sep()}
          {['w-full', 'w-4/5', 'w-full', 'w-3/4', 'w-5/6', 'w-full'].map((w, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-1 h-1.5 rounded-sm flex-shrink-0 ${faded ? 'bg-slate-100' : 'bg-slate-200'}`} />
              {bar(w)}
            </div>
          ))}
        </div>
      )

    case 'minutes':
      return (
        <div className="space-y-1">
          {bar('w-3/5', 'h-1.5', true)}
          {bar('w-2/5')}
          <div className="h-0.5" />
          {['w-full', 'w-4/5', 'w-full', 'w-5/6'].map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full flex-shrink-0 ${faded ? 'bg-slate-100' : 'bg-slate-200'}`} />
              {bar(w)}
            </div>
          ))}
        </div>
      )

    case 'letter':
      return (
        <div className="space-y-1">
          {bar('w-2/5')}
          {bar('w-3/5')}
          <div className="h-0.5" />
          {bar('w-full')}
          {bar('w-full')}
          {bar('w-4/5')}
          <div className="h-0.5" />
          {bar('w-full')}
          {bar('w-3/5')}
        </div>
      )

    case 'report':
      return (
        <div className="space-y-1">
          {bar('w-3/5', 'h-1.5', true)}
          {bar('w-2/5')}
          <div className="h-0.5" />
          {bar('w-full')}
          {bar('w-full')}
          {bar('w-4/5')}
          <div className="h-0.5" />
          {bar('w-1/3', 'h-1', true)}
          {bar('w-full')}
          {bar('w-3/4')}
        </div>
      )

    case 'financial':
      return (
        <div className="space-y-1">
          {bar('w-3/5', 'h-1.5', true)}
          {[['w-2/5', 'w-1/4'], ['w-2/5', 'w-1/4'], ['w-2/5', 'w-1/4']].map(([l, r], i) => (
            <div key={i} className="flex justify-between items-center">
              {bar(l)}
              {bar(r, 'h-1', true)}
            </div>
          ))}
          {sep()}
          <div className="flex justify-between items-center">
            {bar('w-2/5', 'h-1.5', true)}
            {bar('w-1/4', 'h-1.5', true)}
          </div>
        </div>
      )

    case 'risk':
      return (
        <div className="space-y-1.5">
          {bar('w-2/5', 'h-1.5', true)}
          {(faded
            ? ['bg-slate-100', 'bg-slate-100', 'bg-slate-100', 'bg-slate-100']
            : ['bg-red-300 dark:bg-red-700', 'bg-amber-300 dark:bg-amber-700', 'bg-amber-300 dark:bg-amber-700', 'bg-emerald-300 dark:bg-emerald-700']
          ).map((dot, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
              <div className={`h-1 flex-1 rounded-sm ${faded ? 'bg-slate-100' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
      )

    case 'resolution':
      return (
        <div className="space-y-1">
          {bar('w-3/5', 'h-1.5', true)}
          {bar('w-full')}
          {bar('w-full')}
          {bar('w-4/5')}
          <div className="h-0.5" />
          {bar('w-3/5', 'h-1.5', true)}
          {bar('w-full')}
          {bar('w-3/4')}
        </div>
      )

    case 'aob':
      return (
        <div className="space-y-1">
          {[0, 1, 2].map(i => (
            <div key={i}>
              {i > 0 && <div className="h-0.5" />}
              {bar('w-3/4', 'h-1.5', true)}
              {bar('w-full')}
              {bar('w-4/5')}
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

// ─── Modal document content ─────────────────────────────────────────────────

function SectionModalContent({ section, entity }: { section: Section; entity: Entity }) {
  switch (section.type) {
    case 'cover':
      return (
        <div className="flex flex-col items-center justify-center text-center py-8 gap-3 min-h-[200px]">
          <EntityLogo entity={entity} size="lg" />
          <div>
            <p className="text-sm font-bold text-slate-800">{entity.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">Board of Directors</p>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div>
            <p className="text-sm font-semibold text-slate-700">Board Pack · Q1 2026</p>
            <p className="text-xs text-slate-400 mt-0.5">{entity.nextBoard}</p>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Strictly Confidential</p>
        </div>
      )

    case 'agenda':
      return (
        <div className="space-y-2.5">
          <div>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Board Meeting Agenda</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{entity.nextBoard} · 10:00 hrs · Registered Office</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <div className="space-y-1.5">
            {[
              'Apologies for Absence',
              'Declarations of Interest',
              'Minutes of Previous Meeting (15 Dec 2025)',
              'Matters Arising',
              "Chief Executive's Report",
              'Q4 2025 Financial Statements',
              'Risk & Compliance Update',
              'Resolutions for Approval',
              'Any Other Business',
              'Date of Next Meeting',
            ].map((item, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-[10px] text-slate-400 font-medium w-4 flex-shrink-0 tabular-nums">{i + 1}.</span>
                <span className="text-[10px] text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'minutes':
      return (
        <div className="space-y-2">
          <div>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Minutes of Board Meeting</p>
            <p className="text-[10px] text-slate-400">Held on 15 December 2025 · 10:00 GMT</p>
          </div>
          <div className="text-[10px] text-slate-600">
            <p><span className="font-medium text-slate-700">Present:</span> D. Thompson (Chair), S. Chen, J. Mwangi, P. Walsh, R. Patel</p>
            <p className="mt-0.5"><span className="font-medium text-slate-700">In Attendance:</span> Company Secretary, External Auditors (PwC)</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <div className="space-y-2">
            {[
              ['1.', 'Apologies for Absence', 'No apologies were received. A quorum was present throughout.'],
              ['2.', 'Conflicts of Interest', 'No conflicts were declared in relation to items on the agenda.'],
              ['3.', 'Minutes of Previous Meeting', 'The minutes of the meeting held 18 September 2025 were approved as an accurate record. Proposed: P. Walsh. Seconded: J. Mwangi.'],
              ['4.', 'Matters Arising', 'The action log was reviewed. All actions noted as complete or carried to this agenda.'],
            ].map(([num, title, body]) => (
              <div key={num}>
                <p className="text-[10px] font-semibold text-slate-700">{num} {title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'letter':
      return (
        <div className="space-y-2 text-[10px]">
          <p className="text-slate-400">{entity.nextBoard}</p>
          <p className="font-semibold text-slate-800">Dear Board Members,</p>
          <p className="text-slate-600 leading-relaxed">
            I am pleased to present the Q1 2026 Board Pack for {entity.name} ahead of the board meeting scheduled for {entity.nextBoard}.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The pack contains the CEO's report, Q4 2025 financial statements, and three resolutions for board approval. I draw your attention in particular to the CEO's commentary on trading performance and the proposed amendments to the banking facilities.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Key points for attention at this meeting: revenue performance against budget, the proposed capital restructuring, and the director appointment being put forward for approval.
          </p>
          <p className="text-slate-600">I look forward to seeing you all.</p>
          <div className="pt-1">
            <p className="font-semibold text-slate-700">D. Thompson</p>
            <p className="text-slate-400">Board Chairman</p>
          </div>
        </div>
      )

    case 'report':
      return (
        <div className="space-y-2 text-[10px]">
          <div>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Chief Executive's Report</p>
            <p className="text-slate-400">Q4 2025 & Q1 2026 Outlook</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <div>
            <p className="font-semibold text-slate-700 mb-0.5">Executive Summary</p>
            <p className="text-slate-600 leading-relaxed">Revenue for Q4 2025 was £12.4m, exceeding budget by £0.5m (4%). EBITDA margin improved to 22.6%, up from 19.8% in Q3 2025.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-0.5">Key Highlights</p>
            <div className="space-y-0.5 text-slate-600">
              <p>· New client wins: 3 contracts signed (combined value £2.1m)</p>
              <p>· Headcount: 187 FTEs, +5 since September 2025</p>
              <p>· Pipeline: £18.2m qualified, conversion rate 34%</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-0.5">Operational Update</p>
            <p className="text-slate-600 leading-relaxed">The technology migration programme completed on schedule in November. All legacy systems have been decommissioned and the new platform is operating at full capacity.</p>
          </div>
        </div>
      )

    case 'financial':
      return (
        <div className="space-y-2 text-[10px]">
          <div>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Q4 Financial Statements</p>
            <p className="text-slate-400">Quarter ended 31 December 2025</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[9px] text-slate-400 font-medium pb-1">P&L Summary</th>
                <th className="text-right text-[9px] text-slate-400 font-medium pb-1">Q4 2025</th>
                <th className="text-right text-[9px] text-slate-400 font-medium pb-1">Q4 2024</th>
                <th className="text-right text-[9px] text-slate-400 font-medium pb-1">Var</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {[
                ['Revenue', '£12.4m', '£10.8m', '+15%'],
                ['Cost of Sales', '£8.1m', '£7.2m', '+13%'],
                ['Gross Profit', '£4.3m', '£3.6m', '+19%'],
                ['Admin Expenses', '£1.5m', '£1.4m', '+7%'],
              ].map(([label, q4, q3, v]) => (
                <tr key={label} className="border-b border-slate-50">
                  <td className="py-0.5">{label}</td>
                  <td className="text-right tabular-nums">{q4}</td>
                  <td className="text-right tabular-nums text-slate-400">{q3}</td>
                  <td className="text-right tabular-nums text-emerald-600">{v}</td>
                </tr>
              ))}
              <tr className="font-semibold text-slate-700">
                <td className="pt-1">EBITDA</td>
                <td className="text-right tabular-nums pt-1">£2.8m</td>
                <td className="text-right tabular-nums text-slate-400 pt-1">£2.2m</td>
                <td className="text-right tabular-nums text-emerald-600 pt-1">+27%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )

    case 'risk':
      return (
        <div className="space-y-2 text-[10px]">
          <div>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Risk & Compliance</p>
            <p className="text-slate-400">Quarter ended 31 December 2025</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <div className="space-y-2">
            {[
              { level: 'HIGH', color: 'text-red-600 bg-red-50 border-red-200', title: 'Regulatory Risk', body: 'EU AI Act compliance review initiated. Legal counsel engaged. Board approval required by March 2026.' },
              { level: 'MED', color: 'text-amber-600 bg-amber-50 border-amber-200', title: 'Operational Risk', body: 'Single-supplier dependency for cloud infrastructure. RFP for secondary provider in progress.' },
              { level: 'MED', color: 'text-amber-600 bg-amber-50 border-amber-200', title: 'Financial Risk', body: 'FX exposure on EUR-denominated contracts (£3.2m). Hedging strategy under review with CFO.' },
              { level: 'LOW', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', title: 'Reputational Risk', body: 'Social media monitoring in place. No incidents to report this quarter.' },
            ].map(({ level, color, title, body }) => (
              <div key={title} className="flex gap-2">
                <span className={`inline-block border px-1 py-0.5 rounded text-[8px] font-bold flex-shrink-0 leading-none mt-0.5 ${color}`}>{level}</span>
                <div>
                  <p className="font-semibold text-slate-700">{title}</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'resolution':
      return (
        <div className="space-y-3 text-[10px]">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Resolutions for Approval</p>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          {[
            { num: 1, title: 'Approval of Q4 2025 Accounts', text: 'IT IS RESOLVED THAT the Q4 2025 management accounts, as presented to the Board, be and are hereby approved and signed by the Chair on behalf of the Board.' },
            { num: 2, title: 'Banking Facility Renewal', text: 'IT IS RESOLVED THAT the Board hereby approves the renewal of the revolving credit facility with Barclays Corporate on the terms set out in the facility letter dated 4 February 2026.' },
            { num: 3, title: 'Director Appointment', text: 'IT IS RESOLVED THAT [Name] be appointed as an Independent Non-Executive Director of the Company with effect from 15 March 2026, subject to satisfactory completion of due diligence.' },
          ].map(({ num, title, text }) => (
            <div key={num} className="space-y-0.5">
              <p className="font-bold text-slate-700 uppercase tracking-wide text-[9px]">Resolution {num} — {title}</p>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )

    case 'aob':
      return (
        <div className="space-y-2 text-[10px]">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Any Other Business</p>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <div className="space-y-2.5">
            {[
              { n: 1, title: 'Q2 2026 Board Meeting', body: 'Proposed date: 25 June 2026, 10:00 BST at Registered Office. Confirmation requested from all directors by 20 March.' },
              { n: 2, title: 'Audit Committee — Terms of Reference', body: 'Updated terms of reference to be circulated for board approval by email ahead of the Q2 meeting.' },
              { n: 3, title: 'Board Effectiveness Survey', body: 'Annual survey to be issued w/c 16 March 2026. Results will be presented and discussed at the Q2 board meeting.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-2">
                <span className="text-slate-400 font-medium flex-shrink-0 w-3 tabular-nums">{n}.</span>
                <div>
                  <p className="font-semibold text-slate-700">{title}</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}

// ─── Thumbnail ───────────────────────────────────────────────────────────────

function PageThumbnail({
  section,
  index,
  status,
  onClick,
}: {
  section: Section
  index: number
  status: SectionStatus
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left border border-black/[0.09] dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-500 hover:shadow-md transition-all overflow-hidden"
    >
      <div className={`h-1.5 w-full ${status === 'complete' ? 'bg-emerald-400' : status === 'in-progress' ? 'bg-blue-400' : 'bg-slate-200'}`} />
      <div className="p-3">
        <p className="text-[10px] text-slate-400 font-medium mb-1.5 tabular-nums">{String(index + 1).padStart(2, '0')}</p>
        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-snug mb-2.5 group-hover:text-slate-900 dark:group-hover:text-zinc-100">{section.title}</p>
        <div className="mb-3">
          <MiniPreview type={section.type} faded={status === 'pending'} />
        </div>
        <StatusBadge status={status} />
      </div>
    </button>
  )
}

// ─── Browse modal ─────────────────────────────────────────────────────────────

function BrowseModal({
  entity,
  statuses,
  initialIndex,
  onClose,
}: {
  entity: Entity
  statuses: SectionStatus[]
  initialIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)
  const section = SECTIONS[current]
  const status = statuses[current]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-[520px] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex-shrink-0">
          <div>
            <p className="text-xs text-slate-400 font-medium">{entity.shortName} · Board Pack Q1 2026</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100 mt-0.5">{section.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className={`h-1 w-full rounded mb-5 ${status === 'complete' ? 'bg-emerald-400' : status === 'in-progress' ? 'bg-blue-400' : 'bg-slate-200 dark:bg-zinc-700'}`} />
          <SectionModalContent section={section} entity={entity} />
        </div>

        {/* Edit CTA */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 flex-shrink-0">
          <Link
            href={`/entity/${entity.id}/edit/${current}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 dark:bg-zinc-100 hover:bg-slate-700 dark:hover:bg-white active:bg-slate-900 dark:active:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2l3 3-8 8H3v-3L11 2z" />
            </svg>
            Edit this section
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 flex-shrink-0">
          <button
            onClick={() => setCurrent(p => Math.max(0, p - 1))}
            disabled={current === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 4L6 8l4 4" />
            </svg>
            Previous
          </button>
          <span className="text-xs text-slate-400 tabular-nums">{current + 1} / {SECTIONS.length}</span>
          <button
            onClick={() => setCurrent(p => Math.min(SECTIONS.length - 1, p + 1))}
            disabled={current === SECTIONS.length - 1}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── App config ──────────────────────────────────────────────────────────────

const CONNECTED_USER = 'sarah.chen@boardsuite.io'

interface AppInfo {
  description: string
  getDeeplink: (entity: Entity) => { label: string; url: string }
}

const APP_CONFIG: Record<string, AppInfo> = {
  'Entities': {
    description: 'Entity registry providing corporate data, registered addresses, directors, and group structure.',
    getDeeplink: (entity) => ({
      label: `${entity.shortName} — Entity Record`,
      url: `https://entities.internal/records/${entity.id}`,
    }),
  },
  'Boards NextGen': {
    description: 'Board management platform supplying pack templates, approval workflows, and distribution controls.',
    getDeeplink: (entity) => ({
      label: `${entity.shortName} — Q1 2026 Board Pack`,
      url: `https://boards.internal/packs/${entity.id}/q1-2026`,
    }),
  },
  'Risk Manager': {
    description: 'Risk register and compliance tracking. Provides live risk ratings and regulatory flags used in this pack.',
    getDeeplink: (entity) => ({
      label: `${entity.shortName} — Risk Register`,
      url: `https://risk.internal/entities/${entity.id}/register`,
    }),
  },
  'Minutes': {
    description: 'Meeting minutes repository. Previous board minutes are pulled directly into this pack.',
    getDeeplink: (entity) => ({
      label: `${entity.shortName} — Board Minutes`,
      url: `https://minutes.internal/boards/${entity.id}`,
    }),
  },
  'Data Intelligence': {
    description: 'Financial data platform. Provides market data, benchmarks, and analytics referenced in this pack.',
    getDeeplink: (entity) => ({
      label: `${entity.shortName} — Analytics Dashboard`,
      url: `https://dataintel.internal/entities/${entity.id}/dashboard`,
    }),
  },
}

// ─── Connected app popup ──────────────────────────────────────────────────────

function ConnectedAppPopup({
  appName,
  entity,
  onClose,
}: {
  appName: string
  entity: Entity
  onClose: () => void
}) {
  const cfg = APP_CONFIG[appName]
  if (!cfg) return null
  const deeplink = cfg.getDeeplink(entity)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-6 h-6 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:bg-slate-300 dark:active:bg-zinc-600 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-3 h-3 text-slate-500 dark:text-zinc-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="px-5 pt-5 pb-4">
          {/* App name */}
          <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 pr-6 mb-3">{appName}</p>

          {/* Auth status */}
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-none">Authenticated</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5 truncate">{CONNECTED_USER}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">{cfg.description}</p>

          {/* Deeplink */}
          <a
            href={deeplink.url}
            onClick={onClose}
            className="flex items-center justify-between gap-2 w-full px-3 py-2.5 bg-slate-900 dark:bg-zinc-100 hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 text-white dark:text-zinc-900 text-[11px] font-medium rounded-lg transition-colors group"
          >
            <span className="truncate">{deeplink.label}</span>
            <svg className="w-3 h-3 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

function getCurrentMilestone(completion: number): string {
  if (completion >= 96) return 'Approved'
  if (completion >= 81) return 'In review'
  if (completion >= 61) return 'Pack drafted'
  if (completion >= 41) return 'Papers received'
  if (completion >= 21) return 'Papers requested'
  if (completion >= 1) return 'Agenda set'
  return 'Not started'
}

export default function BoardPackViewer({ entity }: { entity: Entity }) {
  const statuses = getSectionStatuses(entity.completion)
  const [browseIndex, setBrowseIndex] = useState<number | null>(null)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [connectedExpanded, setConnectedExpanded] = useState(false)
  const completeCount = statuses.filter(s => s === 'complete').length

  const today = new Date('2026-03-03')
  const daysUntil = Math.ceil((entity.nextBoardDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const dateStyle = daysUntil <= 7
    ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
    : daysUntil <= 14
    ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
    : 'text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700'
  const daysLabel = daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `${daysUntil}d`

  const milestone = getCurrentMilestone(entity.completion)
  const isDone = entity.completion >= 96

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">
          <EntityLogo entity={entity} size="lg" />
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Board Pack · Q1 2026</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">{entity.name}</h2>
          </div>
        </div>
        <button
          onClick={() => setBrowseIndex(0)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 dark:bg-zinc-100 hover:bg-slate-700 dark:hover:bg-white active:bg-slate-900 dark:active:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="12" height="12" rx="1" />
            <path d="M5 6h6M5 9h4" />
          </svg>
          Browse Document
        </button>
      </div>

      {/* Status strip + connected apps */}
      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sections complete */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
            <svg className="w-3 h-3 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="2" width="10" height="12" rx="1.5" />
              <path d="M6 6h4M6 9h4M6 12h2" />
            </svg>
            <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300">
              {completeCount}<span className="font-normal text-slate-400"> / {SECTIONS.length} sections</span>
            </span>
          </div>

          {/* Next board meeting */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg ${dateStyle}`}>
            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="3" width="12" height="11" rx="1.5" />
              <path d="M5 1v3M11 1v3M2 7h12" />
            </svg>
            <span className="text-[11px] font-medium">{entity.nextBoard}</span>
            <span className="text-[10px] opacity-60">({daysLabel})</span>
          </div>

          {/* Stage */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDone ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
            <span className="text-[11px] text-slate-600 dark:text-zinc-400">{milestone}</span>
          </div>

          {/* Progress */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-400' : 'bg-blue-400'}`}
                style={{ width: `${entity.completion}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">{entity.completion}%</span>
          </div>

          {/* Connected widget */}
          <button
            onClick={() => setConnectedExpanded(v => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg transition-colors ${
              connectedExpanded
                ? 'bg-slate-100 dark:bg-zinc-700 border-slate-300 dark:border-zinc-600'
                : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">{entity.connectedApps.length} connected</span>
            <svg
              className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${connectedExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </div>

        {/* Expandable app list */}
        <div className={`overflow-hidden transition-all duration-200 ${connectedExpanded ? 'max-h-20' : 'max-h-0'}`}>
          <div className="flex items-center gap-1.5 pt-2 flex-wrap">
            {entity.connectedApps.map(app => (
              APP_CONFIG[app] ? (
                <button
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md hover:border-slate-400 dark:hover:border-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-700 active:bg-slate-100 dark:active:bg-zinc-600 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-zinc-400">{app}</span>
                </button>
              ) : null
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-2">
        {SECTIONS.map((section, i) => (
          <PageThumbnail
            key={i}
            section={section}
            index={i}
            status={statuses[i]}
            onClick={() => setBrowseIndex(i)}
          />
        ))}
      </div>

      {/* Browse modal */}
      {browseIndex !== null && (
        <BrowseModal
          entity={entity}
          statuses={statuses}
          initialIndex={browseIndex}
          onClose={() => setBrowseIndex(null)}
        />
      )}

      {/* Connected app popup */}
      {selectedApp && (
        <ConnectedAppPopup
          appName={selectedApp}
          entity={entity}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  )
}
