// eslint.config.js (in the root directory)
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nuxtEslintConfig from '@nuxt/eslint-config' // The Nuxt config factory
import eslintConfigPrettier from 'eslint-config-prettier' // Prettier compatibility (MUST BE LAST)

// Determine the root directory for tsconfig paths
const __dirname = import.meta.dirname // Use import.meta.dirname in ESM

export default tseslint.config(
	// 1. Global Ignores (Adjust as needed)
	{
		ignores: [
			'**/node_modules/**',
			'**/.pnpm-store/**',
			'**/dist/**',
			'**/build/**',
			// Nuxt specific (relative to root)
			'frontend/.nuxt/**',
			'frontend/.output/**',
			'frontend/dist/**',
			// Backend specific (example)
			'backend/dist/**',
			// Other common ignores
			'**/*.log',
			'pnpm-lock.yaml',
			'coverage/**',
		],
	},

	// 2. Core ESLint Recommended Rules
	js.configs.recommended,

	// 3. TypeScript Recommended (base for .ts files, NON-TYPE-AWARE)
	// This sets up the parser and plugin for TS files generally
	// but doesn't activate rules that require type information globally.
	...tseslint.configs.recommended,

	// 4. Custom Global Rules (also non-type-aware unless project explicitly set here, which we avoid for global)
	{
		// Apply to all JS/TS files initially, can be overridden below
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node, // Assume Node.js environment globally or for backend
				...globals.es2021,
			},
		},

		// These rules will apply to all files in all folders that aren't ignored above.
		// Treat this as global.
		// To create specific rules for either frontend or backend, use the rules below.
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
				'warn', // or 'error'
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'linebreak-style': ['error', 'unix'], // Enforce LF line breaks

			// Add other global overrides if needed
			// 'no-console': 'warn', // Example: discourage console.log in production code
		},
	},

	// 5. Frontend (Nuxt) Specific Configuration
	// We call the nuxtEslintConfig factory. It returns an array of config objects.
	// We need to ensure these configs only apply to the frontend directory.
	...(await (async () => {
		const nuxtConfigs = await nuxtEslintConfig({
			// Options for @nuxt/eslint-config:
			features: {
				stylistic: true, // Or false, or an options object. Enables stylistic rules.
				typescript: true, // Enables TypeScript-specific Nuxt rules.
			},
			// IMPORTANT: Point to the tsconfig.json *within* your Nuxt app folder
			tsconfigPath: 'frontend/tsconfig.json',
		})

		// Modify each config object from Nuxt to only apply to 'frontend' files
		return nuxtConfigs.map(config => ({
			...config,
			files: ['frontend/**/*.{js,jsx,ts,tsx,vue}'], // Scope to frontend
		}))
	})()),

	// 6. Backend Specific Configuration (Example - Optional)
	// You might not need this if the global config covers the backend well enough
	{
		files: ['backend/**/*.ts'], // Target backend TS files
		languageOptions: {
			globals: {
				...globals.node, // Ensure node globals are set if not covered globally
			},
			parserOptions: {
				project: './backend/tsconfig.json', // Specific tsconfig for backend
				// tsconfigRootDir: __dirname,
				// sourceType: 'module',
			},
		},
		rules: {
			// Add backend-specific rule overrides if necessary
		},
	},

	// 7. Prettier Compatibility Configuration (MUST BE THE ABSOLUTE LAST ONE)
	// This disables ESLint rules that conflict with the Prettier config above.
	eslintConfigPrettier
)
