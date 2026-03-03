// Type definitions for @indobase/js

export interface IndobaseClientOptions<SchemaName extends string = 'public'> {
  auth?: {
    persistSession?: boolean;
    storageKey?: string;
    storage?: {
      getItem(key: string): Promise<string | null>;
      setItem(key: string, value: string): Promise<void>;
      removeItem(key: string): Promise<void>;
    };
    autoRefreshToken?: boolean;
    detectSessionInUrl?: boolean;
    headers?: Record<string, string>;
  };
  realtime?: {
    params?: Record<string, unknown>;
    eventsPerSecond?: number;
  };
  db?: {
    schema?: SchemaName;
  };
  global?: {
    fetch?: typeof fetch;
    headers?: Record<string, string>;
  };
}

export interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  count: number | null;
  status: number;
  statusText: string;
}

export interface QueryData<T> {
  data: T;
}

export interface QueryError {
  message: string;
  details: string;
  hint: string;
  code: string;
}
