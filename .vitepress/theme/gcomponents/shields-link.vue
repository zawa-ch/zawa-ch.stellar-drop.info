<template>
	<a :href="linkTarget?.href" :target="linkTarget?.isReference ? undefined : '_blank'">
		<img :src="badgeSrc.href" />
	</a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { URIRef } from '../utils/uri';

const props = withDefaults(defineProps<{
	href: string | URIRef;
	badgeStyle?: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
	logo?: string;
	color?: string;
}>(), {
	badgeStyle: 'flat',
});

const linkTarget = computed<URIRef | null>(() => {
	if (!props.href) { return null; }
	if (typeof props.href === 'string') {
		return URIRef.parse(props.href);
	} else {
		return props.href;
	}
});

const badgeSrc = computed<URIRef>(() => {
	var uri = new URIRef('https://img.shields.io/')
	if (!linkTarget.value) {
		console.warn(`Encounted invalid link. Please check reference.\nhref=${props.href}`)
		uri.path = 'badge/Invalid%20link-red'
		return uri
	}
	uri.path = `badge/${escapeShields(linkTarget.value.host ?? linkTarget.value.path)}-${props.color ?? 'white'}`
	{
		var q = []
		q.push(`style=${props.badgeStyle}`)
		if (props.logo) { q.push(`logo=${encodeURIComponent(props.logo)}`) }
		uri.query = q.join('&')
	}
	return uri
})

function escapeShields(text: string): string {
	return text.replaceAll('-', '--').replaceAll('_', '__').replaceAll(' ', '%20')
}
</script>
