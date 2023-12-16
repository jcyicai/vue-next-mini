import { isString } from '@vue/shared'

export function patchStyle(el: Element, prev, next) {
  const style = (el as HTMLElement).style
  const isCssString = isString(next)

  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key])
    }

    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, '')
        }
      }
    }
  }
}

// 设置样式
function setStyle(style: CSSStyleDeclaration, name: string, val: string) {
  style[name] = val
}
