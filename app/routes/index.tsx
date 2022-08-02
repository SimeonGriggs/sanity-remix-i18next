import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage, useLocale } from "remix-i18next";
import { i18nCookie } from "~/cookies";
import i18nConfig from "~/i18nextConfig";
import i18next from "~/i18next.server";

// This tells remix to load the "home" namespace
export let handle = {
  i18n: "home",
};

export let meta: MetaFunction = ({ data }) => {
  return { title: data.title };
};

export let loader: LoaderFunction = async ({ request }) => {
  let t = await i18next.getFixedT(request);
  let title = t("My page title");

  return json({ title });
};

export let action: ActionFunction = async ({ request }) => {
  const bodyParams = await request.formData();
  const cookie = bodyParams.get("locale")

  return redirect("/", {
    headers: {
      "Set-Cookie": await i18nCookie.serialize(cookie),
    },
  });
};

export default function Component() {
  const data = useLoaderData()
  console.log(data);

  let translation = useTranslation();
  const { t } = translation;

  const locale = useLocale();

  return (
    <div>
      {i18nConfig.supportedLngs.map((lng) => (
        <Form key={lng} method="post">
          <input type="hidden" name="locale" value={lng} />
          <button disabled={locale === lng} type="submit">{lng}</button>
        </Form>
      ))}
      <hr />
      <h1>
        {locale}: {t("greeting")}
      </h1>
    </div>
  );
}
