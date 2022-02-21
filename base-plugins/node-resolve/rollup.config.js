// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    nodeResolve()
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'cjs'
    },
  ],
};