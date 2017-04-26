/*
b = 0
class T(object):
{
	a = b  // static var

	__b = 1  // private static var
	// 


	def __init__(self):
	{
		self._T__t = 1
	}

	def __privatFunc(self, p1, p2):
	{
		pass
	}

	def publicFunc(self, p1, p2):
	{
		pass
	}
 
 	@staticmethod
	def staticFunc(p1, p2):
	{
		pass
	}
}
*/

/*
* GetClassDict与VarDict的读属性相同，写属性不同
* 读的时候都遍历整个dict并递归读父dict
* 写的时候，VarDict可能写本地，也可能递归地写父dict
* GetClassDict只写本地dict，而不写父dict
*/
var GetClassDict = {
	createNew : function(superDict) {
		var getClassDict = {};

		var superDict = superDict;  // 父作用域的数据字典
		var dict = {};  // 本作用域的数据字典

		// private
		
		// public 
		getClassDict.addVar = function(varName, v) {
			dict[varName] = v;
		}
		getClassDict.getVar = function(varName) {
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
		getClassDict.getDict = function() {
			return dict;
		}

		return getClassDict;
	}
}

function classProcessor(tokenArr, dict) {

	try {

		// 语法检查
		if (tokenArr[0] != "class" || tokenArr[2] != "(" || tokenArr[4] != ")" || tokenArr[5] != ":") {
			throw "error: syntax error";
		}

		// 获得类名，并判断是否是标识符
		var className = tokenArr[1];
		if (!isIdentifier(className)) {
			throw "error: syntax error: illegal identifier";
		}

		// 获得父类类名，如果不存在，报错
		var parentClassName = tokenArr[3];
		var parentClassDef = dict.getVar(parentClassName);
		if (parentClassDef === undefined) {
			throw "error: parentClassName not fount";
		}
		parentClassDef = parentClassDef.value;

		// 处理类定义块，将将私有变量名 __varName 替换为 _className__varName
		var classBlock = selectBlockCode(tokenArr).block;
		for (var i = 0; i < classBlock.length; i++) {
			var token = classBlock[i];
			if (token.substring(0, 2) === "__") {
				if (token.substring(token.length-2, token.length) != "__") {
					classBlock[i] = "_" + className + token;
				}
			}
			if (token.substring(0, 7) === "self.__") {
				classBlock[i] = "self._" + className + token.substring(5);
			}
		}
		var getClassDict = GetClassDict.createNew(dict);
		generalBlockProcessor(classBlock, getClassDict);
		newClassDict = getClassDict.getDict();

		var newClassDef = ClassDef.createNew(className, parentClassDef, newClassDict);
		var newVar = Var.createNew("class", newClassDef);
		dict.addVar(className, newVar);
	} catch (e) {
		throw ("Exception in classProcessor: \n" + e.toString());
	}
	
}










