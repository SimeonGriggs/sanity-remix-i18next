import {PortableText} from '@portabletext/react'
import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {Link, useLoaderData} from '@remix-run/react'
import groq from 'groq'
import {useTranslation} from 'react-i18next'
import ProseableText from '~/components/ProseableText'

import i18next from '~/i18next.server'
import {fallbackLng, supportedLngs} from '~/i18nextConfig'
import client from '~/sanity/client'
import {portableTextComponents} from '~/sanity/portableTextComponents'

// This tells remix-i18n to load the "legal" namespace
export let handle = {
  i18n: 'legal',
}

export let meta: MetaFunction = ({data}) => {
  return {title: data.title}
}

export let loader: LoaderFunction = async ({request, params}) => {
  // Here we query data directly from the loader
  // Because we need to use the params.slug to query the right document
  // ...it feels weird to fetch data in two ways :/

  // But we can still target the right locale with our query
  let locale = await i18next.getLocale(request)
  const queryParams = {language: locale, baseLanguage: fallbackLng, slug: params.slug}
  const content = await client.fetch(
    groq`*[_type == "legal" && slug.current == $slug][0]{
    ...,
    // Filter portable text blocks that belong to this market are not market specific
    content[_type != "marketContent" || (_type == "marketContent" && market == $language)]{
      ...,
      // filter inline blocks with the same conditions
      "children": children[_type != "marketContent" || (_type == "marketContent" && market == $language)]{
        ...
      }
    }
    }`,
    queryParams
  )

  const languageVersions = supportedLngs.reduce((acc, lng) => {
    return {[lng]: `/legal/${content.slug.current}`, ...acc}
  }, {})

  return json({content, languageVersions, queryParams})
}

export default function Legal() {
  const {content, queryParams} = useLoaderData()
  console.log(queryParams)

  return (
    <div className="grid grid-cols-1 gap-4 max-w-lg">
      <h1 className="text-3xl font-bold text-teal-800">{content.title}</h1>
      {content?.content?.length > 0 ? (
        <ProseableText value={content.content} components={portableTextComponents} />
      ) : null}
    </div>
  )
}
