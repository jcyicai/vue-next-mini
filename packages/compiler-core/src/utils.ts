import { NodeTypes } from './ast'
import { CREATE_ELEMENT_VNODE, CREATE_VNODE } from './runtimeHelpers'

export function isText(node) {
  return node.type === NodeTypes.INTERPOLATION || node.type === NodeTypes.TEXT
}

export function getVNodeHelper(ssr: boolean, isComponent: boolean) {
  return ssr || isComponent ? CREATE_VNODE : CREATE_ELEMENT_VNODE
}
