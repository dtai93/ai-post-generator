const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "AI POST GENERATOR", // Tên Mini App mới
    subtitle: "Generate trending crypto memes with AI 🚀",
    description: "AI-powered post generator: Hunt fresh memes from multiple sources, get degen captions, and post instantly on Base with a small tip 🔥",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["meme", "ai", "crypto", "degen", "base"],
    heroImageUrl: "https://i.ibb.co/7JWBHPf0/image.jpg", // Ảnh bìa đẹp: Bitcoin rocket to moon bull market (funny degen vibe)
    tagline: "Post trending memes instantly 🚀",
    ogTitle: "AI POST GENERATOR on Base",
    ogDescription: "Generate and post AI-suggested crypto memes with one tap 🔥",
    ogImageUrl: "https://i.ibb.co/7JWBHPf0/image.jpg", // OG image giống hero để hiển thị đẹp trên cast
  },
} as const;