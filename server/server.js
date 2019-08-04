const express = require('express');
const bodyParser = require('body-parser');
const PORT = 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

let calculatorHistory =[]
// app.delete('/delete', (req, res))

app.post('/calculate', (req, res) => {
	let mathObj = req.body;

	mathObj.answer = doMath(mathObj);
	//uses doMath module to add a property to the mathObj with the answer

	calculatorHistory.push(mathObj);
	//pushes updated object into history array

	console.log(mathObj);
	res.sendStatus(201); //created status
});

//GET route
app.get('/calculate', (req, res) => {
	//sends entire calculator history to append to DOM
	res.send(calculatorHistory);
});
