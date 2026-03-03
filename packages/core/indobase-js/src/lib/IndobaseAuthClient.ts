import { AuthClient } from '@indobase/auth-js'
import { IndobaseAuthClientOptions } from './types'

export class IndobaseAuthClient extends AuthClient {
  constructor(options: IndobaseAuthClientOptions) {
    super(options)
  }
}
