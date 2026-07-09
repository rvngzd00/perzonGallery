import { useEffect } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

/**
 * Normalized mouse position in [-1, 1] relative to viewport center,
 * smoothed with a spring for luxe-feeling parallax.
 */
export function useMousePosition(): {
  x: MotionValue<number>
  y: MotionValue<number>
} {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 50, damping: 20 })
  const y = useSpring(rawY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return { x, y }
}
