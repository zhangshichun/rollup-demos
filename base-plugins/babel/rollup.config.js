// rollup.config.js
import babel from '@rollup/plugin-babel';import path from 'path'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    babel({
      presets: ['@babel/preset-env']
    })
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
};