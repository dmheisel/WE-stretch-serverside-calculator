console.log('js sourced');

$(document).ready(handleReady);
// let currentIndex = 0;
let workingNum = [];
let equation = [];
let operators = ['+', '-', '*', '/'];

function handleReady() {
	console.log('jquery sourced');
	$('.numberButton').on('click', handleNumberClick);
	$('.operatorButton').on('click', handleOperatorClick);
	$('#clearButton').on('click', handleClearClick);
	$('#deleteButton').on('click', handleDeleteClick);
	$('#clearMemoryButton').on('click', handleClearMemoryClick);
	$('#equalsButton').on('click', handleEqualsClick);
	$('#decimalButton').on('click', handleDecimalClick);
	$('#calculatorHistory').on('click', '.historyItem', handleReturnHistoryClick);
	receiveHistory();
}

function handleNumberClick() {
	let entry = $(this)
		.text()
		.trim();
	console.log(entry, ' pushed'); // removes extra white space
	if (workingNum.length === 0 && equation.length === 0) {
		$('#calcDisplayBottom').text('');
		$('#calcDisplayTop').text('0');
	}
	workingNum.push(entry);
	if ($('#calcDisplayBottom').text() === '0') {
		$('#calcDisplayBottom').text('');
	}
	$('#calcDisplayBottom').append(entry);
}

function handleOperatorClick() {
	let entry = $(this)
		.text()
		.trim();
	//gathers button text as entry to calc
	console.log(entry, ' pushed');

	//if there is a number started, moves it to the top display to start next #
	if (workingNum.length > 0) {
		console.log('adding number ', workingNum, ' to list');
		if (workingNum[workingNum.length - 1] === '.') {
			$('#calcDisplayBottom').append('0');
			workingNum.push('0'); // displays number ending in '.' as '.0'
		}
		equation.push(workingNum.join('')); //joins working num array into string,
		//adds the string into the equation array
		workingNum = []; // resets working number

		if ($('#calcDisplayTop').text() === '0') {
			$('#calcDisplayTop').text('');
		} // removes 0 before adding number

		if ($('#calcDisplayBottom').text() !== '0') {
			$('#calcDisplayTop').append($('#calcDisplayBottom').text());
			$('#calcDisplayBottom').text('0');
		} // moves text from bottom display to top and resets bottom to 0

		equation.push(entry); //adds current operator to formula
		$('#calcDisplayTop').append(entry); // adds operator to top display
	} else if ($('#calcDisplayBottom').text() !== '0') {
		//if bottom display has numbers (such as if its displaying the last answer)
		//push that number into the equation along with operator
		equation.push($('#calcDisplayBottom').text());
		$('#calcDisplayBottom').text('0');
		equation.push(entry);
		$('#calcDisplayTop').text('');
		$('#calcDisplayTop').append(equation[0] + equation[1]);
	} else if (operators.includes(equation[equation.length - 1])) {
		//if the last entry into the equation is an operator
		equation[equation.length - 1] = entry; // changes last operator to new operator
		console.log('operator changed to ', entry, 'equation is now ', equation);
		$('#calcDisplayTop').text(
			$('#calcDisplayTop')
				.text()
				.slice(0, -1)
		);
		$('#calcDisplayTop').append(entry); //changes top display for  new operator
	}
}

function handleEqualsClick() {
	if (workingNum.length > 0) {
		equation.push(workingNum.join(''));
		//adds the working number to the equation
		if ($('#calcDisplayTop').text() === '0') {
			$('#calcDisplayTop').text('');
		} // clears the top display before adding to it
		$('#calcDisplayTop').append($('#calcDisplayBottom').text());
		$('#calcDisplayBottom').text('0');
		//adds the info from bottom to top, clears bottom
		workingNum = [];
	}

	if (equation.length > 0 && !operators.includes(equation[1])) {
		alert('Invalid format - include second number');
		return;
	} else if (operators.includes(equation[equation.length - 1])) {
		alert('Invalid format - formula cannot end with operator');
		return;
	} else if (equation.length > 0) {
		//if formula is valid, sends, clears, and receives
		sendFormula();
		equation = [];
		receiveHistory();
	}
}

function handleDecimalClick() {
	if (!workingNum.includes('.')) {
		//last entry cannot be '.' and working number can't already include '.'
		let entry = $(this)
			.text()
			.trim();
		//trims white space from character
		if (workingNum.length === 0) {
			workingNum.push('0');
			// if first entry of num is decimal, append 0 to start
			$('#calcDisplayBottom').text('0');
		}
		workingNum.push(entry);
		$('#calcDisplayBottom').append(entry);
	}
}

function handleClearClick() {
	$('#calcDisplayBottom').text('0');
	$('#calcDisplayTop').text('0');
	workingNum = [];
	equation = [];
	formulaOperators = [];
}

function handleDeleteClick() {
	if (
		$('#calcDisplayBottom').text().length > 0 &&
		$('#calcDisplayBottom').text() !== '0'
	) {
		//handles deletion of immediate working number (num still in bottom display)
		workingNum.pop();
		$('#calcDisplayBottom').text(
			$('#calcDisplayBottom')
				.text()
				.slice(0, -1)
		);
		if ($('#calcDisplayBottom').text() === '') {
			$('#calcDisplayBottom').text('0'); // ensures bottom text will have blank 0
		}
	} else {
		if (operators.includes(equation[equation.length - 1])) {
			//if last item in equation is an operator
			equation.pop();
			$('#calcDisplayTop').text(
				$('#calcDisplayTop')
					.text()
					.slice(0, -1)
			);
		} else if (workingNum.length === 0 && equation.length > 0) {
			// if no working number is currently queued up, makes last formula number new working number
			workingNum = equation.pop().split('');
			workingNum.pop();
			$('#calcDisplayTop').text(
				$('#calcDisplayTop')
					.text()
					.slice(0, -1)
			);
		} else if (workingNum.length > 0) {
			// if there is a working number queued (in top display)
			workingNum.pop();
			$('#calcDisplayTop').text(
				$('#calcDisplayTop')
					.text()
					.slice(0, -1)
			);
			if ($('#calcDisplayTop').text() === '') {
				$('#calcDisplayTop').text('0');
			}
		}
	}
}

function handleClearMemoryClick() {
	$.ajax({
		method: 'DELETE',
		url: '/clearMemory'
	}).then(response => console.log('server response received:', response));
	receiveHistory();
}

function handleReturnHistoryClick() {
	let mathObj = $(this).data('object');
	console.log(mathObj);
	$.ajax({
		method: 'POST',
		url: '/calculate',
		data: mathObj
	}).then(response => console.log('server response: ', response));
	receiveHistory();
}

function sendFormula() {
	let mathObj = {
		equation: equation
		// mathOperators: formulaOperators
	};
	console.log('sending ', mathObj);
	$.ajax({
		method: 'POST',
		url: '/calculate',
		data: mathObj
	}).then(response => console.log('server response: ', response));
}
function receiveHistory() {
	$.ajax({
		method: 'GET',
		url: '/calcHistory'
	}).then(response => {
		console.log(response);
		renderHistory(response);
	});
}

function renderHistory(history) {
	$('#calculatorHistory').empty();
	if (history.length > 0) {
		let answer = history[history.length - 1].answer;
		let formula = history[history.length - 1].equation;
		console.log(answer);
		$('#calcDisplayTop').text('');
		$('#calcDisplayTop').append(formula);
		$('#calcDisplayBottom').text(answer);
	} else {
		$('#calcDisplayTop').text('0');
		$('#calcDisplayBottom').text('0');
	}
	for (let i = history.length - 1; i >= 0; i--) {
		let htmlText = $(
			`<button class="historyItem dropdown-item p-0 m-0" type="button">${history[
				i
			].formula.join('')}</button>`
		);
		htmlText.data('object', history[i]);
		$('#calculatorHistory').append(htmlText);
	}
}
