function BrandLockup({ showTagline = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt=""
        className="size-11 rounded-2xl shadow-sm ring-1 ring-rose-100"
        src="/frosted-whispers-mark.svg"
      />
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b5c66]">
          Frosted Whispers
        </p>
        {showTagline && (
          <p className="mt-1 text-xs text-stone-500">Every cake carries a message.</p>
        )}
      </div>
    </div>
  )
}

export default BrandLockup
