<template>
	<article class="profile-item" :style="itemStyle">
		<div :style="{ display: props.profileImage && URIRef.canParse(props.profileImage) ? undefined : 'none' }">
			<div class="image" :style="{ borderColor: props.edgeColor, backgroundImage: `url(${props.profileImage})` }"></div>
		</div>
		<div class="description-area">
			<div class="name">{{ props.name }}</div>
			<div class="links">
				<slot name="links"></slot>
			</div>
			<div>
				<slot></slot>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed, HTMLAttributes } from 'vue';
import { URIRef } from '../utils/uri';

const props = withDefaults(defineProps<{
	name?: string;
	profileImage?: string;
	color?: string;
	edgeColor?: string;
}>(), {
	edgeColor: 'var(--color--fg)',
});

const itemStyle = computed<HTMLAttributes['style']>(() => {
	return {
		backgroundColor: props.color ? `rgb(from ${props.color} r g b /15%)` : undefined,
	};
});
</script>

<style lang="css" scoped>
article.profile-item {
	display: grid;
	grid-template-columns: 160px 1fr;
	gap: 1.5rem;
	margin-block: 1.5rem;
	padding: 8px;
	border-radius: 12px;
}

article.profile-item .image {
	width: 120px;
	aspect-ratio: 1;
	margin-inline: auto;
	border: 4px solid;
	border-radius: 100%;
	overflow: hidden;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

article.profile-item .name {
	font-size: 1.5rem;
	font-weight: 600;
}

article.profile-item .links {
	display: flex;
	flex-flow: row wrap;
	column-gap: 0.5rem;
	align-items: center;
}

article.profile-item .description-area {
	display: flex;
	flex-flow: column;
	row-gap: 4px;
}

@media screen and (width < 600px) {
	article.profile-item {
		grid-template-columns: 1fr;
	}

	article.profile-item .image {
		aspect-ratio: 1;
		margin-block: 0;
	}

	article.profile-item .description-area {
		text-align: center;
	}

	article.profile-item .links {
		justify-content: center;
	}
}
</style>
