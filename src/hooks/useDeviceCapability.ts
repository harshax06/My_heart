import { useEffect, useState } from 'react'

interface DeviceCapability {
  isMobile: boolean
  isLowPower: boolean
  particleMultiplier: number
}

export function useDeviceCapability(): DeviceCapability {
  const [cap, setCap] = useState<DeviceCapability>(() => {
    const mobile = window.innerWidth < 768
    const lowPower = mobile || navigator.hardwareConcurrency <= 4
    return {
      isMobile: mobile,
      isLowPower: lowPower,
      particleMultiplier: lowPower ? 0.35 : 1,
    }
  })

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768
      const lowPower = mobile || navigator.hardwareConcurrency <= 4
      setCap({
        isMobile: mobile,
        isLowPower: lowPower,
        particleMultiplier: lowPower ? 0.35 : 1,
      })
    }
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])

  return cap
}
