import { AuthClient } from '@indobase/auth-js'
import { SupabaseAuthClientOptions } from './types'

export class IndobaseAuthClient extends AuthClient {
  constructor(options: SupabaseAuthClientOptions) {
    super(options)
  }
}
