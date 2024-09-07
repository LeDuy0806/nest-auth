/** Extracting Promise return value */
export type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never

/** Converting a union type to an intersection type */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/** eg: export type result = StringToUnion<'abc'> result: 'a'|'b'|'c' */
export type StringToUnion<S extends string> = S extends `${infer S1}${infer S2}` ? S1 | StringToUnion<S2> : never

/** String replacement, similar to js's string replace method */
export type Replace<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Left}${From}${infer Right}` ? `${Left}${To}${Right}` : Str

/** String replacement, similar to js's string replaceAll method */
export type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Left}${From}${infer Right}`
  ? Replace<Replace<`${Left}${To}${Right}`, From, To>, From, To>
  : Str

/** eg: export type result = CamelCase<'foo-bar-baz'>, result：fooBarBaz */
export type CamelCase<S extends string> = S extends `${infer S1}-${infer S2}`
  ? S2 extends Capitalize<S2>
    ? `${S1}-${CamelCase<S2>}`
    : `${S1}${CamelCase<Capitalize<S2>>}`
  : S

/** eg: export type result = StringToArray<'abc'>, result：['a', 'b', 'c'] */
export type StringToArray<S extends string, T extends any[] = []> = S extends `${infer S1}${infer S2}`
  ? StringToArray<S2, [...T, S1]>
  : T

/** `RequiredKeys`It is used to get all the required fields, where these required fields are combined into a union type */
export type RequiredKeys<T> = {
  [P in keyof T]: T extends Record<P, T[P]> ? P : never
}[keyof T]

/** `OptionalKeys`It is used to get all optional fields, where these optional fields are combined into a union type */
export type OptionalKeys<T> = {
  [P in keyof T]: object extends Pick<T, P> ? P : never
}[keyof T]

/** `GetRequired`It is used to obtain a new type consisting of all required keys and their types in a type. */
export type GetRequired<T> = {
  [P in RequiredKeys<T>]-?: T[P]
}

/** `GetOptional`It is used to obtain a new type composed of all optional keys and their types in a type.*/
export type GetOptional<T> = {
  [P in OptionalKeys<T>]?: T[P]
}

/**  export type result1 = Includes<[1, 2, 3, 4], '4'> result： false; export type result2 = Includes<[1, 2, 3, 4], 4> result： true */
export type Includes<T extends any[], K> = K extends T[number] ? true : false

/** eg:export type result = MyConcat<[1, 2], [3, 4]>  result：[1, 2, 3, 4] */
export type MyConcat<T extends any[], U extends any[]> = [...T, ...U]
/** eg: export type result1 = MyPush<[1, 2, 3], 4> result：[1, 2, 3, 4] */
export type MyPush<T extends any[], K> = [...T, K]
/** eg: export type result3 = MyPop<[1, 2, 3]>  result：[1, 2] */
export type MyPop<T extends any[]> = T extends [...infer L, infer R] ? L : never // eslint-disable-line

export type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer R}`
      ? K extends keyof T
        ? PropType<T[K], R>
        : unknown
      : unknown

/**
 * NestedKeyOf
 * Get all the possible paths of an object
 * @example
 * export type Keys = NestedKeyOf<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type RecordNamePaths<T extends object> = {
  [K in NestedKeyOf<T>]: PropType<T, K>
}
