# Indobase JS

Official JavaScript client for Indobase.

## Installation

**npm:**
```bash
npm install @indobase/js
```

**yarn:**
```bash
yarn add @indobase/js
```

**pnpm:**
```bash
pnpm add @indobase/js
```

## Usage

```typescript
import { createClient } from "@indobase/js"

const client = createClient("https://your-project.indobase.co", "public-anon-key")
```

## Features
- **Isomorphic**: Works in Node.js, Browsers, Deno, Bun, and React Native.
- **Type-safe**: Built with TypeScript, offering comprehensive intellisense.
- **Unified SDK**: Provides access to Authentication, Database, Realtime, Storage, and Edge Functions.

## TypeScript Support
`@indobase/js` provides first-class TypeScript support. Types are automatically inferred when you provide your database schema.

## Node + Browser Support
Works in modern browsers, Node.js (>=18), Deno, Bun, Edge Functions (Cloudflare Workers), and React Native.

## License
MIT
