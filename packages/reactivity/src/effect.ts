import { extend, isArray } from '@vue/shared'
import { Dep, createDep } from './dep'
import { ComputedRefImpl } from './computed'

export type EffectScheduler = (...args: any[]) => any

type KeyToDepMap = Map<any, Dep>
/**
 * 收集所有依赖的实例
 * 1、'key': 响应性对象
 * 2、'value': Map 对象
 *      1、'key': 响应性对象的指定属性
 *      2、'value': 指定对象的指定属性的 执行函数
 */
const targetMap = new WeakMap<any, KeyToDepMap>()

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn)

  if (options) {
    extend(_effect, options) // 如果 options 包含 调度器，effect 也会包含，从而走自定义的 effect.scheduler 逻辑
  }
  // 懒执行
  if (!options || !options.lazy) {
    _effect.run()
  }
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

  run() {
    activeEffect = this
    return this.fn()
  }

  stop() {}
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
  // 获取指定 key 的 dep
  let dep = depsMap.get(key)
  // 如果 dep 不存在，则生成一个新的 dep，并放入到 depsMap 中
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
  const effects = isArray(dep) ? dep : [...dep]

  // 不在依次触发，而是先触发所有的计算属性依赖，再触发所有的非计算属性依赖
  // 否则会造成死循环 原因是 后面执行的 effect 是存在 computed 计算属性
  // 计算属性中又存在 scheduler 调度器，再次触发脏状态，再次执行 triggerRefValue 从而造成死循环
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

/**
 * 触发指定依赖
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}
