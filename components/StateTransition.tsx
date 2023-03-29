'use client'

import { useIsoMorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { cloneElement, createRef, DependencyList, ReactElement, Ref, useImperativeHandle, useMemo, useRef } from 'react'

export type StateTransitionProps = {
  state: DependencyList
  orientation?: 'horizontal' | 'vertical'
  children: ReactElement
}

export function StateTransition({ state, children, orientation = 'vertical' }: StateTransitionProps) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const stateLengthRef = useRef(state.length)
    if (stateLengthRef.current !== state.length) {
      console.warn('state props is a dependency list, whose length should be static')
    }
  }

  const ref = useRef<HTMLElement>(null)

  const oref: Ref<HTMLElement | null> = useMemo(
    () => children.props.ref || createRef<HTMLElement>(),
    [children.props.ref]
  )

  useImperativeHandle(oref, () => ref.current)

  const startHeightRef = useRef(0)
  const startWidthRef = useRef(0)

  function syncStart() {
    if (ref.current) {
      startHeightRef.current = ref.current.offsetHeight
      startWidthRef.current = ref.current.offsetWidth
    }
  }

  const deps = [...state, orientation]

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(syncStart, deps)

  // fix first time height tracking, to avoid animation when appeared
  useIsoMorphicLayoutEffect(syncStart, [])

  useIsoMorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }

    const prop = orientation === 'vertical' ? 'height' : 'width'

    const style = el.style
    style.transition = 'none'
    const setToEnd = () => {
      style.removeProperty(prop)
      style.removeProperty('overflow')
      el.ontransitionend = null
      el.ontransitioncancel = null
    }

    const start = prop === 'height' ? startHeightRef.current : startWidthRef.current
    const end = prop === 'height' ? el.offsetHeight : el.offsetWidth
    const changed = start !== end

    if (changed) {
      el.ontransitioncancel = setToEnd
      el.ontransitionend = setToEnd
      style[prop] = `${start}px`
      el.getBoundingClientRect()
      style.removeProperty('transition')
      style[prop] = `${end}px`
      style.overflow = 'hidden'
    } else {
      style.removeProperty('transition')
      setToEnd()
    }
  }, deps)

  return cloneElement(children, { ref })
}
