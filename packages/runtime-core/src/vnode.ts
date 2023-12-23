import { isArray, isFunction, isObject, isString } from '@vue/shared'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { normalizeClass } from './normalizeProp'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export interface VNode {
  __v_isVNode: true
  type: any
  props: any
  children: any
  shapeFlag: number
  key: any
}

// 判断是否为 vnode
export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false
}
// 创建 vnode
export function createVNode(type: any, props?: any, children?: any): VNode {
  if (props) {
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
  }

  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  return createBaseVNode(type, props, children, shapeFlag)
}

function createBaseVNode(
  type: any,
  props?: any,
  children?: any,
  shapeFlag?: number
) {
  // 创建 vnode 对象
  const vnode = {
    __is_VNode: true,
    type,
    props,
    children,
    shapeFlag,
    key: props?.key || null
  } as unknown as VNode

  normalizeChildren(vnode, children)

  return vnode
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    // children 为数组 [h('p', 'p1'), h('p', 'p2')]
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (isObject(children)) {
  } else if (isFunction(children)) {
  } else {
    children = String(children) // children 为字符串
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.children = children
  vnode.shapeFlag |= type // 按位或赋值 此时为 9
}

// 节点类型是否相同
export function isSameVNodeType(n1: VNode, n2: VNode) {
  return n1.type === n2.type && n1.key === n2.key
}
