// 使用位运算进行权限管理
export const enum ShapeFlags {
  // 元素 1
  ELEMENT = 1 /* 0000000001 */,
  // 函数组件 2
  FUNCTIONAL_COMPONENT = 1 << 1 /* 0000000010 */,
  // 常规状态组件 4
  STATEFUL_COMPONENT = 1 << 2 /* 0000000100 */,
  // 文本 8
  TEXT_CHILDREN = 1 << 3 /* 0000001000 */,
  // 数组 16
  ARRAY_CHILDREN = 1 << 4 /* 0000010000 */,
  // 插槽 32
  SLOTS_CHILDREN = 1 << 5 /* 0000100000 */,
  // https://vue3js.cn/docs/zh/guide/teleport.html
  // 当在初始的 HTML 结构中使用这个组件时，我们可以看到一个问题——模态是在深度嵌套的 div 中渲染的,
  // 而模态的 position:absolute 以父级相对定位的 div 作为引用。
  // Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下呈现 HTML,
  // 而不必求助于全局状态或将其拆分为两个组件。
  // teloport 64
  TELEPORT = 1 << 6 /* 0001000000 */,
  // suspense 128
  SUSPENSE = 1 << 7 /* 0010000000 */,
  // 组件是否应该被缓存（或者叫未缓存？）256
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8 /* 0100000000 */,
  // 缓存的组件 512
  COMPONENT_KEPT_ALIVE = 1 << 9 /* 1000000000 */,
  // 组件 6
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT |
    ShapeFlags.FUNCTIONAL_COMPONENT /* 0000000110 */
}
