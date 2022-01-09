// rollup.config.js
export default {
  // 核心选项
  input: 'index.js',     // 必须
  plugins: [],
  output: [
    {
      file: 'out/amd/bundle.js',
      format: 'amd',
      amd: {
        id: 'Test'
      }
    },
    {
      file: 'out/cjs/bundle.js',
      format: 'cjs'
    },
    {
      file: 'out/esm/bundle.js',
      format: 'esm'
    },
    {
      file: 'out/iife/bundle.js',
      format: 'iife',
      name: 'Test',
      globals: {
        lodash: 'lodash'
      }
    },
    {
      file: 'out/umd/bundle.js',
      format: 'umd',
      name: 'Test',
      globals: {
        lodash: 'lodash'
      },
      amd: {
        id: 'Test'
      }
    },
    {
      file: 'out/system/bundle.js',
      format: 'system'
    }
  ],
  external: ['lodash']
};