/**
 * 收集依赖
 * @param target 代理对象
 * @param key 属性
 */
export function track(target: object, key: unknown) {
  console.log('收集依赖')
}

/**
 * 触发依赖
 * @param target 代理对象
 * @param key 属性
 * @param newValue 新值
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  console.log('触发依赖')
}
