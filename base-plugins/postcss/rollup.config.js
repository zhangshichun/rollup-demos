// rollup.config.js

import postcss from 'rollup-plugin-postcss';
import path from 'path'

export default {
  // 核心选项
  input: path.resolve(__dirname, './index.js'),     // 必须
  plugins: [
    postcss({
      plugins: [
      ],
      extract: true,  
      use: ["sass"], 
      writeDefinitions: true
    })
  ],
  output: [
    {
      file: path.resolve(__dirname, 'out/bundle.js'),
      format: 'esm'
    },
  ],
};