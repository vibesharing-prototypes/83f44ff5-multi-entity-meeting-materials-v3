'use client'

import { useState, useRef } from 'react'
import { BOOK_BUILDING_ITEMS, type Entity, type ChatMessage } from '@/components/data'

function getEntityMessages(entity: Entity): ChatMessage[] {
  const histories: Record<number, ChatMessage[]> = {
    // Meridian Capital — 72%, in review, CEO Report unassigned
    1: [
      { id: 1, role: 'assistant', content: 'Meridian Capital board pack opened for Q1 2026. Meeting is 14 March — 15 days out.' },
      { id: 2, role: 'user', content: 'Start drafting. Pull the Q4 2025 template.' },
      { id: 3, role: 'assistant', content: 'Done. Cover Page, Agenda, and Previous Minutes pre-filled from Q4 2025. Chair\'s Introduction drafted from standard template. Q4 Financial Statements are in — Finance submitted on 3 February.' },
      { id: 4, role: 'assistant', content: 'One blocker: section 3.2 (CEO Report) has no assigned author. It was carried over from the last pack without an owner. The section needs to be assigned before I can progress it.' },
      { id: 5, role: 'user', content: 'Who drafted it last quarter?' },
      { id: 6, role: 'assistant', content: 'Sarah Chen drafted the Q4 2025 CEO Report. I can send her a request to take this on — shall I draft the message?' },
    ],
    // Apex Ventures — 45%, pack started, GDPR blocker
    2: [
      { id: 1, role: 'assistant', content: 'Apex Ventures board pack for Q1 2026 is underway. Meeting is 18 March.' },
      { id: 2, role: 'user', content: 'Papers all in?' },
      { id: 3, role: 'assistant', content: 'Yes — agenda confirmed, all board papers received as of 7 February. Sections 1–4 are drafted.' },
      { id: 4, role: 'assistant', content: 'Compliance flag: the EU data processing addendum attached to section 6.3 requires legal sign-off before the pack can be finalised. This is blocking Risk & Compliance.' },
      { id: 5, role: 'user', content: 'Who needs to sign this off?' },
      { id: 6, role: 'assistant', content: 'It needs to go to your DPO or General Counsel. I can prepare a sign-off request with the relevant clause highlighted. Do you want me to draft it?' },
    ],
    // Horizon Digital — 88%, final review
    3: [
      { id: 1, role: 'assistant', content: 'Horizon Digital board pack is in final review. Meeting is 11 March — 12 days out.' },
      { id: 2, role: 'user', content: 'Where are we on section reviews?' },
      { id: 3, role: 'assistant', content: 'Seven of nine sections are complete: Cover Page through Risk & Compliance. Chair\'s Introduction was revised and re-approved on 19 February.' },
      { id: 4, role: 'assistant', content: 'Resolutions section is with the legal team — expected back tomorrow. AOB is pending a short note from the Chair.' },
      { id: 5, role: 'user', content: 'Can we distribute once resolutions are cleared?' },
      { id: 6, role: 'assistant', content: 'Yes. Once the resolutions section is signed off I\'ll compile the final PDF and prepare the distribution list. All director contact details are confirmed.' },
    ],
    // Nordic Solutions — 31%, early stage, unsigned December resolution
    4: [
      { id: 1, role: 'assistant', content: 'Nordic Solutions board pack for Q1 2026 is at an early stage. Meeting is 25 March — 26 days out.' },
      { id: 2, role: 'user', content: 'What\'s the status on the December resolution?' },
      { id: 3, role: 'assistant', content: 'The capital restructuring resolution was approved in December 2025. Three of five directors have e-signed. Waiting on Lars Eriksson and Chair Ingrid Söderström. Reminders sent 20 February — no response yet.' },
      { id: 4, role: 'user', content: 'Chase them again and start the pack.' },
      { id: 5, role: 'assistant', content: 'Re-sending signature requests now with a deadline of 5 March. For the board pack — agenda is set and paper requests have gone to all section leads. Financial statements and risk report due from Finance by 7 March.' },
    ],
    // Pacific Rim Ops — 60%, urgent, Q4 Financials missing
    5: [
      { id: 1, role: 'assistant', content: 'Pacific Rim Ops has the nearest board meeting — 7 March, 8 days away. The pack is drafted but there\'s a critical gap.' },
      { id: 2, role: 'user', content: 'What\'s missing?' },
      { id: 3, role: 'assistant', content: 'Q4 Financial Statements haven\'t been received from Finance. Section 6 is blank. All other sections — Cover through CEO Report and Risk & Compliance — are drafted and awaiting review.' },
      { id: 4, role: 'assistant', content: 'I\'ve sent two requests to the Singapore Finance team (31 January and 14 February). No submission yet. This is now urgent.' },
      { id: 5, role: 'user', content: 'Escalate it. Who\'s the Finance lead?' },
      { id: 6, role: 'assistant', content: 'Regional Finance Director is Michael Tan. I can draft an escalation email copying the CFO — financials need to be with us by 3 March at the latest to allow review time before the meeting.' },
    ],
    // Atlantic Resources — 95%, nearly done, chair sign-off pending
    6: [
      { id: 1, role: 'user', content: 'What\'s the status on Atlantic Resources?' },
      { id: 2, role: 'assistant', content: 'Almost done. Eight of nine sections are complete and approved. The pack has been through two full rounds of review.' },
      { id: 3, role: 'assistant', content: 'Final step: board chair sign-off on the cover letter. Sent to Patricia Walsh on 24 February — awaiting response. Once confirmed I\'ll compile the final PDF and prepare the distribution list.' },
      { id: 4, role: 'user', content: 'When did we finish the main sections?' },
      { id: 5, role: 'assistant', content: 'CEO Report and Q4 Financials approved 12 February. Risk & Compliance on 17 February. Resolutions finalised 21 February — all three are straightforward renewals. Smoothest pack of the quarter.' },
    ],
    // Iberian Holdings — 18%, just started
    7: [
      { id: 1, role: 'assistant', content: 'Iberian Holdings board pack for Q1 2026 has been opened. Meeting is 28 March — 29 days out.' },
      { id: 2, role: 'user', content: 'Let\'s get the agenda set.' },
      { id: 3, role: 'assistant', content: 'Agenda drafted from the Q4 2025 template. I\'ve added the annual strategy review item requested by the board in December. Sending to the Chair for approval today.' },
      { id: 4, role: 'assistant', content: 'Paper requests sent to all section owners: CEO Report to Alejandro Ruiz, Financial Statements to Madrid Finance, Risk update to the compliance officer. Papers due 9 March.' },
      { id: 5, role: 'user', content: 'Any standing items to add?' },
      { id: 6, role: 'assistant', content: 'Yes — director fee review (annual) and renewal of the company\'s insurance authorisation are both due at Q1 per the governance calendar. I\'ve added them to the agenda.' },
    ],
    // Eastern Markets — 55%, steady progress
    8: [
      { id: 1, role: 'assistant', content: 'Eastern Markets board pack is underway. Meeting is 4 April — good runway ahead.' },
      { id: 2, role: 'user', content: 'What\'s done so far?' },
      { id: 3, role: 'assistant', content: 'Cover Page, Agenda, and Previous Minutes are complete. Chair\'s Introduction and CEO Report are drafted and with section owners for review.' },
      { id: 4, role: 'assistant', content: 'Q4 Financial Statements received from Abu Dhabi Finance on 10 February and included in the pack. Risk & Compliance is currently being drafted.' },
      { id: 5, role: 'user', content: 'Flag anything I should know.' },
      { id: 6, role: 'assistant', content: 'Nothing blocking. One note: two directors are in different time zones. I\'ve proposed 10:00 GST for the meeting — avoids early morning for the London board members. Shall I confirm this with the Chair?' },
    ],
  }

  return histories[entity.id] ?? [
    { id: 1, role: 'assistant', content: `Working on the ${entity.shortName} board pack for Q1 2026. Meeting is ${entity.nextBoard}.` },
  ]
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
          isUser
            ? 'bg-slate-800 dark:bg-zinc-700 text-white rounded-br-sm'
            : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

export default function EntitySidebar({ entity }: { entity: Entity }) {
  const activeItem = BOOK_BUILDING_ITEMS.find(item => item.entityId === entity.id) ?? null
  const [messages, setMessages] = useState<ChatMessage[]>(getEntityMessages(entity))
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleSendMessage(content: string) {
    if (!content.trim()) return
    const trimmed = content.trim()
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: trimmed }
    const assistantMsg: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `Understood. Working on: "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '...' : ''}"`,
    }
    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInputValue('')
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* Agent progress tracker */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-2">
          Agent Activity
        </h2>
        {activeItem ? (
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 dark:text-zinc-300 leading-snug">{activeItem.title}</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-snug">{activeItem.detail}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic">No active task</p>
        )}
      </div>

      {/* Chat header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
          AI Assistant
        </h2>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.map(msg => (
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
            placeholder={`Ask about ${entity.shortName}…`}
            className="flex-1 text-sm border border-slate-200 dark:border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-600 placeholder:text-slate-400 dark:placeholder:text-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-slate-800 dark:bg-zinc-100 hover:bg-slate-700 dark:hover:bg-white active:bg-slate-900 dark:active:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-zinc-900 text-xs font-medium rounded transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
