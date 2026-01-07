---
title: このサイトについて
---
<script setup lang="ts">
import { useData } from 'vitepress';
import { version } from 'vue';
const { theme } = useData<ThemeConfig>();
</script>

## プライバシー
このサイトでは、ユーザーが直接入力したもの、およびサイトアクセスに必要なものを除き、保存・使用される情報(トラッキングCookieなど)はありません。

## リンク
このサイトはリンクフリーです。  
リンク先はサイト内のどこであってもよい(MAY)ですが、リソース移動などによるリンク切れを避けるためにも、トップページへリンクすることをおすすめします。

## このサイトの開発環境
このサイトは [VitePress](https://vitepress.dev/){target=_blank} ([Vue](https://vuejs.org/){target=_blank} `{{ version }}`) を用いて構築しています。  
すべての機能の利用には JavaScript が必要になりますが、無効、または未実装の環境でも閲覧は可能です。

なお、このサイトは Mozilla Firefox を使用して開発しており、次のウェブブラウザからのアクセスを想定しています:
- Mozilla Firefox (PC, Latest)
- Google Chrome (PC, Latest)

このサイトに不具合・欠陥を見つけた場合は、 [GitHub Issue](https://github.com/zawa-ch/zawa-ch.stellar-drop.info/issues/new/choose) にてお知らせください。

## オープンソースライセンス
このサイトの構築には、
[VitePress](https://vitepress.dev/){target=_blank}、
[Vue.js](https://vuejs.org/){target=_blank}、
[markdown-it](https://github.com/markdown-it/markdown-it){target=_blank}、
[unified](https://unifiedjs.com){target=_blank}(hast)、
[K<sup>A</sup>T<sub>E</sub>X](https://katex.org){target=_blank}、
[Shiki](http://shiki.style/){target=_blank}
などのオープンソースのソフトウェアを使用しています。

<small>これらのソフトウェアの開発者のみなさん、ありがとうございます！</small>

## 著作権
{{ theme.footer?.copyright }}

このサイトは<a target="_blank" href="/license">既定のライセンス</a>の下で公開されています。
