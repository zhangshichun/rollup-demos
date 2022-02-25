// rollup.config.js
import path from 'path'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle-no-plugin.js'),
      format: 'esm'
    },
  ]
};