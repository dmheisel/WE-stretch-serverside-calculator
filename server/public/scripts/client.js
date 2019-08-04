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
	$('#equalsButton').on('click', handleEqualsClick);
	$('#decimalButton').on('click', handleDecimalClick);
}

function handleNumberClick() {
	let entry = $(this)
		.text()
		.trim();
	console.log(entry, ' pushed');
	workingNum.push(entry);
	if ($('#calcDisplayBottom').text() === '_') {
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

		if ($('#calcDisplayTop').text() === '_') {
			$('#calcDisplayTop').text('');
		} // removes _ before adding number

		if ($('#calcDisplayBottom').text() !== '_') {
			$('#calcDisplayTop').append($('#calcDisplayBottom').text());
			$('#calcDisplayBottom').text('_');
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
		if ($('#calcDisplayTop').text() === '_') {
			$('#calcDisplayTop').text('');
		}
		$('#calcDisplayTop').append($('#calcDisplayBottom').text());
		$('#calcDisplayBottom').text('_');
		workingNum = [];
	}
	if (formulaNums.length === formulaOperators.length) {
		alert('Invalid format.');
		return;
	}
}

function handleDecimalClick() {
	if (!workingNum.includes('.')) {
		//last entry cannot be '.' and working number can't already include '.'
		let entry = $(this)
			.text()
			.trim();
		if (workingNum.length === 0) {
			workingNum.push('0');
			if ($('#calcDisplayBottom').text() === '_') {
				$('#calcDisplayBottom').text('');
			}
			$('#calcDisplayBottom').append('0');
		}
		workingNum.push(entry);
		if ($('#calcDisplayBottom').text() === '_') {
			$('#calcDisplayBottom').text('');
		}
		$('#calcDisplayBottom').append(entry);
	}
}

function handleClearClick() {
	$('#calcDisplayBottom').text('_');
	$('#calcDisplayTop').text('_');
	workingNum = [];
	formulaNums = [];
	formulaOperators = [];
}

function handleDeleteClick() {
	if ($('#calcDisplayBottom').text() !== '_') {
		//handles deletion of immediate working number (num still in bottom display)
		workingNum.pop();
		$('#calcDisplayBottom').text(
			$('#calcDisplayBottom')
				.text()
				.slice(0, -1)
		);
		if ($('#calcDisplayBottom').text() === '') {
			$('#calcDisplayBottom').text('_'); // ensures bottom text will have blank _
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
				$('#calcDisplayTop').text('_');
			}
		}
	}
}
