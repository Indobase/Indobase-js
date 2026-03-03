/**
 * Module Resolution Tests (CommonJS)
 *
 * Tests that the package works correctly when required via CommonJS.
 * This catches issues like the wrapper.mjs bug that broke jsdelivr CDN imports.
 *
 * Run with: node test/module-resolution.test.cjs
 */

const assert = require('assert')

console.log('Testing CommonJS require...\n')

// Test 1: Main export works
console.log('1. Testing main export...')
const indobase = require('../dist/index.cjs')
assert(indobase, 'Main export should exist')
assert(typeof indobase.createClient === 'function', 'createClient should be a function')
console.log('   ✅ Main export works\n')

// Test 2: createClient works
console.log('2. Testing createClient...')
const { createClient } = indobase
const client = createClient('https://example.indobase.co', 'test-key')
assert(client, 'Client should be created')
console.log('   ✅ createClient works\n')

// Test 3: Auth client exists and has methods
console.log('3. Testing Auth client...')
assert(client.auth, 'client.auth should exist')
assert(typeof client.auth.signUp === 'function', 'auth.signUp should be a function')
assert(
  typeof client.auth.signInWithPassword === 'function',
  'auth.signInWithPassword should be a function'
)
assert(typeof client.auth.signOut === 'function', 'auth.signOut should be a function')
assert(typeof client.auth.getSession === 'function', 'auth.getSession should be a function')
assert(typeof client.auth.getUser === 'function', 'auth.getUser should be a function')
assert(
  typeof client.auth.onAuthStateChange === 'function',
  'auth.onAuthStateChange should be a function'
)
console.log('   ✅ Auth client works\n')

// Test 4: PostgREST client exists
console.log('4. Testing PostgREST client...')
assert(typeof client.from === 'function', 'client.from should be a function')
const query = client.from('test')
assert(query, 'from() should return a query builder')
console.log('   ✅ PostgREST client works\n')

// Test 5: Storage client exists
console.log('5. Testing Storage client...')
assert(client.storage, 'client.storage should exist')
assert(typeof client.storage.from === 'function', 'storage.from should be a function')
console.log('   ✅ Storage client works\n')

// Test 6: Functions client exists
console.log('6. Testing Functions client...')
assert(client.functions, 'client.functions should exist')
assert(typeof client.functions.invoke === 'function', 'functions.invoke should be a function')
console.log('   ✅ Functions client works\n')

// Test 7: Realtime client exists
console.log('7. Testing Realtime client...')
assert(typeof client.channel === 'function', 'client.channel should be a function')
assert(typeof client.removeChannel === 'function', 'client.removeChannel should be a function')
console.log('   ✅ Realtime client works\n')

console.log('🎉 All CommonJS tests passed!')
