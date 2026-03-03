import { resolveFetch, resolveHeadersConstructor, fetchWithAuth } from '../../src/lib/fetch'

// Mock fetch for testing
const mockFetch = jest.fn()
const mockHeaders = jest.fn()

describe('fetch module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset global fetch
    delete (global as any).fetch
    delete (global as any).Headers
  })

  describe('resolveFetch', () => {
    test('should use custom fetch when provided', () => {
      const customFetch = jest.fn()
      const result = resolveFetch(customFetch)
      expect(typeof result).toBe('function')
      // Test that it actually calls the custom fetch
      result('test')
      expect(customFetch).toHaveBeenCalledWith('test')
    })

    test('should use global fetch when available', () => {
      const globalFetch = jest.fn()
      ;(global as any).fetch = globalFetch

      const result = resolveFetch()
      expect(typeof result).toBe('function')
      // Test that it actually calls the global fetch
      result('test')
      expect(globalFetch).toHaveBeenCalledWith('test')
    })

    test('should return native fetch when no custom fetch provided', () => {
      const result = resolveFetch()
      expect(typeof result).toBe('function')
    })
  })

  describe('resolveHeadersConstructor', () => {
    test('should return native Headers', () => {
      const GlobalHeaders = jest.fn()
      ;(global as any).Headers = GlobalHeaders

      const result = resolveHeadersConstructor()
      expect(result).toBe(GlobalHeaders)
    })
  })

  describe('fetchWithAuth', () => {
    test('should add apikey and authorization headers', async () => {
      const mockResponse = { ok: true }
      const mockFetchImpl = jest.fn().mockResolvedValue(mockResponse)
      const mockHeadersImpl = jest.fn().mockReturnValue({
        has: jest.fn().mockReturnValue(false),
        set: jest.fn(),
      })

      ;(global as any).fetch = mockFetchImpl
      ;(global as any).Headers = mockHeadersImpl

      const indobaseKey = 'test-key'
      const getAccessToken = jest.fn().mockResolvedValue('test-token')

      const authFetch = fetchWithAuth(indobaseKey, getAccessToken)
      await authFetch('https://example.com')

      expect(mockHeadersImpl).toHaveBeenCalled()
      expect(getAccessToken).toHaveBeenCalled()
    })

    test('should use indobaseKey as fallback when getAccessToken returns null', async () => {
      const mockResponse = { ok: true }
      const mockFetchImpl = jest.fn().mockResolvedValue(mockResponse)
      const mockHeadersImpl = jest.fn().mockReturnValue({
        has: jest.fn().mockReturnValue(false),
        set: jest.fn(),
      })

      ;(global as any).fetch = mockFetchImpl
      ;(global as any).Headers = mockHeadersImpl

      const indobaseKey = 'test-key'
      const getAccessToken = jest.fn().mockResolvedValue(null)

      const authFetch = fetchWithAuth(indobaseKey, getAccessToken)
      await authFetch('https://example.com')

      expect(getAccessToken).toHaveBeenCalled()
    })

    test('should not override existing apikey header', async () => {
      const mockResponse = { ok: true }
      const mockFetchImpl = jest.fn().mockResolvedValue(mockResponse)
      const mockSet = jest.fn()
      const mockHeadersImpl = jest.fn().mockReturnValue({
        has: jest.fn().mockImplementation((key) => key === 'apikey'),
        set: mockSet,
      })

      ;(global as any).fetch = mockFetchImpl
      ;(global as any).Headers = mockHeadersImpl

      const indobaseKey = 'test-key'
      const getAccessToken = jest.fn().mockResolvedValue('test-token')

      const authFetch = fetchWithAuth(indobaseKey, getAccessToken)
      await authFetch('https://example.com')

      expect(mockSet).not.toHaveBeenCalledWith('apikey', indobaseKey)
    })

    test('should not override existing authorization header', async () => {
      const mockResponse = { ok: true }
      const mockFetchImpl = jest.fn().mockResolvedValue(mockResponse)
      const mockSet = jest.fn()
      const mockHeadersImpl = jest.fn().mockReturnValue({
        has: jest.fn().mockImplementation((key) => key === 'Authorization'),
        set: mockSet,
      })

      ;(global as any).fetch = mockFetchImpl
      ;(global as any).Headers = mockHeadersImpl

      const indobaseKey = 'test-key'
      const getAccessToken = jest.fn().mockResolvedValue('test-token')

      const authFetch = fetchWithAuth(indobaseKey, getAccessToken)
      await authFetch('https://example.com')

      expect(mockSet).not.toHaveBeenCalledWith('Authorization', expect.stringContaining('Bearer'))
    })
  })
})
