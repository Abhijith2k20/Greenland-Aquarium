import { useMemo } from 'react'

export default function Bubbles({ count = 4 }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        size: 4 + ((i * 13) % 10),
        delay: `${(i * 0.9) % 8}s`,
        duration: `${14 + ((i * 3) % 10)}s`,
        opacity: 0.12 + ((i % 4) * 0.06),
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble absolute bottom-[-40px] rounded-full bg-white/30"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.duration,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  )
}
