/**
 * IIFE entry for production usage.
 *
 * This bundle mounts `PageAgent` to `window.PageAgent` without auto-initializing any agent instance.
 */
import { PageAgent } from './PageAgent'

window.PageAgent = PageAgent

console.log('[page-agent] page-agent.js loaded (no autoInit)')

