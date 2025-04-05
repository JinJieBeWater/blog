import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  // Override the default config here
  site: {
    title: '锦的博客',
    subtitle: 'JinBlog',
    author: 'JinJieBeWater',
    description: 'JinJie\'s Blog，记录生活，记录成长',
    website: 'https://jinjiebewater-blog.vercel.app/',
    pageSize: 5,
    socialLinks: [
      {
        name: 'github',
        href: 'https://github.com/JinJieBeWater',
      },
      {
        name: 'rss',
        href: '/atom.xml',
      },
      {
        name: 'twitter',
        href: 'https://x.com/JinJieBeWater',
      },
    ],
    navLinks: [
      {
        name: 'Posts',
        href: '/',
      },
      {
        name: 'Archive',
        href: '/archive',
      },
      {
        name: 'Categories',
        href: '/categories',
      },
      {
        name: 'About',
        href: '/about',
      },
    ],
    categoryMap: [{ name: 'JinJieBeWater', path: 'JinJieBeWater' }],
    footer: [
      '© %year <a target="_blank" href="%website">%author</a>',
      'Theme <a target="_blank" href="https://github.com/Moeyua/astro-theme-typography">Typography</a> by <a target="_blank" href="https://moeyua.com">Moeyua</a>',
      'Proudly published with <a target="_blank" href="https://astro.build/">Astro</a>',
    ],
  },
  seo: {
    twitter: '@JinJieBeWater',
    meta: [],
    link: [],
  },
}
