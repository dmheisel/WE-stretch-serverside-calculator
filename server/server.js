const express = require('express');
const bodyParser = require('body-parser');
const doMath = require('./modules/doMath');

const parseEquation = require('./modules/parseEquation');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

app.listen(PORT, console.log('local server listening on port: ', PORT));

let calculatorHistory = [];
// app.delete('/delete', (req, res))

app.post('/calculate', (req, res) => {
	let mathObj = req.body;
	mathObj.answer = doMath(mathObj);
	// mathObj.equation = parseEquation(mathObj);
	//uses doMath module to add a property to the mathObj with the answer

	calculatorHistory.push(mathObj);
	console.log(mathObj, ' added to server.  history = ', calculatorHistory);
	//pushes updated object into history array

	res.sendStatus(201); //created status
});

//GET route
app.get('/calcHistory', (req, res) => {
	//sends entire calculator history to append to DOM
	res.send(calculatorHistory);
});

app.delete('/clearMemory', (req, res) => {
	calculatorHistory = [];
	res.sendStatus(201);
});
