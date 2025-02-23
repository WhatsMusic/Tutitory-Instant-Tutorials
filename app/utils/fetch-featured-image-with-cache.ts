"use client";

export async function fetchFeaturedImageWithCache(
	query: string
): Promise<string | null> {
	// Eindeutigen Key für localStorage festlegen
	const localKey = `featuredImage:${query}`
		.replace(/\s+/g, "_")
		.toLowerCase();

	// 1) Im Browser: Check, ob schon im localStorage vorhanden
	if (typeof window !== "undefined") {
		const cachedUrl = localStorage.getItem(localKey);
		if (cachedUrl) {
			// Bereits im Cache → direkt zurückgeben
			return cachedUrl;
		}
	}

	// 2) Nichts im Cache: Pexels-API-Aufruf
	const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
		query
	)}&per_page=1`;
	const res = await fetch(url, {
		headers: {
			Authorization: process.env.PEXELS_API_KEY!
		}
	});

	if (!res.ok) {
		console.error("Error fetching image from Pexels:", res.statusText);
		return null;
	}

	const data = await res.json();
	if (data.photos && data.photos.length > 0) {
		// Wähle z.B. das "large"-Bild
		const imageUrl = data.photos[0].src.large;

		// 3) Nun im localStorage ablegen (nur im Browser!)
		if (typeof window !== "undefined") {
			localStorage.setItem(localKey, imageUrl);
		}
		return imageUrl;
	}

	return null;
}
