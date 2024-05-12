import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended })

export default [
  ...compat.extends('eslint-config-standard'),
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    },
    files: ['src/**/*.js', 'src/**/*.ts'],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'commonjs',
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  }
]
