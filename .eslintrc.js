module.exports = {
  root: true,
  extends: ['@aparajita/base'],

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        tsconfigRootDir: './',
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
      },
    },
  ],
}
