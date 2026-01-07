import { defineConfig } from 'vitepress'
import { ThemeConfig } from './theme/config'

// https://vitepress.dev/reference/site-config
export default defineConfig<ThemeConfig>({
	title: "Satellite #ee+411",
	description: "zawa-ch. personal site",
	lang: 'ja',
	srcExclude: [
		'README.md',
	],
	assetsDir: 'public',
	themeConfig: {
		branding: {
			color: '#003f8e',
			logoSrc: '/assets/site-logo-symbol.svg',
			logoAlt: 'Satellite #ee+411 symbol',
			logoHeight: 25,
		},
		navigation: [
			{ href: '/', name: 'Home' },
			{ href: '/article/', name: 'Articles' },
			{ href: '/links', name: 'Links' },
		],
		footer: {
			copyright: 'Copyright 2025-2026 zawa-ch. All rights reserved.',
			message: '',
			navigation: [
				{ href: '/license', name: 'ライセンス' },
				{ href: '/infomation', name: 'このサイトについて' },
			]
		},
	},
	cleanUrls: true,
})
