# reactivity

响应式

## WeakMap
- `{key, value}` 结构对象
- `key` 必须是对象
- `key` 是弱引用
  - 弱引用：不会影响垃圾回收机制。即 `WeakMap` 的 key 不再任何引用时，会被直接回收。
  - 强引用：会影响垃圾回收机制。存在强引用的对象永远不会被回收

```javascript
let obj = {
    name: 'jc'
}
const map = new Map() // new WeakMap()
map.set(obj, 'cc')

obj = null
```

- 正常来说，对象为空，堆内存中数据没有指针指向就会被回收
- 但 map 数据依然存在，说明 Map 为强引用
- 设置 WeakMap，数据为空，则说明 WeakMap 为弱引用
- 准确地说，obj 不存在其他引用时， WeakMap 不会阻止垃圾回收，基于 obj 的引用将会被清除，这就证明 WeakMap 的弱引用特性。
