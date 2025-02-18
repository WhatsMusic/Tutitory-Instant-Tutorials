import { useTranslations } from 'next-intl';

export default function Imprint() {
	const t = useTranslations('Imprint');

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">{t('information')}</h2>
				<p>
					{t('name')}<br />
					{t('street')}<br />
					{t('plz')}<br />
					<a href={`mailto:${t('email')}`}>{t('email')}</a>
				</p>
			</section>
			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">{t('disclaimer')}</h2>
				<p>{t('disclaimerText')}</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">{t('liability')}</h2>
				<p>{t('liabilityText')}</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">{t('copyright')}</h2>
				<p>{t('copyrightText')}</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">{t('dataProtection')}</h2>
				<p>{t('dataProtectionText')}</p>
			</section>
		</div>
	);

}