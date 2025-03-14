export function getKeys<T extends object>(obj: T): Array<keyof T> {
	return Object.keys(obj) as Array<keyof T>
}

export function getValues<T extends object>(obj: T): Array<T[keyof T]> {
	return Object.values(obj) as Array<T[keyof T]>
}

type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]]
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>
export type Entries<BaseType> = BaseType extends object
	? ObjectEntries<BaseType>
	: never

export function getEntries<T extends object>(obj: T) {
	return Object.entries(obj) as Entries<T>
}
