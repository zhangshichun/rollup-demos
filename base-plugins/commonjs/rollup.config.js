// rollup.config.js
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    commonjs()
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'cjs'
    },
  ],
};