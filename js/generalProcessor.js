
function generalProcessor(tokenArr, dict){
	try{
		var l = 0;
		while(l < tokenArr.length && (tokenArr[l] == "{" || tokenArr[l] == "}" || tokenArr[l] == "\n")) {
			l++;
		}
		if (l === tokenArr.length) {
			return null;
		}
		if (tokenArr[l] === "def"){
			// function define
			defProcessor(tokenArr.slice(l), dict);
			return null;
		} else if (tokenArr[l] === "class"){
			// class define
			classProcessor(tokenArr.slice(l), dict);
			return null;
		} else if (tokenArr[l] === "if"){
			// if statement
			ifProcessor(tokenArr.slice(l), dict);
			return null;
		} else if (tokenArr[l] === "for"){
			// for loop
			forProcessor(tokenArr.slice(l), dict);
			return null;
		} else if (tokenArr[l] === "while"){
			// while loop
			whileProcessor(tokenArr.slice(l), dict);
			return null;
		} else if (tokenArr[l] === "return"){ //no use 
			// return - =
			return exprProcessor(tokenArr.slice(l+1), dict);
			//return arithmeticProcessor(tokenArr.slice(l + 1), dict);
		} else if (tokenArr[l] === "print"){
			var __r = tokenArr.length-1;
			while(__r >= l && tokenArr[__r] != ')'){
				__r--;
			}
			if (__r < l) throw "Syntax Error: Need ')' for print()";
			var qvq = exprProcessor(tokenArr.slice(l+2, __r), dict);
			Output(qvq.toString() + "\n");
			return keywordDict.getVar("None");
		} else {
			return exprProcessor(tokenArr, dict);
		}
	} catch(err){
		throw err;
	}
}

function getNextValidToken(tokenArr, x){//[x, inf)
	while(x < tokenArr.length && (tokenArr[x] == "}" || tokenArr[x] == "{" || tokenArr[x] == "\n"))
		x++;
	return x;
}

function getNextEnding(tokenArr, now){
	var flag = 0, cnt = 0;
	while(now < tokenArr.length){
		if (tokenArr[now] == "{"){
			cnt++;
			flag = 1;
		}
		if (tokenArr[now] == "}"){
			cnt--;
			flag = 1;
		}
		if (flag == 1 && cnt == 0){
			break;
		}
		now++;
	}
	return now;
}


function generalBlockProcessor(tokenArr, dict){
	try{
		var pos = 0;
		if (tokenArr.length > 0 && tokenArr[-1] != "\n")
			tokenArr.push("\n");
		tokenArr.push(0);
		var returnValue = null;
		var preValue = null;
		while(pos < tokenArr.length - 1){
			var now = pos;
			now = getNextValidToken(tokenArr, now);
			if (tokenArr[now] === "for" || tokenArr[now] === "while" || tokenArr[now] === "def" || tokenArr[now] === "class"){
				now = getNextEnding(tokenArr, now);
				while (now >= tokenArr.length - 1)
					now--;
				returnValue = generalProcessor(tokenArr.slice(pos, now + 1), dict);
				if (returnValue === null)
					preValue = returnValue;
				pos = getNextValidToken(tokenArr, now);
			} else if (tokenArr[now] === "if"){
				now = getNextEnding(tokenArr, now);
				var tmpnow = now;
				now = getNextValidToken(tokenArr, now);
				while(tokenArr[now] === "elif"){
					now = getNextEnding(tokenArr, now);
					tmpnow = now;
					now = getNextValidToken(tokenArr, now);
				}
				if (tokenArr[now] === "else"){
					now = getNextEnding(tokenArr, now);
					tmpnow = now;
					now = getNextValidToken(tokenArr, now);
				}
				returnValue = generalProcessor(tokenArr.slice(pos, tmpnow + 1), dict);
				if (returnValue === null)
					preValue = returnValue;
				pos = now;
			} else{
				while(now < tokenArr.length && tokenArr[now] != "\n"){
					now++;
				}
				returnValue = generalProcessor(tokenArr.slice(pos, now), dict);
				now = getNextValidToken(tokenArr, now);
				if (returnValue != null)
					preValue = returnValue;
				pos = now;
			}
		}
	} catch (err){
		throw err;
	}
	if (preValue === null) {
		preValue = keywordDict.getVar("None");
	}
	return preValue;
}
