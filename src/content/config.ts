import { z, defineCollection, reference } from "astro:content";

// Gig
const gigVid = z.object({
  link: z.string(),
  title: z.string().optional(),
});

const gigTrack = z.object({
  title: z.string(),
  time: z.string(),
  link: z.string().optional(),
});

const gigArtistMedia = z.object({
  id: reference("artist"),
  vid: z.array(gigVid).optional(),
  tracklist: z.array(gigTrack).optional(),
});

const Gig = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
		date: z.date(),
    venue: reference("venue"),
    artists: z.array(gigArtistMedia),
    description: z.string().optional(),
    intro: z.string().optional(),
    feature_vid: z.string().optional(),
    audioOnly: z.boolean().optional(),
  }),
});

// Venues
const artistAudioculture = z.object({
  link: z.string(),
  snippet: z.string(),
  image: z.string().optional(),
});

const webLinks = z.object({
  facebook: z.string().optional(),
  bandcamp: z.string().optional(),
  website: z.string().optional(),
  soundcloud: z.string().optional(),
  instagram: z.string().optional(),
  spotify: z.string().optional(),
  audioculture: artistAudioculture.optional(),
});

const Venue = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    lat: z.number(),
    lng: z.number(),
    description: z.string().optional(),
    links: webLinks.optional(),
    died: z.date().optional(),
		hidden: z.boolean().optional()
  }),
});

// Artist
const Artist = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    links: webLinks.optional(),
    origin: z.string().optional(),
    died: z.date().optional(),
		hidden: z.boolean().optional()
  }),
});

// Blog
const Blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
		date: z.date(),
		author: z.string(),
		tags: z.array(z.string()),
		featureMode: z.boolean().optional(),
		hideCaptions: z.boolean().optional()
  }),
});

// Vault Session
const VaultSession = defineCollection({
  type: "data",
  schema: z.object({
		date: z.date(),
    title: z.string(),
		artist: reference("artist"),
		full_video: z.string(),
		description: z.string(),
		tracklist: z.array(gigTrack).optional(),
  }),
});


// Manifest
const imageVariants = z.array(z.string());
const fileList = z.record(z.string(), imageVariants.optional())
const media = z.object({
  images: fileList.optional(),
  audio: fileList.optional()
})
const artistDirectory = z.record(z.string(), media)
// const Manifest = defineCollection({
//     type: "data",
//     schema: z.record(z.string(), artistDirectory),
//   });

export const collections = {
  gig: Gig,
  venue: Venue,
  artist: Artist,
	blog: Blog,
	vaultsession: VaultSession
  //manifest: Manifest
};
