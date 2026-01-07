<template>
	<main class="default">
		<section class="banner"
			:style="{ backgroundImage: frontmatter['bannerImage'] ? `url(${frontmatter['bannerImage']})` : undefined }">
			<div style="flex: 1;"></div>
			<div class="title">
				<h1>{{ page.title }}</h1>
			</div>
			<div class="bottom"></div>
		</section>
		<article>
			<Content class="content" />
		</article>
	</main>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
const { page, frontmatter } = useData()
</script>

<style lang="css">
main.default {
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
}

main.default h1,
main.default .content>*>:is(section, h1, h2, h3, h4, h5, h6, p, ul, ol, dl, hr, div, pre, .custom-block, table, nav.table-of-contents, blockquote, a.banner-item, article.profile-item) {
	width: 90%;
	max-width: 1280px;
	margin-inline: auto;
	box-sizing: border-box;
}

main.default h2 {
	margin-block-start: 10rem;
}

main.default>section.banner {
	display: flex;
	flex-flow: column;
	width: 100%;
	height: 30rem;
	max-height: unset;
	max-width: unset;
	margin: unset;
	position: relative;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	background-attachment: local;
}

main.default section.banner .title {
	padding: 8px;
	background-color: rgb(from var(--color--bg) r g b /45%);
	backdrop-filter: blur(4px);
}

main.default section.banner>.bottom {
	height: 1px;
	background-color: var(--color--fg);
}
</style>
