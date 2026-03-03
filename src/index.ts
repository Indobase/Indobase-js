// Main SDK entry point for @indobase/js
//
// This SDK wraps the core @indobase packages:
// - @indobase/auth-js - Authentication
// - @indobase/postgrest-js - Database queries
// - @indobase/functions-js - Edge functions
// - @indobase/realtime-js - Real-time subscriptions
// - @indobase/storage-js - Storage
//
// Usage:
//   import { createIndobaseClient } from '@indobase/js'
//   const client = createIndobaseClient('https://your-project.indobase.co', 'your-api-key')
//
// For type definitions, the types are re-exported from the core packages.

// Re-export the main client creator
// The actual implementation is in @indobase/indobase-js which must be built first
import type { IndobaseClientOptions, QueryResult, QueryData, QueryError } from './types'

export type {
  IndobaseClientOptions,
  QueryResult,
  QueryData,
  QueryError
}

// Note: The createIndobaseClient function is re-exported from @indobase/indobase-js
// which must be built before this package. This is handled by the monorepo build.
export const createIndobaseClient = (() => {
  // This will be replaced at build time with the actual implementation
  // For now, we provide a type-safe stub
  return <Database = any, SchemaName extends string = 'public'>(
    indobaseUrl: string,
    indobaseKey: string,
    options?: IndobaseClientOptions<SchemaName>
  ) => {
    throw new Error('Please build @indobase/indobase-js first: npm run build --workspace=@indobase/indobase-js')
  }
})()

// Version info
export const SDK_VERSION = '1.0.0'
export const PACKAGE_NAME = '@indobase/js'
