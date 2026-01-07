import { CSSProperties } from "vue";
import { URIRef } from "./uri";

export const validator = {
	/**
	 * タグの要素名が有効なものであるかを検査します
	 * @param tagname 検査対象の要素名。
	 * @returns 要素名として有効であれば `true` 、そうでなければ `false` 。
	 */
	isValidTagname,
	/**
	 * フィルタの内容に従って、属性キーのフィルタリングを行います
	 * @param tagname 適用するタグの要素名。
	 * @param attr フィルタを行う属性。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタされた属性、フィルタによって除去された場合は `undefined` 。
	 */
	filterAttributeKey,
	/**
	 * フィルタの内容に従って、属性値のフィルタリングを行います
	 * @param tagname 適用するタグの要素名。
	 * @param attr フィルタを行う属性。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタされた属性、フィルタによって除去された場合は `undefined` 。
	 */
	filterAttributeEntry,
	/**
	 * フィルタの内容に従って、CSSクラスのフィルタリングを行います
	 * @param tagname 適用するタグの要素名。
	 * @param className フィルタを行うCSSクラス。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタされたCSSクラス、フィルタによって除去された場合は `undefined` 。
	 */
	filterClassEntry,
	/**
	 * フィルタの内容に従って、CSSスタイルのフィルタリングを行います
	 * @param tagname 適用するタグの要素名。
	 * @param style フィルタを行うCSSスタイル。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタされたCSSスタイル、フィルタによって除去された場合は `undefined` 。
	 */
	filterStyleEntry,
	/**
	 * フィルタの内容に従って、属性キーのフィルタリングを行うイテレータを取得します
	 * @param tagname 適用するタグの要素名。
	 * @param attrs フィルタを行う属性を列挙するオブジェクト。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタを行った属性を列挙するオブジェクト。
	 */
	useAttributeKeyFilterView,
	/**
	 * フィルタの内容に従って、属性値のフィルタリングを行うイテレータを取得します
	 * @param tagname 適用するタグの要素名。
	 * @param attrs フィルタを行う属性を列挙するオブジェクト。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタを行った属性を列挙するオブジェクト。
	 */
	useAttributeEntryFilterView,
	/**
	 * フィルタの内容に従って、CSSスタイルのフィルタリングを行うイテレータを取得します
	 * @param tagname 適用するタグの要素名。
	 * @param attrs フィルタを行う属性を列挙するオブジェクト。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタを行った属性を列挙するオブジェクト。
	 */
	useStyleFilterView,
	/**
	 * フィルタの内容に従って、属性のサニタイズを行うイテレータを取得します
	 * @param tagname 適用するタグの要素名。
	 * @param attrs サニタイズを行う属性を列挙するオブジェクト。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns サニタイズを行った属性を列挙するオブジェクト。
	 */
	useAttributeSanitizerView,
	/**
	 * フィルタの内容に従って、属性のサニタイズを行います
	 * @param tagname 適用するタグの要素名。
	 * @param attrs サニタイズを行う属性を列挙するオブジェクト。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns サニタイズを行った属性。
	 */
	sanitizeAttributes<TAttrValue = string>(tagname: string, attrs: Iterable<[string, string]>, rules?: {
		keyRules?: AttributeKeyFilterRule[],
		valueRules?: AttributeEntryFilterRule<TAttrValue>[],
		classRules?: AttributeKeyFilterRule[],
		styleRules?: AttributeEntryFilterRule<string>[],
	}, fallback?: {
		keyFallback?: AttributeKeyFilterRulePredicate,
		valueFallback?: AttributeEntryFilterRulePredicate<string | TAttrValue>,
		classFallback?: AttributeKeyFilterRulePredicate,
		styleFallback?: AttributeEntryFilterRulePredicate<string>,
	}): { [K: string]: string | TAttrValue } & { style: CSSProperties | undefined } & { class: string[] | undefined } {
		return Object.fromEntries(useAttributeSanitizerView(tagname, attrs, rules, fallback));
	},
	/**
	 * フィルタの内容に従って、CSSクラスのフィルタリングを行います
	 * @param tagname 適用するタグの要素名。
	 * @param attr フィルタを行うCSSクラスの配列。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタされたCSSクラスの配列。
	 */
	filterClassList,
	/**
	 * フィルタの内容に従って、CSSスタイルのサニタイズを行います
	 * @param tagname 適用するタグの要素名。
	 * @param styleText フィルタを行うCSSスタイル文字列。
	 * @param rules フィルタのルール。
	 * @param fallback いずれのルールも適用されなかった場合のフィルタの挙動。
	 * @returns フィルタされたCSSスタイルの配列、パースに失敗した場合`undefined`。
	 */
	sanitizeStyle,
	/**
	 * スタイル付け文字列をパースするためのイテレータを取得します
	 * @param styleText パースする文字列。
	 * @returns パースしたキー値列を列挙するオブジェクト。
	 * @throws パースに失敗した場合に`Error`をスロー。
	 */
	useStyleParserView,
	/**
	 * スタイル付け文字列をパースします
	 * @param styleText パースする文字列。
	 * @returns パースした`CSSProperties`オブジェクト。
	 * @throws パースに失敗した場合に`Error`をスロー。
	 */
	parseStyle(styleText: string | null | undefined): CSSProperties {
		if (!styleText) { return {}; }
		return Object.fromEntries([...useStyleParserView(styleText ?? '')].filter((item) => CSS.supports(item[0], item[1])));
	},
	/**
	 * URIが有効なものであるかを検査します
	 * @param uri 検査対象のURI文字列。
	 * @param allowScheme 許可されるスキーマ文字列。
	 * @returns URIとして有効であれば `true` 、そうでなければ `false` 。
	 */
	isValidURI,
};

export type AttributeKeyFilterRuleCondition = (tagname: string, key: string) => boolean;
export type AttributeKeyFilterRulePredicate = { filter: 'accept' | 'reject' } | { filter: 'rewrite', to: (s: string) => string };
export type AttributeKeyFilterRule = { cond: AttributeKeyFilterRuleCondition } & AttributeKeyFilterRulePredicate;
export type AttributeEntryFilterRuleCondition = (tagname: string, entry: [string, string]) => boolean;
export type AttributeEntryFilterRulePredicate<TAttrValue = string> = { filter: 'accept' | 'reject' } | { filter: 'rewrite', to: (s: [string, string]) => [string, TAttrValue] };
export type AttributeEntryFilterRule<TAttrValue = string> = { cond: AttributeEntryFilterRuleCondition } & AttributeEntryFilterRulePredicate<TAttrValue>;

// サニタイザーの既定スキーマ
// hast-util-sanitize のコードを参照: https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/schema.js
export const defaultSchema = {
	allowTagname: [
		'a', 'b', 'blockquote', 'br', 'code', 'dd', 'del', 'details', 'div', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
		'hr', 'i', 'img', 'ins', 'kbd', 'li', 'ol', 'p', 'picture', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'source',
		'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'tt', 'ul', 'var'
	] as (string | RegExp)[],
	attributeKeyFilterFallbackRule: { filter: 'reject' } as AttributeKeyFilterRulePredicate,
	attributeKeyFilterRules: [
		{
			cond: (_tagname, attr) => [
				'abbr', 'accept', 'acceptCharset', 'accessKey', 'action', 'align', 'alt', 'axis', 'border', 'cellPadding', 'cellSpacing', 'char',
				'charOff', 'charSet', 'checked', 'clear', 'colSpan', 'color', 'cols', 'compact', 'coords', 'dateTime', 'dir', 'encType', 'frame',
				'hSpace', 'headers', 'height', 'hrefLang', 'htmlFor', 'id', 'isMap', 'itemProp', 'label', 'lang', 'maxLength', 'media', 'method',
				'multiple', 'name', 'noHref', 'noShade', 'noWrap', 'open', 'prompt', 'readOnly', 'rev', 'rowSpan', 'rows', 'rules', 'scope',
				'selected', 'shape', 'size', 'span', 'start', 'summary', 'tabIndex', 'title', 'useMap', 'vAlign', 'value', 'width'
			].includes(attr), filter: 'accept'
		},
		{ cond: (tagname, attr) => ['a', 'dl', 'img', 'ol', 'summary', 'table', 'ul'].includes(tagname) && ['ariaDescribedBy', 'ariaLabel', 'ariaLabeledBy'].includes(attr), filter: 'accept' },
		{ cond: (tagname, attr) => ['a', 'dl', 'img', 'ol', 'summary', 'table', 'ul'].includes(tagname) && ['ariaDescribedBy', 'ariaLabel', 'ariaLabeledBy'].includes(attr), filter: 'accept' },
		{ cond: (tagname, attr) => ['blockquote', 'del', 'ins', 'q'].includes(tagname) && attr === 'cite', filter: 'accept' },
		{ cond: (tagname, attr) => tagname === 'a' && ['cite', 'href'].includes(attr), filter: 'accept' },
		{ cond: (tagname, attr) => tagname === 'div' && attr === 'itemScope', filter: 'accept' },
		{ cond: (tagname, attr) => tagname === 'div' && attr === 'itemType', filter: 'accept' },
		{ cond: (tagname, attr) => tagname === 'img' && attr === 'longDesc', filter: 'accept' },
		{ cond: (tagname, attr) => tagname === 'img' && attr === 'src', filter: 'accept' },
		{ cond: (tagname, attr) => tagname === 'source' && attr === 'srcSet', filter: 'accept' },
	] as AttributeKeyFilterRule[],
	attributeEntryFilterFallbackRule: { filter: 'accept' } as AttributeEntryFilterRulePredicate<string>,
	attributeEntryFilterRules: [
		{ cond: (_tagname, attr) => attr[0] === 'href' && !isValidURI(attr[1], ['http', 'https', 'irc', 'ircs', 'mailto', 'xmpp']), filter: 'reject' },
		{ cond: (_tagname, attr) => ['cite', 'longDesc', 'src'].includes(attr[0]) && !isValidURI(attr[1]), filter: 'reject' },
	] as AttributeEntryFilterRule[],
	classFilterFallbackRule: { filter: 'reject' } as AttributeKeyFilterRulePredicate,
	classFilterRules: [
		{ cond: (tagname, classname) => tagname === 'code' && /^laungage-/.test(classname), filter: 'accept' },
	] as AttributeKeyFilterRule[],
	styleFilterFallbackRule: { filter: 'reject' } as AttributeEntryFilterRulePredicate,
	styleFilterRules: [
		{ cond: (_tagname, entry) => !CSS.supports(entry[0], entry[1]), filter: 'reject' },
	] as ({ cond: AttributeEntryFilterRuleCondition } & AttributeEntryFilterRulePredicate)[],
};

function test(target: string, cond: string | RegExp): boolean { return typeof cond === 'string' ? cond === target : cond.test(target); }
function isValidTagname(tagname: string, allow: (string | RegExp)[] = defaultSchema.allowTagname): boolean { return allow.some((c) => test(tagname, c)); }

function useAttributeSanitizerView<TAttrValue = string>(tagname: string, attrs: Iterable<[string, string]>, rules?: {
	keyRules?: AttributeKeyFilterRule[],
	valueRules?: ({ cond: AttributeEntryFilterRuleCondition } & AttributeEntryFilterRulePredicate<string | TAttrValue>)[],
	classRules?: AttributeKeyFilterRule[],
	styleRules?: AttributeEntryFilterRule[],
}, fallback?: {
	keyFallback?: AttributeKeyFilterRulePredicate,
	valueFallback?: AttributeEntryFilterRulePredicate<string | TAttrValue>,
	classFallback?: AttributeKeyFilterRulePredicate,
	styleFallback?: AttributeEntryFilterRulePredicate<string>,
}): IteratorObject<([string, string | TAttrValue] | ['class', string[]] | ['style', CSSProperties])> {
	const attrIt = attrs[Symbol.iterator]();
	const next = (): IteratorResult<([string, string | TAttrValue] | ['class', string[]] | ['style', CSSProperties])> => {
		for (; ;) {
			const attr = attrIt.next();
			if (attr.done) { return { done: true, value: undefined }; }
			// 属性値のサニタイズは次の手順によって行われる:
			// 1. attributeKeyFilterRules によって属性キーの正規化とフィルタリングを行う。
			const keyFiltered = filterAttributeKey(tagname, attr.value, rules?.keyRules, fallback?.keyFallback);
			if (!keyFiltered) { continue; }
			// 2. attributeValueRewriteRules によって属性値の正規化とフィルタリングを行う。
			const valueFiltered = filterAttributeEntry(tagname, keyFiltered, rules?.valueRules, fallback?.valueFallback);
			if (!valueFiltered) { continue; }
			// 3. class, style を含む場合、それぞれに対して専用のサニタイズを行う。
			if (valueFiltered[0] === 'class' && typeof valueFiltered[1] === 'string') {
				const classList = filterClassList(tagname, valueFiltered[1].split(' '), rules?.classRules, fallback?.classFallback);
				return { done: false, value: ['class', classList] };
			} else if (valueFiltered[0] === 'style' && typeof valueFiltered[1] === 'string') {
				const style = sanitizeStyle(tagname, valueFiltered[1], rules?.styleRules, fallback?.styleFallback);
				if (!style) { continue; }
				return { done: false, value: ['style', style] };
			} else {
				return { done: false, value: valueFiltered };
			}
		}
	};
	const sym = { next, [Symbol.iterator]() { return sym } };
	return sym;
}

function useAttributeKeyFilterView(tagname: string, attrs: Iterable<[string, string]>, rules?: AttributeKeyFilterRule[], fallback?: AttributeKeyFilterRulePredicate): IteratorObject<[string, string]> {
	const attrIt = attrs[Symbol.iterator]();
	const next = (): IteratorResult<[string, string]> => {
		for (; ;) {
			const attr = attrIt.next();
			if (attr.done) { return { done: true, value: undefined }; }
			const filtered = filterAttributeKey(tagname, attr.value, rules, fallback);
			if (filtered) { return { done: false, value: filtered }; }
		}
	};
	const sym = { next, [Symbol.iterator]() { return sym; } }
	return sym;
}

function filterAttributeKey(tagname: string, attr: [string, string],
	rules: AttributeKeyFilterRule[] = defaultSchema.attributeKeyFilterRules,
	fallback: AttributeKeyFilterRulePredicate = defaultSchema.attributeKeyFilterFallbackRule,
): [string, string] | undefined {
	const rule: AttributeKeyFilterRulePredicate = rules.find((rule) => rule.cond(tagname, attr[0])) ?? fallback;
	switch (rule.filter) {
		case "accept": return attr;
		case "reject": return undefined;
		case "rewrite": return [rule.to(attr[0]), attr[1]];
	}
}

function useAttributeEntryFilterView<TAttrValue = string>(tagname: string, attrs: [string, string][], rules?: AttributeEntryFilterRule<string | TAttrValue>[], fallback?: AttributeEntryFilterRulePredicate<string | TAttrValue>): IteratorObject<[string, string | TAttrValue]> {
	const attrIt = attrs[Symbol.iterator]();
	const next = (): IteratorResult<[string, string | TAttrValue]> => {
		for (; ;) {
			const attr = attrIt.next();
			if (attr.done) { return { done: true, value: undefined }; }
			const filtered = filterAttributeEntry<TAttrValue>(tagname, attr.value, rules, fallback);
			if (filtered) { return { done: false, value: filtered }; }
		}
	};
	const sym = { next, [Symbol.iterator]() { return sym; } }
	return sym;
}

function filterAttributeEntry<TAttrValue = string>(tagname: string, attr: [string, string],
	rules: AttributeEntryFilterRule<string | TAttrValue>[] = defaultSchema.attributeEntryFilterRules,
	fallback: AttributeEntryFilterRulePredicate<string | TAttrValue> = defaultSchema.attributeEntryFilterFallbackRule,
): [string, string | TAttrValue] | undefined {
	const rule: AttributeEntryFilterRulePredicate<string | TAttrValue> = rules.find((rule) => rule.cond(tagname, attr)) ?? fallback;
	switch (rule.filter) {
		case "accept": return attr;
		case "reject": return undefined;
		case "rewrite": return rule.to(attr);
	}
}

function filterClassList(tagname: string, classList: string[], rules?: AttributeKeyFilterRule[], fallback?: AttributeKeyFilterRulePredicate): string[] {
	return classList.map((className) => filterClassEntry(tagname, className, rules, fallback)).filter((className) => className !== undefined);
}

function filterClassEntry(tagname: string, className: string,
	rules: AttributeKeyFilterRule[] = defaultSchema.classFilterRules,
	fallback: AttributeKeyFilterRulePredicate = defaultSchema.classFilterFallbackRule,
): string | undefined {
	const rule = rules.find((rule) => rule.cond(tagname, className)) ?? fallback;
	switch (rule.filter) {
		case "accept": return className;
		case "reject": return undefined;
		case "rewrite": return rule.to(className);
	}
}

function sanitizeStyle(tagname: string, styleText: string | null | undefined, rules?: AttributeEntryFilterRule[], fallback?: AttributeEntryFilterRulePredicate<string>): CSSProperties | undefined {
	try {
		return Object.fromEntries([...useStyleFilterView(tagname, useStyleParserView(styleText), rules, fallback)]);
	} catch (err) {
		return undefined;
	}
}

function useStyleFilterView(tagname: string, styles: Iterable<[string, string]>, rules?: AttributeEntryFilterRule[], fallback?: AttributeEntryFilterRulePredicate<string>): IteratorObject<[string, string]> {
	const styleIt = styles[Symbol.iterator]();
	const next = (): IteratorResult<[string, string]> => {
		do {
			const style = styleIt.next();
			if (style.done) { return { done: true, value: undefined }; }
			const filtered = filterStyleEntry(tagname, style.value, rules, fallback);
			if (!filtered) { continue; }
			return { done: false, value: filtered };
		} while (true);
	};
	const sym = { next, [Symbol.iterator]() { return sym; } };
	return sym;
}

function filterStyleEntry(tagname: string, style: [string, string],
	rules: AttributeEntryFilterRule[] = defaultSchema.styleFilterRules,
	fallback: AttributeEntryFilterRulePredicate<string> = defaultSchema.styleFilterFallbackRule,
): [string, string] | undefined {
	const rule: AttributeEntryFilterRulePredicate<string> = rules.find((rule) => rule.cond(tagname, style)) ?? fallback;
	switch (rule.filter) {
		case "accept": return style;
		case "reject": return undefined;
		case "rewrite": rule.to(style);
	}
}

function useStyleParserView(text: string | null | undefined): IteratorObject<[string, string]> {
	const gp = () => /^[;\s]*(?:(?:[-a-zA-Z][-a-zA-Z\d]*)\s*:\s*(?:(?:[^;]|\\;)*(?:[^;\s]|\\;))\s*;[;\s]*)*(?:(?:[-a-zA-Z][-a-zA-Z\d]*)\s*:\s*(?:(?:[^;]|\\;)*(?:[^;\s]|\\;))\s*[;\s]*)$/g;
	const ip = () => /^(?<prop>[-a-zA-Z][-a-zA-Z\d]*)\s*:\s*(?<value>(?:[^;]|\\;)*(?:[^;\s]|\\;))\s*(;[;\s]*)?/;
	let remain = (text ?? '').replaceAll(/\/\*.*?\*\//g, '').replace(/^[;\s]*/, '').trim();
	// スタイル文字列としての正当性を確認、構文エラーはここで切り捨てる
	if (!gp().test(remain)) { throw Error(`invalid style string "${text}"`); }
	const next = (): IteratorResult<[string, string]> => {
		if (!remain) { return { done: true, value: undefined }; }
		const match = remain.match(ip());
		if (!match || !match.groups?.['prop']) { throw Error(`invalid style string "${text}"`); }
		remain = remain.replace(ip(), '').trim();
		return { done: false, value: [match.groups['prop'].trim(), match.groups['value'].trim()] };
	};
	const sym = { next, [Symbol.iterator]() { return sym; } };
	return sym;
}

function isValidURI(uri: string | null | undefined, allowScheme: (string | RegExp)[] = ['http', 'https']): true | false {
	const testScheme = (scheme: string) => allowScheme.some((c) => typeof c === 'string' ? c === scheme : c.test(scheme));
	const ref = typeof uri === 'string' ? URIRef.parse(uri) : uri;
	if (!ref) { return false; }
	return !ref.scheme || testScheme(ref.scheme);
}
