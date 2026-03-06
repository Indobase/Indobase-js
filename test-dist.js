const lib = require('./dist/index.js');

console.log('Exported from @indobase/js:');
console.log(Object.keys(lib));

if (typeof lib.createClient === 'function') {
    console.log('\nAttempting to create a client...');
    const client = lib.createClient('https://example.indobase.co', 'public-anon-key');
    if (client) {
        console.log('✅ Successfully imported and initialized @indobase/js client!');
        console.log('Client features:', Object.keys(client));
    } else {
        console.error('❌ Failed to initialize client properly.');
    }
} else {
    console.error('❌ createClient is not exported!');
}
