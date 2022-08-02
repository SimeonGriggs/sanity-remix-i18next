import type {ActionFunction, LoaderFunction, MetaFunction} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {json} from '@remix-run/node'
import {Form} from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import {useLocale} from 'remix-i18next'
import {i18nCookie} from '~/cookies'
import i18nConfig, {supportedLngs} from '~/i18nextConfig'
import i18next from '~/i18next.server'

// This tells remix to load the "home" namespace
export let handle = {
  i18n: 'home',
}

export let meta: MetaFunction = ({data}) => {
  return {title: data.title}
}

export let loader: LoaderFunction = async ({request}) => {
  let t = await i18next.getFixedT(request, 'home')
  let title = t('title')

  return json({title})
}

export let action: ActionFunction = async ({request}) => {
  const bodyParams = await request.formData()
  const locale = bodyParams.get('locale')
  let cookie

  if (locale && supportedLngs.includes(String(locale))) {
    cookie = locale
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': await i18nCookie.serialize(cookie),
    },
  })
}

export default function Component() {
  let translation = useTranslation()
  const {t} = translation

  const locale = useLocale()

  return (
    <div>
      <Form method="post">
        {i18nConfig.supportedLngs.map((lng) => (
          <button key={lng} name="locale" value={lng} disabled={locale === lng} type="submit">
            {lng}
          </button>
        ))}
      </Form>
      <hr />
      <h1>{t('course.singular')}</h1>
      <p>
        <strong>{t('name', {ns: 'home'})}</strong>
        <br />
        <em>{t('title', {ns: 'home'})}</em>
      </p>
    </div>
  )
}
