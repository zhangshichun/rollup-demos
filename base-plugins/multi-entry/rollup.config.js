// rollup.config.js

import multi from '@rollup/plugin-multi-entry';
import path from 'path'


export default {
  // 核心选项
  input: [path.resolve(__dirname, 'a.js'), path.resolve(__dirname, 'b.js')],     // 必须
  plugins: [
    multi()
  ],
  output: {
    dir: path.resolve(__dirname, 'out'),
    format: 'esm'
  },
};