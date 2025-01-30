export const metadata = {
	title: "Imprint - Tutitory",
	description:
		"The imprint of Tutitory with all legally required information."
};

export default function Imprint() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Imprint</h1>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">
					Information according to § 5 TMG:
				</h2>
				<p>Robert Schulz</p>
				<p>Leipziger Str. 18</p>
				<p>04720 Döbeln</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">Contact:</h2>
				<p>
					Email:{" "}
					<a
						href="mailto:info@whatsmusic.de"
						className="text-blue-500"
					>
						info@whatsmusic.de
					</a>
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">
					Liability for Content
				</h2>
				<p>
					As a service provider, we are responsible for our own
					content on these pages in accordance with § 7 para.1 TMG
					(General German Telemedia Act) according to general laws.
					However, according to §§ 8 to 10 TMG, we as a service
					provider are not obligated to monitor transmitted or stored
					third-party information or to investigate circumstances
					that indicate illegal activity.
				</p>
				<p>
					Obligations to remove or block the use of information
					according to general laws remain unaffected by this.
					However, liability in this regard is only possible from the
					time of knowledge of a specific legal violation. Upon
					becoming aware of such violations, we will remove this
					content immediately.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">
					Liability for Links
				</h2>
				<p>
					Our website contains links to external third-party websites,
					on whose contents we have no influence. Therefore, we
					cannot assume any liability for these external contents. The
					respective provider or operator of the pages is always
					responsible for the contents of the linked pages. The
					linked pages were checked for possible legal violations at
					the time of linking. Illegal contents were not recognizable
					at the time of linking.
				</p>
				<p>
					A permanent content control of the linked pages is,
					however, not reasonable without concrete indications of a
					legal violation. If we become aware of any legal
					violations, we will remove such links immediately.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">Copyright</h2>
				<p>
					The content and works created by the site operators on these
					pages are subject to German copyright law. The
					duplication, editing, distribution, and any kind of use
					outside the limits of copyright require the written consent
					of the respective author or creator. Downloads and copies
					of this page are only permitted for private, non-commercial
					use.
				</p>
				<p>
					If the content on this site was not created by the
					operator, the copyrights of third parties are respected. In
					particular, third-party content is marked as such. Should
					you nevertheless become aware of a copyright infringement,
					please notify us accordingly. Upon becoming aware of legal
					violations, we will remove such content immediately.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">
					Dispute Resolution
				</h2>
				<p>
					The European Commission provides a platform for
					online dispute resolution (ODR):{" "}
					<a
						href="https://ec.europa.eu/consumers/odr"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500"
					>
						https://ec.europa.eu/consumers/odr
					</a>
					.
				</p>
				<p>Our email address can be found above in the imprint.</p>
				<p>
					We are neither willing nor obliged to participate in dispute
					resolution proceedings before a consumer arbitration board.
				</p>
			</section>
		</div>
	);
}
