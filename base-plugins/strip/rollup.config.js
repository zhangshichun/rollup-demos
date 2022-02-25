// rollup.config.js

import strip from '@rollup/plugin-strip';
import path from 'path'


export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    strip({
      functions: ['console.*']
    })
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
};