'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { type Entity, type ChatMessage } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import { SECTIONS, type SectionType } from '@/components/sections'

// ─── Section editor content (large format, contentEditable) ──────────────────

function SectionEditorContent({ type, entity }: { type: SectionType; entity: Entity }) {
  switch (type) {
    case 'cover':
      return (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
          <EntityLogo entity={entity} size="lg" />
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">{entity.name}</p>
            <p className="text-sm text-slate-500 mt-1">Board of Directors</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-zinc-700" />
          <div>
            <p className="text-xl font-semibold text-slate-700 dark:text-zinc-300">Board Pack · Q1 2026</p>
            <p className="text-sm text-slate-500 mt-1">{entity.nextBoard}</p>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">Strictly Confidential</p>
        </div>
      )

    case 'agenda':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Board Meeting Agenda</h2>
            <p className="text-sm text-slate-400 mt-1">{entity.nextBoard} · 10:00 hrs · Registered Office</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          <div className="space-y-3">
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
              <div key={i} className="flex gap-4">
                <span className="text-sm text-slate-400 font-medium w-5 flex-shrink-0 tabular-nums">{i + 1}.</span>
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'minutes':
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Minutes of Board Meeting</h2>
            <p className="text-sm text-slate-400">Held on 15 December 2025 · 10:00 GMT · Registered Office</p>
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="font-semibold text-slate-700">Present:</span> D. Thompson (Chair), S. Chen, J. Mwangi, P. Walsh, R. Patel</p>
            <p><span className="font-semibold text-slate-700">In Attendance:</span> Company Secretary, External Auditors (PwC)</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          <div className="space-y-4">
            {[
              ['1.', 'Apologies for Absence', 'No apologies were received. A quorum was present throughout the meeting.'],
              ['2.', 'Conflicts of Interest', 'No conflicts were declared in relation to items on the agenda.'],
              ['3.', 'Minutes of Previous Meeting', 'The minutes of the meeting held 18 September 2025 were approved as a true and accurate record. Proposed: P. Walsh. Seconded: J. Mwangi.'],
              ['4.', 'Matters Arising', 'The action log was reviewed. All actions from the September meeting were noted as complete or carried to items on this agenda.'],
              ['5.', 'Chief Executive\'s Report', 'The CEO presented the Q4 2025 performance report. The Board noted the strong revenue performance and the successful completion of the technology migration programme.'],
            ].map(([num, title, body]) => (
              <div key={num}>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{num} {title}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'letter':
      return (
        <div className="space-y-5 text-sm">
          <p className="text-slate-400">{entity.nextBoard}</p>
          <p className="font-semibold text-slate-800 dark:text-zinc-100 text-base">Dear Board Members,</p>
          <p className="text-slate-600 leading-relaxed">
            I am pleased to present the Q1 2026 Board Pack for {entity.name} ahead of the board meeting scheduled for {entity.nextBoard}.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The pack contains the Chief Executive's report, Q4 2025 financial statements, and three resolutions for board approval. I draw your attention in particular to the CEO's commentary on trading performance and the proposed amendments to the banking facilities.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Key points for attention at this meeting include: revenue performance against budget, the proposed capital restructuring resolution, and the independent director appointment being put forward for approval.
          </p>
          <p className="text-slate-600 leading-relaxed">
            All papers have been circulated in advance. Please do not hesitate to contact the Company Secretary with any questions prior to the meeting.
          </p>
          <p className="text-slate-600">I look forward to seeing you all on {entity.nextBoard}.</p>
          <div className="pt-2">
            <p className="font-semibold text-slate-800">D. Thompson</p>
            <p className="text-slate-400">Board Chairman</p>
            <p className="text-slate-400">{entity.name}</p>
          </div>
        </div>
      )

    case 'report':
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Chief Executive's Report</h2>
            <p className="text-sm text-slate-400">Q4 2025 & Q1 2026 Outlook</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Executive Summary</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">Revenue for Q4 2025 was £12.4m, exceeding budget by £0.5m (4%). EBITDA margin improved to 22.6%, up from 19.8% in Q3 2025. The quarter saw strong new business performance and the successful delivery of the technology migration programme.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Key Highlights</h3>
            <div className="space-y-1.5 text-sm text-slate-600">
              <p>· New client wins: 3 contracts signed (combined value £2.1m)</p>
              <p>· Headcount: 187 FTEs, +5 since September 2025</p>
              <p>· Pipeline: £18.2m qualified, conversion rate 34%</p>
              <p>· Customer satisfaction score: 8.4/10 (up from 7.9 in Q3)</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Operational Update</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">The technology migration programme completed on schedule in November. All legacy systems have been decommissioned and the new platform is operating at full capacity. The programme was delivered on time and within the approved budget of £1.8m.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Outlook for Q1 2026</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">The pipeline remains strong. We expect Q1 2026 revenue to be in the range of £11.8m–£12.6m, in line with full-year budget. Key strategic priorities for the quarter are the banking facility renewal and the director appointment process.</p>
          </div>
        </div>
      )

    case 'financial':
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Q4 Financial Statements</h2>
            <p className="text-sm text-slate-400">Quarter ended 31 December 2025 · Unaudited management accounts</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-zinc-700">
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide pb-2">P&L Summary</th>
                <th className="text-right text-xs text-slate-500 font-semibold uppercase tracking-wide pb-2">Q4 2025</th>
                <th className="text-right text-xs text-slate-500 font-semibold uppercase tracking-wide pb-2">Q4 2024</th>
                <th className="text-right text-xs text-slate-500 font-semibold uppercase tracking-wide pb-2">Variance</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-zinc-300">
              {[
                ['Revenue', '£12.4m', '£10.8m', '+15%', false],
                ['Cost of Sales', '(£8.1m)', '(£7.2m)', '+13%', false],
                ['Gross Profit', '£4.3m', '£3.6m', '+19%', true],
                ['Admin Expenses', '(£1.5m)', '(£1.4m)', '+7%', false],
                ['Depreciation', '(£0.3m)', '(£0.3m)', '0%', false],
              ].map(([label, q4, q3, v, bold]) => (
                <tr key={String(label)} className="border-b border-slate-100 dark:border-zinc-800">
                  <td className={`py-2 ${bold ? 'font-semibold' : ''}`}>{label}</td>
                  <td className={`text-right tabular-nums py-2 ${bold ? 'font-semibold' : ''}`}>{q4}</td>
                  <td className="text-right tabular-nums py-2 text-slate-400">{q3}</td>
                  <td className="text-right tabular-nums py-2 text-emerald-600">{v}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 dark:border-zinc-600">
                <td className="pt-2 font-bold text-slate-800 dark:text-zinc-100">EBITDA</td>
                <td className="text-right tabular-nums pt-2 font-bold text-slate-800">£2.8m</td>
                <td className="text-right tabular-nums pt-2 text-slate-400">£2.2m</td>
                <td className="text-right tabular-nums pt-2 text-emerald-600 font-semibold">+27%</td>
              </tr>
            </tbody>
          </table>
          <div className="text-xs text-slate-400 pt-2">
            Note: Figures are unaudited management accounts prepared in accordance with UK GAAP. Full statutory accounts will be presented at the AGM.
          </div>
        </div>
      )

    case 'risk':
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Risk & Compliance Report</h2>
            <p className="text-sm text-slate-400">Quarter ended 31 December 2025</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          <div className="space-y-4">
            {[
              { level: 'HIGH', dot: 'bg-red-500', border: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30', badge: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/40', title: 'Regulatory Risk — EU AI Act', body: 'The EU AI Act requires compliance review of all AI-enabled products by Q2 2026. A compliance working group has been established and external legal counsel engaged. Board approval is required for the remediation budget of £240k. Action: Board to approve budget at this meeting.' },
              { level: 'MED', dot: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30', badge: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40', title: 'Operational Risk — Supplier Concentration', body: 'Cloud infrastructure is hosted exclusively with a single provider, representing a concentration risk. An RFP for a secondary provider is in progress, with selection expected by end of Q1 2026. Estimated cost of dual-provider arrangement: £80k p.a.' },
              { level: 'MED', dot: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30', badge: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40', title: 'Financial Risk — FX Exposure', body: 'EUR-denominated contracts represent £3.2m of annual revenue. Current hedging policy does not cover this exposure. CFO is reviewing hedging options; a proposal will be presented at the Q2 board meeting.' },
              { level: 'LOW', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30', badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40', title: 'Reputational Risk', body: 'Social media monitoring is in place via third-party provider. No adverse incidents were recorded in Q4 2025. Brand sentiment score: 74/100 (stable).' },
            ].map(({ level, dot, border, badge, title, body }) => (
              <div key={title} className={`rounded-lg border p-4 ${border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${badge}`}>{level}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{title}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'resolution':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Resolutions for Approval</h2>
            <p className="text-sm text-slate-400">For adoption at the board meeting on {entity.nextBoard}</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          {[
            { num: 1, title: 'Approval of Q4 2025 Accounts', text: 'IT IS RESOLVED THAT the Q4 2025 management accounts of the Company, as presented to the Board at the meeting held on [Date], be and are hereby approved and shall be signed by the Chair on behalf of the Board of Directors.' },
            { num: 2, title: 'Banking Facility Renewal', text: 'IT IS RESOLVED THAT the Board of Directors hereby approves the renewal of the revolving credit facility with Barclays Corporate Banking on the terms and conditions set out in the facility letter dated 4 February 2026, and that the Chief Financial Officer be authorised to execute all documents necessary to give effect to this resolution.' },
            { num: 3, title: 'Director Appointment', text: 'IT IS RESOLVED THAT [Full Name] be appointed as an Independent Non-Executive Director of the Company with effect from 15 March 2026, subject to the satisfactory completion of all background checks and due diligence, and that the Company Secretary be authorised to file all necessary notifications with Companies House and other relevant authorities.' },
          ].map(({ num, title, text }) => (
            <div key={num} className="space-y-2">
              <p className="text-sm font-bold text-slate-800 uppercase tracking-wide">Resolution {num} — {title}</p>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
              <p className="text-sm text-slate-600 leading-relaxed italic">{text}</p>
              <div className="flex gap-8 pt-2">
                <div>
                  <p className="text-xs text-slate-400">Proposed by</p>
                  <div className="h-px w-24 bg-slate-300 dark:bg-zinc-600 mt-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Seconded by</p>
                  <div className="h-px w-24 bg-slate-300 dark:bg-zinc-600 mt-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )

    case 'aob':
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wide">Any Other Business</h2>
            <p className="text-sm text-slate-400">Items raised for discussion or noting</p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-800" />
          <div className="space-y-5">
            {[
              { n: 1, title: 'Q2 2026 Board Meeting', body: 'Proposed date: 25 June 2026, 10:00 BST at the Registered Office, London. Confirmation is requested from all directors by 20 March 2026. Any director unable to attend in person may join via video link.' },
              { n: 2, title: 'Audit Committee — Terms of Reference Review', body: 'Updated terms of reference for the Audit Committee, reflecting the new FRC guidance published in January 2026, are to be circulated by email for board approval ahead of the Q2 meeting. No discussion required at this meeting.' },
              { n: 3, title: 'Board Effectiveness Survey', body: 'The annual board effectiveness survey will be issued to all directors and regular attendees during the week commencing 16 March 2026. Results will be analysed independently and presented for discussion at the Q2 board meeting.' },
              { n: 4, title: 'Date of Next Meeting', body: 'The next scheduled board meeting is 25 June 2026. The Company Secretary will issue a formal notice and papers no later than five business days prior to the meeting, in accordance with the Company\'s Articles of Association.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-4">
                <span className="text-sm text-slate-400 font-semibold w-5 flex-shrink-0 tabular-nums">{n}.</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{title}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{body}</p>
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

// ─── Editor AI sidebar ────────────────────────────────────────────────────────

const EDITOR_PROMPTS = [
  'Rewrite in formal tone',
  'Make this more concise',
  'Expand with more detail',
  'Check for consistency',
]

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
          isUser ? 'bg-slate-800 dark:bg-zinc-700 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

// ─── Main DocumentEditor component ───────────────────────────────────────────

export default function DocumentEditor({
  entity,
  sectionIndex,
}: {
  entity: Entity
  sectionIndex: number
}) {
  const router = useRouter()
  const [hasUnsaved, setHasUnsaved] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: `I'm here to help you edit the ${SECTIONS[sectionIndex].title} section. Ask me to rewrite passages, adjust the tone, expand on points, or check consistency with other sections.`,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const section = SECTIONS[sectionIndex]

  function handleBack() {
    if (
      hasUnsaved &&
      !window.confirm('You have unsaved changes. Discard and return to the board pack?')
    ) {
      return
    }
    router.push(`/entity/${entity.id}`)
  }

  function handleSave() {
    setHasUnsaved(false)
  }

  function handleDiscard() {
    if (window.confirm('Discard all unsaved changes to this section?')) {
      setHasUnsaved(false)
    }
  }

  function handleSendChat(content: string) {
    if (!content.trim()) return
    const trimmed = content.trim()
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: trimmed }
    const assistantMsg: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `Working on: "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}". I'll update the ${section.title} section accordingly.`,
    }
    setChatMessages(prev => [...prev, userMsg, assistantMsg])
    setInputValue('')
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendChat(inputValue)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#f0f0f1] dark:bg-zinc-950 overflow-hidden">

      {/* Top navigation bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 4L6 8l4 4" />
            </svg>
            {entity.shortName}
          </button>
          <svg className="w-3 h-3 text-slate-400 dark:text-zinc-600 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2l4 4-4 4" />
          </svg>
          <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 truncate">{section.title}</span>
          {hasUnsaved && (
            <span className="ml-1 flex-shrink-0 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>

        {/* Section prev/next */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (hasUnsaved && !window.confirm('Discard unsaved changes before switching sections?')) return
              router.push(`/entity/${entity.id}/edit/${sectionIndex - 1}`)
            }}
            disabled={sectionIndex === 0}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 4L6 8l4 4" />
            </svg>
            Prev
          </button>
          <span className="text-xs text-slate-400 dark:text-zinc-500 tabular-nums">{sectionIndex + 1} / {SECTIONS.length}</span>
          <button
            onClick={() => {
              if (hasUnsaved && !window.confirm('Discard unsaved changes before switching sections?')) return
              router.push(`/entity/${entity.id}/edit/${sectionIndex + 1}`)
            }}
            disabled={sectionIndex === SECTIONS.length - 1}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* AI assistant sidebar */}
        <aside className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">AI Assistant</h2>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Editing: {section.title}</p>
          </div>

          {/* Prompt starters */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0 space-y-1.5">
            {EDITOR_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => handleSendChat(p)}
                className="w-full text-left text-xs text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 active:bg-slate-200 dark:active:bg-zinc-600 px-3 py-2 rounded border border-slate-200 dark:border-zinc-700 transition-colors leading-snug"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {chatMessages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-200 dark:border-zinc-800 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this section…"
                className="flex-1 text-sm border border-slate-200 dark:border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-600 placeholder:text-slate-400 dark:placeholder:text-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
              />
              <button
                onClick={() => handleSendChat(inputValue)}
                disabled={!inputValue.trim()}
                className="px-3 py-2 bg-slate-800 dark:bg-zinc-100 hover:bg-slate-700 dark:hover:bg-white active:bg-slate-900 dark:active:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-zinc-900 text-xs font-medium rounded transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </aside>

        {/* Document preview area */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-zinc-800 p-8">
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={() => setHasUnsaved(true)}
            className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none rounded-xl p-10 min-h-[700px] outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700 focus:ring-offset-4 dark:focus:ring-offset-zinc-800 cursor-text transition-shadow"
          >
            <SectionEditorContent type={section.type} entity={entity} />
          </div>
        </main>
      </div>

      {/* Sticky footer */}
      <footer className="flex-shrink-0 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasUnsaved ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className="text-xs text-slate-600 dark:text-zinc-400">
            {hasUnsaved ? 'You have unsaved changes to this section.' : 'All changes saved.'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDiscard}
            disabled={!hasUnsaved}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!hasUnsaved}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            Save changes
          </button>
        </div>
      </footer>
    </div>
  )
}
