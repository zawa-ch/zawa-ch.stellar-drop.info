/**
 * RFC3986 URI文字列をラップします
 */
export class URIRef {
	private static uriCmplRegex() { return /^(?<scheme>[a-zA-Z][-a-zA-Z\d+\.]*):(?:\/\/(?<authority>(?:(?<userinfo>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:]|%[\da-fA-F]{2})*)@)?(?<host>\[(?:(?:[\da-fA-F]{1,4}:){6}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|::(?:[\da-fA-F]{1,4}:){5}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){4}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:)?[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){3}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,2}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){2}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,3}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}:(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,4}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,5}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}|(?:(?:[\da-fA-F]{1,4}:){0,6}[\da-fA-F]{1,4})?::|v[\da-fA-F]+\.(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:])+)\]|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)|(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=]|%[\da-fA-F]{2})*)(?::(?<port>\d*))?)(?<path>(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)|(?<pathAbs>\/(?:(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)?)|(?<pathRootless>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)|)(?:\?(?<query>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*))?(?:#(?<fragment>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*))?$/; }
	private static uriRefRegex() { return /^(?:\/\/(?<authority>(?:(?<userinfo>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:]|%[\da-fA-F]{2})*)@)?(?<host>\[(?:(?:[\da-fA-F]{1,4}:){6}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|::(?:[\da-fA-F]{1,4}:){5}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){4}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:)?[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){3}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,2}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){2}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,3}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}:(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,4}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,5}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}|(?:(?:[\da-fA-F]{1,4}:){0,6}[\da-fA-F]{1,4})?::|v[\da-fA-F]+\.(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:])+)\]|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)|(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=]|%[\da-fA-F]{2})*)(?::(?<port>\d*))?)(?<path>(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)|(?<pathAbs>\/(?:(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)?)|(?<pathRootless>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)|)(?:\?(?<query>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*))?(?:#(?<fragment>(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*))?$/; }
	private static encodeIfNeeded(value: string) {
		if (URIRef.uriCmplRegex().test(value) || URIRef.uriRefRegex().test(value)) {
			return value;
		} else {
			return encodeURI(value);
		}
	}
	private static captureUri(uri: string): { scheme: string | null; authority: string | null; userinfo: string | null; host: string | null; port: string | null; path: string; query: string | null; fragment: string | null; } {
		const c = /^(?:(?<scheme>[^:\/?#]+):)?(?:\/\/(?<authority>(?:(?<userinfo>[^@\/?#]*)@)?(?<host>[^\/?#]*)(?::(?<port>\d+))?))?(?<path>[^?#]*)(?:\?(?<query>[^#]*))?(?:#(?<fragment>.*))?$/.exec(uri);
		if (!c || c?.groups === undefined || c.groups.path === undefined) { throw Error('input is not URI'); }
		return { scheme: c.groups.scheme ?? null, authority: c.groups.authority ?? null, userinfo: c.groups.userinfo ?? null, host: c.groups.host ?? null, port: c.groups.port ?? null, path: c.groups.path, query: c.groups.query ?? null, fragment: c.groups.fragment ?? null };
	}

	private _value: string;

	constructor(value: string) {
		const encoded = URIRef.encodeIfNeeded(value);
		if (!URIRef.uriCmplRegex().test(encoded) && !URIRef.uriRefRegex().test(encoded)) { throw Error(`Invarid URI "${value}"`); }
		this._value = encoded;
	}

	/**
	 * 有効なURI文字列、もしくはその相対パスとしてパースを試みます
	 * @param value パース対象の文字列。
	 * @returns パースに成功した場合そのオブジェクト、失敗した場合 null 。
	 */
	public static parse(value: string): URIRef | null { try { return new URIRef(value); } catch (e) { return null; } }

	/**
	 * URI文字列として有効であるかを判定します
	 * @param value 検査対象の文字列。
	 * @returns URI文字列、もしくはその相対パスである場合 true 、そうでなければ false 。
	 */
	public static canParse(value: string): boolean { try { const encoded = URIRef.encodeIfNeeded(value); return URIRef.uriCmplRegex().test(encoded) || URIRef.uriRefRegex().test(encoded); } catch (e) { return false; } }

	public get isReference(): boolean { return URIRef.uriRefRegex().test(this._value); }

	public get href(): string { return this._value; }
	public set href(value: string) {
		const encoded = URIRef.encodeIfNeeded(value);
		if (!URIRef.uriCmplRegex().test(encoded) && !URIRef.uriRefRegex().test(encoded)) { throw Error(`Invarid URI "${value}"`); }
		this._value = encoded;
	}

	public get scheme(): string | null { return URIRef.captureUri(this._value).scheme; }
	public set scheme(value: string | null) {
		// fixme: '/'の前に':'を含む非ルートパスをpathに設定した状態でschemeをnullに設定すると異常なURIが生成される
		if (value && !/^[a-zA-Z][-a-zA-Z\d+\.]*$/.test(value)) { throw Error(`"${value}" is ineligible for schema string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [value ? `${value}:` : '', el.authority != null ? `//${el.authority}` : '', el.path, el.query != null ? `?${el.query}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get authority(): string | null {
		const r = URIRef.captureUri(this._value).authority;
		return r ? decodeURI(r) : r;
	}
	public set authority(value: string | null) {
		// fixme: '//'から始まるパスをpathに設定した状態でauthorityをnullに設定するとパスの一部がAuthorityフィールドに変化する
		const match = (v: string) => /^(?:(?:(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:]|%[\da-fA-F]{2})*)@)?(?:\[(?:(?:[\da-fA-F]{1,4}:){6}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|::(?:[\da-fA-F]{1,4}:){5}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){4}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:)?[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){3}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,2}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){2}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,3}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}:(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,4}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,5}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}|(?:(?:[\da-fA-F]{1,4}:){0,6}[\da-fA-F]{1,4})?::|v[\da-fA-F]+\.(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:])+)\]|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)|(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=]|%[\da-fA-F]{2})*)(?::(?:\d*))?$/.test(v)
		const ev = !value || match(value) ? value : encodeURI(value);
		if (ev && !match(ev)) { throw Error(`"${value}" is ineligible for authority string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [el.scheme ? `${el.scheme}:` : '', ev != null ? `//${ev}` : '', ev != null && !el.path.startsWith('/') ? `/${el.path}` : el.path, el.query != null ? `?${el.query}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get userinfo(): string | null {
		const r = URIRef.captureUri(this._value).userinfo;
		return r ? decodeURI(r) : r;
	}
	public set userinfo(value: string | null) {
		// fixme: '//'から始まるパスをpathに設定した状態でuserinfo, host, portをすべてnullに設定するとパスの一部がAuthorityフィールドに変化する
		const match = (v: string) => /^(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:]|%[\da-fA-F]{2})*$/.test(v)
		const ev = !value || match(value) ? value : encodeURI(value);
		if (ev && !match(ev)) { throw Error(`"${value}" is ineligible for userinfo string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [el.scheme ? `${el.scheme}:` : '', ev != null || el.host != null || el.port != null ? `//` : '', ev != null ? `${ev}@` : '', el.host ?? '', el.port != null ? `:${el.port}` : '', (ev != null || el.host != null || el.port != null) && !el.path.startsWith('/') ? `/${el.path}` : el.path, el.query != null ? `?${el.query}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get host(): string | null {
		const r = URIRef.captureUri(this._value).host;
		return r ? decodeURI(r) : r;
	}
	public set host(value: string | null) {
		// fixme: '//'から始まるパスをpathに設定した状態でuserinfo, host, portをすべてnullに設定するとパスの一部がAuthorityフィールドに変化する
		const match = (v: string) => /^(?:\[(?:(?:[\da-fA-F]{1,4}:){6}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|::(?:[\da-fA-F]{1,4}:){5}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){4}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:)?[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){3}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,2}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:){2}(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,3}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}:(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,4}[\da-fA-F]{1,4})?::(?:[\da-fA-F]{1,4}:[\da-fA-F]{1,4}|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))|(?:(?:[\da-fA-F]{1,4}:){0,5}[\da-fA-F]{1,4})?::[\da-fA-F]{1,4}|(?:(?:[\da-fA-F]{1,4}:){0,6}[\da-fA-F]{1,4})?::|v[\da-fA-F]+\.(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:])+)\]|(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)|(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=]|%[\da-fA-F]{2})*)$/.test(v)
		const ev = !value || match(value) ? value : encodeURI(value);
		if (ev && !match(ev)) { throw Error(`"${value}" is ineligible for host string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [el.scheme ? `${el.scheme}:` : '', el.userinfo != null || ev != null || el.port != null ? `//` : '', el.userinfo != null ? `${el.userinfo}@` : '', ev ?? '', el.port != null ? `:${el.port}` : '', (el.userinfo != null || ev != null || el.port != null) && !el.path.startsWith('/') ? `/${el.path}` : el.path, el.query != null ? `?${el.query}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get port(): string | null { return URIRef.captureUri(this._value).port; }
	public set port(value: string | null) {
		// fixme: '//'から始まるパスをpathに設定した状態でuserinfo, host, portをすべてnullに設定するとパスの一部がAuthorityフィールドに変化する
		const match = (v: string) => /^\d*$/.test(v)
		if (value && !match(value)) { throw Error(`"${value}" is ineligible for port string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [el.scheme ? `${el.scheme}:` : '', el.userinfo != null || el.host != null || value != null ? `//` : '', el.userinfo != null ? `${el.userinfo}@` : '', el.host ?? '', value != null ? `:${value}` : '', (el.userinfo != null || el.host != null || value != null) && !el.path.startsWith('/') ? `/${el.path}` : el.path, el.query != null ? `?${el.query}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get path(): string { return decodeURI(URIRef.captureUri(this._value).path); }
	public set path(value: string) {
		const el = URIRef.captureUri(this._value)
		const match = (v: string) => {
			const r = {
				abs: /^(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*$/.test(v),
				absNoauth: /^\/(?:(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*)?$/.test(v),
				noroot: /^(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*$/.test(v),
				rel: /^(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=@]|%[\da-fA-F]{2})+(?:\/(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@]|%[\da-fA-F]{2})*)*$/.test(v),
				empty: /^$/.test(v),
			};
			return [r.abs && el.authority != null, r.absNoauth, r.noroot && el.scheme, r.rel, r.empty].some(v => v);
		}
		const ev = !value || match(el.authority != null && !value.startsWith('/') ? `/${value}` : value) ? value : encodeURI(value);
		if (ev && !match(el.authority != null && !ev.startsWith('/') ? `/${ev}` : ev)) { throw Error(`"${value}" is ineligible for path string.`); }
		this._value = [el.scheme ? `${el.scheme}:` : '', el.authority != null ? `//${el.authority}` : '', el.authority != null && !ev.startsWith('/') ? `/${ev}` : ev, el.query != null ? `?${el.query}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get query(): string | null {
		const r = URIRef.captureUri(this._value).query;
		return r ? decodeURI(r) : r;
	}
	public set query(value: string | null) {
		const match = (v: string) => /^(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*$/.test(v)
		const ev = !value || match(value) ? value : encodeURI(value);
		if (ev && !match(ev)) { throw Error(`"${value}" is ineligible for query string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [el.scheme ? `${el.scheme}:` : '', el.authority != null ? `//${el.authority}` : '', el.path, ev != null ? `?${ev}` : '', el.fragment != null ? `#${el.fragment}` : ''].join('');
	}

	public get fragment(): string | null {
		const r = URIRef.captureUri(this._value).fragment;
		return r ? decodeURI(r) : r;
	}
	public set fragment(value: string | null) {
		const match = (v: string) => /^(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*$/.test(v)
		const ev = !value || match(value) ? value : encodeURI(value);
		if (ev && !match(ev)) { throw Error(`"${value}" is ineligible for fragment string.`); }
		const el = URIRef.captureUri(this._value)
		this._value = [el.scheme ? `${el.scheme}:` : '', el.authority != null ? `//${el.authority}` : '', el.path, el.query != null ? `?${el.query}` : '', ev != null ? `#${ev}` : ''].join('');
	}
};

export function deserializeURIQuery(queryString: string): { [k: string]: string | true } {
	const match = (v: string) => /^(?:[-a-zA-Z\d\._~!$&'\(\)*+,;=:@\/?]|%[\da-fA-F]{2})*$/.test(v);
	const ev = !queryString || match(queryString) ? queryString : encodeURI(queryString);
	if (ev && !match(ev)) { throw Error(`"${queryString}" is ineligible for query string.`); }
	return Object.fromEntries<string | true>(ev.split('&').map((v) => /^(?<key>[^&=]+)(?:=(?<value>[^&]*))?$/.exec(v)?.groups).filter((v) => v !== undefined).map((v) => { return [v.key, v.value ?? true]; }));
}

export function serializeURIQuery(qurey: { [k: string]: string | true }): string {
	return Object.entries(qurey).map((v) => v[0] + (v[1] !== true ? `=${v[1]}` : '')).join('&');
}
