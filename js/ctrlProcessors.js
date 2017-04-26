
function ifProcessor(tokenArr, dict) {
	try {
		// 语法检查
		if (tokenArr[0] != "if") {
			throw "error: syntax error";
		}

		// 获得if后面的判断条件表达式
		var tmp = selectExpr(tokenArr.slice(1), ":");
		var logicPart = tmp.expr; // 获得的逻辑表达式
		var remain = tmp.remain; // 逻辑表达式、":"后面的部分
		tmp = selectBlockCode(remain);
		var blockCode = tmp.block; // 下一个Block的代码
		remain = tmp.remain; // 下一个block后面的部分
		var logicRes = exprProcessor(logicPart,dict);
		if (!isValid(logicRes)) {
			throw "Error: invalid expression: " + logicPart.join(" ");
		}
		if (logicRes.value != false && logicRes.value != 0 && logicRes.value != null && logicRes.value != undefined) {
			var newVarDict = VarDict.createNew(dict);
			generalBlockProcessor(blockCode, newVarDict);
		}
		else {
			while (remain[0] === "elif") {
				tmp = selectExpr(remain.slice(1), ":");
				logicPart = tmp.expr;
				remain = tmp.remain;
				tmp = selectBlockCode(remain);
				blockCode = tmp.block;
				remain = tmp.remain;
				logicRes = exprProcessor(logicPart,dict);
				if (!isValid(logicRes)) {
					throw "Error: invalid expression: " + logicPart.join(" ");
				}
				if (logicRes.value != false && logicRes.value != 0 && logicRes.value != null && logicRes.value != undefined) {
					var newVarDict = VarDict.createNew(dict);
					generalBlockProcessor(blockCode, newVarDict);
					return;
				}
			}
			if (remain.length > 0 && remain[0] === "else") {
				blockCode = selectBlockCode(remain).block;
				var newVarDict = VarDict.createNew(dict);
				generalBlockProcessor(blockCode, newVarDict);
			}
		}
	} catch (e) {
		throw ("Exception in ifProcessor: \n" + e.toString());
	}

}

function whileProcessor(tokenArr, dict) {
	

	try {
		if (tokenArr[0] != "while") {
			throw "error: syntax error: illegal identifier";
		}
		var tmp = selectExpr(tokenArr.slice(1), ":");
		var logicPart = tmp.expr;
		var remain = tmp.remain;
		var blockCode = selectBlockCode(remain).block;
		var logicRes = exprProcessor(logicPart,dict);
		if (!isValid(logicRes)) {
			throw "Error: invalid expression: " + logicPart.join(" ");
		}
		while (logicRes.value != false && logicRes.value != 0 && logicRes.value != null && logicRes.value != undefined) {
			var newVarDict = VarDict.createNew(dict);
			generalBlockProcessor(blockCode, newVarDict);
			logicRes = exprProcessor(logicPart,dict);
			if (!isValid(logicRes)) {
				throw "Error: invalid expression: " + logicPart.join(" ");
			}
		}
	} catch (e) {
		throw ("Exception in whileProcessor: \n" + e.toString());
	}

	return null;
}

function forProcessor(tokenArr, dict) {
	try {
		if (tokenArr[0] != "for" || tokenArr[2] != "in") {
			throw "error: syntax error";
		}
		var tmpVarName = tokenArr[1];
		var tmp = selectExpr(tokenArr.slice(3), ":");
		var targetExpr = tmp.expr;
		var remain = tmp.remain;
		var blockCode = selectBlockCode(remain).block;
		var cnt = 0;
		while (true) {
			var targetVar = exprProcessor(targetExpr, dict);
			if (!isValid(targetVar)) {
				throw "Error: invalid expression: " + targetExpr.join(" ");
			}
			if (targetVar.type != "array") {
				throw "error: the object is not iterable"
			}
			var li = targetVar.value.getList();
			if (cnt >= li.length) {
				break;
			}
			var newVarDict = VarDict.createNew(dict);
			newVarDict.addVar(tmpVarName, li[cnt]);
			generalBlockProcessor(blockCode, newVarDict);
			cnt++;
		}
	} catch(e) {
		throw ("Exception in forProcessor: \n" + e.toString());
	}
}