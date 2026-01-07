import '../utils/d';
import { URIRef } from '../utils/uri';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';
import { RuleCore } from 'markdown-it/lib/parser_core.mjs';
import { RuleInline } from 'markdown-it/lib/parser_inline.mjs';
import Token from 'markdown-it/lib/token.mjs';
import mditAbbr from 'markdown-it-abbr';
import mditBracketedSpans from 'markdown-it-bracketed-spans';
import mditContainer from 'markdown-it-container';
import mditDeflist from 'markdown-it-deflist';
import mditFootnote from 'markdown-it-footnote';
import mditIns from 'markdown-it-ins';
import mditKatex from 'markdown-it-katex';
import mditMark from 'markdown-it-mark';
import mditSub from 'markdown-it-sub';
import mditSup from 'markdown-it-sup';
import { Comment, defineComponent, h, VNode } from "vue";
import { Enumerable, unwrapDefined, unwrapNonnull } from "../utils/type-util";
import KatexComponent from './katex-component.vue';
import DateTip from '../gcomponents/date-tip.vue';
import ShieldsLink from '../gcomponents/shields-link.vue';
import { defaultSchema, validator } from '../utils/hscript-validator';
import CodeBlock from './code-block.vue';
import MisskeyNote from '../gcomponents/misskey-note.vue';

/**
 * MarkdownIt トークン列をVueでレンダリングするためのコンポーネント
 */
export default defineComponent(setup, { props: ['ast'] });
function setup(props: {
	ast: Token[]
}) {
	return () => [...mditRenderView(props.ast.values())];
}

/**
 * mdit-component で使用できるトークン列を得るための Markdown パーサー
 */
export function useMarkdownParser<TFrontMatter = unknown>(opts?: {
	disable?: string[];
	enable?: string[];
	extensions?: {
		subscript?: boolean;
		superscript?: boolean;
		footnote?: boolean;
		defList?: boolean;
		abbreviation?: boolean;
		insert?: boolean;
		mark?: boolean;
		math?: boolean;
	};
}) {
	const mdit = MarkdownIt({
		html: false,
		xhtmlOut: true,
		breaks: false,
		linkify: true,
	});
	mdit.enable(opts?.enable ?? []);
	mdit.disable(opts?.disable ?? []);
	mdit.use(mditComponentsPlugin);
	mdit.use(mditContainer, 'error');
	mdit.use(mditContainer, 'caution');
	mdit.use(mditContainer, 'danger');
	mdit.use(mditContainer, 'warning');
	mdit.use(mditContainer, 'info');
	mdit.use(mditContainer, 'note');
	mdit.use(mditContainer, 'tip');
	mdit.use(mditContainer, 'important');
	mdit.use(mditContainer, 'details');
	if (opts?.extensions?.subscript ?? true) { mdit.use(mditSub); }
	if (opts?.extensions?.superscript ?? true) { mdit.use(mditSup); }
	if (opts?.extensions?.footnote ?? true) { mdit.use(mditFootnote); }
	if (opts?.extensions?.defList ?? true) { mdit.use(mditDeflist); }
	if (opts?.extensions?.abbreviation ?? true) { mdit.use(mditAbbr); }
	if (opts?.extensions?.insert ?? true) { mdit.use(mditIns); }
	if (opts?.extensions?.mark ?? true) { mdit.use(mditMark); }
	if (opts?.extensions?.math ?? true) { mdit.use(mditKatex, {}) };
	mdit.use(mditBracketedSpans, {});
	mdit.use(mditAttributePlugin, {});
	return (text: string) => {
		const fmResult = fm<TFrontMatter>(text);
		const env = {};
		const result = mdit.parse(fmResult.body, env);
		return { frontmatter: fmResult.attributes, token: result, env: env };
	};
}

/**
 * markdown-it のトークン列を VNode へ変換するためのイテレータを取得します
 * @param token VNode への変換を行う markdown-it Token 列のイテレータ。
 */
function mditRenderView(token: Enumerable<Token>): IteratorObject<VNode | string> {

	const parsableAsJson = (s: string) => { try { JSON.parse(s); return true; } catch (err) { return false; } };

	const customBlock = (token: Token, subtree: (children: Enumerable<Token>) => IteratorObject<VNode | string>): VNode => {
		if (!token.type.startsWith('container_')) { throw Error('Invalid argument'); }
		const type = token.type.replace(/^container_/, '');
		const attrs = validator.sanitizeAttributes('div', token.attrs ?? [], {
			keyRules: [{ cond: (_tagname, attr) => attr === 'title', filter: 'reject' }, ...defaultSchema.attributeKeyFilterRules],
		});
		attrs.class = (attrs.class ?? []).concat(['custom-block', type]);
		const title = token.attrGet('title') ?? token.info.replace(/^\s*[^\s]+\s*/, '').trim();
		return h('div', attrs, [
			h('p', { class: ['custom-block-title'].concat(title ? ['custom-block-title-default'] : []) }, title ? title : type.toUpperCase()),
			...subtree(token.children ?? []),
		]);
	}

	const inlineComponents: { name: string, process: (token: Token, subtree: (children: Enumerable<Token>) => IteratorObject<VNode | string>) => VNode | string }[] = [
		{
			name: 'date', process: (token) => {
				return h(DateTip, validator.sanitizeAttributes('span', token.attrs ?? [], {
					keyRules: [{ cond: (_tagname, key) => /^:?date$/.test(key), filter: 'accept' }, { cond: (_tagname, key) => /^:?fuzzyness$/.test(key), filter: 'accept' }, ...defaultSchema.attributeKeyFilterRules],
					valueRules: [{ cond: (_tagname, entry) => [':date', ':fuzzyness'].includes(entry[0]) && parsableAsJson(entry[1]), filter: 'rewrite', to: (entry) => [entry[0].replace(/^:/, ''), JSON.parse(entry[1])] }, ...defaultSchema.attributeEntryFilterRules]
				}));
			}
		},
		{
			name: 'shieldsLink', process: (token) => {
				const href = token.attrGet('href');
				const tgt = href ? URIRef.parse(href) : null;
				return h(ShieldsLink, {
					target: tgt && (tgt.authority || tgt.scheme) ? '_blank' : undefined, ...validator.sanitizeAttributes('a', token.attrs ?? [], {
						keyRules: [{ cond: (_tagname, key) => ['badgeStyle', 'logo', 'color'].includes(key), filter: 'accept' }, { cond: (_tagname, key) => ['badgeStyle', 'logo', 'color'].includes(key), filter: 'accept' }, ...defaultSchema.attributeKeyFilterRules],
						valueRules: [{ cond: (_tagname, entry) => entry[0] === 'badgeStyle' && ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'].includes(entry[1]), filter: 'rewrite', to: (s) => [s[0], s[1] as 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'] }, { cond: (_tagname, entry) => entry[0] === 'badgeStyle', filter: 'reject' }, ...defaultSchema.attributeEntryFilterRules]
					}), href: (tgt?.href ?? '')
				});
			}
		},
	];

	const quoteblockComponents: { name: string, process: (token: Token, subtree: (children: Enumerable<Token>) => IteratorObject<VNode | string>) => VNode | string }[] = [
		{
			name: 'miNote', process: (token) => {
				const attrs = validator.sanitizeAttributes('blockquote', token.attrs ?? [], {
					keyRules: [{ cond: (_tagname, attr) => ['host', 'noteId'].includes(attr), filter: 'accept' }, ...defaultSchema.attributeKeyFilterRules],
				});
				return h(MisskeyNote, { ...attrs, host: attrs['host'] ?? '', noteId: attrs['noteId'] ?? '' });
			}
		}
	];

	const tokenProcessor: { condition: (token: Token) => boolean, process: (token: Token, subtree: (children: Enumerable<Token>) => IteratorObject<VNode | string>) => { array: false, value: VNode | string } | { array: true, value: (VNode | string)[] } }[] = [
		{
			condition: (token) => token.hidden,
			process: (token, subtree) => { return token.children ? { array: true, value: [...subtree(token.children)] } : { array: false, value: h(Comment, 'hidden') }; }
		},
		{
			condition: (token) => token.type === 'text',
			process: (token) => { return { array: false, value: token.content }; }
		},
		{
			condition: (token) => token.type === 'inline',
			process: (token, subtree) => { return { array: true, value: [...subtree(token.children ?? [])] }; }
		},
		{
			condition: (token) => token.type === 'image',
			process: (token) => { return { array: false, value: h('img', validator.sanitizeAttributes('img', token.attrs ?? [])) }; }
		},
		{
			condition: (token) => token.type === 'code_inline',
			process: (token) => { return { array: false, value: h('code', validator.sanitizeAttributes('code', token.attrs ?? []), token.content) }; }
		},
		{
			condition: (token) => token.type === 'code_block',
			process: (token) => { return { array: false, value: h(CodeBlock, { ...validator.sanitizeAttributes('code', token.attrs ?? []), code: token.content.trimEnd() }) }; }
		},
		{
			condition: (token) => token.type === 'fence',
			process: (token) => { return { array: false, value: h(CodeBlock, { ...validator.sanitizeAttributes('code', token.attrs ?? []), code: token.content.trimEnd(), lang: token.info }) }; }
		},
		{
			condition: (token) => token.type === 'math_inline',
			process: (token) => { return { array: false, value: h(KatexComponent, { ...validator.sanitizeAttributes('math', token.attrs ?? []), display: 'inline', expr: token.content }) }; }
		},
		{
			condition: (token) => token.type === 'math_block',
			process: (token) => { return { array: false, value: h(KatexComponent, { ...validator.sanitizeAttributes('math', token.attrs ?? []), display: 'block', expr: token.content }) }; }
		},
		{
			condition: (token) => token.type === 'inline_component',
			process: (token, subtree) => {
				if (typeof token.meta !== 'object') { throw Error(`Expected "object", but got "${typeof token.meta}"`); }
				if (typeof token.meta.name !== 'string') { throw Error(`Expected "string", but got "${typeof token.meta.name}"`); }
				const comp = inlineComponents.find((comp) => comp.name === token.meta.name);
				if (comp === undefined) {
					console.warn(`unrecognized inline component "${token.meta.name}"`, token);
					return { array: false, value: h('span', validator.sanitizeAttributes('span', token.attrs ?? []), [...subtree(token.children ?? [])]) };
				}
				return { array: false, value: comp.process(token, subtree) };
			}
		},
		{
			condition: (token) => token.type === 'quoteblock_component',
			process: (token, subtree) => {
				if (typeof token.meta !== 'object') { throw Error(`Expected "object", but got "${typeof token.meta}"`); }
				if (typeof token.meta.name !== 'string') { throw Error(`Expected "string", but got "${typeof token.meta.name}"`); }
				const comp = quoteblockComponents.find((comp) => comp.name === token.meta.name);
				if (comp === undefined) {
					console.warn(`unrecognized inline component "${token.meta.name}"`, token);
					return { array: false, value: h('blockquote', validator.sanitizeAttributes('span', token.attrs ?? []), [...subtree(token.children ?? [])]) };
				}
				return { array: false, value: comp.process(token, subtree) };
			}
		},
		{
			condition: (token) => ['container_info', 'container_note', 'container_tip', 'container_important', 'container_warning', 'container_caution', 'container_danger'].includes(token.type),
			process: (token, subtree) => { return { array: false, value: customBlock(token, subtree) }; }
		},
		{
			condition: (token) => token.type === 'container_details',
			process: (token, subtree) => {
				const attrs = validator.sanitizeAttributes('details', token.attrs ?? []);
				attrs.class = (attrs.class ?? []).concat(['custom-block', 'details']);
				const title = token.info.replace(/^\s*[^\s]+\s*/, '').trim();
				return {
					array: false,
					value: h('details', attrs, title ? [h('summary', title), ...subtree(token.children ?? []),] : [...subtree(token.children ?? []),])
				};
			},
		},
		{
			condition: (token) => token.type === 'footnote',
			process: (token, subtree) => { return { array: false, value: h('li', { id: `footnote-${token.meta.label}`, class: ['footnote-item'] }, [...subtree(token.children ?? [])]) }; }
		},
		{
			condition: (token) => token.type === 'footnote_ref',
			process: (token) => { return { array: false, value: h('a', { id: `fnref-${token.meta.label}-${token.meta.subId}`, class: ['footnote-ref'], href: `#footnote-${token.meta.label}` }, h('sup', `[${token.meta.id + 1}]`)) }; }
		},
		{
			condition: (token) => token.type === 'footnote_anchor',
			process: (token) => { return { array: false, value: h('a', { class: ['footnote-anchor'], href: `#fnref-${token.meta.label}-${token.meta.subId}` }, `↩`) }; }
		},
		{
			condition: (token) => token.type === 'footnote_block',
			process: (token, subtree) => { return { array: false, value: h('section', { class: ['footnote'] }, h('ol', [...subtree(token.children ?? [])])) }; }
		},
		{
			condition: (token) => token.type === 'link',
			process: (token, subtree) => {
				const href = token.attrGet('href');
				const tgt = href ? URIRef.parse(href) : null;
				return { array: false, value: h('a', { target: tgt && (tgt.authority || tgt.scheme) ? '_blank' : undefined, ...validator.sanitizeAttributes('a', token.attrs ?? []) }, [...subtree(token.children ?? [])]) };
			}
		},
		{
			condition: (token) => ['softbreak', 'hardbreak', 'hr'].includes(token.type),
			process: (token) => { return { array: false, value: h(token.tag, validator.sanitizeAttributes(token.tag, token.attrs ?? [])) }; }
		},
		{
			condition: (token) => ['heading'].includes(token.type),
			process: (token, subtree) => {
				const attrs = validator.sanitizeAttributes(token.tag ?? 'div', token.attrs ?? [], {
					keyRules: [{ cond: (_tagname, attr) => attr === 'id', filter: 'accept' }, ...defaultSchema.attributeKeyFilterRules],
				});
				return {
					array: false,
					value: h(token.tag ?? 'div', attrs, [...subtree(token.children ?? [])].concat(typeof attrs.id === 'string' ? [h('a', { class: ['header-anchor'], href: `#${attrs.id}` })] : [])),
				};
			},
		},
		{
			condition: (token) => ['paragraph', 'blockquote', 'bullet_list', 'ordered_list', 'list_item', 'table', 'thead', 'tr', 'th', 'td', 'tbody'].includes(token.type),
			process: (token, subtree) => { return { array: false, value: h(token.tag ?? 'div', validator.sanitizeAttributes(token.tag ?? 'div', token.attrs ?? []), [...subtree(token.children ?? [])]) }; }
		},
		{
			condition: (token) => ['em', 'strong', 's', 'del', 'ins', 'mark', 'span'].includes(token.type),
			process: (token, subtree) => { return { array: false, value: h(token.tag ?? 'span', validator.sanitizeAttributes(token.tag ?? 'span', token.attrs ?? []), [...subtree(token.children ?? [])]) }; }
		},
	];

	/**
	 * Token 配列を木構造に変換するためのイテレータを取得します
	 * @param token 変換元のトークン列。
	 * @returns ネストされた Token を出力するイテレータ。
	 */
	function nestTonkenView(token: Enumerable<Token>): IteratorObject<Token> {
		const pLeaf = (token: Enumerable<Token>): IteratorObject<Token> => {
			const iter = token[Symbol.iterator]();
			const next = (): IteratorResult<Token> => {
				const item = iter.next();
				if (item.done) { throw Error(`unexpected token end`); }
				switch (item.value.nesting) {
					case 0: {
						if (item.value.children !== null) {
							item.value.children = [...nestTonkenView(item.value.children.values())];
						}
						return { done: false, value: item.value };
					}
					case 1: {
						if (item.value.children !== null) { throw Error(`unexpected child contents ${item.value.type} ${JSON.stringify(item.value)}`); }
						item.value.type = item.value.type.replace(/_open$/, '');
						item.value.children = [...pLeaf(iter)];
						item.value.nesting = 0;
						return { done: false, value: item.value };
					}
					case -1: { return { done: true, value: undefined }; }
				}
			}
			const sym = { next, [Symbol.iterator]: () => sym };
			return sym;
		};
		const iter = token[Symbol.iterator]();
		const next = (): IteratorResult<Token> => {
			const item = iter.next();
			if (item.done) { return { done: true, value: undefined }; }
			switch (item.value.nesting) {
				case 0: {
					if (item.value.children !== null) {
						item.value.children = [...nestTonkenView(item.value.children.values())];
					}
					return { done: false, value: item.value };
				}
				case 1: {
					if (item.value.children !== null) { throw Error(`unexpected child contents ${item.value.type} ${JSON.stringify(item.value)}`); }
					item.value.type = item.value.type.replace(/_open$/, '');
					item.value.nesting = 0;
					item.value.children = [...pLeaf(iter)];
					return { done: false, value: item.value };
				}
				case -1: { throw Error(`unexpected tag-close token in top level ${item.value.type} ${JSON.stringify(item.value)}`); }
			}
		}
		const sym = { next, [Symbol.iterator]: () => sym };
		return sym;
	}

	const iter = nestTonkenView(token);
	let cache: (VNode | string)[] = [];
	const next = (): IteratorResult<VNode | string> => {
		if (cache.length > 0) { return { done: false, value: cache.shift()! } }
		const item = iter.next();
		if (item.done) { return { done: true, value: undefined }; }
		if (item.value.nesting !== 0) { throw Error(`unexpected tag-nesting token in top level ${item.value.type} ${JSON.stringify(item.value)}`); }
		const process = tokenProcessor.find((p) => p.condition(item.value))?.process;
		if (!process) {
			console.warn('unimplemented token', item.value);
			return { done: false, value: (item.value.children ? h(item.value.tag ? item.value.tag : (item.value.block ? 'div' : 'span'), Object.fromEntries(item.value.attrs ?? []), [...mditRenderView(item.value.children.values())]) : item.value.tag ? h(item.value.tag, Object.fromEntries(item.value.attrs ?? []), item.value.content) : item.value.content) };
		}
		const result = process(item.value, (children) => mditRenderView(children));
		if (result.array && result.value.length <= 0) {
			return { done: false, value: h(Comment, 'empty') };
		} else if (result.array) {
			result.value = result.value.map((i) => typeof i !== 'string' ? i : i);
			cache.push(...result.value);
			return { done: false, value: cache.shift()! };
		} else {
			return { done: false, value: typeof result.value !== 'string' ? result.value : result.value };
		}
	}
	const sym = { next, [Symbol.iterator]: () => sym };
	return sym;
}

/**
 * 文字列を走査し、条件を満たす文字の位置を取得する
 * @param src 走査対象の文字列
 * @param begin 文字列の走査開始位置。
 * @param end 文字列の走査終了位置。
 * @returns 条件を満たす文字が見つかった場合その位置、そうでない場合 null 。
 */
function scanString(src: string, conds: ((char: number, get: (i: number) => { char: number | null, index: number }) => boolean)[], begin: number = 0, end: number = src.length): number | null {
	const gc = (pos: number) => src.charCodeAt(pos);
	var pos = begin;
	while (pos < end && !conds.some((c) => c(gc(pos), (i) => { return { char: pos + i >= begin && pos + i < end ? gc(pos + i) : null, index: pos + i - begin } }))) { pos = pos + 1; }
	return pos < end ? pos : null;
}

/**
 * 文字列を走査し、条件を満たす文字の最後の位置を取得する
 * @param src 走査対象の文字列
 * @param begin 文字列の走査開始位置。
 * @param end 文字列の走査終了位置。
 * @returns 条件を満たす文字が見つかった場合その位置、そうでない場合 null 。
 */
function rscanString(src: string, conds: ((char: number, get: (i: number) => { char: number | null, index: number }) => boolean)[], begin: number = src.length, end: number = 0): number | null {
	const gc = (pos: number) => src.charCodeAt(pos);
	var pos = begin;
	while (pos > end && !conds.some((c) => c(gc(pos - 1), (i) => { return { char: pos + i - 1 >= end && pos + i - 1 < begin ? gc(pos + i - 1) : null, index: pos + i - end - 1 } }))) { pos = pos - 1; }
	return pos > end ? pos - 1 : null;
}

const mditAttributePlugin = (mdit: MarkdownIt, params?: {}) => {
	const deleteString = (s: string, begin: number, end: number) => s.slice(0, begin) + s.slice(end);

	const findDelim = (src: string, from: 'begin' | 'end' = 'begin') => {
		const gc = (pos: number) => src.charCodeAt(pos);
		const parse = (begin: number) => {
			if (gc(begin) !== 0x7B) { return null; }
			let p = begin + 1;
			for (; ;) {
				const i = scanString(src, [(c) => c === 0x22 /* """ */, (c) => c === 0x27 /* "'" */, (c) => c === 0x7D /* "}" */], p);
				if (i === null) { return null; }
				switch (gc(i)) {
					case 0x22: {
						const qe = scanString(src, [(c, i) => i(0).index === 0 && c === 0x22, (c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x22,], i + 1);
						if (qe === null) { return null; }
						p = qe + 1;
						break;
					}
					case 0x27: {
						const qe = scanString(src, [(c, i) => i(0).index === 0 && c === 0x27, (c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x27,], i + 1);
						if (qe === null) { return null; }
						p = qe + 1;
						break;
					}
					case 0x7D: { return { begin: begin, end: i + 1 }; }
					default: { return null; }
				}
			}
		};
		const rparse = (end: number) => {
			if (gc(end - 1) !== 0x7D) { return null; }
			let p = end - 1;
			for (; ;) {
				const i = rscanString(src, [(c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x22 /* """ */, (c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x27 /* "'" */, (c) => c === 0x7B /* "{" */], p);
				if (i === null) { return null; }
				switch (gc(i)) {
					case 0x22: {
						const qe = rscanString(src, [(c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x22,], i);
						if (qe === null) { return null; }
						p = qe;
						break;
					}
					case 0x27: {
						const qe = rscanString(src, [(c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x27,], i);
						if (qe === null) { return null; }
						p = qe;
						break;
					}
					case 0x7B: { return { begin: i, end: end }; }
					default: { return null; }
				}
			}
		};
		switch (from) {
			case 'begin': { return parse(0); }
			case 'end': { return rparse(src.length); }
		}
	};

	type ParamToken = { position: { begin: number, end: number }, beforeBreak: boolean } & ({ type: 'open_bracket' | 'close_bracket' | 'keyvalue_punctuation' } | { type: 'dquot_value' | 'squot_value' | 'raw_value', value: string });
	/**
	 * パラメーター文字列をトークン列に変換するためのイテレータ
	 */
	const paramToknizeIter = (src: string, begin: number = 0, end: number = src.length): IteratorObject<ParamToken> => {
		let open = false;
		let close = false;
		let index = begin;
		const skipNsp = () => { index = scanString(src, [(c) => c > 0x20], index, end) ?? end; };
		const next = (): IteratorResult<ParamToken> => {
			if (close) { return { done: true, value: undefined }; }
			if (begin >= end) { throw Error(`Unexpected end of string. Expected "{"(0x7B).`); }
			const initIndex = index;
			skipNsp();
			if (begin >= end) { throw Error(`Unexpected end of string. Expected "{"(0x7B).`); }
			const beginIndex = index;
			switch (src.charCodeAt(index)) {
				case 0x3D: {
					++index;
					if (!open) { throw Error(`Unexpected token. Expected "{"(0x7B), but got 0x${src.charCodeAt(index).toString(16)} (index ${index} in "${src}")`); }
					return { done: false, value: { type: 'keyvalue_punctuation', position: { begin: beginIndex, end: index }, beforeBreak: beginIndex !== initIndex } };
				}
				case 0x7B: {
					if (open) { throw Error(`Unexpected token. Unexpected "{"(0x7B), but got 0x${src.charCodeAt(index).toString(16)} (index ${index} in "${src}")`); }
					open = true;
					++index;
					return { done: false, value: { type: 'open_bracket', position: { begin: beginIndex, end: index }, beforeBreak: beginIndex !== initIndex } };
				}
				case 0x7D: {
					if (!open) { throw Error(`Unexpected token. Expected "{"(0x7B), but got 0x${src.charCodeAt(index).toString(16)} (index ${index} in "${src}")`); }
					close = true;
					++index;
					return { done: false, value: { type: 'close_bracket', position: { begin: beginIndex, end: index }, beforeBreak: beginIndex !== initIndex } };
				}
				case 0x22: {
					if (!open) { throw Error(`Unexpected token. Expected "{"(0x7B), but got 0x${src.charCodeAt(index).toString(16)} (index ${index} in "${src}")`); }
					const endIndex = scanString(src, [
						(c, i) => i(0).index === 0 && c === 0x22,
						(c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x22,
					], index + 1, end);
					if (endIndex === null) { throw Error(`Unexpected end of string. (in scanning """(0x22))`); }
					index = endIndex + 1;
					return { done: false, value: { type: 'dquot_value', position: { begin: beginIndex, end: endIndex + 1 }, value: src.substring(beginIndex + 1, endIndex), beforeBreak: beginIndex !== initIndex } };
				}
				case 0x27: {
					if (!open) { throw Error(`Unexpected token. Expected "{"(0x7B), but got 0x${src.charCodeAt(index).toString(16)} (index ${index} in "${src}")`); }
					const endIndex = scanString(src, [
						(c, i) => i(0).index === 0 && c === 0x27,
						(c, i) => ![null, 0x5C].includes(i(-1).char) && c === 0x27,
					], index + 1, end);
					if (endIndex === null) { throw Error(`Unexpected end of string. (in scanning "'"(0x27))`); }
					index = endIndex + 1;
					return { done: false, value: { type: 'squot_value', position: { begin: beginIndex, end: endIndex + 1 }, value: src.substring(beginIndex + 1, endIndex), beforeBreak: beginIndex !== initIndex } };
				}
				default: {
					if (!open) { throw Error(`Unexpected token. Expected "{"(0x7B), but got 0x${src.charCodeAt(index).toString(16)} (index ${index} in "${src}")`); }
					const endIndex = scanString(src, [
						(c) => c <= 0x20,
						(c) => c === 0x22,
						(c) => c === 0x27,
						(c) => c === 0x3D,
						(c) => c === 0x7D,
					], index + 1, end);
					index = endIndex ? endIndex : end;
					return { done: false, value: { type: 'raw_value', position: { begin: beginIndex, end: endIndex ?? end }, value: src.substring(beginIndex, endIndex ?? end).trim(), beforeBreak: beginIndex !== initIndex } };
				}
			}
		}
		const sym = { next, [Symbol.iterator]() { return sym; } };
		return sym;
	};

	/**
	 * パラメータートークン列を解析するためのイテレータ
	 */
	const paramsParseIter = (tokens: Enumerable<ParamToken>): IteratorObject<[string] | [string, string]> => {
		const iter = tokens[Symbol.iterator]();
		let cache: ParamToken[] = [];
		const getToken = (): IteratorResult<ParamToken> => {
			const c = cache.shift();
			if (c !== undefined) { return { done: false, value: c }; } else { return iter.next(); }
		};
		let cIndex: number | undefined = undefined;
		let done: boolean = false;
		let open: boolean = false;
		let willBreak: boolean = false;
		const assertBreak = (token: ParamToken) => { if (willBreak && !token.beforeBreak) { throw Error(`Expected whitespace between tokens, but not. (in ${token.position.begin})`); } }
		const next = (): IteratorResult<[string] | [string, string]> => {
			if (done) { return { done: true, value: undefined }; }
			const v = getToken();
			if (v.done) { throw Error(`Unexpected stream end. Expect ${open ? 'close_bracket' : 'open_bracket'}.`); }
			if (!open && v.value.type === 'open_bracket') { open = true; return next(); }
			if (!open) { throw Error(`Unexpected ${v.value.type}. Expect open_bracket. (in ${v.value.position.begin})`); }
			switch (v.value.type) {
				case 'close_bracket': { done = true; open = false; cIndex = v.value.position.end; return { done: true, value: undefined }; }
				case 'raw_value': {
					assertBreak(v.value);
					const key = v.value.value;
					const vsecond = getToken();
					if (vsecond.done) { throw Error(`Unexpected stream end. Expect keyvalue_punctuation, rawvalue, or close_bracket.`); }
					if (vsecond.value.type === 'raw_value') {
						cache.push(vsecond.value);
						willBreak = true;
						cIndex = v.value.position.end;
						return { done: false, value: [key] };
					} else if (vsecond.value.type === 'close_bracket') {
						cache.push(vsecond.value);
						willBreak = false;
						cIndex = v.value.position.end;
						return { done: false, value: [key] };
					} else if (vsecond.value.type !== 'keyvalue_punctuation') {
						throw Error(`Unexpected ${vsecond.value.type}. Expect keyvalue_punctuation, raw_value, or close_bracket. (in ${vsecond.value.position.begin})`);
					} else { /* keep going */ }
					const vvalue = getToken();
					if (vvalue.done) { throw Error(`Unexpected stream end. Expected dquot_value, or squot_value.`); }
					if (vvalue.value.type !== 'dquot_value' && vvalue.value.type !== 'squot_value') { throw Error(`Unexpected ${vvalue.value.type}. Expect dquot_value, or squot_value. (in ${vvalue.value.position.begin})`); }
					willBreak = true;
					cIndex = vvalue.value.position.end;
					return { done: false, value: [key, vvalue.value.value] };
				}
				default: { throw Error(`Unexpected ${v.value.type}. Expect close_bracket, or raw_value. (in ${v.value.position.begin})`); }
			}
		}
		const sym = { next, pointer() { return cIndex; }, [Symbol.iterator]() { return sym; } };
		return sym;
	};

	const parseParams = (src: string, begin?: number, end?: number) => {
		try {
			const iter = paramsParseIter(paramToknizeIter(src, begin, end));
			let attrs: [string, string][] = [];
			let classes: string[] = [];
			let id: string | undefined = undefined;
			for (const item of iter) {
				if (item.length === 2 && /^:?[a-zA-Z_][-\da-zA-Z_]*$/g.test(item[0])) { attrs.push(item); continue; }
				if (item.length === 2) { Error(`"${item[0]}" is not match any pattern.`); }
				const value = item[0];
				const classRegex = /^\.([a-zA-Z_][-\da-zA-Z_]*)$/.exec(value);
				const idRegex = /^#(.*)$/.exec(value);
				const attrRegex = /^([a-zA-Z_][-\da-zA-Z_]*)$/.exec(value);
				if (classRegex && classRegex[1]) { classes.push(classRegex[1]); continue; }
				if (idRegex && idRegex[1] && !id) { id = idRegex[1]; continue; }
				if (attrRegex && attrRegex[1] && !id) { attrs.push([attrRegex[1], 'true']); continue; }
				throw Error(`"${value}" is not match any pattern.`);
			}
			return attrs;
		} catch (err) {
			return null;
		}
	};

	type TransformerResult = IteratorResult<Token> | undefined;
	type TransformerParentToken = { token: IteratorResult<Token>, parent: TransformerParentToken | null };
	interface TransformerObject { transform(token: IteratorResult<Token>, parent: TransformerParentToken | null): TransformerResult };
	function transformerView(tokens: Iterable<Token>, transformers: (() => TransformerObject)[]): IteratorObject<Token> {
		const tokenIt = tokens[Symbol.iterator]();
		const transformerIns = transformers.map((t) => t());
		const next = (): IteratorResult<Token> => {
			let token: IteratorResult<Token> | undefined = undefined;
			let trying = 0;
			do {
				if (trying >= 1024) { throw Error('Exceeded recursion limit. May be a software bug.'); }
				++trying;
				token = tokenIt.next();
				for (const t of transformerIns) {
					if (token === undefined) { break; }
					token = t.transform(token, null);
				}
			} while (token === undefined);
			if (!token.done && token.value.children) {
				token.value.children = [...transformerView(token.value.children, transformers)];
			}
			return token;
		}
		const sym = { next, [Symbol.iterator]() { return sym; } };
		return sym;
	}
	const transformers: (() => TransformerObject)[] = [
		() => {
			// fenced code blocks
			const transform = (token: IteratorResult<Token>): IteratorResult<Token> => {
				if (token.done || !token.value.block) { return token; }
				const delim = findDelim(token.value.info, 'end');
				if (delim === null) { return token; }
				const attrs = parseParams(token.value.info, delim.begin, delim.end);
				if (attrs === null) { return token; }
				token.value.attrs = (token.value.attrs ?? []).concat(attrs);
				token.value.info = deleteString(token.value.info, delim.begin, delim.end);
				return { done: false, value: token.value };
			}
			return { transform };
		},
		() => {
			// inline nesting 0
			let p = 0;
			const s = [
				(token: IteratorResult<Token>) => !token.done && ['image', 'code_inline'].includes(token.value.type),
				(token: IteratorResult<Token>) => !token.done && token.value.type === 'text' && findDelim(token.value.content, 'begin') !== null,
			];
			const transform = (token: IteratorResult<Token>, parent: TransformerParentToken | null): IteratorResult<Token> => {
				if (parent === null || parent.token.done || parent.token.value.type !== 'inline') { return token; }
				if (p === 1 && s[1](token)) {
					p = 0;
					const delim = unwrapNonnull(findDelim(token.value.content, 'begin'));
					const attrs = parseParams(token.value.content, delim.begin, delim.end);
					if (attrs === null) { return token; }
					token.value.attrs = (token.value.attrs ?? []).concat(attrs);
					token.value.content = deleteString(token.value.content, delim.begin, delim.end);
					return { done: false, value: token.value };
				} else {
					p = s[0](token) ? 1 : 0;
					return token;
				}
			}
			return { transform };
		},
		() => {
			// tables
			let cache: Token[] = [];
			const transform = (token: IteratorResult<Token>): IteratorResult<Token> | undefined => {
				if (token.done && cache.length === 0) { return token; } else if (token.done && cache.length < 4) { return { done: false, value: unwrapDefined(cache.shift()) }; } else if (token.done) { /* keep going */ } else { cache.push(token.value); }
				if (cache.length < 4) { return undefined; }
				// これ以降は少なくとも cache の要素数は4以上ある
				if (cache[0].type !== 'table_close' || cache[1].type !== 'paragraph_open' || cache[2].type !== 'inline' || cache[3].type !== 'paragraph_close') { return { done: false, value: unwrapDefined(cache.shift()) }; }
				const delim = findDelim(cache[2].content, 'begin');
				if (delim === null || delim.begin !== 0 || delim.end !== cache[2].content.length) { return { done: false, value: unwrapDefined(cache.shift()) }; }
				const attrs = parseParams(cache[2].content, delim.begin, delim.end);
				if (attrs === null) { return { done: false, value: unwrapDefined(cache.shift()) }; }
				const rtoken = unwrapDefined(cache.shift());
				rtoken.attrs = (rtoken.attrs ?? []).concat(attrs);
				cache.splice(0, 3);
				return { done: false, value: rtoken };
			}
			return { transform };
		},
		() => {
			// inline attributes
			const processSingle = (arr: Token[], index: number) => {
				if (index >= arr.length || arr[index].nesting !== 0) { throw Error('invalid argument'); }
				if (arr.length <= index + 1 || arr[index + 1].type !== 'text') { return; }
				const delim = findDelim(arr[index + 1].content, 'begin');
				if (delim === null) { return; }
				const attrs = parseParams(arr[index + 1].content, delim.begin, delim.end);
				if (attrs === null) { return; }
				arr[index].attrs = (arr[index].attrs ?? []).concat(attrs);
				arr[index + 1].content = deleteString(arr[index + 1].content, delim.begin, delim.end);
				if (arr[index + 1].content.length === 0) { arr[index + 1].type = '!marked_deletion!'; }
			};
			const findEnd = (arr: Token[], begin: number): number => {
				if (begin >= arr.length || arr[begin].nesting !== 1) { throw Error('invalid argument'); }
				const l = arr[begin].level;
				for (let i = begin; i < arr.length; ++i) { if (arr[i].nesting === -1 && l === arr[i].level) { return i; } }
				throw Error('Nest closing not found');
			};
			const processNest = (arr: Token[], index: number) => {
				const endIndex = findEnd(arr, index);
				if (endIndex + 1 >= arr.length) { return; }
				if (arr[endIndex + 1].type !== 'text') { return; }
				const delim = findDelim(arr[endIndex + 1].content, 'begin');
				if (delim === null) { return; }
				const attrs = parseParams(arr[endIndex + 1].content, delim.begin, delim.end);
				if (attrs === null) { return; }
				arr[index].attrs = (arr[index].attrs ?? []).concat(attrs);
				arr[endIndex + 1].content = deleteString(arr[endIndex + 1].content, delim.begin, delim.end);
				if (arr[endIndex + 1].content.length === 0) { arr[endIndex + 1].type = '!marked_deletion!'; }
			};
			const transform = (token: IteratorResult<Token>): IteratorResult<Token> => {
				if (token.done || token.value.type !== 'inline' || token.value.children === null) { return token; }
				for (let i = 0; i < token.value.children.length; ++i) {
					switch (token.value.children[i].nesting) {
						case 0: { processSingle(token.value.children, i); break; }
						case 1: { processNest(token.value.children, i); break; }
						case -1: { break; }
					}
				}
				token.value.children = token.value.children.filter((t) => t.type !== '!marked_deletion!');
				return { done: false, value: token.value };
			}
			return { transform };
		},
		() => {
			// horizonal rule
			let cache: Token[] = [];
			const hrPtn = /^ {0,3}(?:(?:- *){3,}|(?:\* *){3,}|(?:_ *){3,})/;
			const transform = (token: IteratorResult<Token>): IteratorResult<Token> | undefined => {
				if (token.done && cache.length === 0) { return token; } else if (token.done && cache.length < 3) { return { done: false, value: unwrapDefined(cache.shift()) }; } else if (token.done) { /* keep going */ } else { cache.push(token.value); }
				if (cache.length < 3) { return undefined; }
				// これ以降は少なくとも cache の要素数は3以上ある
				if (cache[0].type !== 'paragraph_open' || cache[1].type !== 'inline' || cache[2].type !== 'paragraph_close') { return { done: false, value: unwrapDefined(cache.shift()) }; }
				if (!hrPtn.test(cache[1].content)) { return { done: false, value: unwrapDefined(cache.shift()) }; }
				const delimBegin = cache[1].content.indexOf('{');
				if (delimBegin < 0) { return { done: false, value: unwrapDefined(cache.shift()) }; }
				const attrs = parseParams(cache[1].content, delimBegin);
				if (attrs === null) { return { done: false, value: unwrapDefined(cache.shift()) }; }
				cache[0].markup = cache[1].content;
				cache[0].type = 'hr';
				cache[0].tag = 'hr';
				cache[0].nesting = 0;
				const rtoken = unwrapDefined(cache.shift());
				rtoken.attrs = (rtoken.attrs ?? []).concat(attrs);
				cache.splice(0, 2);
				return { done: false, value: rtoken };
			}
			return { transform };
		},
	];

	const attributeRule: RuleCore = (state) => {
		state.tokens = [...transformerView(state.tokens, transformers)];
	}

	if (mdit.core.ruler.getRules('curly_attributes').length > 0) {
		mdit.core.ruler.before('curly_attributes', 'parse_attributes', attributeRule);
	} else {
		mdit.core.ruler.before('linkify', 'parse_attributes', attributeRule);
	}
};

/**
 * Markdownからコンポーネントを扱えるようにするための独自記法を提供する markdown-it プラグイン
 */
const mditComponentsPlugin = (mdit: MarkdownIt, params?: {}) => {
	// TODO. テスト

	/**
	 * インラインコンポーネントのための記法をサポートするためのインラインルール
	 */
	const inlineComponentRuler: RuleInline = (state): boolean => {
		let pointer = state.pos;
		const region = { begin: state.pos, end: state.posMax };
		const gc = (pos: number = pointer) => state.src.charCodeAt(pos);

		// > :
		if (gc() !== 0x3A) { return false; }
		pointer = region.begin + 1;

		// > :componentName[
		// > :componentName{
		const nameEndPointer = scanString(state.src, [
			(ch: number) => ch === 0x5B, // "["
			(ch: number) => ch === 0x7B, // "{"
			(ch: number) => ch <= 0x20, // ASCII 制御文字, 空白文字
		], pointer, region.end);
		if (nameEndPointer === null) { return false; }
		if (gc(nameEndPointer) === 0x5B) {
			// > :componentName[content]
			pointer = nameEndPointer + 1;
			const bracketEndPointer = gc(pointer) === 0x5D ? pointer : state.md.helpers.parseLinkLabel(state, pointer, true);
			if (bracketEndPointer < 0) { return false; }
			pointer = bracketEndPointer + 1;

			const token = state.push('inline_component_open', 'span', 1);
			token.meta = { name: state.src.substring(region.begin + 1, nameEndPointer) };

			state.pos = nameEndPointer + 1;
			state.posMax = bracketEndPointer;
			state.md.inline.tokenize(state);
			state.push('inline_component_close', 'span', -1);
		} else if (gc(nameEndPointer) === 0x7B) {
			// > :componentName{props}
			pointer = nameEndPointer;
			const token = state.push('inline_component_open', 'span', 1);
			token.meta = { name: state.src.substring(region.begin + 1, nameEndPointer) };
			state.push('inline_component_close', 'span', -1);
		} else {
			return false;
		}

		state.pos = pointer;
		state.posMax = region.end;
		return true;
	};

	const quoteblockComponentRuler: RuleCore = (state) => {
		const findBlockquoteClose = (tokens: Token[], begin: number = 0): number => {
			const bLevel = tokens[begin].level;
			let index = begin;
			do {
				++index;
				if (index >= tokens.length) { throw Error('Expected token "blockquote_close" not found.'); }
			} while (tokens[index].type !== 'blockquote_close' || tokens[index].level !== bLevel);
			return index;
		}
		const findFirstInline = (tokens: Token[], begin: number, end: number): { result: 'not_found', paragraph: null, inline: null } | { result: 'found', paragraph: { begin: number, end: number }, inline: number } => {
			if (end - begin < 3) { return { result: 'not_found', paragraph: null, inline: null }; }
			if (tokens[begin].type !== 'paragraph_open') { return { result: 'not_found', paragraph: null, inline: null }; }
			if (tokens[begin + 1].type !== 'inline') { return { result: 'not_found', paragraph: null, inline: null }; }
			const bLevel = tokens[begin].level;
			let index = begin;
			do {
				++index;
				if (index >= tokens.length) { return { result: 'not_found', paragraph: null, inline: null }; }
			} while (tokens[index].type !== 'paragraph_close' || tokens[index].level !== bLevel);
			return { result: 'found', paragraph: { begin, end: index }, inline: begin + 1 };
		}
		const procIter = (tokens: Token[]): IteratorObject<undefined> => {
			let index = 0;
			const sym = {
				next(): IteratorResult<undefined> {
					if (index >= tokens.length) { return { done: true, value: undefined }; }
					if (tokens[index].type !== 'blockquote_open') {
						++index;
						return { done: false, value: undefined };
					}

					const beginIndex = index;
					const endIndex = findBlockquoteClose(tokens, beginIndex);
					const firstInline = findFirstInline(tokens, beginIndex + 1, endIndex);
					const componentInfo = firstInline.result === 'found' ? /^\[:([^\s]+)\]\s*([^\n]+)?/m.exec(tokens[firstInline.inline].content) : undefined;
					const componentName = componentInfo?.[1];
					const componentParams = componentInfo?.[2]?.trim();
					if (firstInline.result === 'found' && componentName) {
						tokens[beginIndex].type = 'quoteblock_component_open';
						tokens[beginIndex].markup = '>[:';
						tokens[beginIndex].meta = { name: componentName };
						tokens[beginIndex].info = componentParams ?? "";
						tokens[endIndex].type = 'quoteblock_component_close';
						tokens[firstInline.inline].content = tokens[firstInline.inline].content.replace(/^\[:([^\s]+)\]\s*([^\n]+)?/m, '').trim();
					}
					if (firstInline.result === 'found' && !tokens[firstInline.inline].content) {
						tokens[firstInline.inline].type = '!marked_deletion!';
					}
					if (firstInline.result === 'found' && firstInline.paragraph.end - firstInline.paragraph.begin === 2 && tokens[firstInline.inline].type === '!marked_deletion!') {
						tokens[firstInline.paragraph.begin].type = '!marked_deletion!';
						tokens[firstInline.paragraph.end].type = '!marked_deletion!';
					}
					const iter = procIter(tokens.slice(beginIndex + 1, endIndex));
					while (!iter.next().done) { }

					index = endIndex + 1;
					return { done: false, value: undefined };
				},
				[Symbol.iterator]() { return sym; },
			};
			return sym;
		};
		const i = procIter(state.tokens);
		while (!i.next().done) { }
		state.tokens = state.tokens.filter((t) => t.type !== '!marked_deletion!');
	}

	if (mdit.inline.ruler.getRules('bracketed-spans').length > 0) {
		mdit.inline.ruler.before('bracketed-spans', 'inline_component', inlineComponentRuler);
	} else {
		mdit.inline.ruler.push('inline_component', inlineComponentRuler);
	}
	mdit.core.ruler.before('inline', 'blockquote_to_component', quoteblockComponentRuler);
}
