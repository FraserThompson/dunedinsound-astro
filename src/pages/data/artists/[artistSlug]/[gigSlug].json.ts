import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { getEntryImages } from 'src/util/collection.ts'
import type { ArtistGigResponse } from "src/util/helpers";

export const GET = (async ({ params, request }) => {
	const artistSlug = params.artistSlug
	const gigSlug = params.gigSlug

	if (!gigSlug || !artistSlug) {
		return new Response(JSON.stringify({ error: 'wrong params' }), { status: 404 });
	}

	const gig = await getEntry("gig", gigSlug)

	if (!gig) {
		return new Response(JSON.stringify({ error: 'no gig' }), { status: 404 });
	}

	const hasArtist = gig.data.artists?.some((a) => a.id.id === artistSlug)
	if (!hasArtist) {
		return new Response(JSON.stringify({ error: 'artist not on gig' }), { status: 404 })
	}

	const images = await getEntryImages(gig, artistSlug)
	const data = gig.data

	const resJson: ArtistGigResponse = {
		images,
		data
	}

	return new Response(
		JSON.stringify(resJson),
	);
}) satisfies APIRoute;

export async function getStaticPaths() {

	const gigs = await getCollection('gig')

	const countByArtist = new Map<string, number>()
	for (const gig of gigs) {
		for (const a of gig.data.artists ?? []) {
			const id = a.id.id
			countByArtist.set(id, (countByArtist.get(id) ?? 0) + 1)
		}
	}

	return gigs.flatMap((gig) =>
		(gig.data.artists ?? [])
			.map((a) => a.id.id)
			.filter((artistId) => (countByArtist.get(artistId) ?? 0) >= 5)
			.map((artistId) => ({
				params: { artistSlug: artistId, gigSlug: gig.id }
			}))
	)

}
