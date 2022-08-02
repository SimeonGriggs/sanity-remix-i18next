import groq from "groq";
import sanityClient from "~/sanityClient";

export const supportedLngs = ["en_US", "no", "nl"];
const fallbackLng = supportedLngs[0];

type KVObject = { key: string; text: string };

export async function loadResources(lng: string, ns: string) {
  let data;

  if (ns === "common") {
    data = await sanityClient.fetch(
      groq`*[_id == "labelGroup"][0].labels[]{
      key,
      // Pick language-specific object item
      "text": coalesce(text[$language], text[$baseLanguage]),
    }`,
      { language: lng, baseLanguage: fallbackLng }
    );
  } else if (ns === "home") {
    data = await sanityClient.fetch(
      groq`*[_type == "presenter"][0]{
          name,
          // Pick language-specific array item
          "title": coalesce(title[_key == $language][0].value, title[_key == $baseLanguage][0].value)
      }`,
      { language: lng, baseLanguage: fallbackLng }
    );
  }

  // Convert array of KV objects to a single object
  const keyedData = Array.isArray(data)
    ? data.reduce((acc: { [key: string]: string }, item: KVObject) => {
        acc[item.key] = item.text;
        return acc;
      }, {})
    : data;

  return keyedData;
}

export default {
  supportedLngs,
  fallbackLng,
  defaultNS: "common",
  react: { useSuspense: false },
  backend: {
    loadPath: "{{lng}}|{{ns}}",
    request: (options, url, payload, callback) => {
      try {
        const [lng, ns] = url.split("|");
        console.log({ lng, ns });
        loadResources(lng, ns).then((response) => {
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
  },
};
