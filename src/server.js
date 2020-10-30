
const express = require('express')
const mysqlx = require('@mysql/xdevapi')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!');
})



app.get('/api/person/list', (req, res) => {
	var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');            	
			    	var myTable = db.getTable('Person');
			    	
			    	myTable.select(['id','forname', 'surname', 'birthdate', 'isAlive', 'gender']).
						execute().then(result => {
							res.send(result.fetchAll())
						})
					})
})

app.post('/api/person/create', (req, res) => {
		var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Person');

			    	var forname = req.body.forname
			    	var surname = req.body.surname
			    	var birthdate = req.body.birthdate
			    	var isAlive = req.body.isAlive
			    	var gender = req.body.gender

					myTable.insert(['forname', 'surname', 'birthdate', 'isAlive', 'gender']).
					    values(forname, surname, birthdate, isAlive, gender).
				        execute();
			                })
})

app.get('/api/animal/list', (req, res) => {
	var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Animal');

			    	myTable.select(['id', 'name', 'isAlive', 'sex', 'species_id', 'race_id']).
						execute().then(result => {
							res.send(result.fetchAll())
						})
					})
})

app.post('/api/animal/create', (req, res) => {
		var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Animal');

			    	var name = req.body.name
			    	var isAlive = req.body.isAlive
			    	var sex = req.body.sex
			    	var species = req.body.species_id
			    	var race = req.body.race_id

					myTable.insert(['name', 'isAlive', 'sex', 'species_id', 'race_id']).
					    values(name, isAlive, sex, species, race).
				        execute();
			                })
})

app.post('/api/species/create', (req, res) => {
		var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Species');

			    	var label = req.body.label

					myTable.insert(['label']).
					    values(label).
				        execute();
			                })
})

app.get('/api/species/list', (req, res) => {
	var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Species');

			    	myTable.select(['id', 'label']).
						execute().then(result => {
							res.send(result.fetchAll())
						})
					})
})

app.post('/api/race/create', (req, res) => {
		var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

					var db = dictSession.getSchema('heritage');
					var myTable = db.getTable('Race');

					var label = req.body.label

					myTable.insert(['label']).
					    values(label).
				        execute();
			                })
})

app.get('/api/race/list', (req, res) => {
	var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Race');

			    	myTable.select(['id', 'label']).
						execute().then(result => {
							res.send(result.fetchAll())
						})
					})
})

app.post('/api/relationship/create', (req, res) => {
		var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

					var db = dictSession.getSchema('heritage');
					var myTable = db.getTable('Relationship');

					var label = req.body.label

					myTable.insert(['label']).
					    values(label).
				        execute();
			                })
})

app.get('/api/relationship/list', (req, res) => {
	var mySession = mysqlx.getSession( {
                host: 'heritage-db', port: 33060,
                user: 'sensei', password: 'herit12S' } ).then(function (dictSession){

			    	var db = dictSession.getSchema('heritage');
			    	var myTable = db.getTable('Relationship');

			    	myTable.select(['id', 'label']).
						execute().then(result => {
							res.send(result.fetchAll())
						})
					})
})




app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port} or ${process.env.PORT}`)
})
