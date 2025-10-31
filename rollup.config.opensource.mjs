import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'

// 开源版本的 Rollup 配置 - 排除 call-js-sdk
export default {
  input: './src/index.opensource.js',
  output: [
    {
      file: './dist/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: './dist/bundle.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            corejs: '3'
          }
        ]
      ],
      extensions: ['.js', '.ts']
    }),
    terser({
      compress: {
        drop_console: true
      },
      mangle: true
    }),
    postcss({
      extract: 'style/index.css',
      minimize: true
    })
  ]
}
