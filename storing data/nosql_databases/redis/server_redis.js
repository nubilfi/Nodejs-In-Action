/**
 * Redis node example
 */

// Connecting to a redis server
const redis = require('redis');
const client = redis.createClient(16462, 'redis-16462.c9.us-east-1-2.ec2.cloud.redislabs.com');

client.on('error', (err) => {                   // emit an error event when the client has problem communicating with
    console.log('error ' + err);                // the redis server
});

// Manipulating data in redis
client.set('color', 'red', redis.print);        // the print function prints the results of
client.get('color', (err, value) => {           // an operation or an error if one occures
    if (err) throw err;
    console.log('Got: ' + value);
});

// Storing and retrieving values using a hash table
/* storing data in elements of a redis hash table */
client.hmset('camping', {
    'shelter': '2-person tent',
    'cooking': 'campstove'
}, redis.print);                                // set hash table elements

client.hget('camping', 'cooking', (err, value) => { // get 'cooking' element's value
    if (err) throw err;
    console.log('Will be cooking with: ' + value);
});

client.hkeys('camping', (err, keys) => {            // get has table keys
    if (err) throw err;
    keys.forEach((key, i) => {
        console.log(' ' + key);
    });
});

// Storing and retrieving data using the lists
client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, -1, (err, items) => {
    if (err) throw err;
    items.forEach((item, i) => {
        console.log(' ' + item);
    });
});

// Storing and retrieving data using sets
client.sadd('ip_addresses', '94.10.33.19', redis.print);
client.sadd('ip_addresses', '94.10.33.19', redis.print);
client.sadd('ip_addresses', '202.33.10.19', redis.print);
client.smembers('ip_addresses', (err, members) => {
    if (err) throw err;
    console.log(members);
});
