<template>
	<blockquote v-if="status?.value === 'done'" class="mi-note" :style="rootStyle">
		<div class="user">
			<div>
				<img class="user-profileimg" :src="status.note.user.avatarUrl" />
			</div>
			<div>
				<div class="user-displayname">{{ status.note.user.name }}</div>
				<div class="user-handle">
					{{ `@${status.note.user.username}@${status.note.user.host ? status.note.user.host : props.host}` }}
				</div>
			</div>
		</div>
		<div class="note-body">
			<MfmComponent :value="status.note.text !== null ? status.note.text : undefined"></MfmComponent>
		</div>
		<div class="note-footer">
			<div style="display: flex; flex-flow: row; column-gap: 0.5rem;">
				<DateTip :date="status.note.createdAt" />
				<span>★ {{ status.note.reactionCount }}</span>
				<span>⭮ {{ status.note.renoteCount }}</span>
				<span>⮨ {{ status.note.repliesCount }}</span>
			</div>
			<div>
				<a :href="status.note.url ?? `https://${props.host}/notes/${props.noteId}`" target="_blank">
					{{ status.note.url ?? `https://${props.host}/notes/${props.noteId}` }}
				</a>
			</div>
		</div>
	</blockquote>
	<div v-else-if="status?.value === 'error'" class="custom-block caution">
		<p class="custom-block-title">Error</p>
		<p>ノートの取得に失敗しました。{{ status.error ? '報告されたエラーは次のとおりです: ' : '' }}</p>
		<CodeBlock v-if="status.error" :code="String(status.error)" />
	</div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, onMounted, onUnmounted, onWatcherCleanup, ref, watch, WatchHandle } from 'vue';
import { MiNote, useMisskeyDataQuery } from '../composables/misskey';
import MfmComponent from './mfm-component';
import DateTip from './date-tip.vue';
import CodeBlock from '../lcomponents/code-block.vue';

const props = withDefaults(defineProps<{
	host: string;
	noteId: string;
}>(), {
});
const query = useMisskeyDataQuery(props.host);
const status = ref<{ value: 'done', note: MiNote } | { value: 'error', error?: any } | null>();
const color = computed(() => status.value?.value === 'done' && status.value.note.user.instance?.themeColor ? status.value.note.user.instance?.themeColor : 'transparent');
const rootStyle = computed<CSSProperties>(() => { return { '--note-color': color.value } });

let hostReflector: WatchHandle | null = null;
let noteUpdater: WatchHandle | null = null;
onMounted(() => {
	hostReflector = watch(() => props.host, (value) => {
		query.host.value = value;
	});
	noteUpdater = watch(() => { return { getter: query.note.value, host: query.host.value, noteId: props.noteId } }, (value) => {
		if (!value.host) {
			status.value = { value: 'error', error: Error('host is not specified.') };
		}
		if (!value.noteId) {
			status.value = { value: 'error', error: Error('noteId is not specified.') };
			return;
		}
		if (!value.getter) { return; }
		const controller = new AbortController();
		value.getter(value.noteId, controller.signal).then((v) => {
			status.value = { value: 'done', note: v };
		}).catch((err) => {
			status.value = { value: 'error', error: err };
		});
		onWatcherCleanup(() => {
			controller.abort();
		});
	});
});
onUnmounted(() => {
	hostReflector?.stop();
	noteUpdater?.stop();
});
</script>

<style lang="css" scoped>
.mi-note {
	--note-color: transparent;
	padding-block: 1rem;
	background-color: color-mix(in srgb, var(--color--bg-dark1), var(--note-color) 5%);
}

.mi-note .user {
	display: flex;
	flex-flow: row;
	column-gap: 1rem;
}

.mi-note .user-profileimg {
	width: 48px;
	height: 48px;
	overflow: hidden;
	border-radius: 100%;
}

.mi-note .user-handle {
	font-family: var(--font-family--monospace);
	font-size: 0.8rem;
	opacity: 0.75;
}

.mi-note .note-body {
	margin-block: 1.5rem;
}

.mi-note .note-footer {
	font-size: 0.8rem;
	line-height: 1.2rem;
}
</style>
