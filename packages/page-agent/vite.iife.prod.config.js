// @ts-check
import { config as dotenvConfig } from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env from repo root
dotenvConfig({ path: resolve(__dirname, '../../.env'), quiet: true })

// IIFE Bundle for production usage:
// - bundles all local packages so it can be used via <script> tag
// - mounts `PageAgent` to `window.PageAgent`
// - does NOT auto-initialize an agent instance
export default defineConfig(() => ({
	plugins: [cssInjectedByJsPlugin({ relativeCSSInjection: true })],
	publicDir: false,
	build: {
		// Keep outputs from other iife builds (e.g. page-agent.demo.js) in the same folder.
		// Repo root `npm run cleanup` is responsible for cleaning dist outputs.
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'src/iife.ts'),
			name: 'PageAgent',
			fileName: () => 'page-agent.js',
			formats: ['iife'],
		},
		outDir: resolve(__dirname, 'dist', 'iife'),
		rollupOptions: {
			onwarn: function (message, handler) {
				if (message.code === 'EVAL') return
				handler(message)
			},
		},
	},
	define: {
		'import.meta.env.LLM_MODEL_NAME': JSON.stringify(process.env.LLM_MODEL_NAME),
		'import.meta.env.LLM_API_KEY': JSON.stringify(process.env.LLM_API_KEY),
		'import.meta.env.LLM_BASE_URL': JSON.stringify(process.env.LLM_BASE_URL),
	},
}))
