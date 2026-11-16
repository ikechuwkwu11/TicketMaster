import { RefreshCw } from 'lucide-react';

/** Decorative SafeTix-style barcode with animated blue scan glow */
export default function SafeTixBarcode({ seed = 1 }) {
  // Deterministic bar pattern from seat seed so each ticket looks unique
  const bars = [];
  let x = 0;
  for (let i = 0; i < 48; i += 1) {
    const n = ((seed * 17 + i * 13) % 7) + 1;
    const w = n % 2 === 0 ? 1.5 : n > 4 ? 3.5 : 2.2;
    bars.push({ x, w, tall: i % 5 !== 0 });
    x += w + 1.2;
  }
  const width = Math.ceil(x + 4);

  return (
    <div className="relative overflow-hidden rounded-[2px] bg-white px-2.5 pb-2.5 pt-2 shadow-sm">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-[#333]">
          Screenshots won&apos;t get you in
        </p>
        <RefreshCw className="h-3.5 w-3.5 shrink-0 text-[#555]" strokeWidth={2.25} />
      </div>

      <div className="relative h-[52px] w-full overflow-hidden bg-white">
        <svg
          viewBox={`0 0 ${width} 52`}
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.tall ? 0 : 6}
              width={b.w}
              height={b.tall ? 52 : 40}
              fill="#111"
            />
          ))}
        </svg>

        {/* Animated blue scan / SecureEntry glow */}
        <div className="barcode-scan-glow pointer-events-none absolute inset-y-0 left-0 w-14" />
      </div>
    </div>
  );
}
