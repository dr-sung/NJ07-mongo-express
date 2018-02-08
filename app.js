const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded( {extended: false} ));
app.use('/static', express.static(__dirname + '/static'));

const studentsdb = require('./studentsdb');

app.get('/', (req, res) => {
	studentsdb.find({}, (err, results) => {
		if (err) {
			res.status(505).send('<h1>find() error</h1>', err);
		} else {
			res.render('index', {results});
		}
	});
});

app.get('/insert', (req, res) => {
	res.sendFile(__dirname + '/static/html/insert.html');
});

app.post('/insert', (req, res) => {
	const obj = {
		name: req.body.name,
		age: req.body.age,
		gpa: req.body.gpa
	};
	studentsdb.insert(obj, (err, results) => {
		if (err) {
			res.status(505).send('<h1>insert() error</h1>', err);
		} else {
			res.redirect('/');
		}
	});
});

app.get('/update', (req, res) => {
	const student = {
		_id: req.query._id,
		name: req.query.name,
		age: req.query.age,
		gpa: req.query.gpa
	}
	res.render('update', {student});
});

app.post('/update', (req, res) => {
	const query = {_id: new ObjectID(req.body._id)};
	const value = {
		$set: {
			name: req.body.name,
			age: req.body.age,
			gpa: req.body.gpa
		}
	};
	studentsdb.update(query, value, (err, results) => {
		if (err) {
			res.status(505).send('<h1>Update Error</h1>', err);
		} else {
			res.redirect('/');
		}
	})
});

app.get('/remove', (req, res) => {
	// remove: req.query._id
	const query = {_id: new ObjectID(req.query._id)};
	studentsdb.remove(query, (err, results) => {
		if (err) {
			console.log('remove error', err);
			res.status(505).send('<h1>Remove Error</h1>', err);
		} else {
			res.redirect('/');
		}
	});
});

const port = process.env.PORT || 3000;
studentsdb.startDatabaseAndApp(app, port, (result) => {
	console.log(result);
});