import { createClient } from './src/index';

console.log('Attempting to create a client...');
const client = createClient('https://example.indobase.co', 'public-anon-key');

if (client && client.auth) {
  console.log('✅ Successfully imported and initialized @indobase/js client!');
  console.log('Client object keys:', Object.keys(client));
} else {
  console.error('❌ Failed to initialize client properly.');
}
