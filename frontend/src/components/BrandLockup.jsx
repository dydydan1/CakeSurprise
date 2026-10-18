function BrandLockup({ showTagline = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt="crumbcoded"
        className="size-12 rounded-2xl shadow-[0_8px_24px_rgba(114,47,67,0.12)] ring-1 ring-[#D49AA6]/45"
        src="/crumbcoded-mark.svg"
      />
      <div>
        <p className="brand-wordmark text-xl font-semibold tracking-[-0.03em] text-[#722F43]">
          crumbcoded
        </p>
        {showTagline && (
          <p className="mt-0.5 text-xs text-[#4B3435]/65">Baked with Love, Coded for You.</p>
        )}
      </div>
    </div>
  )
}

export default BrandLockup
