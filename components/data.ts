export type ProtoState = 'calm' | 'busy' | 'critical'

export interface Entity {
  id: number
  name: string
  shortName: string
  country: string
  countryCode: string
  nextBoard: string
  nextBoardDate: Date
  completion: number
  connectedApps: string[]
}

export interface BookBuildingItem {
  id: number
  entityId: number
  category: 'gap' | 'overdue' | 'assignment' | 'signature' | 'approval'
  title: string       // gap/opportunity as a plain statement
  meta: string        // short context for row meta line
  detail: string      // longer explanation for modal body
  actionLabel: string // CTA button text
  states: ProtoState[]
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export const ENTITIES: Entity[] = [
  {
    id: 1,
    name: 'Meridian Capital Holdings Ltd',
    shortName: 'Meridian Capital',
    country: 'United Kingdom',
    countryCode: 'UK',
    nextBoard: '14 Mar 2026',
    nextBoardDate: new Date('2026-03-14'),
    completion: 72,
    connectedApps: ['Entities', 'Boards NextGen', 'Minutes', 'Risk Manager'],
  },
  {
    id: 2,
    name: 'Apex Ventures GmbH',
    shortName: 'Apex Ventures',
    country: 'Germany',
    countryCode: 'DE',
    nextBoard: '18 Mar 2026',
    nextBoardDate: new Date('2026-03-18'),
    completion: 45,
    connectedApps: ['Entities', 'Boards NextGen', 'Risk Manager', 'Data Intelligence'],
  },
  {
    id: 3,
    name: 'Horizon Digital S.A.',
    shortName: 'Horizon Digital',
    country: 'France',
    countryCode: 'FR',
    nextBoard: '11 Mar 2026',
    nextBoardDate: new Date('2026-03-11'),
    completion: 88,
    connectedApps: ['Entities', 'Boards NextGen', 'Data Intelligence'],
  },
  {
    id: 4,
    name: 'Nordic Solutions AB',
    shortName: 'Nordic Solutions',
    country: 'Sweden',
    countryCode: 'SE',
    nextBoard: '25 Mar 2026',
    nextBoardDate: new Date('2026-03-25'),
    completion: 31,
    connectedApps: ['Entities', 'Boards NextGen', 'Minutes'],
  },
  {
    id: 5,
    name: 'Pacific Rim Operations Pte Ltd',
    shortName: 'Pacific Rim Ops',
    country: 'Singapore',
    countryCode: 'SG',
    nextBoard: '7 Mar 2026',
    nextBoardDate: new Date('2026-03-07'),
    completion: 60,
    connectedApps: ['Entities', 'Boards NextGen', 'Risk Manager', 'Minutes'],
  },
  {
    id: 6,
    name: 'Atlantic Resources Inc',
    shortName: 'Atlantic Resources',
    country: 'United States',
    countryCode: 'US',
    nextBoard: '20 Mar 2026',
    nextBoardDate: new Date('2026-03-20'),
    completion: 95,
    connectedApps: ['Entities', 'Boards NextGen', 'Data Intelligence', 'Risk Manager'],
  },
  {
    id: 7,
    name: 'Iberian Holdings S.L.',
    shortName: 'Iberian Holdings',
    country: 'Spain',
    countryCode: 'ES',
    nextBoard: '28 Mar 2026',
    nextBoardDate: new Date('2026-03-28'),
    completion: 18,
    connectedApps: ['Entities', 'Boards NextGen', 'Minutes', 'Data Intelligence'],
  },
  {
    id: 8,
    name: 'Eastern Markets Ltd',
    shortName: 'Eastern Markets',
    country: 'UAE',
    countryCode: 'AE',
    nextBoard: '4 Apr 2026',
    nextBoardDate: new Date('2026-04-04'),
    completion: 55,
    connectedApps: ['Entities', 'Boards NextGen', 'Risk Manager'],
  },
]

export const BOOK_BUILDING_ITEMS: BookBuildingItem[] = [
  {
    id: 1,
    entityId: 4,
    category: 'signature',
    title: 'Resolution awaiting 3 of 5 director signatures',
    meta: 'Nordic Solutions · 3 of 5 complete',
    detail: 'Capital restructuring resolution approved in December — 3 of 5 e-signatures complete.',
    actionLabel: 'Send reminder',
    states: ['calm', 'busy'],
  },
  {
    id: 2,
    entityId: 6,
    category: 'approval',
    title: 'Pack at 95% — Chair approval required before distribution',
    meta: 'Atlantic Resources · Pack at 95%',
    detail: 'Pack is complete and awaiting final sign-off from the Chair before it can be distributed to directors.',
    actionLabel: 'Send for approval',
    states: ['calm', 'busy'],
  },
  {
    id: 3,
    entityId: 1,
    category: 'gap',
    title: 'No cybersecurity topic on the agenda in 12 months',
    meta: 'Meridian Capital · Last covered Mar 2025',
    detail: 'Cybersecurity was last discussed in March 2025. Rising threat landscape may make this a material governance gap.',
    actionLabel: 'Add section',
    states: ['busy', 'critical'],
  },
  {
    id: 4,
    entityId: 2,
    category: 'gap',
    title: 'Carbon neutrality goals set Feb 2025 — no check-in since',
    meta: 'Apex Ventures · 13 months since last mention',
    detail: 'Board committed to interim carbon reduction targets 13 months ago. No progress update has been added to any subsequent agenda.',
    actionLabel: 'Add to agenda',
    states: ['busy', 'critical'],
  },
  {
    id: 5,
    entityId: 1,
    category: 'assignment',
    title: 'Financial Review section has no presenter assigned',
    meta: 'Meridian Capital · Meeting in 15 days',
    detail: 'Section 3.2 is unassigned. The board meeting is in 15 days and the pack is already in review.',
    actionLabel: 'Assign owner',
    states: ['busy', 'critical'],
  },
  {
    id: 6,
    entityId: 2,
    category: 'approval',
    title: 'GDPR data processing addendum sign-off blocking pack completion',
    meta: 'Apex Ventures · Pack blocked',
    detail: 'EU data processing addendum requires legal sign-off before the pack can be finalised and distributed.',
    actionLabel: 'Review item',
    states: ['critical'],
  },
  {
    id: 7,
    entityId: 5,
    category: 'overdue',
    title: 'Q4 Financial Statements not received — pack cannot progress',
    meta: 'Pacific Rim Ops · Meeting in 9 days',
    detail: 'Finance has not submitted Q4 statements. The pack is blocked at 60% and the board meeting is in under two weeks.',
    actionLabel: 'Notify Finance',
    states: ['critical'],
  },
]

export interface PlanningSuggestion {
  id: number
  entities: Array<{ entityId: number }>
  sourceType: 'regulation' | 'market' | 'source-material' | 'personnel' | 'geopolitical' | 'reorder'
  sourceLabel: string
  title: string
  reason: string
  affectedSection?: string
  suggestedPrompt?: string
  actionLabel: string
  states: ProtoState[]
}

export const PLANNING_SUGGESTIONS: PlanningSuggestion[] = [
  {
    id: 1,
    entities: [{ entityId: 2 }],
    sourceType: 'personnel',
    sourceLabel: 'CFO Succession',
    title: 'Update presenter for Financial Review and Budget — Anna Bauer appointed CFO 10 Mar',
    reason: 'Klaus Weber (departing CFO) is still listed as presenter on Sections 3 and 5. Anna Bauer was appointed on 10 March 2026.',
    affectedSection: 'Financial Review',
    suggestedPrompt: 'Update the presenter field on Sections 3 and 5 of the Apex Ventures board pack from Klaus Weber to Anna Bauer, effective 10 March 2026.',
    actionLabel: 'Update presenter',
    states: ['calm', 'busy'],
  },
  {
    id: 2,
    entities: [{ entityId: 2 }],
    sourceType: 'regulation',
    sourceLabel: 'EU AI Act',
    title: 'EU AI Act enforcement deadline shifted to Q3 — update Risk section',
    reason: 'EU AI Act enforcement guidelines revised 24 Feb 2026 — key deadline shifted from Q2 to Q3 2026.',
    affectedSection: 'Risk & Compliance',
    suggestedPrompt: 'Update the Risk & Compliance section for Apex Ventures to reflect the revised EU AI Act enforcement deadline (Q3 2026) and adjust the remediation budget timeline accordingly.',
    actionLabel: 'Apply',
    states: ['calm', 'busy', 'critical'],
  },
  {
    id: 3,
    entities: [{ entityId: 3 }],
    sourceType: 'market',
    sourceLabel: 'ECB Rate Cut',
    title: 'ECB cut to 2.90% — revise FX hedging commentary',
    reason: 'ECB cut rates 25bps to 2.90% on 6 Mar 2026. Pack currently references the superseded rate of 3.15%.',
    affectedSection: 'Q4 Financial Statements',
    suggestedPrompt: "Update Horizon Digital's Q4 Financial Statements to reflect the ECB rate cut to 2.90% (6 Mar 2026) and revise all FX hedging commentary to align with the current rate environment.",
    actionLabel: 'Apply',
    states: ['calm', 'busy', 'critical'],
  },
  {
    id: 4,
    entities: [{ entityId: 4 }],
    sourceType: 'reorder',
    sourceLabel: 'Agenda Reorder',
    title: 'Move EU Regulatory Update to agenda item 2 — AI Act enforcement revised',
    reason: 'Item is currently listed at position 7. Given the AI Act enforcement revision, board attention is needed early in the meeting.',
    actionLabel: 'Reorder',
    states: ['busy', 'critical'],
  },
  {
    id: 5,
    entities: [{ entityId: 6 }],
    sourceType: 'source-material',
    sourceLabel: 'Auditor Revision',
    title: 'Reconcile EBITDA — PwC revised Q4 accounts (£2.6m, was £2.8m)',
    reason: 'PwC submitted revised management accounts on 28 Feb 2026. EBITDA now £2.6m; pack currently states £2.8m.',
    affectedSection: 'Q4 Financial Statements',
    suggestedPrompt: "Reconcile the Q4 Financial Statements for Atlantic Resources with PwC's revised management accounts: update EBITDA from £2.8m to £2.6m and recalculate EBITDA margin.",
    actionLabel: 'Apply',
    states: ['busy', 'critical'],
  },
  {
    id: 6,
    entities: [{ entityId: 1 }, { entityId: 6 }, { entityId: 8 }],
    sourceType: 'geopolitical',
    sourceLabel: 'Geopolitical Risk',
    title: 'Add Geopolitical Risk section — armed conflict escalation affecting supply chain exposure',
    reason: 'Escalation in Eastern Europe since 12 Mar 2026 may affect supply chain exposure for three entities with operations or counterparties in the region.',
    actionLabel: 'Add section',
    states: ['critical'],
  },
  {
    id: 7,
    entities: [{ entityId: 2 }, { entityId: 3 }, { entityId: 4 }, { entityId: 7 }],
    sourceType: 'regulation',
    sourceLabel: 'CSRD',
    title: 'Add mandatory ESG disclosure section to all 4 EU entity packs',
    reason: 'CSRD mandatory reporting applies from Jan 2026 for qualifying EU entities. No ESG disclosure section exists in any of the 4 affected packs.',
    affectedSection: 'ESG Disclosure',
    suggestedPrompt: 'Add an ESG disclosure section to board packs for Apex Ventures, Horizon Digital, Nordic Solutions, and Iberian Holdings, covering scope 1 & 2 emissions, social metrics, and board oversight of sustainability strategy as required under CSRD.',
    actionLabel: 'Apply',
    states: ['busy', 'critical'],
  },
]

export const PROMPT_STARTERS: string[] = [
  'Which packs are at risk this quarter?',
  'Create board pack',
  'Show all outstanding director signatures',
  'Draft a circular resolution across entities',
]

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Q1 2026 pack status: 6 of 8 entities are in progress. Most urgent — Pacific Rim Ops meets on 7 March and Q4 Financials are still missing from Finance. Atlantic Resources is nearly done, pending chair sign-off only. Four items need your review before I can proceed.',
  },
]
