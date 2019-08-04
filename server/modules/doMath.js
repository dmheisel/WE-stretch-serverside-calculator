function doMath(mathObj) {
	/*mathObj will look like:
    {
      mathNums: ['1', '4', '75'],
      mathOperators: ['*', '-'];
    }
  Should always have one fewer operator than numbers.  Access in order of:
  num1, operator1, num2, operator2, num3
  '1', '*', '4', '-', '75'
  should resolve to -71
  */
	let currentTotal = 0;
	mathObj.mathOperators.forEach((operator, index) => {
		let x = Number(mathObj.mathNums[index]);
		let y = Number(mathObj.mathNums[index + 1]);
		if (index != 0) {
			x = currentTotal;
		}
		if (operator === '+') {
			currentTotal = x + y;
		} else if (operator === '-') {
			currentTotal = x - y;
		} else if (operator === '*') {
			currentTotal = x * y;
		} else if (operator === '/') {
			currentTotal = x / y;
		}
	});
	return currentTotal;
}

module.exports = doMath;
