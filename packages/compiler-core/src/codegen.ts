import { helperNameMap } from './runtimeHelpers'

function createCodegenContext(ast) {
  const context = {
    code: '',
    runtimeGlobalName: 'Vue',
    source: ast.loc.source,
    indentLevel: 0,
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
}
