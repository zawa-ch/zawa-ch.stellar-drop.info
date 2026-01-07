<template>
	<a v-if="linkTarget != null" :href="linkTarget.href"
		:target="linkTarget.authority || linkTarget.scheme ? '_blank' : undefined" class="banner-item" :style="rootStyle"
		:title="itemTitle">
		<div class="content">
			<div class="ref" aria-hidden="true">
				<span v-if="linkTarget.scheme !== null && linkTarget.scheme != 'https'">{{ linkTarget.scheme }}:</span>
				<span v-if="linkTarget.authority">//</span>
				<span v-if="linkTarget.userinfo">{{ linkTarget.userinfo }}</span>
				<span v-if="linkTarget.host && linkTarget.host.startsWith('www.')">www.</span>
				<span v-if="linkTarget.host" class="host">{{ linkTarget.host.replace(/^www\./i, '') }}</span>
				<span v-if="linkTarget.port">:{{ linkTarget.port }}</span>
				<span>{{ linkTarget.path }}</span>
			</div>
			<div class="title">{{ itemTitle ?? '' }}</div>
			<div class="description">
				<slot></slot>
			</div>
		</div>
	</a>
	<div v-else class="banner-item" :style="rootStyle" :title="itemTitle">
		<div class="content">
			<div class="title">{{ itemTitle ?? '' }}</div>
			<div class="description">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HTMLAttributes } from 'vue';
import { URIRef } from '../utils/uri';

const props = withDefaults(defineProps<{
	backgroundColor?: string;
	borderStyle?: string;
	backgroundImage?: string;
	title?: string;
	href?: string;
}>(), {
	borderStyle: '2px solid var(--color--fg)',
	backgroundColor: 'var(--color--bg)',
});

// note: https://zenn.dev/snowcait/articles/d0f609d6366ef9 なんかでOpenGraphの取得できるかと
// 考えていたが、CORSを迂回してまですることか……？ となったため、やめておく

const itemTitle = computed<string | undefined>(() => props.title ?? undefined)
const linkTarget = computed<URIRef | null>(() => props.href ? URIRef.parse(props.href) : null);
const backgroundRef = computed<URIRef | null>(() => props.backgroundImage ? URIRef.parse(props.backgroundImage) : null);
const rootStyle = computed<HTMLAttributes["style"]>(() => {
	return {
		backgroundColor: props.backgroundColor,
		backgroundImage: backgroundRef.value ? `url(${backgroundRef.value.href})` : undefined,
		border: props.borderStyle,
	};
});
</script>

<style lang="css" scoped>
.banner-item {
	display: block;
	margin-block: 0.5rem;
	border-radius: 8px;
	overflow: hidden;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-attachment: local;
	color: var(--color--fg);
	text-decoration: none;
}

.banner-item>.content {
	display: flex;
	flex-flow: column-reverse;
	width: calc(100% - 16px);
	height: calc(100% - 16px);
	min-height: 5rem;
	padding: 8px;
	background-color: hsl(from var(--color--bg) h s l /0.75);
	backdrop-filter: blur(4px);
}

.banner-item>.content>.ref {
	font-size: 0.8rem;
	font-weight: 400;
	opacity: 0.75;
	overflow-x: hidden;
	text-overflow: ellipsis;
	text-wrap-mode: nowrap;
}

.banner-item>.content>.ref>.host {
	font-weight: 600;
}

.banner-item>.content>.title {
	font-size: 1.5rem;
	font-weight: 500;
	overflow-x: hidden;
	text-overflow: ellipsis;
	text-wrap-mode: nowrap;
}

.banner-item>.content>.description {
	font-size: 0.8rem;
	font-weight: 400;
	overflow-x: hidden;
	text-overflow: ellipsis;
	text-wrap-mode: nowrap;
}
</style>
