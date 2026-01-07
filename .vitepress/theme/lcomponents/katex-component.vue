<template>
	<div v-if="props.display === 'block'" v-html="katex.renderToString(props.expr)"></div>
	<span v-else v-html="katex.renderToString(props.expr)"></span>
</template>

<script lang="ts" setup>
import katex from 'katex';
const props = withDefaults(defineProps<{
	display?: 'block' | 'inline';
	expr?: string;
}>(), {
	display: 'block',
	expr: '',
});
</script>

<style lang="css">
@import url(https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.css);
</style>
