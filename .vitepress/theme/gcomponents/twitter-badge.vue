<template>
	<a :href="`https://twitter.com/@${props.user}`" target="_blank">
		<img alt="X (formerly Twitter) Follow" :src="`https://img.shields.io/twitter/follow/${props.user}`">
	</a>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	user: string;
}>(), {});
</script>
