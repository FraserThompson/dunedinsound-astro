import rss, { type RSSFeedItem } from '@astrojs/rss';
import { loadAndFormatCollection } from '@src/util/collection';
import { defaultMetaDescription, siteTitle } from '@src/util/seo';

export async function GET(context: any) {

	const gigs = await loadAndFormatCollection('gig')
	const blogs = await loadAndFormatCollection('blog')

	// Combine gigs and blogs and sorts them by date
	const posts = [...gigs, ...blogs]
	const combinedPosts = posts.sort((a, b) => {
		return new Date(a.entry.data.date) > new Date(b.entry.data.date) ? -1 : 1
	})

	const items = combinedPosts.map((post) => {
		const item: RSSFeedItem = {
			title: post.entry.data.title,
			pubDate: post.entry.data.date,
			description: post.extra.metaDescription,
			link: post.extra.absolutePath,
		}
		if (post.extra.cover) {
			item.enclosure = {
				url: post.extra.cover[0].src,
				length: 1000,
				type: 'image/jpeg',
			}
			item.customData = `<media:content url=${post.extra.cover[0].src} medium="image" />`
		}
		return item
	})

	return rss({
		title: siteTitle,
		description: defaultMetaDescription,
		site: context.site,
		items
	})
};

