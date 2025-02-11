import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  {
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
  {
    files: ['**/*.ts', '**/*.vue', '**/*.js'],
    ignorePatterns: ['old/'],
    plugins: { prettier },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/multi-word-component-names': 'off',
      // set to 'warn' to highlight formatting errors, but if we format
      // on save anyway, it's not that useful
      //'prettier/prettier': 'warn',
      'vue/block-lang': [
        'error',
        {
          script: { allowNoLang: true, lang: 'ts' },
        },
      ],
    },
  },
];
