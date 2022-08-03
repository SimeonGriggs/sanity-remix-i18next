import groq from 'groq'
import type {BackendOptions, RequestCallback} from 'i18next-http-backend'

import client from '~/sanity/client'

export const supportedLngs = ['en_US', 'no', 'nl']
export const fallbackLng = supportedLngs[0]

export async function loadResources(lng: string, ns: string) {
  let data = {}
  const queryParams = {language: lng, baseLanguage: fallbackLng, slug: `yeah`}

  if (ns === 'common') {
    type KVObject = {key: string; text: string}

    const labelArray = (await client.fetch(
      groq`*[_id == "labelGroup"][0].labels[]{
        key,
        // Pick language-specific object item
        "text": coalesce(text[$language], text[$baseLanguage]),
      }`,
      queryParams
    )) as KVObject[]

    // Convert array of KV objects into a single object
    if (labelArray.length) {
      data = labelArray.reduce((acc: {[key: string]: string}, item: KVObject) => {
        return {[item.key]: item.text, ...acc}
      }, {})
    }
  } else if (ns === 'home') {
    data = await client.fetch(
      groq`{
        "legalPages": *[_type == "legal" && defined(slug.current) && !(_id in path("drafts.**"))]{ _id, title, slug },
        "title": "Course Platform"
      }`,
      queryParams
    )
  }

  return data
}

export default {
  supportedLngs,
  fallbackLng,
  defaultNS: 'common',
  react: {useSuspense: false},
  backend: {
    loadPath: '{{lng}}|{{ns}}',
    request: (
      options: BackendOptions,
      url: string,
      payload: unknown,
      callback: RequestCallback
    ) => {
      try {
        const [lng, ns] = url.split('|')
        loadResources(lng, ns).then((response) => {
          callback(null, {
            data: response,
            status: 200,
          })
        })
      } catch (e) {
        console.error(e)
        callback(null, {
          data: `${e}`,
          status: 500,
        })
      }
    },
  },
}
