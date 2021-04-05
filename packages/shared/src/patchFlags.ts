/**
 * Patch flags are optimization hints generated by the compiler.
 * when a block with dynamicChildren is encountered during diff, the algorithm
 * enters "optimized mode". In this mode, we know that the vdom is produced by
 * a render function generated by the compiler, so the algorithm only needs to
 * handle updates explicitly marked by these patch flags.
 *
 * Patch flags can be combined using the | bitwise operator and can be checked
 * using the & operator, e.g.
 *
 * ```js
 * const flag = TEXT | CLASS
 * if (flag & TEXT) { ... }
 * ```
 *
 * Check the `patchElement` function in '../../runtime-core/src/renderer.ts' to see how the
 * flags are handled during diff.
 */
export const enum PatchFlags {
  /**
   * Indicates an element with dynamic textContent (children fast path)
   * 指明元素是一个动态的文本内容
   */
  TEXT = 1,

  /**
   * Indicates an element with dynamic class binding.
   * 指明元素是动态的class绑定
   */
  CLASS = 1 << 1,

  /**
   * Indicates an element with dynamic style
   * The compiler pre-compiles static string styles into static objects
   *
   * + detects and hoists inline static objects
   * e.g. style="color: red" and :style="{ color: 'red' }" both get hoisted as
   *   const style = { color: 'red' }
   *   render() { return e('div', { style }) }
   *
   * 指明一个元素是动态的样式
   * 编译器将静态字符串样式预编译为静态对象
   */
  STYLE = 1 << 2,

  /**
   * Indicates an element that has non-class/style dynamic props.
   * Can also be on a component that has any dynamic props (includes
   * class/style). when this flag is present, the vnode also has a dynamicProps
   * array that contains the keys of the props that may change so the runtime
   * can diff them faster (without having to worry about removed props)
   *
   * 指明一个元素拥有非class/style的动态props元素
   * 也可以是一个拥有任何动态props的的组件（包括class/style）
   * 当拥有这个flag，vnodes同时拥有包含所有可能改变的props的key的动态props数组
   * 因此在运行时可以最快的diff他们（不用担心移除的props）
   */
  PROPS = 1 << 3,

  /**
   * Indicates an element with props with dynamic keys. When keys change, a full
   * diff is always needed to remove the old key. This flag is mutually
   * exclusive with CLASS, STYLE and PROPS.
   *
   * 指明一个元素含有动态的props字段名。
   * 当字段名发生修改的时候，一次完整的diff通常需要移除旧的字段名。
   * 这个flag对于class、style、props来说是相对独立的
   */
  FULL_PROPS = 1 << 4,

  /**
   * Indicates an element with event listeners (which need to be attached
   * during hydration)
   *
   * 指明一个元素包含事件监听
   */
  HYDRATE_EVENTS = 1 << 5,

  /**
   * Indicates a fragment whose children order doesn't change.
   *
   * 指明一个片段，子集排序不进行变化
   */
  STABLE_FRAGMENT = 1 << 6,

  /**
   * Indicates a fragment with keyed or partially keyed children
   *
   * 指明一个具有下标或者部分下标子集的片段
   */
  KEYED_FRAGMENT = 1 << 7,

  /**
   * Indicates a fragment with unkeyed children.
   *
   * 指明一个不具有key子集的片段
   */
  UNKEYED_FRAGMENT = 1 << 8,

  /**
   * Indicates an element that only needs non-props patching, e.g. ref or
   * directives (onVnodeXXX hooks). since every patched vnode checks for refs
   * and onVnodeXXX hooks, it simply marks the vnode so that a parent block
   * will track it.
   *
   * 指定一个不需要进行props patch的元素
   */
  NEED_PATCH = 1 << 9,

  /**
   * Indicates a component with dynamic slots (e.g. slot that references a v-for
   * iterated value, or dynamic slot names).
   * Components with this flag are always force updated.
   *
   * 指定一个拥有动态slots的组件
   * 例如：slot引用了一个v-for迭代出来的值，或者动态的slot名字
   * 组件拥有这个标签那么每次都是重新更新
   */
  DYNAMIC_SLOTS = 1 << 10,

  /**
   * Indicates a fragment that was created only because the user has placed
   * comments at the root level of a template. This is a dev-only flag since
   * comments are stripped in production.
   *
   * 指定一个因为用户放置了根模板级别的注释的片段。
   * 自动生产环境注释被抛去，这就是一个只有在开发环境使用的标签
   */
  DEV_ROOT_FRAGMENT = 1 << 11,

  /**
   * SPECIAL FLAGS -------------------------------------------------------------
   * Special flags are negative integers. They are never matched against using
   * bitwise operators (bitwise matching should only happen in branches where
   * patchFlag > 0), and are mutually exclusive. When checking for a special
   * flag, simply check patchFlag === FLAG.
   *
   * 特殊标签
   * 特殊标签是负数。他们从不按位操作符进行匹配。（位操作匹配应该只发生在patchFlag > 0的分支）
   * 并且互相独立。
   * 当校验特殊标签的时候，只需要简单的校验patchFlag === FLAG
   */

  /**
   * Indicates a hoisted static vnode. This is a hint for hydration to skip
   * the entire sub tree since static content never needs to be updated.
   *
   * 指定一个静态vnode。
   * 这是一个用于提示编译器跳过整个附属节点的，因为静态内容从不需要进行更新
   */
  HOISTED = -1,
  /**
   * A special flag that indicates that the diffing algorithm should bail out
   * of optimized mode. For example, on block fragments created by renderSlot()
   * when encountering non-compiler generated slots (i.e. manually written
   * render functions, which should always be fully diffed)
   * OR manually cloneVNodes
   *
   * 一个特殊的标签用于指定diff算法应该退出优化模式。
   * 举个例子，当遭遇不存在编译器来生成slots但是被renderSlot创建的块
   * 这意思就是说，手动写一个render函数，总是需要全部进行diff，或者手动cloneVNodes
   */
  BAIL = -2
}

/**
 * dev only flag -> name mapping
 */
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}
