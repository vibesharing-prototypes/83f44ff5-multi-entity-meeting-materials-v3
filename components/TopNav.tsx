export default function TopNav() {
  return (
    <nav className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Left: logo mark + app title */}
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 210 222" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
            <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
            <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
          </svg>
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-zinc-100">Subsidiary Board Management</span>
        </div>

        {/* Right: bell + user */}
        <div className="flex items-center gap-3">
          {/* Bell */}
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors relative">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2a4 4 0 0 1 4 4c0 2.667 1.333 4 1.333 4H2.667S4 8.667 4 6a4 4 0 0 1 4-4Z"/>
              <path d="M6.87 13a1.333 1.333 0 0 0 2.26 0"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white dark:ring-zinc-900" />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700" />

          {/* User */}
          <div className="flex items-center gap-2">
            <img src="https://randomuser.me/api/portraits/med/women/65.jpg" alt="Sarah Mitchell" className="h-7 w-7 rounded-full object-cover" />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-zinc-100">Sarah Mitchell</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">General Counsel</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
