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
import {i18nCookie} from '~/cookies'

type LoaderData = {locale: string; cookie: string}

export let loader: LoaderFunction = async ({request}) => {
  let locale = await i18next.getLocale(request)

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await i18nCookie.parse(cookieHeader)) || ``

  return json<LoaderData>({locale, cookie})
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
  let {locale, cookie} = useLoaderData<LoaderData>()
  console.log({locale, cookie})

  let {i18n} = useTranslation()

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale)

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
