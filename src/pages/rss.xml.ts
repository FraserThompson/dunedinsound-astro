import rss, { type RSSFeedItem } from '@astrojs/rss';
import { loadAndFormatCollection } from 'src/util/collection';
import { defaultMetaDescription, siteTitle } from 'src/util/seo';

export async function GET(context) {
	const gigs = await loadAndFormatCollection('gig')
	return rss({
		title: siteTitle,
		description: defaultMetaDescription,
		site: context.site,
		items: gigs.map((gig) => {
			const item: RSSFeedItem = {
				title: gig.entry.data.title,
				pubDate: gig.entry.data.date,
				description: gig.extra.metaDescription,
				link: gig.extra.absolutePath,
			}
			if (gig.extra.cover) {
				item.enclosure = {
					url: gig.extra.cover[0].src,
					length: 1000,
					type: 'image/jpeg',
				}
			}
			return item
		}
		)
	});
}
