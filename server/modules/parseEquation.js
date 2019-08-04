function parseEquation(mathObj) {
	let equation = '';
	mathObj.mathOperators.forEach((operator, index) => {
		equation += mathObj.mathNums[index] + operator;
	});
	equation += mathObj.mathNums[mathObj.mathNums.length - 1];
	return equation;
}

module.exports = parseEquation;
