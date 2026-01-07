export type ArticleIndexItem = {
	slug: string
	title: string
	description?: string
	date?: string | number
	tags?: string[]
	hidden?: boolean
}
function isArticleIndexItem(arg: unknown): arg is ArticleIndexItem {
	if (typeof arg !== 'object') {
		return false
	}
	return [
		{ name: 'slug', type: (v: unknown) => typeof v === 'string' },
		{ name: 'title', type: (v: unknown) => typeof v === 'string' },
		{ name: 'tags', type: (v: unknown) => Array.isArray(v) },
	].every((i) => i.type((arg as Record<string, unknown>)[i.name]))
}

export type ArticleIndex = ArticleIndexItem[]
function toArticleIndex(items: ArticleIndex): Record<string, ArticleIndexItem> {
	return Object.fromEntries(items.map((i) => [i.slug, i]))
}

export class ArticleFetcher {
	private _index_data: Record<string, ArticleIndexItem>

	constructor(index: ArticleIndex) {
		this._index_data = toArticleIndex(index)
	}

	public get index() { return this._index_data }

	public get tags() { return Object.entries(this._index_data).flatMap((i) => i[1].tags ?? []).reduce((p, c) => p.includes(c) ? p : p.concat([c]), [] as string[]) }

	public async fetch(key: string) {
		if (!Object.keys(this._index_data).includes(key)) {
			throw Error(`Index has no item ${key}`)
		}
		const u = new URL(`https://raw.githubusercontent.com/zawa-ch/zawa-ch/refs/heads/zawa-ch.stellar-drop.info/blog/article/${this._index_data[key].slug}.md`)
		const r = await fetch(u)
		if (!r.ok) {
			throw new Error(`Unexpected responce code: ${r.status} ${r.statusText}`)
		}
		return await r.text()
	}
}

export async function fetchIndex(indexUri: string) {
	const r = await fetch(indexUri)
	if (!r.ok) {
		throw new Error(`Unexpected responce code: ${r.status} ${r.statusText}`)
	}
	const j = await r.json()
	const expect_context = 'info.stellar-drop.zawa-ch.blog-entries.v1'
	if (j['@context'] !== expect_context) {
		throw new Error(`Unexpected context: ${j['@context']}`)
	}
	if (!Array.isArray(j['articles']) || j['articles'].some((i) => !isArticleIndexItem(i))) {
		throw new Error(`$.articles expect ArticleIndexItem[], but not.`)
	}
	return j['articles'] as ArticleIndex
}
