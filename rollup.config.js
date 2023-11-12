import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

// 默认导出一个数组，数组的每一个对象都是一个单独的导出文件配置
// https://www.rollupjs.com/guide/big-list-of-options
export default [
  {
    // 入口文件
    input: 'packages/vue/src/index.ts',
    // 打包出口
    output: [
      // 导出 iife 格式
      {
        // 开启 sourceMap
        sourceMap: true,
        // 导出文件地址
        file: './packages/vue/dist/vue.js',
        // 生成包的格式
        format: 'iife',
        // 变量名
        name: 'Vue',
        sourcemap: true
      }
    ],
    // 插件
    plugins: [
      // ts
      typescript({
        sourceMap: true
      }),
      // 模块导入的路径补全
      resolve(),
      // 转 commonjs 为 ESM
      commonjs()
    ]
  }
]
