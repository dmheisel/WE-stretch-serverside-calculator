console.log('js sourced');

$(document).ready(onReady);
// let currentIndex = 0;
let workingNum = [];
let equation = [];
let operators = ['+', '-', '*', '/'];

function onReady() {
	console.log('jquery sourced');
	$('.numberButton').click(onNumberClick);
	$('.operatorButton').click(onOperatorClick);
	$('#clearButton').click(onClearClick);
	$('#deleteButton').click(onDeleteClick);
	$('#clearMemoryButton').click(onClearMemoryClick);
	$('#equalsButton').click(onEqualsClick);
	$('#decimalButton').click(onDecimalClick);
	$('#calculatorHistory').on('click', '.historyItem', onReturnHistoryClick);
	// receiveHistory();
}

function onNumberClick() {
	let entry = $(this)
		.text()
		.trim();
	console.log(entry, ' pushed'); // removes extra white space
	if (entry === '0' && workingNum.length == 0) {
		return;
	}

	if (workingNum.length === 0 && equation.length === 0) {
		$('#calcDisplayBottom').text('');
		$('#calcDisplayTop').text('0');
	}
	if (equation.length === 1) {
		$('#calcDisplayTop').text('0');
		equation.pop();
	}
	workingNum.push(entry);
	if ($('#calcDisplayBottom').text() === '0') {
		$('#calcDisplayBottom').text('');
	}
	$('#calcDisplayBottom').append(entry);
}

function onOperatorClick() {
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
	} else if (equation.length == 1) {
		equation.push(entry);
		$('#calcDisplayTop').append(entry);
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

function onEqualsClick() {
	if (workingNum.length > 0) {
		if (workingNum[workingNum.length - 1] === '.') {
			workingNum.push('0'); // adds 0 if last char is decimal
		}
		equation.push(workingNum.join('')); // adds workingNum to equation
		workingNum = []; //clears workingNum
	}
	if (equation.length > 1) {
		if (operators.includes(equation[equation.length - 1])) {
			alert(
				'Invalid input, last char cannot be an operator.  Please finish the equation'
			);
			return;
		}
		sendFormula();
		// equation = [];
		// receiveHistory();
	} else {
		$('#calcDisplayBottom').text('0');
		$('#calcDisplayTop').text('0');
		$('#calcDisplayTop').text(equation[0]);
	}
}

function onDecimalClick() {
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

function onClearClick() {
	$('#calcDisplayBottom').text('0');
	$('#calcDisplayTop').text('0');
	workingNum = [];
	equation = [];
	formulaOperators = [];
}

function onDeleteClick() {
	if (
		$('#calcDisplayBottom').text().length > 0 &&
		$('#calcDisplayBottom').text() !== '0'
	) {
		//ons deletion of immediate working number (num still in bottom display)
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

function onClearMemoryClick() {
	$.ajax({
		method: 'DELETE',
		url: '/clearMemory'
	}).then(response => console.log('server response received:', response));
	receiveHistory();
}

function onReturnHistoryClick() {
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
	};
	console.log('sending ', mathObj);
	$.ajax({
		method: 'POST',
		url: '/calculate',
		data: mathObj
	}).then(response => {
		console.log('server response: ', response);
		receiveHistory();
	});
}
function receiveHistory() {
	$.ajax({
		method: 'GET',
		url: '/calcHistory'
	}).then(response => {
		console.log(response);
		if (equation.length > 0) {
			renderHistory(response);
		}
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
			`<button class="historyItem dropdown-item p-0 m-0" type="button">
			${history[i].equation.join('')}
			</button>`
		);
		htmlText.data('object', history[i]);
		$('#calculatorHistory').append(htmlText);
	}
}
