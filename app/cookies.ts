import {createCookie} from '@remix-run/node' // or cloudflare/deno

export const i18nCookie = createCookie('locale', {
  maxAge: 604_800, // one week
})
