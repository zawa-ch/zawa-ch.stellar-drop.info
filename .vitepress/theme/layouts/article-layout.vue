<template>
	<main class="article-index">
		<section class="banner"
			:style="{ backgroundImage: frontmatter['bannerImage'] ? `url(${frontmatter['bannerImage']})` : undefined }">
			<div style="flex: 1;"></div>
			<div class="title">
				<h1 v-if="articleFm">{{ articleFm?.title }}</h1>
				<h1 v-else>{{ page.title }}</h1>
				<div v-if="status === 'index' && indexDisplay" class="item-count">{{ indexDisplay.length }} items</div>
				<div v-if="status === 'article'">
					<DateTip v-if="articleFm?.date" :date="articleFm.date" fuzzyness="second" />
					<span v-if="articleFm?.description">{{ articleFm.description }}</span>
				</div>
			</div>
			<div class="bottom"></div>
		</section>
		<ClientOnly>
			<section v-if="status === 'index'" class="article-list">
				<BannerItem v-for="value in indexDisplay" :title="value.title" :href="`?page=${value.slug}`">
					<DateTip v-if="value.date" :date="value.date" fuzzyness="minute" />
					<span v-if="value.description">{{ value.description }}</span>
				</BannerItem>
			</section>
			<article v-if="status === 'article'" class="content">
				<MditComponent :ast="articleBody" />
			</article>
			<div v-if="status === 'error'" class="content">
				<div class="custom-block danger">
					<p class="custom-block-title">ERROR</p>
					<p>
						記事の取得をしているときにエラーが発生しました。報告されたエラーは次のとおりです:
					</p>
					<CodeBlock :code="error"></CodeBlock>
				</div>
			</div>
		</ClientOnly>
	</main>
</template>

<script setup lang="ts">
import { useData, useRouter } from 'vitepress'
import BannerItem from '../gcomponents/banner-item.vue';
import DateTip from '../gcomponents/date-tip.vue';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { ArticleFetcher, ArticleIndexItem, fetchIndex } from '../composables/article-fetcher';
import { useLoadProgressState } from '../composables/load-progress';
import { deserializeURIQuery, URIRef } from '../utils/uri';
import MditComponent, { useMarkdownParser } from '../lcomponents/mdit-component';
import CodeBlock from '../lcomponents/code-block.vue';
import { useDocument } from '../composables/document';
const { site, page, frontmatter } = useData();
const document = useDocument();
const router = useRouter();
const progress = useLoadProgressState();
const parser = useMarkdownParser<{ title: string, tags?: string[], date?: string | number | null, description?: string }>();
const status = ref<'article' | 'index' | 'error' | undefined>();
const error = ref<string | undefined>();
const indexBase = ref<ArticleIndexItem[] | undefined>();
const indexDisplay = ref<ArticleIndexItem[] | undefined>();
const fetcher = ref<ArticleFetcher | undefined>();
const q = computed(() => deserializeURIQuery(router.route.query.replace(/^\?/, '')))
const rawArticle = ref<string | undefined>();
const article = computed(() => rawArticle.value ? parser(rawArticle.value) : undefined);
const articleFm = computed(() => article.value?.frontmatter);
const articleBody = computed(() => article.value?.token ?? []);

watch(() => articleFm.value ? articleFm.value.title : page.value.title, (v) => {
	if (document.value) { document.value.title = v + ' | ' + site.value.title; }
});

onBeforeMount(async () => {
	if (typeof frontmatter.value.articleIndex.uri !== 'string') { return; }
	await render(q.value);
});
router.onBeforeRouteChange = (to) => {
	const tgt = URIRef.parse(to);
	if (tgt === null) {
		console.error('Route to invalid URI', tgt);
		return false;
	}
	if (!tgt.isReference || tgt.path !== router.route.path) { return true; }
	render(deserializeURIQuery(tgt.query ?? ''));
}
router.onBeforePageLoad = (to) => {
	const tgt = URIRef.parse(to);
	if (tgt === null) {
		console.error('Route to invalid URI', tgt);
		return false;
	}
	if (!tgt.isReference || tgt.path !== router.route.path) { return true; }
	render(deserializeURIQuery(tgt.query ?? ''));
}
async function render(q: { [k: string]: string | true; }) {
	progress.progress.value = 0.2;
	try {
		if (!indexBase.value || !fetcher.value) {
			indexBase.value = await fetchIndex(frontmatter.value.articleIndex.uri);
			fetcher.value = new ArticleFetcher(indexBase.value);
		}
		indexDisplay.value = indexBase.value.filter((item) => {
			if ((item.hidden ?? false) && q['all'] !== true && q['all'] !== 'true') { return false; }
			return true;
		}).sort(articleItemLess);
		progress.progress.value = 0.5;
		if (typeof q['page'] === 'string') {
			rawArticle.value = await fetcher.value.fetch(q['page']);
		} else {
			rawArticle.value = undefined;
		}
		status.value = article.value !== undefined ? 'article' : 'index';
		progress.complete();
	} catch (err) {
		status.value = 'error';
		error.value = String(err);
		progress.complete();
	}
}
function articleItemLess(left: ArticleIndexItem, right: ArticleIndexItem): number {
	const parseOrUndef = (s: string) => {
		const i = Date.parse(s)
		return Number.isNaN(i) ? undefined : i
	}
	const ld = typeof left.date == 'number' ? left.date : typeof left.date == 'string' ? parseOrUndef(left.date) : undefined
	const rd = typeof right.date == 'number' ? right.date : typeof right.date == 'string' ? parseOrUndef(right.date) : undefined
	if (ld !== undefined && rd !== undefined) {
		return rd - ld
	} else if (rd === undefined) {
		return 1
	} else if (ld === undefined) {
		return -1
	} else {
		return left.slug.toLowerCase() > right.slug.toLowerCase() ? 1 : left.slug.toLowerCase() < right.slug.toLowerCase() ? -1 : 0
	}
}
</script>

<style lang="css">
main.article-index {
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
}

main.article-index>section.banner>.title>*,
main.article-index>section.article-list,
main.article-index .content {
	width: 90%;
	max-width: 1280px;
	margin-inline: auto;
	box-sizing: border-box;
}

main.article-index h2 {
	margin-block-start: 10rem;
}

main.article-index>section.banner {
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

main.article-index section.banner .title {
	padding-block-start: 8px;
	padding-block-end: 8px;
	background-color: rgb(from var(--color--bg) r g b /45%);
	backdrop-filter: blur(4px);
}

main.article-index section.banner .item-count {
	padding-block: 8px;
}

main.article-index section.banner>.bottom {
	height: 1px;
	width: 100%;
	max-width: unset;
	margin-inline: unset;
	background-color: var(--color--fg);
}
</style>
