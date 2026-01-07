import { defineComponent, h, VNode } from 'vue';
import * as mfm from 'mfm-js';
import DateTip from './date-tip.vue';
import { URIRef } from '../utils/uri';
import CodeBlock from '../lcomponents/code-block.vue';

function transform(node: mfm.MfmNode): string | VNode | (string | VNode)[] {
	switch (node.type) {
		case 'quote': return h('blockquote', node.children.flatMap((i) => transform(i)));
		case 'search': return h('a', { style: { display: 'inline-block' } }, [
			h('span', { style: { display: 'inline-block', 'background-color': 'var(--color--button-bg', } }, '検索'),
			h('span', { style: { display: 'inline-block', } }, node.props.query),
		]);
		case 'blockCode': {
			return h(CodeBlock, { code: node.props.code, lang: node.props.lang !== null ? node.props.lang : undefined });
		}
		case 'mathBlock': {
			console.warn('Not implemented node: ', node);
			return '';
		}
		case 'center': return h('div', { style: { 'text-align': 'center' } }, node.children.flatMap((i) => transform(i)));
		case 'unicodeEmoji': return node.props.emoji;
		case 'emojiCode': return `:${node.props.name}:`;
		case 'bold': return h('b', node.children.flatMap((i) => transform(i)));
		case 'small': return h('small', node.children.flatMap((i) => transform(i)));
		case 'italic': return h('i', node.children.flatMap((i) => transform(i)));
		case 'strike': return h('s', node.children.flatMap((i) => transform(i)));
		case 'inlineCode': return h('code', node.props.code);
		case 'mathInline': {
			console.warn('Not implemented node: ', node);
			return '';
		}
		case 'mention': return h('a', { href: `https://${node.props.host ?? 'geoplanetary.net'}/@${node.props.username}` }, node.props.acct);
		case 'hashtag': {
			console.warn('Not implemented node: ', node);
			return '';
		}
		case 'url': {
			const tgt = URIRef.parse(node.props.url);
			return h('a', { href: node.props.url, target: tgt?.isReference ? undefined : '_blank' }, node.props.url);
		}
		case 'link': {
			const tgt = URIRef.parse(node.props.url);
			return h('a', { href: node.props.url, target: tgt?.isReference ? undefined : '_blank' }, node.children.flatMap((i) => transform(i)));
		};
		case 'fn': return transformFnNode(node);
		case 'plain': return h('span', node.children.map((i) => i.props.text));
		case 'text': {
			return node.props.text.replaceAll(/(\r\n|\r|\n)/g, '\n').split('\n').flatMap((v, i) => i != 0 ? [h('br'), v] : [v]);
		}
		default: {
			console.warn('Not implemented node: ', node);
			return '';
		}
	}
}

function validateColor(v: string | true | undefined, conversion?: (value: string) => string, fallback?: string): string | undefined {
	if (typeof v !== 'string') { return fallback; }
	const r = /^([\dA-F]{3})|([\dA-F]{4})|([\dA-F]{6})|([\dA-F]{8})$/i;
	return r.test(v) ? (conversion ?? (v => v))(v) : fallback;
}

function validateInteger(v: string | true | undefined, conversion?: (value: number) => number, fallback?: number): number | undefined {
	if (typeof v !== 'string') { return fallback; }
	const r = /^-?\d+$/i;
	return r.test(v) ? (conversion ?? (v => v))(Number.parseInt(v)) : fallback;
}

function validateNumberString(v: string | true | undefined, conversion?: (value: number) => string, fallback?: string): string | undefined {
	if (typeof v !== 'string') { return fallback; }
	const r = /^-?(\d+(\.\d*)?)|(\.\d+)([eE][+-]?\d+)?$/i;
	return r.test(v) ? (conversion ?? (v => v.toString()))(Number.parseFloat(v)) : fallback;
}

function transformFnNode(node: mfm.MfmFn): string | VNode {
	switch (node.props.name) {
		case 'x2': return h('span', { style: { display: 'inline-block', 'font-size': '200%' } }, node.children.flatMap((i) => transform(i)));
		case 'x3': return h('span', { style: { display: 'inline-block', 'font-size': '300%' } }, node.children.flatMap((i) => transform(i)));
		case 'x4': return h('span', { style: { display: 'inline-block', 'font-size': '400%' } }, node.children.flatMap((i) => transform(i)));
		case 'tada': return h('span', { style: { display: 'inline-block', 'font-size': '150%' } }, node.children.flatMap((i) => transform(i)));
		case 'sparkle': return h('span', {}, node.children.flatMap((i) => transform(i)));
		case 'bg': return h('span', {
			style: {
				display: 'inline-block',
				'background-color': validateColor(node.props.args['color'], v => `#${v}`, '#f00'),
				'overflow-wrap': 'anywhere'
			}
		}, node.children.flatMap((i) => transform(i)));
		case 'fg': return h('span', {
			style: {
				display: 'inline-block',
				'color': validateColor(node.props.args['color'], v => `#${v}`, '#f00'),
				'overflow-wrap': 'anywhere'
			}
		}, node.children.flatMap((i) => transform(i)));
		case 'border': return h('span', {
			style: {
				display: 'inline-block',
				'border-style': 'solid',
				'border-width': validateNumberString(node.props.args['width'], v => `${v}px`, '1px'),
				'border-radius': validateNumberString(node.props.args['radius'], v => `${v}px`),
				'border-color': validateColor(node.props.args['color'], v => `#${v}`, 'var(--color--theme)'),
				overflow: node.props.args['noclip'] ? undefined : 'clip',
			}
		}, node.children.flatMap((i) => transform(i)));
		case 'unixtime': {
			const d = node.children[0].type == 'text' ? validateInteger(node.children[0].props.text, v => v * 1000) : undefined;
			return h(DateTip, { date: d, fuzzyness: 'second' });
		}
		default: {
			console.warn('Not implemented fn node: ', node);
			return h('span', node.children.flatMap((i) => transform(i)));
		}
	}
}

export default defineComponent((props: {
	value: string | undefined;
	activateLink?: boolean;
}) => {
	return () => {
		const root = mfm.parse(props.value ?? '');
		return root.flatMap((i) => transform(i));
	}
}, {
	props: ['value', 'activateLink']
});
