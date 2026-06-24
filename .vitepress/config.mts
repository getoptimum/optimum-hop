import { defineConfig } from 'vitepress'

const { BASE: base = "/" } = process.env;
const withBase = (path: string) => `${base}${path.replace(/^\//, "")}`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
title: 'HOP Docs',
  description: 'The fastest way to experience Optimum',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  base: base,
  markdown: {
    math: true,
  },
  srcExclude: [
    "README.md"
  ],
  sitemap: {
    hostname: "https://docs.getoptimum.xyz",
  },
  head: [
    [
      "link",
      { rel: "icon", href: withBase("/favicons/favicon.svg"), type: "image/svg+xml" },
    ],
    ["link", { rel: "icon", href: withBase("/favicons/favicon-96x96.png"), type: "image/png" }],
    [
      "link",
      {
        rel: "shortcut icon",
        href: withBase("/favicons/favicon.ico"),
        type: "image/x-icon",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#fff" }],
    ["meta", { name: "theme-color", content: "#fff" }],
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
    ],
    [
      "meta",
      {
        property: "description",
        content:"Optimum HOP — the fastest way to experience Optimum's mumP2P. Quickstart bundles for Ethereum and beyond."
      },
    ],
    ["meta", { httpEquiv: "Content-Language", content: "en" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@get_optimum" }],
    ["meta", { name: "twitter:site:domain", content: "docs.getoptimum.xyz" }],
    ["meta", { name: "twitter:url", content: "https://docs.getoptimum.xyz" }],
    ["meta", { name: "twitter:image:alt", content: "Optimum Documentation" }],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Optimum HOP" }],
    ["meta", { property: "og:url", content: "https://docs.getoptimum.xyz" }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    ["meta", { property: "og:image:type", content: "image/png" }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: nav(),

    sidebar: {
      "/": sidebarHome(),
    },

    outline: {
      level: "deep",
    },

    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },

    logo: {
      alt: "Optimum Logo",
      light: "/logo-light.png",
      dark: "/logo-dark.png",
    },
    logoLink: "https://docs.getoptimum.xyz/",

    siteTitle: false,

    socialLinks: [
      { icon: "github", link: "https://github.com/getoptimum/optimum-hop" },
      { icon: "x", link: "https://x.com/get_optimum" },
      { icon: "discord", link: "https://discord.gg/7EwFpu79cZ" },
    ],
  }
})

function sidebarHome() {
  return [
    {
      text: "Documentation",
      collapsed: false,
      items: [
        {
          text: "Complete Setup Guide",
          link: "/docs/",
        },
      ],
    },
    {
      text: "Research",
      collapsed: false,
      items: [
        {
          text: "mump2p",
          link: "https://docs.getoptimum.xyz/docs/research/gossip/gossip",
        },
      ],
    },
  ]
}
