// eslint.config.mjs

import { defineConfig } from 'eslint-define-config';
import ts from '@typescript-eslint/parser';
import tsEslint from '@typescript-eslint/eslint-plugin';
import stylisticEslint from '@stylistic/eslint-plugin';

export default defineConfig([
	{
		ignores: ['**/*.test.js'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: ts,
			parserOptions: {
				ecmaVersion: 2024,
				project: './tsconfig.json',
				createDefaultProgram: true,
				ecmaFeatures: {
					impliedStrict: true,
				},
			},
		},
		plugins: {
			'@typescript-eslint': tsEslint,
			'@stylistic': stylisticEslint,
		},
		rules: {
			'@typescript-eslint/naming-convention': 'warn',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@stylistic/semi': 'warn',
			'curly': 'warn',
			'eqeqeq': ['warn', 'always'],
			'no-redeclare': 'warn',
			'no-throw-literal': 'warn',
			'no-unused-expressions': 'off',
		},
		ignores: ['src/ui-test/resources/problems.ts'],
	},
]);
