var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/personalcrm';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE users(userid SERIAL PRIMARY KEY, name VARCHAR(40) not null, email VARCHAR(40), password VARCHAR(4))');
query.on('end', function() { client.end(); });