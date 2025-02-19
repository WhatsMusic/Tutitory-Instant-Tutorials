import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
	images: {
		domains: ["images.pexels.com"]
	}
};

module.exports = withNextIntl(nextConfig);
export default nextConfig;
