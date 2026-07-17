import { useEffect, useMemo, useRef } from "react"
import { initRaycast } from "/lib/biennial/frontpage/raycast"

const RaycastCanvas = () => {
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") {
      return false
    }

    return window.matchMedia("(pointer: coarse)").matches
  }, [])

  const containerRef = useRef(null)

  useEffect(() => {
    if (isMobile || !containerRef.current) {
      return undefined
    }

    const cleanup = initRaycast(containerRef.current)
    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [isMobile])

  if (isMobile) {
    return null
  }

  return (
    <div
      id="frontpage-app"
      ref={containerRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
    />
  )
}

export default RaycastCanvas
