// Breadcrumbs.tsx
import React from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
  text: string
  href?: string
}

type PropsType = {
  items: BreadcrumbItem[]
}

const Breadcrumbs = ({ items }: PropsType) => {
  return (
    <nav aria-label="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href}>{item.text}</Link>
          ) : (
            <span>{item.text}</span>
          )}
          /
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
