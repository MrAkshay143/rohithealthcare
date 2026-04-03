import { useState, useEffect } from 'react'

type Slide = { id: number; imageUrl: string; alt: string }

const FALLBACK: Slide[] = [
  {
    id: 0,
    imageUrl: '/images/bg-diagnostic.jpg',
    alt: 'Healthcare professionals at work',
  },
]

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)
  const imgs = slides.length > 0 ? slides : FALLBACK

  useEffect(() => {
    if (imgs.length <= 1) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % imgs.length), 4500)
    return () => clearInterval(t)
  }, [imgs.length])

  return (
    <div 
      className="hidden md:block relative overflow-hidden pointer-events-none"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 25%)'
      }}
    >
      {imgs.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img loading={i === 0 ? "eager" : "lazy"}
            src={slide.imageUrl}
            alt={slide.alt}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}
      {/* Optional subtle gradient on top to harmonize colors without creating a hard line */}
      <div className="absolute inset-0 bg-linear-to-b from-[#3d5099]/20 via-transparent to-[#3d5099]/30" />
      {imgs.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-auto">
          {imgs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
