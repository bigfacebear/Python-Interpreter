// function len(arg) {
// 	if (arg.type === "list") {
// 		return arg.value.length;
// 	}
// }

// function ininstance(varName, type) {
// 	// TODO
// 	// primitive: int, float, str, bool
// 	// class
// }

var isValid = function(v) {
	if (v===null || v===undefined) {
		return false;
	} else {
		return true;
	}
}

function rmLineFeed(tokenArr) {
	while (tokenArr[0] === "\n") {
		tokenArr.shift();
	}
	while (tokenArr[tokenArr.length - 1] === "\n") {
		tokenArr.pop();
	}
}

function isIdentifier(name) {
	if (typeof(name) != "string") {
		return false;
	}
	if (name[0] === "\"" || name[0] === "\'") {
		return false;
	}
	var reg = new RegExp("[a-zA-Z\\_][0-9a-zA-Z\\_]*");
	return reg.test(name);
}

function selectExpr(tokenArr, separator) {
	rmLineFeed(tokenArr);
	try {
		var index;
		var lBracket = ["(", "[", "{"];
		var rBracket = [")", "]", "}"];
		for (index = 0; index < tokenArr.length; index++) {
			if (tokenArr[index] === separator) {
				break;
			}
			var bracketType = lBracket.indexOf(tokenArr[index]);
			if (bracketType != -1) {
				var cnt = 1;
				while (index < tokenArr.length && cnt > 0) {
					index++;
					if (tokenArr[index] === lBracket[bracketType]) {
						cnt++;
					} else if (tokenArr[index] === rBracket[bracketType]) {
						cnt--;
					}
				}
			}
		}
		if (index >= tokenArr.length) {
			throw "error: syntax error";
		}
		var expr = tokenArr.slice(0, index);
		rmLineFeed(expr);
		var tmpindex = index+1;
		while(tmpindex < tokenArr.length && tokenArr[tmpindex] == "\n")
			tmpindex++;
		var remain = tokenArr.slice(tmpindex);
		rmLineFeed(remain);
		var ret = {	
			"expr": expr, 
			"remain": remain,
			"index": index
		};
		return ret;
	} catch (e) {
		throw ("Exception in selectExpr: \n" + e.toString());
	}
}

function selectBlockCode(tokenArr) {
	rmLineFeed(tokenArr);
	try {
		var index;
		for (index = 0; index < tokenArr.length; index++) {
			if (tokenArr[index] === "{")
				break;
		}
		var begin = index;
		for (var cnt = 0; index < tokenArr.length; index++) {
			if (tokenArr[index] === "{")
				cnt++;
			else if (tokenArr[index] === "}")
				cnt--;
			if (cnt === 0)
				break;
		}
		if (index === tokenArr.length){
			// block is not found
			throw "error: syntaxError"
		}
		var block = tokenArr.slice(begin + 1, index);
		rmLineFeed(block);
		var tmpindex = index+1;
		while(tmpindex < tokenArr.length && tokenArr[tmpindex] === "\n")
			tmpindex++;
		var remain = tokenArr.slice(tmpindex);
		rmLineFeed(remain);
		var ret = {
			"block": block,
			"remain": remain,
			"index": index
		}
		return ret;
	} catch (e) {
		throw ("Exception in selectBlockCode: \n" + e.toString());
	}
	
}