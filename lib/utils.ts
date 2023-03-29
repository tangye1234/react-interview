/**
 * Merge class names together.
 * @param classes
 */
export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export function abbreviatedNo(num: number) {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
}
