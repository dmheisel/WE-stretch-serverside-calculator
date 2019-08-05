// function doMath(mathObj) {
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
// 	let currentTotal = 0;
// 	mathObj.mathOperators.forEach((operator, index) => {
// 		let x = Number(mathObj.mathNums[index]);
// 		let y = Number(mathObj.mathNums[index + 1]);
// 		if (index != 0) {
// 			x = currentTotal;
// 		}
// 		if (operator === '+') {
// 			currentTotal = x + y;
// 		} else if (operator === '-') {
// 			currentTotal = x - y;
// 		} else if (operator === '*') {
// 			currentTotal = x * y;
// 		} else if (operator === '/') {
// 			currentTotal = x / y;
// 		}
// 	});
// 	return currentTotal;
// }

function doMath(mathObj) {
	/* equation obj will look like:
	{equation: ['3', '+', '52', '/', '8', '+', '3']}
	*/

	let highOrderOperators = ['*', '/'];
	let storedEquation = [];
	mathObj.equation.forEach(el => storedEquation.push(el));
	let equation = mathObj.equation;
	for (let i = 0; i < equation.length - 1; i++) {
		if (highOrderOperators.includes(equation[i + 1])) {
			let x = Number(equation[i]);
			let y = Number(equation[i + 2]);
			let operator = equation[i + 1];
			if (operator === '*') {
				equation[i] = x * y;
			} else if (operator === '/') {
				equation[i] = x / y;
			}
			equation.splice(i + 1, 2);
		}
	}
	while (equation.length > 1) {
		let x = Number(equation[0]);
		let y = Number(equation[2]);
		let operator = equation[1];
		if (operator === '+') {
			equation[0] = x + y;
		} else if (operator === '-') {
			equation[0] = x - y;
		}
		equation.splice(1, 2);
	}
	mathObj.equation = storedEquation;
	return equation[0];
}

module.exports = doMath;
