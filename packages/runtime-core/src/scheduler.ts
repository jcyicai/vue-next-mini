let isFlushPending = false

// promise.resolve()
const resolvedPromise = Promise.resolve() as Promise<any>

// 当前执行任务
let currentFlushPromise: Promise<void> | null = null

// 待执行的任务队列
const pendingPreFlushCbs: Function[] = []

// 队列预处理函数
export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs)
}

// 队列处理函数
function queueCb(cb: Function, pendingQueue: Function[]) {
  // 将所有的回调函数放入队列
  pendingQueue.push(cb)
  queueFlush()
}

// 依次处理队列中的回调函数
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

// 处理队列
function flushJobs() {
  isFlushPending = false
  flushPreFlushCbs()
}

// 依次处理队列中的任务
export function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length) {
    // 去重
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    // 清空
    pendingPreFlushCbs.length = 0
    // 遍历处理 job
    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]()
    }
  }
}
