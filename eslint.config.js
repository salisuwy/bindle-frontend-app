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
    files: ['**/*.ts', '**/*.vue'],
    plugins: { prettier },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'warn',
      'vue/block-lang': [
        'error',
        {
          script: { allowNoLang: true, lang: 'ts' },
        },
      ],
    },
  },
];
