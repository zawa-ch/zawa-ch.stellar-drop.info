import { computed, onMounted, onUnmounted, onWatcherCleanup, ref, watch, WatchHandle } from "vue";
import { unwrapNonnull } from "../utils/type-util";

async function fetchAPI<T extends JsonValue = JsonValue>(host: string, endpoint: string, params: JsonValue = {}, abort?: AbortSignal) {
	const req = new Request(`https://${host}/api/${endpoint}`, { method: 'POST', body: JSON.stringify(params), headers: { "Content-Type": "application/json", }, signal: abort });
	const unwrapOk = async (responce: Response) => { if (responce.ok) { return responce; } else { throw Error(`${String(responce.status)} ${responce.statusText}: ${await responce.text()}`); } };
	const responce_2 = await fetch(req);
	const responce_3 = await unwrapOk(responce_2);
	return await (responce_3.json() as Promise<T>);
}

export function useMisskeyStatus(host: string) {
	const pingDuration = ref<number | undefined>(undefined);
	const onlineUserCount = ref<number | undefined>(undefined);
	const totalUserCount = ref<number | undefined>(undefined);
	const noteCount = ref<number | undefined>(undefined);
	const serverAlive = computed(() => pingDuration !== undefined)

	var pingInterval: number | undefined = undefined;

	async function update() {
		const updateStats = async () => {
			try {
				const stats = await fetchAPI(host, 'stats', {});
				if (typeof stats !== 'object' || stats === null || Array.isArray(stats)) { throw Error(); }
				totalUserCount.value = typeof stats['originalUsersCount'] == 'number' ? stats['originalUsersCount'] : undefined;
				noteCount.value = typeof stats['originalNotesCount'] == 'number' ? stats['originalNotesCount'] : undefined;
			} catch (_err) {
				totalUserCount.value = undefined;
				noteCount.value = undefined;
			}
		}
		const updateOnlineUserCount = async () => {
			try {
				const onlineUsers = await fetchAPI(host, 'get-online-users-count', {});
				if (typeof onlineUsers !== 'object' || onlineUsers === null || Array.isArray(onlineUsers) || typeof onlineUsers['count'] !== 'number') { throw Error(); }
				onlineUserCount.value = onlineUsers['count'];
			} catch (_err) {
				onlineUserCount.value = undefined;
			}
		}

		const start = Date.now();
		try {
			await fetchAPI<{ pong: number }>(host, 'ping', {});
			pingDuration.value = Date.now() - start;
		} catch (_err) {
			pingDuration.value = undefined;
			onlineUserCount.value = undefined;
			totalUserCount.value = undefined;
			noteCount.value = undefined;
		}
		updateStats();
		updateOnlineUserCount();
	}

	onMounted(() => {
		update();
		pingInterval = setInterval(update, 30000);
	});
	onUnmounted(() => {
		clearInterval(pingInterval);
		pingInterval = undefined;
	});

	return {
		pingDuration,
		onlineUserCount,
		totalUserCount,
		noteCount,
		serverAlive,
	};
}

export function useMisskeyDataQuery(host: string | null = null) {
	let watcher: WatchHandle | null = null;
	const hostV = ref<string | null>(host);
	const hostC = computed<string | null>({
		get: () => hostV.value,
		set: (newValue) => {
			status.value = null;
			hostV.value = newValue;
		}
	});
	const status = ref<{ value: 'ready' } | { value: 'error', error?: any } | null>(null);
	const note = (id: string, abort?: AbortSignal) => fetchAPI<MiNote>(unwrapNonnull(host), 'notes/show', { noteId: id }, abort);

	onMounted(() => {
		watcher = watch(() => hostV.value, (value) => {
			status.value = null;
			if (!value) { return; }
			let controller = new AbortController();
			fetchAPI(value, 'ping', {}, controller.signal).then(() => {
				status.value = { value: 'ready' };
			}).catch((err) => {
				status.value = { value: 'error', error: err };
			});
			onWatcherCleanup(() => {
				controller.abort();
			});
		}, { immediate: true });
	});
	onUnmounted(() => {
		watcher?.stop();
	});
	const sym = {
		host: hostC,
		status,
		note: computed(() => status.value?.value === 'ready' ? note : null),
	};
	return sym;
}

export type MiUserSimple = {
	avatarBlurhash: string | null;
	avatarDecorations: {
		id: string;
		url: string;
		angle?: number;
		flipH?: boolean;
		offsetX?: number;
		offsetY?: number;
	}[];
	avatarUrl: string;
	emojis: { [k: string]: JsonValue };
	host: string | null;
	id: string;
	name: string | null;
	onlineStatus: 'unknown' | 'online' | 'active' | 'offline';
	username: string;
	badgeRoles?: {
		displayOrder: number;
		iconUrl: string | null;
		name: string;
	}[];
	instance?: {
		faviconUrl: string | null;
		iconUrl: string | null;
		name: string | null;
		softwareName: string | null;
		themeColor: string | null;
	};
	isBot?: boolean;
	isCat?: boolean;
	makeNotesFollowersOnlyBefore?: number | null;
	makeNoteHiddenBefore?: number | null;
	requireSigninToViewContents?: boolean;
};
export type MiDriveFile = {
	blurhash: string | null;
	comment: string | null;
	createdAt: string;
	folderId: string | null;
	id: string;
	isSensitive: boolean;
	md5: string;
	name: string;
	properties: {
		avgColor?: string;
		height?: number;
		orientation?: number;
		width?: number;
	};
	size: number;
	thumbnailUrl: string | null;
	type: string;
	url: string;
	userId: string;
	folder?: {
		createdAt: string;
		id: string;
		name: string;
		parentId: string | null;
		filesCount?: number;
		foldersCount?: number;
		parent?: MiDriveFile['folder'];
	} | null;
	user?: MiUserSimple | null;
};
export type MiNote = {
	createdAt: string;
	id: string;
	reactionAcceptance: 'likeOnly' | 'likeOnlyForRemote' | 'nonSensitiveOnly' | 'nonSensitiveOnlyForLocalLikeOnlyForRemote' | null;
	reactionCount: number;
	reactionEmojis: { [k: string]: JsonValue };
	reactions: { [k: string]: JsonValue };
	renoteCount: number;
	repliesCount: number;
	text: string | null;
	user: MiUserSimple;
	userId: string;
	visibility: 'public' | 'home' | 'followers' | 'specified';
	chennel?: {
		allowRenoteToExternal: boolean;
		color: string;
		id: string;
		isSensitive: boolean;
		name: string;
		userId: string | null;
	} | null;
	channelId?: string | null;
	clippedCount?: number;
	cw?: string | null;
	deletedAt?: string | null;
	emojis?: { [k: string]: JsonValue } | null;
	fileIds?: string[];
	files?: MiDriveFile[];
	hasPoll?: boolean;
	isHidden?: boolean;
	localOnly?: boolean;
	mentions?: string[];
	myReaction?: string | null;
	poll?: {
		choices: { isVoted: boolean; text: string; votes: number }[];
		multiple: boolean;
		expiresAt?: string | null;
	} | null;
	reantionAndUserPairCache?: string[];
	renote?: MiNote | null;
	renoteId?: string | null;
	reply?: MiNote | null;
	replyId?: string | null;
	tags?: string[];
	uri?: string;
	url?: string;
	visibleUserIds?: string[];
};
