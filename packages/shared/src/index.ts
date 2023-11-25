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
