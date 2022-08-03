import type {ActionFunction, LoaderFunction, MetaFunction} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {json} from '@remix-run/node'
import {Link} from '@remix-run/react'
import {useTranslation} from 'react-i18next'

import {i18nCookie} from '~/cookies'
import {supportedLngs} from '~/i18nextConfig'
import i18next from '~/i18next.server'

// This tells remix-i18n to load the "home" namespace
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

export let action: ActionFunction = async (props) => {
  const {request} = props
  const requestUrl = new URL(request.url)
  const bodyParams = await request.formData()

  const redirectPath = String(bodyParams?.get('redirect'))
  const locale = String(bodyParams?.get('locale'))
  let options = {}

  if (locale && supportedLngs.includes(locale)) {
    options = {
      headers: {
        'Set-Cookie': await i18nCookie.serialize(locale),
      },
    }
  }

  return redirect(redirectPath ?? requestUrl.pathname, options)
}

export default function Home() {
  let translation = useTranslation()
  const {t} = translation

  const legalPages = t('legalPages', {ns: 'home', returnObjects: true}) ?? []

  return (
    <div>
      <h1>{t('course.singular')}</h1>
      {legalPages && legalPages?.length > 0 ? (
        <section>
          {legalPages.map((page) => (
            <p key={page._id}>
              <Link to={`/legal/${page.slug.current}`}>{page.title}</Link>
            </p>
          ))}
        </section>
      ) : null}
    </div>
  )
}
