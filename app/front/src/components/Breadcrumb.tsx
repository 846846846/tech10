// Breadcrumbs.tsx
import React from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
  text: string
  href?: string
}

type PropsType = {
  items: BreadcrumbItem[]
  styles: any
}

const Breadcrumbs = ({ items, styles }: PropsType) => {
  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
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
