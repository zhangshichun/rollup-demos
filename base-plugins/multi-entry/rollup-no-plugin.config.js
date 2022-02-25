// rollup.config.js
import path from 'path'

export default {
  // 核心选项
  input: [path.resolve(__dirname, './a.js'), path.resolve(__dirname, './b.js')],     // 必须
  plugins: [
  ],
  output: {
    dir: path.resolve(__dirname, 'out'),
    format: 'esm'
  },
};