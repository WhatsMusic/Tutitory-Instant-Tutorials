import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocaleType } from "@/types";

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment

	let locale: LocaleType = (await requestLocale) as LocaleType;
	if (!locale || !routing.locales.includes(locale as LocaleType)) {
		locale = routing.defaultLocale;
	}
	const messages = await import(`@/messages/${locale}.json`);

	return { locale, messages: messages.default };
});
