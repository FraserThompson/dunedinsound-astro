import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { getEntryImages } from '@src/util/collection.ts'
import type { ArtistGigResponse } from "@src/util/helpers";

export const GET = (async ({ params, request }) => {
	const gigSlug = params.gigSlug

	if (!gigSlug) {
		return new Response(JSON.stringify({ error: 'wrong params' }), { status: 404 });
	}

	const gig = await getEntry("gig", gigSlug)

	if (!gig) {
		return new Response(JSON.stringify({ error: 'no gig' }), { status: 404 });
	}

	const images = await getEntryImages(gig)

	const resJson: ArtistGigResponse = {
		images,
		data: gig
	}

	return new Response(
		JSON.stringify(resJson),
	);
}) satisfies APIRoute;

export async function getStaticPaths() {

	const gigs = await getCollection('gig')

	return gigs.flatMap((gig) => ({
		params: { gigSlug: gig.id }
	}))

}
