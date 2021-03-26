import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/plugin.js',
    format: 'iife',
    name: 'WSSecureStorage',
    globals: {
      '@capacitor/core': 'capacitorExports',
    },
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      // allowlist of dependencies to bundle in
      // @see https://github.com/rollup/plugins/tree/master/packages/node-resolve#resolveonly
      resolveOnly: [
        'tslib',
        'javascript-blowfish',
        '@aparajita/capacitor-native-decorator',
      ],
    }),
    commonjs(),
  ],
};
