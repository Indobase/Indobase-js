import 'node:buffer'
import { assertEquals, assertExists } from 'https://deno.land/std@0.220.1/assert/mod.ts'
import { createClient, IndobaseClient } from '@indobase/indobase-js'
import type { RealtimeChannel } from '@indobase/indobase-js'

// These tests assume that a local Indobase server is already running
// Start a local Indobase instance with 'indobase start' before running these tests

// TODO: Remove sanitizeOps and sanitizeResources once the issue is fixed
Deno.test(
  'Indobase Integration Tests',
  { sanitizeOps: false, sanitizeResources: false },
  async (t) => {
    // Default local dev credentials from Indobase CLI
    const INDOBASE_URL = 'http://127.0.0.1:54321'
    const ANON_KEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

    const indobase = createClient(INDOBASE_URL, ANON_KEY)

    // Cleanup function to be called after all tests
    const cleanup = async () => {
      await indobase.auth.signOut()
      await indobase.auth.stopAutoRefresh()
      await indobase.removeAllChannels()
      // Give some time for cleanup to complete
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    try {
      await t.step('should connect to Indobase instance', () => {
        assertExists(indobase)
        assertEquals(indobase instanceof IndobaseClient, true)
      })

      await t.step('PostgREST - should query data from public schema', async () => {
        const { data, error } = await indobase.from('todos').select('*').limit(5)

        // The default schema includes a 'todos' table, but it might be empty
        assertEquals(error, null)
        assertEquals(Array.isArray(data), true)
      })

      await t.step('PostgREST - should create and delete a todo', async () => {
        // Create a new todo
        const { data: createdTodo, error: createError } = await indobase
          .from('todos')
          .insert({ task: 'Integration Test Todo', is_complete: false })
          .select()
          .single()

        assertEquals(createError, null)
        assertExists(createdTodo)
        assertEquals(createdTodo!.task, 'Integration Test Todo')
        assertEquals(createdTodo!.is_complete, false)

        // Delete the created todo
        const { error: deleteError } = await indobase
          .from('todos')
          .delete()
          .eq('id', createdTodo!.id)

        assertEquals(deleteError, null)

        // Verify the todo was deleted
        const { data: fetchedTodo, error: fetchError } = await indobase
          .from('todos')
          .select('*')
          .eq('id', createdTodo!.id)
          .single()

        assertExists(fetchError)
        assertEquals(fetchedTodo, null)
      })

      await t.step('Authentication - should sign up a user', async () => {
        const email = `test-${Date.now()}@example.com`
        const password = 'password123'

        const { data, error } = await indobase.auth.signUp({
          email,
          password,
        })

        assertEquals(error, null)
        assertExists(data.user)
        assertEquals(data.user!.email, email)
      })

      await t.step('Authentication - should sign in and out successfully', async () => {
        const email = `deno-signout-${Date.now()}@example.com`
        const password = 'password123'

        await indobase.auth.signUp({ email, password })
        const { data, error } = await indobase.auth.signInWithPassword({ email, password })

        assertEquals(error, null)
        assertExists(data.user)
        assertEquals(data.user!.email, email)

        const { error: signOutError } = await indobase.auth.signOut()

        assertEquals(signOutError, null)
      })

      await t.step('Authentication - should get current user', async () => {
        const email = `deno-getuser-${Date.now()}@example.com`
        const password = 'password123'

        await indobase.auth.signUp({ email, password })
        await indobase.auth.signInWithPassword({ email, password })

        const { data, error } = await indobase.auth.getUser()

        assertEquals(error, null)
        assertExists(data.user)
        assertEquals(data.user!.email, email)
      })

      await t.step('Authentication - should handle invalid credentials', async () => {
        const email = `deno-invalid-${Date.now()}@example.com`
        const password = 'password123'

        await indobase.auth.signUp({ email, password })

        const { data, error } = await indobase.auth.signInWithPassword({
          email,
          password: 'wrongpassword',
        })

        assertExists(error)
        assertEquals(data.user, null)
      })

      await t.step('Authentication - should handle non-existent user', async () => {
        const email = `deno-nonexistent-${Date.now()}@example.com`
        const password = 'password123'

        const { data, error } = await indobase.auth.signInWithPassword({
          email,
          password,
        })

        assertExists(error)
        assertEquals(data.user, null)
      })

      // Run realtime tests for both versions
      const versions = ['1.0.0', '2.0.0']
      for (const vsn of versions) {
        await t.step(`Realtime v${vsn} - is able to connect and broadcast`, async () => {
          const indobaseRealtime = createClient(INDOBASE_URL, ANON_KEY, {
            realtime: { heartbeatIntervalMs: 500, vsn },
          })

          const channelName = `channel-${crypto.randomUUID()}`
          let channel: RealtimeChannel
          const email = `test-${Date.now()}@example.com`
          const password = 'password123'

          // Sign up and create channel
          await indobaseRealtime.auth.signUp({ email, password })
          const config = { broadcast: { self: true, ack: true }, private: true }
          channel = indobaseRealtime.channel(channelName, { config })

          const testMessage = { message: 'test' }
          let receivedMessage: any
          let subscribed = false
          let attempts = 0

          channel
            .on('broadcast', { event: 'test-event' }, (payload: unknown) => (receivedMessage = payload))
            .subscribe((status: string) => {
              if (status == 'SUBSCRIBED') subscribed = true
            })

          // Wait for subscription
          while (!subscribed) {
            if (attempts > 50) throw new Error('Timeout waiting for subscription')
            await new Promise((resolve) => setTimeout(resolve, 100))
            attempts++
          }

          attempts = 0

          await channel.send({ type: 'broadcast', event: 'test-event', payload: testMessage })

          // Wait on message
          while (!receivedMessage) {
            if (attempts > 50) throw new Error('Timeout waiting for message')
            await new Promise((resolve) => setTimeout(resolve, 100))
            attempts++
          }

          assertExists(receivedMessage)
          assertEquals(indobaseRealtime.realtime.getChannels().length, 1)

          // Cleanup channel
          await channel.unsubscribe()
          await indobaseRealtime.removeAllChannels()
        })
      }

      await t.step('Storage - should upload and list file in bucket', async () => {
        const bucket = 'test-bucket'
        const filePath = 'test-file.txt'
        const fileContent = new Blob(['Hello, Indobase Storage!'], { type: 'text/plain' })

        // use service_role key for bypass RLS
        const SERVICE_ROLE_KEY =
          Deno.env.get('INDOBASE_SERVICE_ROLE_KEY') ||
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
        const indobaseWithServiceRole = createClient(INDOBASE_URL, SERVICE_ROLE_KEY, {
          realtime: { heartbeatIntervalMs: 500 },
        })

        // upload
        const { data: uploadData, error: uploadError } = await indobaseWithServiceRole.storage
          .from(bucket)
          .upload(filePath, fileContent, { upsert: true })
        assertEquals(uploadError, null)
        assertExists(uploadData)

        // list
        const { data: listData, error: listError } = await indobaseWithServiceRole.storage
          .from(bucket)
          .list()
        assertEquals(listError, null)
        assertEquals(Array.isArray(listData), true)
        if (!listData) throw new Error('listData is null')
        const fileNames = listData.map((f: any) => f.name)
        assertEquals(fileNames.includes('test-file.txt'), true)

        // delete file
        const { error: deleteError } = await indobaseWithServiceRole.storage
          .from(bucket)
          .remove([filePath])
        assertEquals(deleteError, null)
      })
    } finally {
      // Ensure cleanup runs even if tests fail
      await cleanup()
    }
  }
)
