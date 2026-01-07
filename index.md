---
layout: home
showTitle: false
showDimmer: false
profileCard:
  name: 'zawa-ch.'
  profileImage: '/assets/profile.png'
  description:
    - 開発者に見えて開発者ではない、少しだけ開発している開発者
    - いつも眠たげなMisskeyサーバー管理者
    - ひよっこC++er
    - 個人サイトはじめました
    - ミスキストとしては凡人
    - サーバー建ててるだけの一般家庭です
    - フライトシューティングでは、無誘導兵器が好き
    - "主成分: ミルクティー"
    - "好きな飛行機: F-22A"
    - "好きな音楽ジャンル: Deep House, Prog. House, Uplifting Trance"
    - Take pride in your work, even if it's not prettiest.
    - Java.Lang.NullPointerException
    - 焼きたての std::void_t<> はいかが？
    - version 4.3.0
    - ここが黒歴史とならないことを祈るばかり
    - 犬派か猫派かと聞かれたら、無機物派
    - ねこは……多分います、よろしくおねがいします
    - 起こさないでください
    - Zzz...Zzz...
    - F-22は背中がかわいい
    - ふぉっくすつー！
    - ほみゃー！
    - X？ なにそれ美味しいの？
    - Dockerはどっかーん！するもの
    - zawa-ch. Is Cat ...?
    - SbWwCuWw:Cw--Sr--:RbCbCbCb:CwCwCwCw
    - せめて、エンジニアらしく
    - 嘘じゃないもん！ケーキと違って！
    - こちらzawa-ch.、ミルクティーを確保
    - インドア系だけど、トラックメイカーではない
    - <ここに自己紹介を入力>
  links:
    - {href: "https://geoplanetary.net/@stellar_ch"}
    - {href: "https://caramella.casa/@stellar_ch"}
    - {href: "https://github.com/zawa-ch"}
---
<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue';

const timer = ref<number | null>(null);
const text = ref<string>("");

onMounted(()=> {
  timer.value = setTimeout(()=>{
    text.value = '……あれ、待たせちゃった？';
  }, 900000);
});
onUnmounted(()=> {
  clearInterval(timer.value);
  timer.value = null;
});
</script>

<AutoGrid>
  <BannerItem href="https://geoplanetary.net/" title="じおぷらねたりー" backgroundColor="#003f8e" backgroundImage="https://geoplanetary.net/files/4ceb7826-1027-43dd-aee3-3c9502352e1f">zawa-ch.の運営しているMisskeyサーバー</BannerItem>
  <BannerItem title="GitHub" href="https://github.com/zawa-ch" rel="me" backgroundColor="#181717">有象無象置き場</BannerItem>
</AutoGrid>

来てくれてありがとう。ミルクティー淹れてくるから待っててね<br /><TypingLabel :value="text" />

## Profile

<ProfileItem name="zawa-ch." profileImage="/assets/profile.png">
<template #links>
  <ShieldsLink href="https://geoplanetary.net/@stellar_ch" rel="me" />
  <ShieldsLink href="https://caramella.casa/@stellar_ch" rel="me" />
  <ShieldsLink href="https://github.com/zawa-ch" rel="me" />
</template>
<template #default>
  いつも眠たげな、サーバー「じおぷらねたりー」の管理者。<br />
  趣味で開発したりゲームしたり。なんにでも手を付ける。<s>そしてすぐ飽きる。</s><br />
  なんもわからないままプログラムひっぱたいてる。
  <a href="/profile"><div>もっと！</div></a>
</template>
</ProfileItem>
