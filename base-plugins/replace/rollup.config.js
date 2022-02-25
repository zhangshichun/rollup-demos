// rollup.config.js

import replace from '@rollup/plugin-replace';
import path from 'path'
import dayjs from 'dayjs'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    replace({
      __build_time__: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      preventAssignment: true
    })
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
};