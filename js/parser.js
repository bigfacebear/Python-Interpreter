function print(s){
	var isDebug = 0;
	if (isDebug == 1)
		document.write("<code>" + s.replace(/ /g, "_").replace(/\t/g, "$t$").replace(/\n/g, "$n$") + "</code><br>");
}

function isDigit(ch){
	return (ch >= '0') && (ch <= '9')
}

function trim(s){ 
/*
 * This function get the original input code, 
 * trim the comment, 
 * sort out the indentation,
 * add the brackets
 */
	s = s + "\n"
	s = s.replace(/\t/g, "    ");
	var lineList = new Array();
	var inList = new Array();
	var prot = new Array();
	while(s.length != 0){
		var l = s.indexOf("\n");
		if (l === 0) {
			s = s.substr(l+1);
		}
		lineList.push(s.substr(0, l));
		s = s.substr(l+1);
	}
	for (var i = 0; i < lineList.length; i++){
		inList.push(0);
		var l = 0;
		while(l < lineList[i].length && lineList[i].charAt(l) == ' '){
			l++;
		}
		if (l % 4 != 0){
			throw "Indentation Error: " + lineList[i];
		}
		inList[i] = l / 4;
		l = lineList[i].indexOf('#');
		if (l != -1)
			lineList[i] = lineList[i].substr(0, l);
	}
	for(var i = 1; i < lineList.length; i++){
		for(var j = inList[i-1]; j < inList[i]; j++)
			lineList[i-1] = lineList[i-1] + "{";
		for(var j = inList[i]; j < inList[i-1]; j++)
			lineList[i-1] = lineList[i-1] + "}";
	}
	t = "";	
	for(var i = 0; i < lineList.length; i++)
		t = t + lineList[i] + "\n";
	return t;
}

function parser(s){
	var qiangXingZhuanYi = 0;
	var fuckQiangXingZhuangYi = 0;
	var fuckS = new Array(s.length + 1);
	print(s);
	if (qiangXingZhuanYi == 1) {
		for(var i = 0; i < s.length; i++)
			fuckS[i] = 0;
		for(var i = 0; i < s.length; i++)
			if (s.charAt(i) == '"' && (i == 0 || (s.charAt(i - 1) != '\\'))){
				fuckS[i] = 1;
			}
		var cnt = 0;
		t = "";
		for(var i = 0; i < s.length; i++){
			if (fuckS[i] == 1)
				cnt = 1 - cnt;
			if (cnt == 1 && (s.charAt(i) == '\n')){
				t = t + "/n";
			} else if (cnt == 1 && (s.charAt(i) == '\t')){
				t = t + "/t";
			} else
				t = t + s.charAt(i);
		}
		s = t;
	}
	print(s);
	try{
		s = " " + trim(s) + " ";
	}
	catch(err){
		throw err;
	}
	if (qiangXingZhuanYi == 1) {
		for(var i = 0; i < s.length; i++)
			fuckS[i] = 0;
		for(var i = 0; i < s.length; i++)
			if (s.charAt(i) == '"' && (i == 0 || (s.charAt(i - 1) != '\\'))){
				fuckS[i] = 1;
			}
		var cnt = 0;
		t = "";
		for(var i = 0; i < s.length - 1; i++){
			if (fuckS[i] == 1)
				cnt = 1 - cnt;
			if (cnt == 1 && (s.charAt(i) == '/' && s.charAt(i + 1) == 'n')){
				t = t + "\n";
				i++;
			} else if (cnt == 1 && (s.charAt(i) == '/' && s.charAt(i + 1) == 't')){
				t = t + "\t";
				i++;
			} else
				t = t + s.charAt(i);
		}
		s = t + s.charAt(s.length - 1);
	}
	print(s);
	var l = s.length;
	var TokenList = new Array();
	var spt = new Array(l);
	for (var i = 0; i <= l; i++)
		spt[i] = 0;
	spt[l] = 1;
	for (var i = 0; i < l; i++){
		if (s.charAt(i) == '\r' || s.charAt(i) == '\n' || s.charAt(i) == '\t'
			|| s.charAt(i) == '(' || s.charAt(i) == ')' || s.charAt(i) == '+'
			|| s.charAt(i) == '[' || s.charAt(i) == ']' || s.charAt(i) == '-'
			|| s.charAt(i) == '{' || s.charAt(i) == '}' || s.charAt(i) == '.'
			|| s.charAt(i) == ':' || s.charAt(i) == ';' || s.charAt(i) == ','
			|| s.charAt(i) == '%' || s.charAt(i) == '|' || s.charAt(i) == '&'
			|| s.charAt(i) == '~' || s.charAt(i) == '^' || s.charAt(i) == ' '
			
			|| s.charAt(i) == '/' || s.charAt(i) == '<' || s.charAt(i) == '!'
			|| s.charAt(i) == '*' || s.charAt(i) == '>' || s.charAt(i) == '='
			|| s.charAt(i) == '#'
 			)
			spt[i] = spt[i+1] = 1;
	}
	for(var i = 0; i < l - 1; i++){
		if (s.substr(i, 2) === "**"
			|| s.substr(i, 2) === "//"
			|| s.substr(i, 2) === ">>"
			|| s.substr(i, 2) === "<<"
			|| s.substr(i, 2) === "=="
			|| s.substr(i, 2) === "!="
			|| s.substr(i, 2) === ">="
			|| s.substr(i, 2) === "<="
			|| s.substr(i, 2) === "+="
			|| s.substr(i, 2) === "-="
			|| s.substr(i, 2) === "*="
			|| s.substr(i, 2) === "/="
			|| s.substr(i, 2) === "%="
			){
			spt[i] = spt[i+2] = 2;
			spt[i+1] = 0;
		}	
	}
	for(var i = 0; i < l - 2; i++){
		if (s.substr(i, 3) === "**="
			|| s.substr(i, 2) == "//="
			|| s.substr(i, 2) == ">>="
			|| s.substr(i, 2) == "<<="
			){
			spt[i] = spt[i+3] = 3;
			spt[i+1] = spt[i+2] = 0;
		}	
	}
	var inString = 0;
	for(var i = 0; i < l; i++){
		if (s.charAt(i) == '"' && (i == 0 || (s.charAt(i - 1) != '\\'))){
			inString = 1 - inString;
		}
		if (inString){
			spt[i + 1] = 0;
		}
	}
	for(var i = 0; i < l - 1; i++){
		if (s.charAt(i) == '.' && spt[i + 1] == 1 && isDigit(s.charAt(i + 1))){
			spt[i] = spt[i+1] = 0;
		}
	}
	var lst = l;
	for(var i = l-1; i >= 0; i--)
		if (spt[i] != 0){
			spt[i] = lst;
			lst = i;
		}
	for(var i = 0; i < l; ){
		var stmp = s.substring(i, spt[i]);
		if (stmp == " " || stmp == "\t" || stmp == "\r")
			;
		else{
			TokenList.push(stmp);
		}
		i = spt[i];
	}

	var debugS = "";
	for(var i = 0; i < TokenList.length; i++){
		print(TokenList[i]);
		debugS += "$" + TokenList[i];
		if (fuckQiangXingZhuangYi && TokenList[i].length >= 2 && TokenList[i][0] == '"'){
			TokenList[i] = TokenList[i].replace(/\\n/g, "\n");
		}
	}

	try{
		var result = generalBlockProcessor(TokenList, globalVarDict);
		
		if (result === null)
			result = "";
		return result.toString();
	} catch(err){
		throw err;
	}
}