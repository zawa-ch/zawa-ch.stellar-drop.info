
export function unwrapDefined<T>(value: T | undefined): T {
	if (value === undefined) { throw Error('Unexpected undefined'); }
	return value;
}

export function unwrapNonnull<T>(value: T | null): T {
	if (value === null) { throw Error('Unexpected null'); }
	return value;
}

/**
 * 反復処理プロトコルを実装した列挙可能なオブジェクト
 */
export type Enumerable<T, TReturn = unknown, TNext = unknown> = { [Symbol.iterator]: () => IteratorObject<T, TReturn, TNext> };
