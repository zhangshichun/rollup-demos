// rollup.config.js
import alias from '@rollup/plugin-alias';
import path from 'path'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './a/b') },
      ]
    })
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
};