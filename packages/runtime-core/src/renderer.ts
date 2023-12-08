import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { Comment, Fragment, Text, isSameVNodeType } from './vnode'
import { EMPTY_OBJ } from '@vue/shared'

export interface RendererOptions {
  // 为指定的 element 的 props 打补丁
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  // 为指定的 Element 设置 text
  setElementText(node: Element, text: string): void
  // 插入指定的 el 到 parent 中，anchor 标识插入的位置，即：锚点
  insert(el, parent: Element, anchor?): void
  // 创建 Element
  createElement(type: string)
  // 移除 Element
  remove(el: Element)
}

export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options: RendererOptions): any {
  const {
    insert: hostInsert,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    remove: hostRemove
  } = options

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 挂载
      mountElement(newVNode, container, anchor)
    } else {
      // 更新
      patchElement(oldVNode, newVNode)
    }
  }
  // 挂载
  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode
    // 1. 创建 element
    const el = (vnode.el = hostCreateElement(type))
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 2. 设置文本
      hostSetElementText(el, vnode.children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    }
    // 3. 设置 props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    // 4. 插入
    hostInsert(el, container, anchor)
  }

  const patchElement = (oldVNode, newVNode) => {
    // 拷贝
    const el = (newVNode.el = oldVNode.el)
    // 获取新旧节点的 props
    const oldProps = oldVNode.props || EMPTY_OBJ
    const newProps = newVNode.props || EMPTY_OBJ
    // 更新子节点
    patchChildren(oldVNode, newVNode, el, null)
    // 更新 prop
    patchProps(el, newVNode, oldProps, newProps)
  }

  const patchChildren = (oldVNode, newVNode, container, anchor) => {
    // 旧节点的 children
    const c1 = oldVNode && oldVNode.children
    // 上一个 shapeFlag
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
    // 新节点的children
    const c2 = newVNode && newVNode.children
    // 新节点的 shapeFlag
    const { shapeFlag } = newVNode
    // 新节点为 text  旧节点是 array  否则判断新旧子节点是否相同
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 卸载旧节点
      }

      if (c2 !== c1) {
        // 挂载新子节点的文本
        hostSetElementText(container, c2)
      }
    } else {
      // 旧节点为 array  新节点也为 array 走 diff 否则卸载
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // diff 运算
        } else {
          // 卸载
        }
      } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 删除旧节点的 text
          hostSetElementText(container, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 单独新子节点的挂载
        }
      }
    }
  }

  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        // 根据 key 获取新旧的 props 值
        const next = newProps[key]
        const prev = oldProps[key]
        // 如果不相同 则重新挂载
        if (next !== prev) {
          hostPatchProp(el, key, prev, next)
        }
      }
      // 处理新的 props 不存在，那么则删除旧的 props 对应的属性
      // 旧 { class: 'text' } 新 {}
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return
    }
    // 存在旧节点 且 新旧节点类型不同
    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      // 删除旧节点
      unmount(oldVNode)
      oldVNode = null
    }

    const { type, shapeFlag } = newVNode

    switch (type) {
      case Text:
        break
      case Comment:
        break
      case Fragment:
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
        }
    }
  }
  // 卸载
  const unmount = vnode => {
    hostRemove(vnode.el)
  }
  // 渲染
  const render = (vnode, container) => {
    if (vnode === null) {
      // 卸载
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode, vnode, container)
    }

    container._vnode = vnode
  }

  return {
    render
  }
}
