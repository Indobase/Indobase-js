import { IndobaseAuthClient } from '../../src/lib/IndobaseAuthClient'
import IndobaseClient from '../../src/IndobaseClient'
import { DEFAULT_HEADERS } from '../../src/lib/constants'

const DEFAULT_OPTIONS = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: DEFAULT_HEADERS,
  },
  db: {
    schema: 'public',
  },
}
const settings = { ...DEFAULT_OPTIONS }

const authSettings = { ...settings.global, ...settings.auth }

test('it should create a new instance of the class', () => {
  const authClient = new IndobaseAuthClient(authSettings)
  expect(authClient).toBeInstanceOf(IndobaseAuthClient)
})

test('_initIndobaseAuthClient should overwrite authHeaders if headers are provided', () => {
  const authClient = new IndobaseClient('https://example.indobase.fun', 'indobaseKey')[
    '_initIndobaseAuthClient'
  ](authSettings, {
    Authorization: 'Bearer custom-auth-header',
  })
  expect(authClient['headers']['Authorization']).toBe('Bearer custom-auth-header')
  expect(authClient['headers']['apikey']).toBe('indobaseKey')
})

test('_initIndobaseAuthClient should pass through throwOnError option', () => {
  const client = new IndobaseClient('https://example.indobase.fun', 'indobaseKey')
  const authClient = client['_initIndobaseAuthClient'](
    { ...authSettings, throwOnError: true },
    undefined,
    undefined
  )

  expect((authClient as any).isThrowOnErrorEnabled()).toBe(true)
})

test('createClient should accept auth.throwOnError and wire it to auth client', () => {
  const supa = new IndobaseClient('https://example.indobase.fun', 'indobaseKey', {
    auth: { throwOnError: true },
  })
  expect((supa.auth as any).isThrowOnErrorEnabled()).toBe(true)
})
