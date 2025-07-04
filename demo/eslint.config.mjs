import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginVue from 'eslint-plugin-vue'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'
import path from 'node:path'

export default [
  // Global ignores
  {
    ignores: [
      'dist/**',
      'android/**',
      'ios/**',
      'node_modules/**',
      '**/*.d.ts',
    ],
  },

  // Base JavaScript config
  js.configs.recommended,

  // Neostandard config (StandardJS style)
  ...neostandard(),

  // TypeScript config
  ...tseslint.configs.recommended,

  // Vue config
  ...pluginVue.configs['flat/recommended'],

  // Unicorn config
  pluginUnicorn.configs['flat/recommended'],

  // Oxlint plugin to disable duplicate rules
  ...pluginOxlint.buildFromOxlintConfigFile(
    path.resolve(import.meta.dirname, '../oxlint.config.jsonc'),
  ),

  // TypeScript-specific config
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Vue-specific overrides
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        project: './tsconfig.json',
      },
    },
    rules: {
      // Allow single-word component names (common in demos)
      'vue/multi-word-component-names': 'off',
      // Vue handles unused vars differently
      'vue/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Config files - handle version file that still uses CommonJS
  {
    files: ['.versionrc.js'],
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },

  // Demo-specific rule overrides
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // Allow unassigned imports for CSS/styles (common in Ionic/Vue)
      'import/no-unassigned-import': 'off',
      // Allow unlimited eslint-disable comments in demo code
      '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
      // More flexible import order for demo
      'import/order': 'off',
      // Allow unsafe type assertions in demo (common in framework integration)
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      // Allow unknown in catch for demo simplicity
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      // Allow import spacing issues in demo
      'import/newline-after-import': 'off',
      // Allow promise then/catch patterns (common in Capacitor plugins)
      'promise/prefer-await-to-then': 'off',
      // Allow top-level await alternatives in demo (not all environments support it)
      'unicorn/prefer-top-level-await': 'off',
      // Allow abbreviations in demo code (iCloudSync is clear)
      'unicorn/prevent-abbreviations': 'off',
      // Allow flexible filename casing for Vue components
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      // Allow console logs in demo
      'no-console': 'off',
      // Allow magic numbers in demo code
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },

  // Prettier config (should be last to override formatting rules)
  eslintConfigPrettier,
]
