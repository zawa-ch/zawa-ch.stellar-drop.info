// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import AutoGrid from './gcomponents/auto-grid.vue'
import BannerItem from './gcomponents/banner-item.vue'
import DateTip from './gcomponents/date-tip.vue'
import FolderBlock from './gcomponents/folder-block.vue'
import MisskeyNote from './gcomponents/misskey-note.vue'
import ProfileItem from './gcomponents/profile-item.vue'
import ProgressGauge from './gcomponents/progress-gauge.vue'
import ShieldsLink from './gcomponents/shields-link.vue'
import TwitterBadge from './gcomponents/twitter-badge.vue'
import TypingLabel from './gcomponents/typing-label.vue';
import YoutubeBadge from './gcomponents/youtube-badge.vue'

export default {
	Layout,
	enhanceApp({ app, router, siteData }) {
		app.component('AutoGrid', AutoGrid);
		app.component('BannerItem', BannerItem);
		app.component('DateTip', DateTip);
		app.component('FolderBlock', FolderBlock);
		app.component('MisskeyNote', MisskeyNote);
		app.component('ProfileItem', ProfileItem);
		app.component('ProgressGauge', ProgressGauge);
		app.component('ShieldsLink', ShieldsLink);
		app.component('TwitterBadge', TwitterBadge);
		app.component('TypingLabel', TypingLabel);
		app.component('YoutubeBadge', YoutubeBadge);
	}
} satisfies Theme
