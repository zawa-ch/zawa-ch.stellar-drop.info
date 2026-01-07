<template>
	<main class="home">
		<section class="banner"
			:style="{ backgroundImage: frontmatter['bannerImage'] ? `url(${frontmatter['bannerImage']})` : undefined }">
			<div v-if="frontmatter.showTitle ?? true" class="title">
				<h1>{{ site.title }}</h1>
				<p>{{ site.description }}</p>
			</div>
			<div v-if="frontmatter.profileCard" class="profile-card">
				<ProfileItem color="var(--color--bg-light4)" :name="frontmatter.profileCard.name"
					:profile-image="frontmatter.profileCard.profileImage">
					<template #default>
						<TypingLabel class="profile-description" :value="profileDescription ?? ''">&lt;ここに自己紹介を入力&gt;</TypingLabel>
					</template>
					<template #links>
						<span v-for="value in frontmatter.profileCard?.links">
							<TwitterBadge v-if="value.type === 'twitter'" :user="value.user" />
							<YoutubeBadge v-else-if="value.type === 'youtube-subscribers'" type="subscribers"
								:channel-id="value.channel" />
							<YoutubeBadge v-else-if="value.type === 'youtube-views'" type="views" :channel-id="value.channel" />
							<ShieldLink v-else-if="value.href" :href="value.href" />
						</span>
					</template>
				</ProfileItem>
			</div>
			<div v-if="frontmatter.showDimmer ?? true" class="dimmer"></div>
		</section>
		<article>
			<Content class="content" />
		</article>
	</main>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { ThemeConfig } from '../config';
import { onMounted, ref } from 'vue';
import ProfileItem from '../gcomponents/profile-item.vue';
import TwitterBadge from '../gcomponents/twitter-badge.vue'
import YoutubeBadge from '../gcomponents/youtube-badge.vue'
import ShieldLink from '../gcomponents/shields-link.vue'
import TypingLabel from '../gcomponents/typing-label.vue';

const { site, frontmatter } = useData<ThemeConfig>()

const profileDescription = ref<string | undefined>(undefined);

onMounted(() => {
	if (typeof frontmatter.value.profileCard?.description === 'string') {
		profileDescription.value = frontmatter.value.profileCard.description;
	} else if (Array.isArray(frontmatter.value.profileCard?.description)) {
		const i = Math.trunc(Math.random() * (frontmatter.value.profileCard.description as any[]).length);
		profileDescription.value = (frontmatter.value.profileCard.description as any[])[i];
	}
})
</script>

<style lang="css">
main.home {
	width: 100%;
	overflow-x: hidden;
}

main.home>section,
main.home .content>*>section {
	width: 90%;
	max-width: 1280px;
	margin-inline: auto;
	margin-block: 10rem;
}

main.home .content>*>:is(section, h1, h2, h3, h4, h5, h6, p, ul, ol, dl, hr, div, pre, .custom-block, table, nav.table-of-contents, blockquote, a.banner-item, article.profile-item) {
	width: 90%;
	max-width: 1280px;
	margin-inline: auto;
	box-sizing: border-box;
}
</style>

<style lang="css">
main.home>section.banner {
	display: block;
	width: 100vw;
	height: 100vh;
	max-height: unset;
	max-width: unset;
	margin: unset;
	position: relative;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	background-attachment: fixed;
}

main.home>section.banner>.title {
	position: absolute;
	left: 4%;
	bottom: 8%;
	padding: 8px;
	background-color: rgb(from var(--color--base) r g b /75%);
	backdrop-filter: blur(4px);
}

main.home>section.banner>.profile-card {
	position: absolute;
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

main.home>section.banner>.profile-card>* {
	width: min(max(calc(100% / 3), 640px), calc(100% - 32px));
	backdrop-filter: blur(4px);
}

main.home>section.banner>.profile-card .profile-description {
	/* webフォント使うと環境によってはちらつくため、システム既定のフォントでレンダリングさせる */
	font-family: 'sans-serif';
}

@keyframes dimmer-breathing {
	from {
		opacity: 100%;
	}

	to {
		opacity: 75%;
	}
}

main.home>section.banner>.dimmer {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: min(8%, 64px);
	background: linear-gradient(0deg, var(--color--base), transparent);
	animation: 3.0s cubic-bezier(0.445, 0.05, 0.55, 0.95) 0s infinite alternate dimmer-breathing;
}
</style>
