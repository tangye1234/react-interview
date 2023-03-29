import React from 'react'

export default function Menu<T extends keyof JSX.IntrinsicElements>({ as: As = 'div' as T, children, ...props }: React.ComponentPropsWithoutRef<T> & { as?: T }) {
  return React.createElement(As, props, children)
}

Menu.Title = function Title<T extends keyof JSX.IntrinsicElements>({ as: As = 'h2' as T, children, ...props }: React.ComponentPropsWithoutRef<T> & { as?: T }) {
  return React.createElement(As, props, children)
}

Menu.Root = function Root<T extends keyof JSX.IntrinsicElements>({ as: As = 'ul' as T, children, ...props }: React.ComponentPropsWithoutRef<T> & { as?: T }) {
  return React.createElement(As, props, children)
}

Menu.Item = function Item<T extends keyof JSX.IntrinsicElements>({ as: As = 'li' as T, children, ...props }: React.ComponentPropsWithoutRef<T> & { as?: T }) {
  return React.createElement(As, props, children)
}

// TODO: Add a Menu.Item component

// Compound Components, I don't understand the exact requirement,
// but I think to abstract the Menu component to be more reusable,
// we can use compound components, so that we can use the Menu component in different ways,
// for example, we can use it as a wrapper for the Comobox.Options and Option.