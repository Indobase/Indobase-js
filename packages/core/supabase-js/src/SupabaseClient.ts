import type { AuthChangeEvent } from '@indobase/auth-js'
import { FunctionsClient } from '@indobase/functions-js'
import {
  PostgrestClient,
  type PostgrestFilterBuilder,
  type PostgrestQueryBuilder,
} from '@indobase/postgrest-js'
import {
  type RealtimeChannel,
  type RealtimeChannelOptions,
  RealtimeClient,
  type RealtimeClientOptions,
} from '@indobase/realtime-js'
import { StorageClient as IndobaseStorageClient } from '@indobase/storage-js'

import {
  DEFAULT_AUTH_OPTIONS,
  DEFAULT_DB_OPTIONS,
  DEFAULT_GLOBAL_OPTIONS,
  DEFAULT_REALTIME_OPTIONS,
} from './lib/constants'

import { fetchWithAuth } from './lib/fetch'
import { applySettingDefaults, validateSupabaseUrl } from './lib/helpers'

// 🔥 IMPORTANT: Keep internal class name, alias it
import { IndobaseAuthClient } from './lib/IndobaseAuthClient'

import type {
  Fetch,
  GenericSchema,
  SupabaseAuthClientOptions,
  SupabaseClientOptions,
} from './lib/types'

import { GetRpcFunctionFilterBuilderByArgs } from './lib/rest/types/common/rpc'

export default class IndobaseClient<
  Database = any,
  SchemaName extends string = 'public'
> {
  auth: IndobaseAuthClient
  realtime: RealtimeClient
  storage: IndobaseStorageClient

  protected realtimeUrl: URL
  protected authUrl: URL
  protected storageUrl: URL
  protected functionsUrl: URL
  protected rest: PostgrestClient<any, any, any>
  protected storageKey: string
  protected fetch?: Fetch
  protected changedAccessToken?: string
  protected accessToken?: () => Promise<string | null>

  protected headers: Record<string, string>

  constructor(
    protected indobaseUrl: string,
    protected indobaseKey: string,
    options?: SupabaseClientOptions<any>
  ) {
    const baseUrl = validateSupabaseUrl(indobaseUrl)
    if (!indobaseKey) throw new Error('indobaseKey is required.')

    this.realtimeUrl = new URL('realtime/v1', baseUrl)
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace('http', 'ws')
    this.authUrl = new URL('auth/v1', baseUrl)
    this.storageUrl = new URL('storage/v1', baseUrl)
    this.functionsUrl = new URL('functions/v1', baseUrl)

    const defaultStorageKey = `sb-${baseUrl.hostname.split('.')[0]}-auth-token`

    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: { ...DEFAULT_AUTH_OPTIONS, storageKey: defaultStorageKey },
      global: DEFAULT_GLOBAL_OPTIONS,
    }

    const settings = applySettingDefaults(options ?? {}, DEFAULTS)

    this.storageKey = settings.auth.storageKey ?? ''
    this.headers = settings.global.headers ?? {}

    if (!settings.accessToken) {
      this.auth = this._initIndobaseAuthClient(
        settings.auth ?? {},
        this.headers,
        settings.global.fetch
      )
    } else {
      this.accessToken = settings.accessToken

      this.auth = new Proxy<IndobaseAuthClient>({} as any, {
        get: (_, prop) => {
          throw new Error(
            `Indobase Client is configured with accessToken, accessing indobase.auth.${String(
              prop
            )} is not allowed`
          )
        },
      })
    }

    this.fetch = fetchWithAuth(
      indobaseKey,
      this._getAccessToken.bind(this),
      settings.global.fetch
    )

    this.realtime = new RealtimeClient(this.realtimeUrl.href, {
      headers: this.headers,
      accessToken: this._getAccessToken.bind(this),
      ...settings.realtime,
    })

    this.rest = new PostgrestClient(new URL('rest/v1', baseUrl).href, {
      headers: this.headers,
      fetch: this.fetch,
    })

    this.storage = new IndobaseStorageClient(
      this.storageUrl.href,
      this.headers,
      this.fetch,
      options?.storage
    )

    if (!settings.accessToken) {
      this._listenForAuthEvents()
    }
  }

  get functions(): FunctionsClient {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch,
    })
  }

  from(relation: string) {
    return this.rest.from(relation)
  }

  channel(name: string, opts: RealtimeChannelOptions = { config: {} }): RealtimeChannel {
    return this.realtime.channel(name, opts)
  }

  getChannels(): RealtimeChannel[] {
    return this.realtime.getChannels()
  }

  removeChannel(channel: RealtimeChannel) {
    return this.realtime.removeChannel(channel)
  }

  removeAllChannels() {
    return this.realtime.removeAllChannels()
  }

  private async _getAccessToken() {
    if (this.accessToken) {
      return await this.accessToken()
    }

    const { data } = await this.auth.getSession()
    return data.session?.access_token ?? this.indobaseKey
  }

  private _initIndobaseAuthClient(
    options: SupabaseAuthClientOptions,
    headers?: Record<string, string>,
    fetch?: Fetch
  ) {
    return new IndobaseAuthClient({
      url: this.authUrl.href,
      headers: { ...headers, apikey: this.indobaseKey },
      fetch,
      ...options,
    })
  }

  private _listenForAuthEvents() {
    this.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: any) => {
        this._handleTokenChanged(event, session?.access_token)
      }
    )
  }

  private _handleTokenChanged(event: AuthChangeEvent, token?: string) {
    if (
      (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') &&
      this.changedAccessToken !== token
    ) {
      this.changedAccessToken = token
      this.realtime.setAuth(token)
    } else if (event === 'SIGNED_OUT') {
      this.realtime.setAuth()
      this.changedAccessToken = undefined
    }
  }
}