<template>
	<a :href="`https://youtube.com/channel/${props.channelId}`" target="_blank">
		<img alt="YouTube Channel" :src="`https://img.shields.io/youtube/channel/${props.type}/${props.channelId}`" />
	</a>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	channelId: string;
	type?: 'subscribers' | 'views';
}>(), {
	type: 'subscribers',
});
</script>
