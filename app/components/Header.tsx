import React from 'react'
import {Form, Link, useMatches} from '@remix-run/react'
import {useLocale} from 'remix-i18next'

import {supportedLngs} from '~/i18nextConfig'

export default function Header() {
  // Find alternate versions of this page
  const {languageVersions} =
    useMatches().find((match) => 'languageVersions' in match.data)?.data ?? {}

  // Get current locale to disable current button
  const locale = useLocale()

  return (
    <header className="bg-teal-50 mb-6 flex items-center gap-4 md:-mx-3 p-3 rounded-lg">
      <small className="text-teal-500 flex-1">
        <Link to="/">
          <strong>Course Platform</strong>
        </Link>
      </small>
      <div className="flex gap-2">
        {supportedLngs.map((lng) => (
          <Form key={lng} method="post" action="/?index">
            <input type="hidden" name="redirect" value={languageVersions[lng]} />
            <button
              className="bg-teal-500 text-white font-medium p-2 rounded text-xs disabled:opacity-50"
              name="locale"
              value={lng}
              disabled={locale === lng}
              type="submit"
            >
              {lng.toUpperCase()}
            </button>
          </Form>
        ))}
      </div>
    </header>
  )
}
