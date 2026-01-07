import { computed, ref } from "vue";

const progress = ref<number | undefined>(undefined);
const hideTimer = ref<number | undefined>(undefined);
function setHide(hideFor: number = 250) {
	hideTimer.value = setTimeout(() => {
		progress.value = undefined;
		hideTimer.value = undefined;
	}, hideFor)
}
function clearHide() {
	clearTimeout(hideTimer.value);
	hideTimer.value = undefined;
}

export function useLoadProgressState() {
	return {
		/**
		 * 現在の読み込み進捗を取得、または設定します。
		 */
		progress: computed<number | undefined>({
			get() {
				return progress.value;
			}, set(v) {
				clearHide();
				progress.value = v;
			}
		}),
		/**
		 * 現在のルーティングを読み込み完了としてマークします。
		 */
		complete(hideFor: number = 250) {
			progress.value = 1;
			setHide(hideFor);
		}
	}
}
