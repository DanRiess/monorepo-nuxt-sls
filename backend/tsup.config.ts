import { defineConfig } from 'tsup'

export default defineConfig(options => {
	return {
		entry: ['src/endpoints/**/*.ts', 'src/cron/**/*.ts', 'src/utility/*.ts'],
		format: ['esm'],
		splitting: false,
		minify: !options.watch,
		clean: true,
		target: 'node20',
		// noExternal: ['uuid', 'jose'],
	}
})
