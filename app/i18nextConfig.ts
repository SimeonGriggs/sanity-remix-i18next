import sanityClient from "~/sanityClient";

type KVObject = { key: string, text: string };

export async function loadResources(lng: string) {
  const data = await sanityClient.fetch(
    `*[_id == "labelGroup"][0].labels[]{
      key,
      "text": coalesce(text[$language], text[$baseLanguage]),
      "allText": text
    }`,
    { language: lng, baseLanguage: "en" }
  )
  
  // Convert array of KV objects to object
  const keyedData = data.reduce((acc: {[key: string]: string}, item: KVObject) => {
    acc[item.key] = item.text;
    return acc;
  }, {});

  return keyedData;
}

const supportedLngs = ['en_US', 'no', 'nl']

export default {
  supportedLngs,
  fallbackLng: supportedLngs[0],
  defaultNS: 'common',
  react: {useSuspense: false},
  backend: {
    loadPath: "{{lng}}|{{ns}}",
    request: (options, url, payload, callback) => {
      try {
        const [lng, ns] = url.split("|");
        console.log({ end: `back`, lng, ns });
        loadResources(lng).then((response) => {
          callback(null, {
            data: response,
            status: 200,
          });
        });
      } catch (e) {
        console.error(e);
        callback(null, {
          data: `${e}`,
          status: 500,
        });
      }
    },
  }
};
