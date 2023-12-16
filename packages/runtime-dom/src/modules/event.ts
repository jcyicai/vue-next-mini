export function patchEvent(
  el: Element & { _vei?: Object },
  rawName: string,
  prevValue,
  nextValue
) {
  const invokers = el._vei || (el._vei = {})
  const existingInvoker = invokers[rawName]
  // next存在 且 存在缓存 断定为更新行为
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue
  } else {
    const name = parseName(rawName) // 转小写
    if (nextValue) {
      // 新增事件
      const invoker = (invokers[rawName] = createInvoker(nextValue))
      el.addEventListener(name, invoker)
    } else if (existingInvoker) {
      // 删除事件
      el.removeEventListener(name, existingInvoker)
      invokers[rawName] = undefined
    }
  }
}

// 处理事件名转小写
// 因为 addEventListener 传入的类型 type 为小写
function parseName(name: string) {
  // 去掉 on 之后全部转为小写
  return name.slice(2).toLowerCase()
}

// 创建 invoker
function createInvoker(initialValue) {
  const invoker = (e: Event) => {
    invoker.value && invoker.value()
  }

  invoker.value = initialValue

  return invoker
}
