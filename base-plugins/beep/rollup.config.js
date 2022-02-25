// rollup.config.js

import beep from '@rollup/plugin-beep';
import path from 'path'


export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    beep()
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
};