// 是否为数组
export const isArray = Array.isArray
// 是否为对象
export const isObject = (val: unknown) => {
  return val !== null && typeof val === 'object'
}
// 对比两个数据是否发生改变
export const hasChanged = (value: any, oldValue: any): boolean => {
  return !Object.is(value, oldValue)
}
// 是否是函数
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}
// 是否字符串
export const isString = (val: unknown): val is string => typeof val === 'string'

// 合并
export const extend = Object.assign
// 空对象
export const EMPTY_OBJ: { readonly [key: string]: any } = {}

// 是否 on 开头事件
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
