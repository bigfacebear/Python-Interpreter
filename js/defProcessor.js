function defProcessor(tokenArr, dict) {

	try {

		// 语法检查
		if (tokenArr[0] != "def" || tokenArr[2] != "(") {
			throw "error: syntax error";
		}

		// 获得函数名，并判断是否是标识符
		var funcName = tokenArr[1];
		if (!isIdentifier(funcName)) {
			throw "error: syntax error: illegal identifier";
		}

		var paraList = [];
		var funcCode = [];

		var index;
		for (index = 3; index < tokenArr.length; index++) {
			if (tokenArr[index] === ",") {
				continue;
			} else if (tokenArr[index] === ")") {
				break;
			} else {
				if (!isIdentifier(tokenArr[index])) {
					throw "error: syntax error: illegal identifier";
				}
				paraList.push(tokenArr[index]);
			}
		}
		if (index === tokenArr.length) {
			throw "error: syntax error: expected \")\"";
		}
		if (tokenArr[index + 1] != ":") {
			throw "error: syntax error: expected \":\"";
		}

		funcCode = selectBlockCode(tokenArr.slice(index + 2)).block;

		if (funcCode.length === 0) {
			throw "error: syntax error"
		}

		var newFunc = Func.createNew();
		newFunc.setParaList(paraList);
		newFunc.setCode(funcCode);

		var newVar = Var.createNew("function", newFunc);
		dict.addVar(funcName, newVar);
	} catch (e) {
		throw ("Exception in defProcessor: \n" + e.toString());
	}

}
