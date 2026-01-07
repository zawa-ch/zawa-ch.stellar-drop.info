<template>
	<div class="folder-block">
		<div class="header">
			<button v-if="props.button === 'header'" class="display-toggle" @click="open = !open">
				{{ buttonText ?? (open ? "詳細を隠す" : "詳細") }}
			</button>
			<slot name="header">
			</slot>
		</div>
		<div>
			<AccordionTransition>
				<div v-if="open" class="folder-content">
					<slot name="default"></slot>
				</div>
				<div v-else class="close folder-content">
					<slot name="closeContent"></slot>
				</div>
			</AccordionTransition>
		</div>
		<div class="footerr">
			<slot name="footer"></slot>
			<button v-if="props.button === 'footer'" class="display-toggle" @click="open = !open">
				{{ buttonText ?? (open ? "詳細を隠す" : "詳細") }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import AccordionTransition from '../lcomponents/accordion-transition.vue';

const props = withDefaults(defineProps<{
	button?: 'header' | 'footer' | 'none';
	buttonText?: string;
}>(), {
	button: 'header',
});

const open = defineModel<boolean>('open');
</script>

<style lang="css">
.folder-block {
	display: block;
}

.folder-block .folder-content {
	display: flow-root;
}

.folder-block .display-toggle {
	display: block;
	width: 100%;
	border: none;
	border-radius: 4px;
	padding-block: 8px;
	font-size: 1rem;
	color: var(--color--fg);
	background-color: var(--color--bg-light2);
}
</style>
