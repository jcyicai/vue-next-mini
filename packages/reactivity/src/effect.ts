import { isArray } from '@vue/shared'
import { Dep, createDep } from './dep'

type KeyToDepMap = Map<any, Dep>
/**
 * 收集所有依赖的实例
 * 1、'key': 响应性对象
 * 2、'value': Map 对象
 *      1、'key': 响应性对象的指定属性
 *      2、'value': 指定对象的指定属性的 执行函数
 */
const targetMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

/**
 * 用于收集依赖的方法
 * @param target 代理对象 WeakMap 的 key
 * @param key 代理对象的 key，当依赖触发时，需要根据 key 获取
 */
export function track(target: object, key: unknown) {
  // 如果当前不存在执行函数 直接 return
  if (!activeEffect) return
  // 尝试从 targetMap 中，根据 target 获取 map
  let depsMap = targetMap.get(target)
  // 如果获取的 map 不存在，则生成新的 map 对象，并把该对象赋值给对应的 value
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  trackEffects(dep)
}

/**
 * 利用 dep 依次跟踪指定的 key 的 所有 effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 * 触发依赖
 * @param target 代理对象
 * @param key 属性
 * @param newValue 新值
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  // 尝试从 targetMap 中，根据 target 获取 map
  const depsMap = targetMap.get(target)
  // 如果获取的 map 不存在，直接 return
  if (!depsMap) {
    return
  }

  // 尝试从 map 中，根据 key 获取 ReactiveEffect
  const dep: Dep | undefined = depsMap.get(key)
  // 如果不存在 直接 return
  if (!dep) {
    return
  }

  triggerEffects(dep)
}

/**
 * 依次触发 dep 中保存的依赖
 */
export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep]
  // 依次触发依赖
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

/**
 * 触发指定依赖
 */
export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
