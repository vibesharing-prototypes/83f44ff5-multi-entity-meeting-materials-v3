export default function Footer() {
  return (
    <footer className="mt-24 px-6 py-8">
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-zinc-700 mb-8" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-500 dark:text-zinc-600 uppercase">Multi-Entity Meeting Materials</span>
        <span className="text-[11px] text-slate-500 dark:text-zinc-600">© {new Date().getFullYear()} Diligent Corporation</span>
      </div>
    </footer>
  )
}
