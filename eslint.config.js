import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // Disable rules that conflict with Prettier formatting
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Avoid warnings that would fail --max-warnings=0 in non-React modules
      'react-refresh/only-export-components': 'off',
    },
  },
]);
