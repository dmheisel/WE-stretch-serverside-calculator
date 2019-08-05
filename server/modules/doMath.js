function doMath(mathObj) {
	/* equation obj will look like:
	{equation: ['3', '+', '52', '/', '8', '+', '3']}
	*/
	console.log(mathObj);
	//first process any higher order operations: * and /
	let highOrderOperators = ['*', '/'];
	let formula = mathObj.equation;
	let storedEquation = [];
	mathObj.equation.forEach(el => storedEquation.push(el));

	for (let i = 0; i < formula.length - 1; i++) {
		if (highOrderOperators.includes(formula[i + 1])) {
			let x = Number(formula[i]);
			let y = Number(formula[i + 2]);
			let operator = formula[i + 1];
			if (operator === '*') {
				formula[i] = x * y;
			} else if (operator === '/') {
				formula[i] = x / y;
			}
			formula.splice(i + 1, 2);
		}
	}
	//now process all other operations: + and -
	//while loop will process first three (num1, oper, num2)
	//sets num1 to result of num1(oper)num2, eliminates oper & num 2
	//new oper and num 2 shift in their place if they exist
	//continues until only 1 element in list remains --the result of all calculations
	while (formula.length > 1) {
		let x = Number(formula[0]);
		let y = Number(formula[2]);
		let operator = formula[1];
		if (operator === '+') {
			formula[0] = x + y;
		} else if (operator === '-') {
			formula[0] = x - y;
		}
		formula.splice(1, 2);
	}
	mathObj.equation = storedEquation;
	return formula[0];
}

module.exports = doMath;
