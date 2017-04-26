// 定义关键字
var KeywordDict = {
	createNew : function() {
		keywordDict = {};

		var dict = {};

		keywordDict.addVar = function(varName, v) {
			dict[varName] = v;
		}

		keywordDict.getVar = function(varName) {
			if (dict.hasOwnProperty(varName)) {
				return dict[varName];
			} else {
				return undefined;
			}
		}

		return keywordDict;
	}
}

var keywordDict = KeywordDict.createNew();

keywordDict.addVar("True", Var.createNew("bool", true));
keywordDict.addVar("False", Var.createNew("bool", false));
keywordDict.addVar("None", Var.createNew("NoneType", null));
keywordDict.addVar("class", Var.createNew("keyword", null));
keywordDict.addVar("finally", Var.createNew("keyword", null));
keywordDict.addVar("is", Var.createNew("keyword", null));
keywordDict.addVar("return", Var.createNew("keyword", null));
keywordDict.addVar("continue", Var.createNew("keyword", null));
keywordDict.addVar("for", Var.createNew("keyword", null));
keywordDict.addVar("lambda", Var.createNew("keyword", null));
keywordDict.addVar("try", Var.createNew("keyword", null));
keywordDict.addVar("def", Var.createNew("keyword", null));
keywordDict.addVar("from", Var.createNew("keyword", null));
keywordDict.addVar("nonlocal", Var.createNew("keyword", null));
keywordDict.addVar("while", Var.createNew("keyword", null));
keywordDict.addVar("and", Var.createNew("keyword", null));
keywordDict.addVar("del", Var.createNew("keyword", null));
keywordDict.addVar("global", Var.createNew("keyword", null));
keywordDict.addVar("not", Var.createNew("keyword", null));
keywordDict.addVar("with", Var.createNew("keyword", null));
keywordDict.addVar("as", Var.createNew("keyword", null));
keywordDict.addVar("elif", Var.createNew("keyword", null));
keywordDict.addVar("if", Var.createNew("keyword", null));
keywordDict.addVar("or", Var.createNew("keyword", null));
keywordDict.addVar("yield", Var.createNew("keyword", null));
keywordDict.addVar("assert", Var.createNew("keyword", null));
keywordDict.addVar("else", Var.createNew("keyword", null));
keywordDict.addVar("import", Var.createNew("keyword", null));
keywordDict.addVar("pass", Var.createNew("keyword", null));
keywordDict.addVar("break", Var.createNew("keyword", null));
keywordDict.addVar("except", Var.createNew("keyword", null));
keywordDict.addVar("in", Var.createNew("keyword", null));
keywordDict.addVar("raise", Var.createNew("keyword", null));
keywordDict.addVar("function", Var.createNew("keyword", null));

var builtinVarDict = VarDict.createNew(undefined);
objectClassDef = ClassDef.createNew("object", undefined, {});
builtinVarDict.addVar("object", Var.createNew("class", ClassDef.createNew("object", undefined, {})));
// builtinVarDict.addVar("list", Var.createNew("class", ClassDef.createNew("list", objectClassDef, {})));
// builtinVarDict.addVar("tuple", Var.createNew("class", ClassDef.createNew("tuple", objectClassDef, {})));
// builtinVarDict.addVar("dict", Var.createNew("class", ClassDef.createNew("dict", objectClassDef, {})));
// builtinVarDict.addVar("set", Var.createNew("class", ClassDef.createNew("set", objectClassDef, {})));

var globalVarDict = VarDict.createNew(builtinVarDict);

var PyArray = {
	createNew : function(arr) {
		var pyArray = {};

		var arr = arr;
		var length = arr.length;

		pyArray.getVar = function(index) {
			if (index === "length") {
				return Var.createNew("int", length);
			}
			
			if (index < 0) {
				index += length;
			}
			var ret = arr[index];

			return ret;
		}

		pyArray.addVar = function(index, v) {
			arr[index] = v;
			if (index >= length) {
				for (var i = length; i < index; i++) {
					arr[i] = keywordDict.getVar("None");
				}
			}
			length = arr.length;
		}

		pyArray.getSlice = function(start, end) {
			if (start < 0) {
				start += length;
			}
			if (end < 0) {
				end += length;
			}
			var ret = arr.slice(start, end);
			ret = PyArray.createNew(ret);
			ret = Var.createNew("array", ret);
			return ret;
		}

		pyArray.toString = function() {
			return "[ " + arr.toString() + " ]";
		}

		pyArray.getList = function() {
			return arr;
		}

		pyArray.type = "array";

		return pyArray;
	}
}














