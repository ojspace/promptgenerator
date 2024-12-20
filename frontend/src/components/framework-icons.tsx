export function FrameworkIcons() {
  return (
    <div className="flex gap-4 mt-8">
      {/* These would be actual framework icons in production */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"
        >
          <div className="w-8 h-8 bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  )
}
