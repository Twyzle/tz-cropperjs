import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.vue', '**/*.mjs', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // ✅ This handles <script lang="ts">
        project: true,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Our component is named 'Cropper', which is a single word.
      'vue/multi-word-component-names': 'off',
      '@stylistic/semi': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
  {
    // Ignore build output and config files
    ignores: ['dist/', 'node_modules/', 'eslint.config.mjs'],
  }
)
