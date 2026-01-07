<template>
	<main class="mdplayground">
		<section class="banner"
			:style="{ backgroundImage: frontmatter['bannerImage'] ? `url(${frontmatter['bannerImage']})` : undefined }">
			<div style="flex: 1;"></div>
			<div class="title">
				<h1>{{ parsedContent.frontmatter.title }}</h1>
				<div>
					<DateTip v-if="parsedContent.frontmatter.date" :date="parsedContent.frontmatter.date" />
					<span>{{ parsedContent.frontmatter.description }}</span>
				</div>
			</div>
			<div class="bottom"></div>
		</section>
		<article class="content">
			<mditComponent :ast="parsedContent.token" />
		</article>
		<Transition>
			<textarea v-show="showInput" class="editor" :placeholder="['---', 'title: ...', '---'].join('\n')"
				v-model.lazy="rawContent"></textarea>
		</Transition>
	</main>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref } from 'vue';
import { useWindow } from '../composables/window';
import DateTip from '../gcomponents/date-tip.vue';
import mditComponent, { useMarkdownParser } from '../lcomponents/mdit-component';
const { frontmatter } = useData();
const scroll = useWindow();
const parser = useMarkdownParser<{ title: string, tags?: string[], date?: string | number | null, description?: string }>({});

const showInput = computed(() => scroll.y.value === 0)
const rawContent = ref<string>('');
const parsedContent = computed(() => parser(rawContent.value));
</script>

<style lang="css">
main.mdplayground {
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
}

main.mdplayground>section.banner>.title>*,
main.mdplayground .content {
	width: 90%;
	max-width: 1280px;
	margin-inline: auto;
	box-sizing: border-box;
}

main.mdplayground h2 {
	margin-block-start: 10rem;
}
</style>

<style lang="css" scoped>
main.mdplayground>section.banner {
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

main.mdplayground section.banner .title {
	padding-block-start: 8px;
	background-color: rgb(from var(--color--bg) r g b /45%);
	backdrop-filter: blur(4px);
}

main.mdplayground section.banner .item-count {
	padding-block: 8px;
}

main.mdplayground section.banner>.bottom {
	height: 1px;
	width: 100%;
	max-width: unset;
	margin-inline: unset;
	background-color: var(--color--fg);
}

main.mdplayground .editor {
	position: fixed;
	bottom: 0;
	left: 5%;
	right: 5%;
	height: 20rem;
	max-height: 50%;
	border: none;
	border-radius: 8px 8px 0 0;
	padding-top: 8px;
	z-index: 1024;
	background-color: var(--color--bg-light1);
	color: var(--color--fg);
	font-family: var(--font-family--monospace);
	resize: none;
}

main.mdplayground .editor.v-enter-active,
main.mdplayground .editor.v-leave-active {
	transition: height 250ms cubic-bezier(0.19, 1, 0.22, 1);
}

main.mdplayground .editor.v-enter-from,
main.mdplayground .editor.v-leave-to {
	height: 0;
}
</style>
