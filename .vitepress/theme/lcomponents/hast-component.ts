import type { Element, Root, RootContent } from 'hast';
import { Comment, defineComponent, h, ref, watch, type VNode } from "vue";
import { Enumerable } from '../utils/type-util';

export type HRoot = Root

export default defineComponent(setup, { props: ['ast', 'trusted'] })

function setup(props: {
	ast?: HRoot | null;
	trusted?: boolean;
}) {
	return () => [...hastRootRenderView(props.ast?.children ?? [], props.trusted ?? false)];
}

function hastRootRenderView(contents: Enumerable<RootContent>, trusted: boolean): IteratorObject<VNode | string> {
	const err = (what: string, pos?: RootContent['position']) => Error(what + '(' + pos ? `${pos?.start.line}:${pos?.start.column} , ` : '' + ')');
	const elemRules: { condition: (elem: Element) => boolean, render: (elem: Element) => VNode | string }[] = [
		// Structure
		{ condition: (elem) => ['address', 'article', 'aside', 'footer', 'header', 'hgroup', 'main', 'nav', 'section', 'search'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => elem.tagName === 'h1', render: (elem) => { console.warn('The h1 tag should not be used in the middle of an article.\nsee https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Elements/Heading_Elements#%E3%81%A4%E3%81%AE%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E8%A4%87%E6%95%B0%E3%81%AE_h1_%E8%A6%81%E7%B4%A0%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%AA%E3%81%84\n', elem); return h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]); } },
		{ condition: (elem) => ['h2', 'h3', 'h4', 'h5', 'h6'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },

		// BlockText
		{ condition: (elem) => ['div', 'blockquote', 'figcaption', 'figure', 'hr', 'menu', 'p', 'pre', 'details', 'summary'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['dl', 'dt', 'dd', 'ul', 'ol', 'li'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },

		// Table
		{ condition: (elem) => ['table', 'caption', 'tbody', 'thead', 'tfoot', 'colgroup', 'col', 'td', 'th', 'tr'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },

		// Inline
		{ condition: (elem) => ['span', 'a', 'em', 'strong', 'code', 'mark', 'q', 'small', 'sub', 'sup', 'del', 'ins', 'br', 'wbr', 'cite', 'data', 'time', 'dfn', 'abbr', 'kbd', 'samp', 'var', 'bdi', 'bdo'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['ruby', 'rp', 'rt'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['b', 'i', 's', 'u'].includes(elem.tagName), render: (elem) => { console.warn('Deplecated tag.'); return h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) } },

		// Multimedia
		{ condition: (elem) => ['area', 'audio', 'img', 'map', 'track', 'video'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },

		// Interactivity
		{ condition: (elem) => ['embed', 'iframe', 'object', 'svg', 'canvas', 'noscript', 'script', 'style'].includes(elem.tagName), render: (elem) => { if (trusted) { return h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]); } else { console.warn(`For security reason, ${elem.tagName} is disabled in untrusted context.\n`, elem); return h(Comment, elem.tagName) } } },
		{ condition: (elem) => ['button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'dialog'].includes(elem.tagName), render: (elem) => { if (trusted) { return h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]); } else { console.warn(`For security reason, ${elem.tagName} is disabled in untrusted context.\n`, elem); return h(Comment, elem.tagName) } } },
		{ condition: (elem) => ['fencedframe', 'picture', 'source'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },

		// MathML
		{ condition: (elem) => ['math'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['mi', 'mn', 'mo', 'ms', 'mspace', 'mtext'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['merror', 'mfrac', 'mpadded', 'mphantom', 'mroot', 'mrow', 'sqrt', 'mstyle'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['mscript', 'mover', 'mprescripts', 'msub', 'msubsup', 'msup', 'munder', 'munderover'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['mtable', 'mtd', 'mtr'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },
		{ condition: (elem) => ['annotation', 'annotation-xml', 'semantics'].includes(elem.tagName), render: (elem) => h(elem.tagName, elem.properties, [...hastRootRenderView(elem.children, trusted)]) },

		// DocRoot
		{ condition: (elem) => ['html', 'body'].includes(elem.tagName), render: (elem) => { throw err('unexpected document root', elem.position); } },
		{ condition: (elem) => ['base', 'head', 'link', 'meta', 'title'].includes(elem.tagName), render: (elem) => { throw err('unexpected metadata', elem.position); } },
	];
	const pElem = (elem: Element): VNode | string => {
		const rule = elemRules.find((rule) => rule.condition(elem));
		if (rule) { return rule.render(elem); } else { throw err(`unrecognized element ${JSON.stringify(elem)}`); }
	};
	const iter = contents[Symbol.iterator]();
	const iSym = {
		next(): IteratorResult<VNode | string> {
			const item = iter.next();
			if (item.done) { return { done: true, value: undefined }; }
			switch (item.value.type) {
				case 'comment': return { done: false, value: h(Comment, item.value.value) };
				case 'doctype': throw err('unexpected DOCTYPE directive', item.value.position);
				case 'element': { return { done: false, value: pElem(item.value) }; }
				case 'text': return { done: false, value: item.value.value };
				default: throw err(`unrecognized content ${(item.value as any).type}`);
			}
		},
		[Symbol.iterator]() { return iSym; },
	};
	return iSym;
}
