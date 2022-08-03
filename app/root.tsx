import type {LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Outlet,
} from '@remix-run/react'
import {useChangeLanguage} from 'remix-i18next'
import {useTranslation} from 'react-i18next'

import i18next from '~/i18next.server'
import i18nConfig from '~/i18nextConfig'
import Header from '~/components/Header'

type LoaderData = {locale: string}

export let loader: LoaderFunction = async ({request}) => {
  let locale = await i18next.getLocale(request)

  return json<LoaderData>({locale})
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: i18nConfig.defaultNS,
}

export default function Root() {
  // Get the locale from the loader
  let {locale} = useLoaderData<LoaderData>()

  let {i18n} = useTranslation()

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation data
  useChangeLanguage(locale)

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
      </head>
      <body className="bg-white p-6 md:p-12">
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
