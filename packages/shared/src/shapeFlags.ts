export const enum ShapeFlags {
  ELEMENT = 1, // type = Element
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件
  STATEFUL_COMPONENT = 1 << 2, // 有状态（响应状态）组件
  TEXT_CHILDREN = 1 << 3, // children = Text
  ARRAY_CHILDREN = 1 << 4, // children = Array
  SLOTS_CHILDREN = 1 << 5, // children = slote
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT //组件：有状态（响应数据）组件 | 函数组件
}
