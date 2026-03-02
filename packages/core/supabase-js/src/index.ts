import IndobaseClient from './SupabaseClient'
import type { GenericSchema, IndobaseClientOptions } from './lib/types'

export * from '@indobase/auth-js'
export type { User as AuthUser, Session as AuthSession } from '@indobase/auth-js'
export type {
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
} from '@indobase/postgrest-js'
export { PostgrestError } from '@indobase/postgrest-js'
export type { FunctionInvokeOptions } from '@indobase/functions-js'
export {
  FunctionsHttpError,
  FunctionsFetchError,
  FunctionsRelayError,
  FunctionsError,
  FunctionRegion,
} from '@indobase/functions-js'
export * from '@indobase/realtime-js'
export { default as IndobaseClient } from './SupabaseClient'
// removed SupabaseClient alias to avoid legacy naming
export type { IndobaseClientOptions, QueryResult, QueryData, QueryError, DatabaseWithoutInternals } from './lib/types'

/**
 * Creates a new Indobase Client.
 *
 * @example
 * ```ts
 * import { createClient } from '@indobase/supabase-js'
 *
 * const client = createClient('https://xyzcompany.indobase.fun', 'public-anon-key')
 * const { data, error } = await client.from('profiles').select('*')
 * ```
 */
export const createIndobaseClient = <
  Database = any,
  SchemaName extends string = 'public',
  Schema extends GenericSchema = Database extends { [key: string]: any }
    ? SchemaName extends keyof Database
      ? Database[SchemaName]
      : any
    : any
>(
  indobaseUrl: string,
  indobaseKey: string,
  options?: IndobaseClientOptions<SchemaName>
): IndobaseClient<Database, SchemaName, Schema> => {
  return new IndobaseClient<Database, SchemaName, Schema>(
    indobaseUrl,
    indobaseKey,
    options
  )
}

export const createClient = createIndobaseClient

// Check for Node.js <= 18 deprecation
function shouldShowDeprecationWarning(): boolean {
  // Skip in browser environments
  if (typeof window !== 'undefined') {
    return false
  }

  // Skip if process is not available (e.g., Edge Runtime)
  // Use dynamic property access to avoid Next.js Edge Runtime static analysis warnings
  const _process = (globalThis as any)['process']
  if (!_process) {
    return false
  }

  const processVersion = _process['version']
  if (processVersion === undefined || processVersion === null) {
    return false
  }

  const versionMatch = processVersion.match(/^v(\d+)\./)
  if (!versionMatch) {
    return false
  }

  const majorVersion = parseInt(versionMatch[1], 10)
  return majorVersion <= 18
}

if (shouldShowDeprecationWarning()) {
  console.warn(
    `⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @indobase/supabase-js. ` +
      `Please upgrade to Node.js 20 or later. ` +
      `For more information, visit: https://github.com/indobase/indobase/discussions`
  )
}
