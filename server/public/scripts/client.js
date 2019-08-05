console.log('js sourced');

$(document).ready(handleReady);
// let currentIndex = 0;
let workingNum = [];
let formulaNums = [];
let formulaOperators = [];

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
	console.log(entry, ' pushed');
	if (workingNum.length === 0 && formulaNums.length === 0) {
		$('#calcDisplayBottom').text('0');
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
			workingNum.push('0');
		}
		formulaNums.push(workingNum.join(''));
		workingNum = []; // resets working number

		if ($('#calcDisplayTop').text() === '0') {
			$('#calcDisplayTop').text('');
		} // removes 0 before adding number

		if ($('#calcDisplayBottom').text() !== '0') {
			$('#calcDisplayTop').append($('#calcDisplayBottom').text());
			$('#calcDisplayBottom').text('0');
		}
		formulaOperators.push(entry); //adds current operator to formula
		$('#calcDisplayTop').append(entry);
	} else if (formulaOperators.length > 0) {
		formulaOperators[formulaOperators.length - 1] = entry;
		console.log(
			'operator changed to ',
			entry,
			'full list is ',
			formulaOperators
		);
		$('#calcDisplayTop').text(
			$('#calcDisplayTop')
				.text()
				.slice(0, -1)
		);
		$('#calcDisplayTop').append(entry);
	}
}

function handleEqualsClick() {
	if (workingNum.length > 0) {
		formulaNums.push(workingNum.join(''));
		if ($('#calcDisplayTop').text() === '0') {
			$('#calcDisplayTop').text('');
		}
		$('#calcDisplayTop').append($('#calcDisplayBottom').text());
		$('#calcDisplayBottom').text('0');
		workingNum = [];
	}
	if (formulaOperators.length === 0) {
		formulaNums = [];
		return;
	}
	if (formulaNums.length === formulaOperators.length) {
		alert('Invalid format.');
		return;
	}
	sendFormula();
	formulaNums = [];
	formulaOperators = [];
	receiveHistory();
}

function handleDecimalClick() {
	if (!workingNum.includes('.')) {
		//last entry cannot be '.' and working number can't already include '.'
		let entry = $(this)
			.text()
			.trim();
		if (workingNum.length === 0) {
			workingNum.push('0');
			if ($('#calcDisplayBottom').text() === '0') {
				$('#calcDisplayBottom').text('');
			}
			$('#calcDisplayBottom').append('0');
		}
		workingNum.push(entry);
		if ($('#calcDisplayBottom').text() === '0') {
			$('#calcDisplayBottom').text('');
		}
		$('#calcDisplayBottom').append(entry);
	}
}

function handleClearClick() {
	$('#calcDisplayBottom').text('0');
	$('#calcDisplayTop').text('0');
	workingNum = [];
	formulaNums = [];
	formulaOperators = [];
}

function handleDeleteClick() {
	if ($('#calcDisplayBottom').text() !== '0') {
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
		//checks if last item in equation is operator and removes that from array
		let equation = $('#calcDisplayTop').text();
		let operators = ['/', '*', '+', '-'];

		if (operators.includes(equation[equation.length - 1])) {
			formulaOperators.pop();
			$('#calcDisplayTop').text(
				$('#calcDisplayTop')
					.text()
					.slice(0, -1)
			);
		} else if (workingNum.length === 0 && formulaNums.length > 0) {
			// if no working number is currently queued up, makes last formula number new working number
			workingNum = formulaNums.pop().split('');
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
		mathNums: formulaNums,
		mathOperators: formulaOperators
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
		let equation = history[history.length - 1].equation;
		console.log(answer);
		$('#calcDisplayTop').text('');
		$('#calcDisplayTop').append(equation);
		$('#calcDisplayBottom').text(answer);
	} else {
		$('#calcDisplayTop').text('0');
		$('#calcDisplayBottom').text('0');
	}
	for (let i = history.length - 1; i >= 0; i--) {
		let htmlText = $(
			`<button class="historyItem dropdown-item p-0 m-0" type="button">${
				history[i].equation
			}</button>`
		);
		htmlText.data('object', history[i]);
		$('#calculatorHistory').append(htmlText);
	}
}
