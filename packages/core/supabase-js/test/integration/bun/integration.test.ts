import { test, expect, describe } from 'bun:test'
import { createClient } from '@indobase/supabase-js'

const INDOBASE_URL = 'http://127.0.0.1:54321'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
const SERVICE_ROLE_KEY =
  process.env.INDOBASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const indobase = createClient(INDOBASE_URL, ANON_KEY, {
  realtime: { heartbeatIntervalMs: 500 },
})

const versions = ['1.0.0', '2.0.0']

versions.forEach((vsn) => {
  describe(`Realtime v${vsn}`, () => {
    const indobaseRealtime = createClient(INDOBASE_URL, ANON_KEY, {
      realtime: { heartbeatIntervalMs: 500, vsn },
    })

    test('should subscribe to realtime channel and broadcast', async () => {
      await indobaseRealtime.auth.signOut()
      const email = `bun-test-${Date.now()}@example.com`
      const password = 'password123'
      await indobaseRealtime.auth.signUp({ email, password })

      const channelName = `bun-channel-${crypto.randomUUID()}`
      const config = { broadcast: { self: true, ack: true }, private: true }
      const channel = indobaseRealtime.channel(channelName, { config })
      const testMessage = { message: 'test' }

      let subscribed = false
      let attempts = 0
      let receivedMessage: any

      channel
        .on('broadcast', { event: 'test-event' }, (payload) => (receivedMessage = payload))
        .subscribe((status) => {
          if (status == 'SUBSCRIBED') subscribed = true
        })

      // Wait for subscription
      while (!subscribed) {
        if (attempts > 100) throw new Error('Timeout waiting for subscription')
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      expect(subscribed).toBe(true)

      attempts = 0

      await channel.send({ type: 'broadcast', event: 'test-event', payload: testMessage })

      // Wait on message
      while (!receivedMessage) {
        if (attempts > 50) throw new Error('Timeout waiting for message')
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }
      expect(receivedMessage).toBeDefined()
      expect(indobaseRealtime.realtime.getChannels().length).toBe(1)

      // Cleanup
      await indobaseRealtime.removeAllChannels()
    }, 10000)
  })
})

test('should sign up a user', async () => {
  await indobase.auth.signOut()
  const email = `bun-auth-${Date.now()}@example.com`
  const password = 'password123'

  const { data, error } = await indobase.auth.signUp({
    email,
    password,
  })

  expect(error).toBeNull()
  expect(data.user).toBeDefined()
  expect(data.user!.email).toBe(email)
})

test('should sign in and out successfully', async () => {
  await indobase.auth.signOut()
  const email = `bun-signin-${Date.now()}@example.com`
  const password = 'password123'

  await indobase.auth.signUp({ email, password })

  const { data, error } = await indobase.auth.signInWithPassword({
    email,
    password,
  })

  expect(error).toBeNull()
  expect(data.user).toBeDefined()
  expect(data.user!.email).toBe(email)

  const { error: signOutError } = await indobase.auth.signOut()

  expect(signOutError).toBeNull()
})

test('should get current user', async () => {
  await indobase.auth.signOut()
  const email = `bun-getuser-${Date.now()}@example.com`
  const password = 'password123'

  await indobase.auth.signUp({ email, password })
  await indobase.auth.signInWithPassword({ email, password })

  const { data, error } = await indobase.auth.getUser()

  expect(error).toBeNull()
  expect(data.user).toBeDefined()
  expect(data.user!.email).toBe(email)
})

test('should handle invalid credentials', async () => {
  await indobase.auth.signOut()
  const email = `bun-invalid-${Date.now()}@example.com`
  const password = 'password123'

  await indobase.auth.signUp({ email, password })

  const { data, error } = await indobase.auth.signInWithPassword({
    email,
    password: 'wrongpassword',
  })

  expect(error).not.toBeNull()
  expect(data.user).toBeNull()
})

test('should upload and list file in bucket', async () => {
  const bucket = 'test-bucket'
  const filePath = 'test-file.txt'
  const fileContent = new Blob(['Hello, Indobase Storage!'], { type: 'text/plain' })

  const indobaseWithServiceRole = createClient(INDOBASE_URL, SERVICE_ROLE_KEY, {
    realtime: { heartbeatIntervalMs: 500 },
  })

  // upload
  const { data: uploadData, error: uploadError } = await indobaseWithServiceRole.storage
    .from(bucket)
    .upload(filePath, fileContent, { upsert: true })
  expect(uploadError).toBeNull()
  expect(uploadData).toBeDefined()

  // list
  const { data: listData, error: listError } = await indobaseWithServiceRole.storage
    .from(bucket)
    .list()
  expect(listError).toBeNull()
  expect(Array.isArray(listData)).toBe(true)
  if (!listData) throw new Error('listData is null')
  const fileNames = listData.map((f: any) => f.name)
  expect(fileNames).toContain('test-file.txt')

  // delete file
  const { error: deleteError } = await indobaseWithServiceRole.storage
    .from(bucket)
    .remove([filePath])
  expect(deleteError).toBeNull()
})
