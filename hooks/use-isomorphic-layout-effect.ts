import { useEffect, useLayoutEffect } from 'react'

export const useIsoMorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect