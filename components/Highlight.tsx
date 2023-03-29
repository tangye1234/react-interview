import React, { memo, useDeferredValue, useMemo, useRef } from "react"

export type HighlightProps = {
  children: string
  keyword: string
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// function escapeReplacement(string: string) {
//   return string.replace(/\$/g, '$$$$')
// }

export default memo(function Highlight({ children, keyword }: HighlightProps) {
  const key = useDeferredValue(keyword)
  const ref = useRef<HTMLSpanElement>(null!)
  
  const split = useMemo(() => {
    if (key.length < 1) {
      return [children]
    }
    const sscaped = escapeRegExp(key)
    return children.split(new RegExp(`(?=${sscaped})|(?<=${sscaped})`, 'ig'))
  }, [key, children])
  
  return (
    <span ref={ref}>
      {split.map((s, i) => (
        <span key={i} className={i % 2 === 1 ? 'rounded-sm text-white bg-slate-500/80 ring-1 ring-slate-500/80' : undefined}>
          {s}
        </span>
      ))}
    </span>
  )
})
