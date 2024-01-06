import { compile } from '@vue/compiler-dom'

function compileToFunction(template, options?) {
  const { code } = compile(template, options)
  console.log(code)
  const render = new Function(code)()

  return render
}

export { compileToFunction as compile }
