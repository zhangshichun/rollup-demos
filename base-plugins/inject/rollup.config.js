// rollup.config.js

import inject from '@rollup/plugin-inject';
import path from 'path'


export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    inject({
      _: 'lodash',
      jquery: "jquery"
    })
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
  external: ['lodash', 'jquery']
};