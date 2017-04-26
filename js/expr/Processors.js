var Processors = {
	createNew : function(tokenArr, dict) {
		var processors = {};

		var tokenArr = tokenArr;
		var dict = dict;

		var lBrackets = ["(", "[", "{"];
		var rBrackets = [")", "]", "}"];

		processors.preProcess = function() {
			// 将表达式结尾的换行去掉
			var end = tokenArr.length - 1;
			while (tokenArr[end] === "\n") {
				tokenArr.pop();
				end = tokenArr.length - 1;
			}
			// 将表达式最外面的括号剥掉
			while (tokenArr[0] === "(") {
				var cnt = 1;
				var i = 1;
				for (i = 1; i < tokenArr.length; i++) {
					if (tokenArr[i] === "(") {
						cnt++;
					} else if (tokenArr[i] === ")") {
						cnt--;
					}
					if (cnt === 0) {
						break;
					}
				}
				if (i === tokenArr.length-1) {
					tokenArr = tokenArr.slice(1, tokenArr.length-1);
				} else {
					break;
				}
			}
			// 将表达式中的"not", "in" 替换为"not in"
			for (var i = 0; i < tokenArr.length; i++) {
				if (tokenArr[i] === "not") {
					if (i + 1 < tokenArr.length && tokenArr[i+1] === "in") {
						tokenArr = tokenArr.splice(i, 2, "not in");
					}
				}
			}
		}

		processors.globalProcessor = function() {
			try {
				if (tokenArr[0] != "global") {
					return null;
				}
				if (dict != null && !dict.hasOwnProperty("addGlobal")) {
					throw "SyntaxError: global";
				}
				var nameArr = tokenArr.slice(1);
				var index;
				while ((index = nameArr.indexOf(",")) != -1) {
					nameArr.splice(index, 1);
				}
				if (nameArr.length === 0) {
					throw "SyntaxError: global";
				}
				for (var i = 0; i < nameArr.length; i++) {
					dict.addGlobal(nameArr[i]);
				}
				return keywordDict.getVar("None");
			} catch (e) {
				throw e;
			}
		}

		processors.lambdaProcessor = function() {
			try {
				if (tokenArr[0] != "lambda") {
					return null;
				}
				var paraList = [];
				var funcCode = [];
				var index;
				for (index = 1; index < tokenArr.length; index++) {
					if (tokenArr[index] === ",") {
						continue;
					}
					if (tokenArr[index] === ":") {
						break;
					} else {
						if (!isIdentifier(tokenArr[index])) {
							throw "SyntaxError: illegal identifier" + tokenArr[index] + " in lambda expression";
						}
						paraList.push(tokenArr[index]);
					}
				}
				if (index === tokenArr.length) {
					throw "error: syntax error: expected \":\"";
				}
				var funcCode = tokenArr.slice(index+1);
				if (funcCode.length === 0) {
					throw "SyntaxError: the expression is missed in lambda expression.";
				}
				funcCode.unshift("return");

				var newFunc = Func.createNew();
				newFunc.setParaList(paraList);
				newFunc.setCode(funcCode);
				var newVar = Var.createNew("function", newFunc);

				return newVar;
			} catch (e) {
				throw e;
			}
		}

		// 进行双目运算符操作，运算顺序从左到右
		processors.binaryOp = function(opArr) {
			try {
				var len = tokenArr.length;
				for (var i = len - 1; i >= 0; i--) {
					var bracketType = rBrackets.indexOf(tokenArr[i]);
					if (bracketType != -1) {
						var cnt = 1;
						while (i >= 0 && cnt > 0) {
							i--;
							if (tokenArr[i] === lBrackets[bracketType]) {
								cnt--;
							} else if (tokenArr[i] === rBrackets[bracketType]) {
								cnt++;
							}
						}
					}
					if (opArr.indexOf(tokenArr[i]) != -1) {
						var op = tokenArr[i];
						var leftArr = tokenArr.slice(0, i);
						var rightArr = tokenArr.slice(i+1);
						var leftVar = exprProcessor(leftArr, dict);
						var rightVar = exprProcessor(rightArr, dict);
						if (!isValid(leftVar) || !isValid(rightVar)) {
							throw "error: in valid operation for " + op;
						}
						return Ops.binary[op](leftVar, rightVar);
					}
				}
				return null;
			} catch (e) {
				throw e;
			}
		}

		processors.unaryOp = function(opArr) {
			try {
				if (opArr.indexOf(tokenArr[0]) != -1) {
					op = tokenArr[0];
					var rightArr = tokenArr.slice(1);
					var rightVar = exprProcessor(rightArr, dict);
					if (!isValid(rightVar)) {
						throw "error: in valid operation for " + op;
					}
					return Ops.unary[op](rightVar);
				}
				return null;
			} catch (e) {
				throw e;
			}
		}

		processors.assignOp = function(opArr) {
			try {
				var len = tokenArr.length;
				for (var i = 0; i < len; i++) {
					var bracketType = lBrackets.indexOf(tokenArr[i]);
					if (bracketType != -1) {
						var cnt = 1;
						while (i < len && cnt > 0) {
							i++;
							if (tokenArr[i] === rBrackets[bracketType]) {
								cnt--;
							} else if (tokenArr[i] === lBrackets[bracketType]) {
								cnt++;
							}
						}
					}
					var token = tokenArr[i];
					if (opArr.indexOf(token) != -1) {
						var leftArr = tokenArr.slice(0, i);
						var rightArr = tokenArr.slice(i+1);

						var leftVar = getLeftValue(leftArr, dict);  // 赋值操作的左值比较特殊
						var assignDict = leftVar.assignDict;
						var assignName = leftVar.assignName;

						var rightVar = exprProcessor(rightArr, dict);
						if (!isValid(rightVar)) {
							throw "error: in valid operation for assignment"
						}

						var op = token.substring(0,token.length-1); // +, -, *, ...
						if (op.length > 0) {
							rightVar = Ops.binary[op](assignDict.getVar(assignName), rightVar);
						}
						assignDict.addVar(assignName, rightVar);
						return assignDict.getVar(assignName);
					}
				}
			} catch (e) {
				throw e;
			}
		}

		var getLeftValue = function(tokenArr, dict) {
			var assignDict = dict;
			var assignName = tokenArr[0];
			var len = tokenArr.length;
			if (len === 0) {
				throw "error: Left value missed";
			}
			for (var i = 1; i < len; i++) {
				if (typeof(assignName) === "number") {
					if (assignDict === undefined || !assignDict.hasOwnProperty("type") || assignDict.type != "array") {
						throw "error: invalid assignment operation";
					}
				}
				else if (!isIdentifier(assignName)) {
					throw "error: " + assignName + " is not an identifier";
				}
				if (tokenArr[i] === ".") {
					if (assignDict === null || !assignDict.hasOwnProperty("getVar")) {
						throw "error: " + tokenArr.slice(0,i+1).join("") + " is not an object";
					}
					assignDict = assignDict.getVar(assignName);
					if (assignDict === undefined) {
						throw "error: The object " + tokenArr.slice(0,i+1).join("") + " doesn't exist";
					}
					assignDict = assignDict.value;
					if (i + 1 >= len) {
						throw "error: syntax error";
					}
					assignName = tokenArr[i+1];
					i++;
				} else if (tokenArr[i] === "[") {
					if (assignDict === null || !assignDict.hasOwnProperty("getVar")) {
						throw "error: " + tokenArr.slice(0,i+1).join("") + " is not an object";
					}
					assignDict = assignDict.getVar(assignName);
					if (assignDict === undefined) {
						throw "error: The object " + tokenArr.slice(0,i+1).join("") + " doesn't exist";
					}
					assignDict = assignDict.value;
					i++;
					if (i >= len) {
						throw "error: syntax error";
					}
					assignNameArr = [];
					while (i < len && tokenArr[i] != "]") {
						assignNameArr.push(tokenArr[i]);
						i++;
					}
					if (i === len) {
						throw "error: syntax error";
					}
					assignName = exprProcessor(assignNameArr, dict);
					if (!isValid(assignName)) {
						throw "error: invalid index";
					}
					if (assignName.type != "int") {
						"TypeError: list indices must be integers or slices, not " + assignName.type;
					}
					assignName = assignName.value;
					//i++;
				}
			}
			return {
				assignDict: assignDict,
				assignName: assignName
			};
		}

		processors.addAndSubOp = function() {
			try {
				var len = tokenArr.length;
				for (var i = len - 1; i >= 0; i--) {
					var bracketType = rBrackets.indexOf(tokenArr[i]);
					if (bracketType != -1) {
						var cnt = 1;
						while (i >= 0 && cnt > 0) {
							i--;
							if (tokenArr[i] === lBrackets[bracketType]) {
								cnt--;
							} else if (tokenArr[i] === rBrackets[bracketType]) {
								cnt++;
							}
						}
					}
					if (["+", "-"].indexOf(tokenArr[i]) != -1) {
						var op = tokenArr[i];
						while (i - 1 >= 0 && (tokenArr[i-1] === "+" || tokenArr[i-1] === "-")) {
							i--;
						}
						if (i === 0) {
							return null;  // 其实不是一个加法/减法
						}
						var leftArr = tokenArr.slice(0, i);
						var rightArr = tokenArr.slice(i+1);
						var leftVar = exprProcessor(leftArr, dict);
						var rightVar = exprProcessor(rightArr, dict);
						if (!isValid(leftVar) || !isValid(rightVar)) {
							throw "error: in valid operation for " + op;
						}
						return Ops.binary[op](leftVar, rightVar);
					}
				}
				return null;
			} catch (e) {
				throw e;
			}
		}

		processors.identifierProcessor = function() {
			try {
				if (!isIdentifier(tokenArr[0])) { // 如果第一个token不是一个标识符，则不是该processor处理
					return null;
				}
				/*
				标识符后面可能会有很多的点和方括号，但它们执行的顺序是从左到右固定的 
				所以我们按照跟exprProcessor类似的方法处理
				*/
				
				return specialProcessor();

			} catch (e) {
				throw e;
			}
		}

		function specialProcessor() {
			try {
				var lBrackets = ["(", "["];
				var rBrackets = [")", "]"];
				var cnt = 0;
				var i = tokenArr.length-1;
				var bracketType = rBrackets.indexOf(tokenArr[i]);
				if (bracketType != -1) {
					var cnt = 1;
					while (i >= 0 && cnt > 0) {
						i--;
						if (tokenArr[i] === lBrackets[bracketType]) {
							cnt--;
						} else if (tokenArr[i] === rBrackets[bracketType]) {
							cnt++;
						}
					}
				}
				var token = tokenArr[i];
				if (token != "(" && token != "[" && !isIdentifier(token)) {
					return null;
				}
				if (isIdentifier(token)) {
					var varName = token;
					if (i === 0) {
						var retVar = dict.getVar(varName);
						if (retVar === undefined) {
							throw "error: " + varName + " is not defined";
						}
						return retVar;
					} else if (tokenArr[i-1] === ".") {
						var leftArr = tokenArr.slice(0, i-1);
						var leftVar = exprProcessor(leftArr, dict);
						if (!isValid(leftVar)) {
							throw "error: " + varName + "can not be fetched";
						}
						return Ops.special["."](leftVar, varName);
					} else {
						throw "error: invalid syntax " + varName;
					}
				}
				var leftArr = tokenArr.slice(0, i);
				var leftVar = exprProcessor(leftArr, dict);
				if (!isValid(leftVar)) {
					throw "error: invalid object before" + token;
				}
				if (token === "[") {
					var indexArr = tokenArr.slice(i+1, tokenArr.length-1);
					var sliceIndex = indexArr.indexOf(":");
					if (sliceIndex != -1) {
						// 有切片操作
						var startArr = indexArr.slice(0, sliceIndex);
						var endArr = indexArr.slice(sliceIndex+1);
						var startVar = exprProcessor(startArr, dict);
						var endVar = exprProcessor(endArr, dict);
						if (!isValid(startVar) || !isValid(endVar)) {
							throw "error: invalid index for [:]";
						}
						if (startVar.type != "int") {
							throw "TypeError: list indices must be integers or slices, not " + startVar.type;
						}
						if (endVar.type != "int") {
							throw "TypeError: list indices must be integers or slices, not " + endVar.type;
						}
						return Ops.special["[:]"](leftVar, startVar.value, endVar.value);
					} else {
						var indexVar = exprProcessor(indexArr, dict);
						if (!isValid(indexVar)) {
							throw "error: invalid index for [index]";
						}
						if (indexVar.type != "int") {
							throw "TypeError: list indices must be integers or slices, not " + indexVar.type;
						}
						return Ops.special["[index]"](leftVar, indexVar.value);
					}
				}
				if (token === "(") {
					var paraArr = tokenArr.slice(i+1, tokenArr.length-1);
					var paraList = getList(paraArr, dict);
					if (i - 2 > 0 && tokenArr[i-2] === ".") {
						var objArr = tokenArr.slice(0, i-2);
						var objVar = exprProcessor(objArr, dict);
						return Ops.special["func"](leftVar, paraList, dict, objVar);
					}
					return Ops.special["func"](leftVar, paraList, dict);
				}
			} catch (e) {
				throw e;
			}
		}

		function getList(tokenArr, dict) {
			try {
				var paraList = [];
				if (tokenArr.length != 0) {
					// 参数列表用","结尾
					if (tokenArr[tokenArr.length-1] != ",") {
						tokenArr.push(",");
					}
					var tmp;
					var expr;
					var remain = tokenArr;
					do {
						tmp = selectExpr(remain, ",");
						expr = tmp.expr;
						remain = tmp.remain;
						var para = exprProcessor(expr, dict);
						if (para === undefined) {
							throw "error: syntax error in parameter list";
						}
						paraList.push(para);
					} while (remain.length != 0);
				}
				return paraList;
			} catch (e) {
				throw e;
			}
		}

		processors.literalProcessor = function() {
			try {
				var ret;

				ret = listProcessor();
				if (ret != null) return ret;

				ret = strProcessor();
				if (ret != null) return ret;

				ret = numProcessor();
				if (ret != null) return ret;

				return null;

			} catch (e) {
				throw e;
			}
		}

		function isNumber(token) {
			var hasPoint = false;
			var hasE = false;
			var reg = RegExp("[0-9]");
			if (!reg.test(token.indexOf(0))) {
				return false;
			}
			for (var i = 1; i < token.length; i++) {
				var c = token.indexOf(i);
				if (reg.test(c)) {
					continue;
				}
				if (c === ".") {
					if (hasPoint || hasE) {
						return false;
					} else {
						hasPoint = true;
					}
				} else if (c === "e" || c === "E") {
					if (hasE) {
						return false;
					} else {
						hasE = true;
					}
				} else {
					return false;
				}
			}
			if (hasPoint || hasE) {
				return "float";
			} else {
				return "int";
			}
		}

		function numProcessor() {
			if (tokenArr.length != 1) {
				return null;
			}
			var token = tokenArr[0];
			var type = isNumber(token);
			var value;
			if (type === false) {
				return null;
			} else if (type === "int") {
				value = parseInt(token);
			} else {
				value = parseFloat(token);
			}
			return Var.createNew(type, value);
		}

		function listProcessor() {
			try {
				if (tokenArr[0] === "[" && tokenArr[tokenArr.length-1] === "]") {
					var list = getList(tokenArr.slice(1, tokenArr.length-1), dict);  // [Var, Var, ...]
					var newArr = PyArray.createNew(list);
					return Var.createNew("array", newArr);
				}
			} catch (e) {
				throw e;
			}
		}

		function strProcessor() {
			if (tokenArr.length === 1 ) {
				var token = tokenArr[0];
				console.log("in str" + token);
				if ((token[0] === "\"" && token[token.length-1] === "\"") ||
					(token[0] === "\'" && token[token.length-1] === "\'")) {
					var str = token.substring(1, token.length-1);
					return Var.createNew("str", str);
				} else {
					return null;
				}
			} else {
				return null;
			}
		}

		return processors;
	}
}









