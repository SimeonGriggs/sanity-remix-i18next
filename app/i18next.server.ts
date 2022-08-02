import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import i18nextConfig from '~/i18nextConfig'; // your i18n configuration file
import { i18nCookie } from './cookies';

let i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18nextConfig.supportedLngs,
    fallbackLanguage: i18nextConfig.fallbackLng,
    cookie: i18nCookie
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18nextConfig,
    // backend: {
    // loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    // },
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: Backend,
});

export default i18next;
