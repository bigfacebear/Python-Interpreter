var Var = {
	createNew : function(varType, varValue) {
		var newVar = {};
		newVar.type = varType;
		newVar.value = varValue;
		newVar.toString = function() {
			if (this.type === "int" || this.type === "float" || this.type === "str" || this.type === "array") {
				return this.value.toString();
			} else if (this.type === "bool") {
				if (this.value) {
					return "True";
				} else {
					return "False";
				}
			} else if (this.type === "NoneType") {
				return "None";
			} else {
				return "object of type: " + this.type;
			}
		}
		return newVar;
	}
};

var VarDict = {
	createNew : function(superDict, scope) {
		var varDict = {};

		var superDict = superDict;  // 父作用域的数据字典
		var dict = {};  // 本作用域的数据字典
		var globalVar = [];
		var scope = scope;

		// private
		var updateVar = function(varName, v) {
			if (!dict.hasOwnProperty(varName)) {
				superDict.addVar(varName, v);
			} else {
				dict[varName] = v;
			}
		}

		// 如果要对一个变量名赋值，检测当前作用域内是否有该变量名

		// public 
		/*
		* 为一个变量名赋值
		* 先找，如果找到了就对找到的进行赋值
		* 如果没找到，就在本地新建
		*/
		varDict.hasVar = function(varName) {
			if (dict.hasOwnProperty(varName)) {
				return true;
			}
			if (scope === "func scope" || superDict === undefined) {
				return false;
			}
			return superDict.hasVar(varName);
		}
		varDict.addVar = function(varName, v) {
			if (keywordDict.getVar(varName) != undefined) {
				throw "SyntaxError: invalid syntax";
			}
			if (globalVar.indexOf(varName) != -1) {
				globalVarDict.addVar(varName, v);
			}
			if (this.hasVar(varName)) {
				updateVar(varName, v);
			} else {
				dict[varName] = v;
			}
			// var find = this.getVar(varName);
			// if (find === undefined) { // 没找到
			// 	dict[varName] = v;
			// } else { // 找到了
			// 	updateVar(varName, v);
			// }
		}
		varDict.getVar = function(varName) {
			var find = keywordDict.getVar(varName);
			if (find != undefined) {
				if (find.type != "keyword") {
					return find;
				}
			}
			if (globalVar.indexOf(varName) != -1) {
				return globalVarDict.getVar(varName);
			}
			if (dict.hasOwnProperty(varName)) {
				return dict[varName];
			} else {
				if (superDict === undefined) {
					return undefined;
				} else {
					return superDict.getVar(varName);
				}
			}
		}
		varDict.addGlobal = function(varName) {
			if (globalVar.indexOf(varName) === -1) {
				globalVar.push(varName);
			}
		}

		return varDict;
	}
};

var Func = {
	createNew : function() {
		var func = {};

		var paraList = [];
		var funcCode = [];

		func.setParaList = function(li) {
			paraList = li;
		}
		func.getParaList = function() {
			return paraList;
		}
		func.setCode = function(code) {
			funcCode = code;
		}
		func.getCode = function() {
			return funcCode;
		}
		return func;
	}
};

// 类定义
var ClassDef = {
	createNew : function(className, parentDef, classVarDict) {
		var classDef = {}
		
		var className = className;
		var parentDef = parentDef; // parent's classDef
		var classVarDict = classVarDict;  // staticVars & functions

		classDef.getVar = function(varName) {
			if (keywordDict.getVar(varName) != undefined) {
				throw "SyntaxError: invalid syntax";
			}
			if (classVarDict.hasOwnProperty(varName)) {
				return classVarDict[varName];
			} else {
				if (parentDef === undefined) {
					return undefined;
				} else {
					return parentDef.getVar(varName);
				}
			}
		}

		classDef.addVar = function(varName, v) {
			if (keywordDict.getVar(varName) != undefined) {
				throw "SyntaxError: invalid syntax";
			}
			classVarDict[varName] = v;
		}

		classDef.getClassName = function() {
			return className;
		}

		return classDef;
	}
};

// 类实例
var ClassInst = {
	createNew : function(classDef) {
		var classInst = {}
		
		var classDef = classDef;
		var varDict = {};

		classInst.addVar = function(varName, v) {
			if (keywordDict.getVar(varName) != undefined) {
				throw "SyntaxError: invalid syntax";
			}
			varDict[varName] = v;
		}
		classInst.getVar = function(varName) {
			if (keywordDict.getVar(varName) != undefined) {
				throw "SyntaxError: invalid syntax";
			}
			if (varDict.hasOwnProperty(varName)) {
				return varDict[varName];
			} else {
				return classDef.getVar(varName);
			}
		}

		return classInst;
	}
};
