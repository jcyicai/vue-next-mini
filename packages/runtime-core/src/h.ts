import { isArray, isObject } from '@vue/shared'
import { VNode, createVNode, isVNode } from './vnode'

export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length
  if (l === 2) {
    // 为对象且不为数组
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 是否是 vnode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      return createVNode(type, propsOrChildren)
    } else {
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    // 参数大于 3
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      // 参数 为 3个 且 children 为 vnode
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
