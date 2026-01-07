<template>
	<noscript class="noscript-foot">
		おっと! JavaScript を無効にしているようです。
		このままでも閲覧は可能ですが、すべての機能を利用可能にするためには JavaScript を有効にしてください。
	</noscript>
	<HamburgerMenu v-if="isNarrowView || drawing" class="site-menu" @activate="drawing = !drawing" />
	<SiteDrawer v-model:drawing="drawing" />
	<SiteHeader :progress="progress.progress.value" />
	<HomeLayout v-if="frontmatter.layout === 'home'" />
	<ArticleLayout v-else-if="frontmatter.layout === 'article-index'" />
	<MdplaygroundLayout v-else-if="frontmatter.layout === 'markdown-playground'" />
	<DefaultLayout v-else />
	<SiteFooter />
</template>

<script setup lang="ts">
import { useData, useRouter } from 'vitepress'
import { ref } from 'vue';
import { useResponsive } from './composables/responsive';
import { useLoadProgressState } from './composables/load-progress'
import HamburgerMenu from './lcomponents/hamburger-menu.vue';
import SiteDrawer from './lcomponents/site-drawer.vue';
import SiteHeader from './lcomponents/site-header.vue';
import HomeLayout from './layouts/home-layout.vue';
import ArticleLayout from './layouts/article-layout.vue';
import MdplaygroundLayout from './layouts/mdplayground-layout.vue';
import DefaultLayout from './layouts/default-layout.vue'
import SiteFooter from './lcomponents/site-footer.vue';
import { useSelfXSSWarning } from './composables/selfxss-warning';

const { frontmatter } = useData();
const router = useRouter();
const { isNarrowView } = useResponsive();
const progress = useLoadProgressState();
useSelfXSSWarning();
const drawing = ref<boolean>(false);

router.onBeforePageLoad = () => {
	progress.progress.value = 0.1;
};
router.onAfterPageLoad = () => {
	progress.complete();
	drawing.value = false;
};
</script>

<style lang="css">
/* サイト内の基本CSS */
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap');

/*
 * プロパティと既定値の定義
 */
:root {
	--color--base: #003f8e;

	--scale-x00: 100.0%;
	--scale-xFF: 84.09%;
	--scale-xFE: 70.71%;
	--scale-xFD: 59.46%;
	--scale-xFC: 50.00%;
	--scale-xFB: 42.04%;
	--scale-xFA: 35.36%;
	--scale-xF9: 29.73%;
	--scale-xF8: 25.00%;
	--scale-xF7: 21.02%;
	--scale-xF6: 17.68%;
	--scale-xF5: 14.87%;
	--scale-xF4: 12.50%;
	--scale-xF3: 10.51%;
	--scale-xF2: 8.839%;
	--scale-xF1: 7.433%;

	--color--bg: hsl(from var(--color--base) h var(--scale-xF4) var(--scale-xF6));
	--color--bg-light1: hsl(from var(--color--bg) h s var(--scale-xF7));
	--color--bg-light2: hsl(from var(--color--bg) h s var(--scale-xF8));
	--color--bg-light3: hsl(from var(--color--bg) h s var(--scale-xF9));
	--color--bg-light4: hsl(from var(--color--bg) h s var(--scale-xFA));
	--color--bg-dark1: hsl(from var(--color--bg) h s var(--scale-xF5));
	--color--bg-dark2: hsl(from var(--color--bg) h s var(--scale-xF4));
	--color--fg: hsl(from var(--color--base) h var(--scale-xF4) var(--scale-xFF));
	--color--fg-dark1: hsl(from var(--color--base) h var(--scale-xF4) var(--scale-xFE));
	--color--shadow: hsl(from var(--color--bg) h s var(--scale-xF3));
	--color--accent-fg: hsl(from var(--color--bg) h var(--scale-x00) var(--scale-xFE));
	--color--accent-bg: hsl(from var(--color--bg) h var(--scale-x00) var(--scale-xF6));

	--color--error-bg: hsl(0 var(--scale-xFE) var(--scale-xF6));
	--color--caution-bg: var(--color--error-bg);
	--color--danger-bg: var(--color--error-bg);
	--color--warning-bg: hsl(40 var(--scale-xFE) var(--scale-xF6));
	--color--info-bg: hsl(220 var(--scale-xFE) var(--scale-xF6));
	--color--note-bg: var(--color--info-bg);
	--color--tip-bg: hsl(100 var(--scale-xFE) var(--scale-xF6));
	--color--important-bg: hsl(280 var(--scale-xFE) var(--scale-xF6));
	--color--add-bg: hsl(120 var(--scale-xFE) var(--scale-xF6));
	--color--del-bg: hsl(20 var(--scale-xFE) var(--scale-xF6));

	--color--black: hsl(0deg, 0%, 0%);
	--color--white: hsl(0deg, 0%, 100%);

	background: var(--color--bg);
	color: var(--color--fg);

	--font-family--default: 'Roboto', 'BIZ UDPGothic', 'Noto Sans CJK JP', 'Noto Sans', sans-serif;
	--font-family--monospace: 'Inconsolata Nerd Font', 'Inconsolata', monospace;
	font: 16px/1.25 var(--font-family--default);
}

body {
	padding: 0px;
	margin: 0px;
}

/*
 * コンテンツ区分
 * includes: address, article, aside, footer, header, h1, h2, h3, h4, h5, h6, hgroup, main, nav, section, search
 */
h1 {
	display: block;
	padding-inline: 16px;
	border-inline-start: 4px solid var(--color--fg);
	margin-block: 16pt;
	margin-inline: 8px;
	font: 600 2em/1.5 var(--font-family--default);
}

h2 {
	display: block;
	padding-inline: 0.25em;
	font: 600 1.5em/1.5 var(--font-family--default);
	border-block-end: 1px solid var(--color--fg);
	margin-block: 1em;
}

h3 {
	display: block;
	font: 600 1.2em/1.5 var(--font-family--default);
	padding-inline-start: 0.5em;
	border-inline-start: 0.25em solid var(--color--bg-light3);
	margin-block: 0.5em;
}

h4 {
	display: block;
	font: 600 1em/1.5 var(--font-family--default);
	padding-inline-start: 0.5em;
	border-inline-start: 0.25em solid var(--color--bg-light3);
	margin-block: 0.5em;
}

h5 {
	display: block;
	font: 600 0.9em/1.5 var(--font-family--default);
	padding-inline-start: 0.5em;
	border-inline-start: 0.25em solid var(--color--bg-light3);
	margin-block: 0.5em;
}

h6 {
	display: block;
	font: 600 0.9em/1.5 var(--font-family--default);
	margin-block: 0.5em;
}

a.header-anchor {
	display: inline-block;
	font-size: 0.8rem;
	aspect-ratio: 1;
}

a.header-anchor::after {
	content: "»";
	color: var(--color--fg);
}

/*
 * テキストブロック
 * includes: blockquote, dd, div, dl, dt, figcaption, figure, hr, li, menu, ol, p, pre, ul
 */
p,
dl,
ul,
ol {
	display: block;
	margin-block: 1em;
	line-height: 1.75;
}

blockquote {
	display: block;
	padding-inline-start: 2rem;
	padding-inline-end: 1rem;
	border-inline-start: 0.5em solid var(--color--bg-light4);
	margin-inline: 0;
	margin-block: 0.5em;
}

hr {
	display: block;
	border: none;
	border-bottom: 1px solid var(--color--bg-light4);
	margin-block: 8pt;
	margin-inline: auto;
	overflow: hidden;
	color: var(--color--bg-light4);
}

pre {
	display: block;
	border-radius: 8px;
	padding: 8px;
	background: var(--color--bg-dark2);
	font-family: var(--font-family--monospace);
}

pre code {
	border-radius: 0;
	padding-inline: 0;
	background: unset;
	font-family: inherit;
}

/*
 * インラインテキスト
 * includes: a, abbr, b, bdi, bdo, br, cite, code, data, dfn, em, i, kbd, mark, q, rp, rt, ruby, s, samp, small, span, strong, sub, sup, time, u, var, wbr
 */
a {
	display: inline;
	color: var(--color--accent-fg);
	font-weight: 600;
	text-decoration: none;
}

mark {
	color: var(--color--fg);
	background-color: var(--color--accent-bg);
}

/*
 *
 */
img {
	display: inline-block;
	max-width: 100%;
	overflow: auto;
}

/*
 *
 */
table {
	display: table;
	margin-inline: auto;
	margin-block: 8pt;
	border-collapse: collapse;
	border-spacing: 0;
	padding-inline: 4pt;
	background: var(--color--bg-dark1);
	overflow-x: auto;
}

table>thead {
	border-block-end: 2px solid var(--color--bg-light2);
	padding-block-end: 4px;
	background: var(--color--bg-dark2);
}

th,
td {
	padding-inline: 4pt;
	padding-block: 2pt;
}

th {
	vertical-align: bottom;
}

tbody>tr:nth-of-type(even) {
	background-color: hsl(from var(--color--bg) h s l /75%);
}

/*
 *
 */
code {
	display: inline;
	border-radius: 4px;
	padding-inline: 4px;
	background: var(--color--bg-dark2);
	font-family: var(--font-family--monospace);
}

div[class*="language-"] {
	display: grid;
	grid-template-columns: min-content 1fr;
	margin-block: 1rem;
	border: 1px solid var(--color--bg);
	border-radius: 8px;
	background: var(--color--bg-dark1);
	overflow: hidden;
}

div[class*="language-"]>button.copy {
	grid-row: 1;
	width: min-content;
	grid-column: 1;
	margin-block: 4px;
	margin-inline: 8px;
	background: var(--color--bg-dark1);
	border: none;
}

div[class*="language-"]>button.copy::before {
	content: "◻";
	color: var(--color--fg);
	transition: color 5s ease-in-out;
	text-wrap: nowrap;
}

div[class*="language-"]>button.copy.copied::before {
	content: "◼";
	color: var(--color--accent-fg);
	transition: none;
}

div[class*="language-"]>span.lang {
	grid-row: 1;
	grid-column: 2;
	margin-inline: 8px;
	align-self: center;
	font-family: var(--font-family--monospace);
}

div[class*="language-"]>pre.shiki {
	grid-row: 2;
	grid-column: 1 / -1;
	margin: 0;
	border-top: 1px solid hsl(from var(--color--fg) h s l /0.5);
	padding-block: 8px;
	overflow-x: scroll;
	scrollbar-width: thin;
	text-wrap: nowrap;
}

div[class*="language-"].line-numbers-mode>pre.shiki {
	grid-row: 2;
	grid-column: 2;
	margin: 0;
	border-top: 1px solid hsl(from var(--color--fg) h s l /0.5);
	padding-block: 8px;
	overflow-x: scroll;
	text-wrap: nowrap;
}

div[class*="language-"].line-numbers-mode>.line-numbers-wrapper {
	grid-row: 2;
	grid-column: 1;
	margin: 0;
	border-top: 1px solid hsl(from var(--color--fg) h s l /0.5);
	padding-block: 8px;
	padding-inline-end: 0.5rem;
	text-wrap: nowrap;
	text-align: end;
}

.shiki {
	background-color: var(--shiki-dark-bg);
	border-radius: unset;
	padding-inline: unset;
	background: unset;
}

.shiki .line {
	display: inline-block;
	min-width: calc(100% - 16px);
	padding-inline: 8px;
}

.shiki span {
	color: var(--shiki-dark);
}

.shiki .line.highlighted {
	background-color: hsl(from var(--color--accent-bg) h s l /var(--scale-xFC));
}

.shiki .line.highlighted.error {
	background-color: hsl(from var(--color--error-bg) h s l /var(--scale-xFC));
}

.shiki .line.highlighted.warning {
	background-color: hsl(from var(--color--warning-bg) h s l /var(--scale-xFC));
}

.shiki .line.add {
	background-color: hsl(from var(--color--add-bg) h s l /var(--scale-xFC));
}

.shiki .line.remove {
	background-color: hsl(from var(--color--del-bg) h s l /var(--scale-xFC));
}

.shiki.has-focused-lines .line {
	filter: blur(4px);
	transition: all 200ms ease-in-out;
}

.shiki.has-focused-lines:hover .line {
	filter: blur(0px);
}

.shiki.has-focused-lines .line.has-focus {
	filter: none;
}

section.footnote {
	margin-block-start: 10rem;
	border-block-start: 1px solid hsl(from var(--color--fg) h s l /0.5);
}

.noscript-foot {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 4px;
	z-index: 1024;
	border-top: 1px solid var(--color--fg);
	background-color: var(--color--bg);
}

.custom-block {
	margin-block: 0.5rem;
	padding: 8px;
	border-radius: 8px;
}

.custom-block>.custom-block-title {
	margin-block-end: 0.5rem;
}

.custom-block.info {
	background-color: var(--color--info-bg);
}

.custom-block.note {
	background-color: var(--color--note-bg);
}

.custom-block.tip {
	background-color: var(--color--tip-bg);
}

.custom-block.important {
	background-color: var(--color--important-bg);
}

.custom-block.warning {
	background-color: var(--color--warning-bg);
}

.custom-block.caution {
	background-color: var(--color--caution-bg);
}

.custom-block.danger {
	background-color: var(--color--danger-bg);
}

.custom-block.details {
	background-color: var(--color--bg-light2);
}

.custom-block.details[open]>summary {
	margin-block-end: 0.5rem;
}

.custom-block>p.custom-block-title {
	margin-block-start: 0;
	font-size: 0.8rem;
	font-weight: 600;
}
</style>

<style lang="css" scoped>
.app-main {
	width: 100%;
	min-height: calc(100vh - 48pt);
	padding-top: 48pt;
}

footer.page-foot {
	background: var(--color--bg-dark2);
	padding: 30pt;
	min-height: 40pt;
}

footer.page-foot a {
	color: var(--color--fg);
}

div.foot-map {
	display: flex;
	flex-flow: row;
	gap: 16pt;
}

div.foot-copyright {
	margin-top: 1rem;
	font-size: smaller;
}
</style>
