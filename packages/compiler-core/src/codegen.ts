import { isArray, isString } from '@vue/shared'
import { NodeTypes } from './ast'
import { helperNameMap } from './runtimeHelpers'
import { getVNodeHelper } from './utils'

const aliasHelper = (s: symbol) => `${helperNameMap[s]}: _${helperNameMap[s]}`

function createCodegenContext(ast) {
  const context = {
    code: '',
    runtimeGlobalName: 'Vue',
    source: ast.loc.source,
    indentLevel: 0,
    isSSR: false,
    helper(key) {
      return `_${helperNameMap[key]}`
    },
    push(code) {
      context.code += code
    },
    newLine() {
      newLine(context.indentLevel)
    },
    indent() {
      newLine(++context.indentLevel)
    },
    deindent() {
      newLine(--context.indentLevel)
    }
  }

  function newLine(n: number) {
    context.code += '\n' + `  `.repeat(n)
  }

  return context
}

export function generate(ast) {
  const context = createCodegenContext(ast)

  const { push, newLine, indent, deindent } = context

  genFunctionPreamble(context)

  const functionName = `render`
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${functionName}(${args}) {`)
  indent()

  const hasHelpers = ast.helpers.length > 0
  if (hasHelpers) {
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = _Vue`)
    push('\n')
    newLine()
  }

  newLine()
  push(`return `)

  if (ast.codegenNode) {
    genNode(ast.codegenNode, context)
  } else {
    push(`null`)
  }

  deindent()
  push('}')

  return {
    ast,
    code: context.code
  }
}

function genFunctionPreamble(context) {
  const { push, runtimeGlobalName, newLine } = context
  const VueBinding = runtimeGlobalName
  push(`const _Vue = ${VueBinding}\n`)
  newLine()
  push(`return `)
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.VNODE_CALL:
      genVNodeCall(node, context)
      break
    case NodeTypes.TEXT:
      genText(node, context)
      break
  }
}

function genText(node, context) {
  context.push(JSON.stringify(node.content), node)
}

function genVNodeCall(node, context) {
  const { push, helper } = context
  const {
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    isComponent
  } = node

  const callHelper = getVNodeHelper(context.isSSR, isComponent)
  push(helper(callHelper) + `(`)

  const args = genNullableArgs([tag, props, children, patchFlag, dynamicProps])

  genNodeList(args, context)

  push(')')
}

function genNullableArgs(args: any[]) {
  let i = args.length
  while (i--) {
    if (args[i] != null) break
  }
  return args.slice(0, i + 1).map(arg => arg || `null`)
}

function genNodeList(nodes, context) {
  const { push, newLine } = context

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if (isString(node)) {
      push(node)
    } else if (isArray(node)) {
      genNodeListAsArray(node, context)
    } else {
      genNode(node, context)
    }

    if (i < nodes.length - 1) {
      push(`, `)
    }
  }
}

function genNodeListAsArray(nodes, context) {
  context.push('[')
  genNodeList(nodes, context)
  context.push(']')
}
