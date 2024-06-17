import { useTranslation } from "react-i18next"

export default function MovieWeb() {
  const { t } = useTranslation();

  return  <div>
  <h1 className="my-3 text-lg font-semibold">
    {t("Video Website Support List")}
  </h1>
  <ul>
    <li>
      <a
        className="underline"
        target="_blank"
        href="https://mw.lonelil.ru"
      >
        https://mw.lonelil.ru
      </a>
    </li>
    <li>
      <a
        className="underline"
        target="_blank"
        href="https://movie-web-me.vercel.app"
      >
        https://movie-web-me.vercel.app
      </a>
    </li>
    <li className="mt-1 opacity-60">more websites updating...</li>
  </ul>
</div>
}