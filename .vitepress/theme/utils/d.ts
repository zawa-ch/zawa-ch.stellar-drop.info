type JsonValue = null | boolean | number | string | { [K: string]: JsonValue } | JsonValue[];

declare interface JSON {
	parse(text: string, reviver?: (this: any, key: string, value: JsonValue) => JsonValue): JsonValue;
	stringify(value: JsonValue, replacer?: (this: any, key: string, value: JsonValue) => JsonValue, space?: string | number): string;
	stringify(value: JsonValue, replacer?: (number | string)[] | null, space?: string | number): string;
};

declare module 'markdown-it-abbr' {
	import MarkdownIt from "markdown-it";
	function abbr_plugin(md: MarkdownIt): void;
	export default abbr_plugin;
}
declare module 'markdown-it-attrs' {
	import MarkdownIt from "markdown-it";
	export type Options = {
		leftDelimiter?: string;
		rightDelimiter?: string;
		allowAttributes?: string[];
	};
	function attributes(md: MarkdownIt, options?: Options): void;
	export default attributes;
}
declare module 'markdown-it-bracketed-spans' {
	import MarkdownIt from "markdown-it";
	function bracketed_spans_plugin(md: MarkdownIt): void;
	export default bracketed_spans_plugin;
}
declare module 'markdown-it-container' {
	import MarkdownIt from "markdown-it";
	function container_plugin(md: MarkdownIt, name: string, options?: Object): void;
	export default container_plugin;
}
declare module 'markdown-it-deflist' {
	import MarkdownIt from "markdown-it";
	function deflist_plugin(md: MarkdownIt): void;
	export default deflist_plugin;
}
declare module 'markdown-it-footnote' {
	import MarkdownIt from "markdown-it";
	function footnote_plugin(md: MarkdownIt): void;
	export default footnote_plugin;
}
declare module 'markdown-it-ins' {
	import MarkdownIt from "markdown-it";
	function ins_plugin(md: MarkdownIt): void;
	export default ins_plugin;
}
declare module 'markdown-it-katex' {
	import MarkdownIt from "markdown-it";
	function math_plugin(md: MarkdownIt, options: Object): void;
	export default math_plugin;
}
declare module 'markdown-it-mark' {
	import MarkdownIt from "markdown-it";
	function ins_plugin(md: MarkdownIt): void;
	export default ins_plugin;
}
declare module 'markdown-it-sub' {
	import MarkdownIt from "markdown-it";
	function sub_plugin(md: MarkdownIt): void;
	export default sub_plugin;
}
declare module 'markdown-it-sup' {
	import MarkdownIt from "markdown-it";
	function sup_plugin(md: MarkdownIt): void;
	export default sup_plugin;
}
