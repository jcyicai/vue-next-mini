import { NodeTypes } from './ast'
import { isSingleElementRoot } from './hoistStatic'

export interface TransformContext {
  root
  parent: ParentNode | null
  childIndex: number
  currentNode
  helpers: Map<symbol, number>
  helper<T extends symbol>(name: T): T
  nodeTransforms: any[]
}

export function createTransformContext(root, { nodeTransforms = [] }) {
  const context: TransformContext = {
    nodeTransforms,
    root,
    helpers: new Map(),
    currentNode: root,
    parent: null,
    childIndex: 0,
    helper(name) {
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
      return name
    }
  }

  return context
}

export function transform(root, options) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  // 处理根节点的 codegenNode
  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
  root.components = []
  root.directives = []
  root.imports = []
  root.hoists = []
  root.temps = []
  root.cached = []
}

// 遍历转换节点，转换的过程一定要是深度优先的（即：孙 -> 子 -> 父）
// 因为当前节点的状态往往需要根据子节点的情况来确定
// 转换过程分为两个阶段
// 1. 进入阶段：存储所有节点的转换函数到 exitFns 中
// 2. 退出阶段： 执行 exitFns 中缓存的转换函数，且一定是倒叙的。
//    因为只有这样才能保证整个处理过程是深度优先的。
export function traverseNode(node, context: TransformContext) {
  context.currentNode = node
  const { nodeTransforms } = context
  const exitFns: any = []

  for (let i = 0; i < nodeTransforms.length; i++) {
    const onExit = nodeTransforms[i](node, context)
    if (onExit) {
      exitFns.push(onExit)
    }
  }

  switch (node.type) {
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traverseChildren(node, context)
      break
  }

  context.currentNode = node
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

export function traverseChildren(parent, context: TransformContext) {
  parent.children.forEach((node, index) => {
    context.parent = parent
    context.childIndex = index
    traverseNode(node, context)
  })
}

function createRootCodegen(root) {
  const { children } = root

  // Vue 2 仅支持单个根节点
  if (children.length === 1) {
    const child = children[0]
    if (isSingleElementRoot(root, child) && child.codegenNode) {
      root.codegenNode = child.codegenNode
    }
  }
}
