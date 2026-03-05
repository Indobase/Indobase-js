import { defineConfig } from 'tsup'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const fixShebang = async () => {
  const cliPath = 'dist/cli.js'
  try {
    if (existsSync(cliPath)) {
      let content = readFileSync(cliPath, 'utf-8')
      // Add shebang if not present
      if (!content.startsWith('#!/usr/bin/env node')) {
        content = '#!/usr/bin/env node\n' + content
        writeFileSync(cliPath, content)
      }
    }
  } catch (e) {
    // Ignore errors
  }
}

export default defineConfig([
  // Main SDK (ESM + CJS)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    target: 'es2022',
    external: [
      '@indobase/indobase-js',
    ],
  },
  // CLI (CJS only for bin)
  {
    entry: ['src/cli.ts'],
    format: ['cjs'],
    dts: false,
    sourcemap: false,
    clean: false,
    outDir: 'dist',
    target: 'es2022',
    platform: 'node',
    onSuccess: fixShebang,
  },
])
