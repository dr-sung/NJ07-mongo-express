// database: 'wspdb'  user: 'wsp', password: 'password'
// collection: students
const mongodb = require('mongodb');
const client = mongodb.MongoClient;
// incase user or password contains special chars not allowed for ULR
const userUri = encodeURIComponent('wsp');
const passUri = encodeURIComponent('password');
const databaseName = 'wspdb';
const collectionName = 'students';
const url = 'mongodb://' + userUri + ':'+passUri + 
			'@localhost:27017/'+databaseName+'?authSource='+databaseName;
			
// set upon db connection
let database = null;

function startDatabaseAndApp(app, port, callback) {
	client.connect(url, {poolSize: 20}, (err, db) => {
		if (err) {
			return callback('MongoDB connection error');
		}
		database = db.db(databaseName);
		// disconnect when app terminates
		process.on('SIGINT', () => {
			database.logout((err, result) => {
				database.close();
				console.log('connection closed');
				process.exit(0);
			});
		});

		// start app when database is ready
		app.listen(port, () => {
			return callback('MongoDB and Server started');
		});
	});
}
			
function insert(obj, callback) {
	database.collection(collectionName, (err, collection) => {
		if (err) {
			console.log('students collection is null');
			return callback(err, null);
		}
		collection.insert(obj, (err, results) => {
			if (err) {
				console.log('insert error', err);
				return callback(err, null);
			} else {
				return callback(null, results);
			}
		});
	});
}

function find(query, callback) {
	database.collection(collectionName, (err, collection) => {
		if (err) {
			console.log('students collection is null');
			return callback(err, null);
		}
		collection.find(query).toArray((err, items) => {
			if (err) {
				console.log('find().toArray error', err);
				return callback(err, null);
			} else {
				return callback(null, items);
			}
		});
	});
}

function update(updateQuery, newValue, callback) {
	database.collection(collectionName, (err, collection) => {
		if (err) {
			console.log('students collection is null');
			return callback(err, null);
		}
		collection.update(updateQuery, newValue, (err, results) => {
			if (err) {
				console.log('update error', err);
				return callback(err, null);
			} else {
				return callback(null, newValue);
			}
		});
	});
}

function remove(query, callback) {
	database.collection(collectionName, (err, collection) => {
		if (err) {
			console.log('students collection is null');
			return callback(err, null);
		}
		collection.remove(query, (err, results) => {
			if (err) {
				console.log('remove error', err);
				return callback(err, null);
			} else {
				return callback(null, results);
			}
		});
	});
};

module.exports = {
	insert,
	find,
	update,
	remove,
	startDatabaseAndApp
}