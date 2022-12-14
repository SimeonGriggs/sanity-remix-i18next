import React from 'react'
import {Link} from '@remix-run/react'

export default function Reference({children, mark}) {
  const asPath = ``

  if (!children) {
    return null
  }

  // This is _crude_
  const link = mark?.slug?.current
    ? asPath.split(`/`).slice(0, -1).filter(Boolean).concat(mark.slug.current).join(`/`)
    : null

  return link ? (
    <Link to={link}>
      <a>{children}</a>
    </Link>
  ) : (
    <span>{children}</span>
  )
}
