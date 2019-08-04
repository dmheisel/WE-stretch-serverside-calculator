console.log('js sourced');

$(document).ready(handleReady);
// let currentIndex = 0;
let numberToAdd = [];
let currentNums = [];
let currentOperators = [];

function handleReady() {
	console.log('jquery sourced');
	$('.numberButton').on('click', handleNumberClick);
	$('.operatorButton').on('click', handleOperatorClick);
	$('#clearButton').on('click', handleClearClick);
	$('#equalsButton').on('click', handleEqualsClick);
	$('#decimalButton').on('click', handleDecimalClick);
}

function handleNumberClick() {
	let entry = $(this)
		.text()
		.trim();
	console.log(entry, ' pushed');
	numberToAdd.push(entry);
	if ($('#calcDisplayBottom').text() === '0') {
		$('#calcDisplayBottom').text('');
	}
	$('#calcDisplayBottom').append(entry);
}

function handleOperatorClick() {
	let entry = $(this)
		.text()
		.trim();
	console.log(entry, ' pushed');
	if (numberToAdd.length > 0) {
		console.log('adding number ', numberToAdd, ' to list');
		currentNums.push(numberToAdd.join(''));
		numberToAdd = [];
	}
	if (currentNums.length > currentOperators.length) {
		console.log('adding operator to list');
		currentOperators.push(entry);
		$('#calcDisplayBottom').append(entry);
	}
}

function handleEqualsClick() {
	if (numberToAdd.length > 0) {
		currentNums.push(numberToAdd.join(''));
		numberToAdd = [];
	}
	if (currentNums.length === currentOperators.length) {
		alert('Invalid format.');
		return;
	}
}

function handleDecimalClick() {
	if (
		$('#calcDisplayBottom').text()[$('#calcDisplayBottom').text().length - 1] !=
			'.' &&
		!numberToAdd.includes('.')
	) {
		let entry = $(this)
			.text()
			.trim();
		numberToAdd.push(entry);
		$('#calcDisplayBottom').append(entry);
	}
}

function handleClearClick() {
	$('#calcDisplayBottom').text('0');
	numberToAdd = [];
	currentNums = [];
	currentOperators = [];
}
