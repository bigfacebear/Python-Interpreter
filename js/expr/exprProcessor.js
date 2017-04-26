/*
该方法处理表达式
输入：token的数组
输出：封装好的Var对象，包含type, value
 
支持的运算：(按优先级排列)

0. 数字字面量		123, 1.23
1. 字符串转换		'expression,...'
2. 字典显示		{key:data, ...}
3. 列表显示		[expression, ...]
4. 函数调用		f()
5. 寻址段			x[i:j]
6. 下标			x[i]
7. 属性参考		x.attr
8. 指数			**
9. 按位翻转		~						// 从右向左！！
10.正负号			+x, -x					// 从右向左！！
11.乘法、除法、取余	*, /, //, %
12.加法、减法		+, -
13.移位			<<, >>
14.按位与			&
15.按位异或		^
16.按位或 		|
17.比较运算符		<=, >, <, >=
18.等于运算符		==, !=
19.赋值运算符		=, +=, -=, *=, /=, %=, **=, //=, <<=, >>=		// 从右向左！！
20.成员测试		in, not in
21.布尔非			not  					// 从右向左！！
22.布尔与			and
23.布尔或			or

*/

function exprProcessor(tokenArr, dict) {
	
	try {

		var ret;

		var processors = Processors.createNew(tokenArr, dict);

		processors.preProcess();

		console.log("expr is: " + tokenArr.join(" "));

		if (tokenArr.length === 0) {
			return null;  // TODO: 如果表达式为空，返回什么?
		}

		ret = processors.globalProcessor();
		if (ret != null) return ret;

		ret = processors.lambdaProcessor();
		if (ret != null) return ret;

		ret = processors.binaryOp(["or"]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["and"]);
		if (ret != null) return ret;

		ret = processors.unaryOp(["not"]);
		if (ret != null) return ret;

		ret = processors.unaryOp(["in", "not in"]);
		if (ret != null) return ret;

		ret = processors.assignOp(["=", "+=", "-=", "*=", "/=", "%=", "**=", "//=", "<<=", ">>="])
		if (ret != null) return ret;

		ret = processors.binaryOp(["==", "!="]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["<=", ">", "<", ">="]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["|"]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["^"]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["&"]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["<<", ">>"]);
		if (ret != null) return ret;

		ret = processors.addAndSubOp();  // +, -
		if (ret != null) return ret;

		ret = processors.binaryOp(["*", "/", "//", "%"]);
		if (ret != null) return ret;

		ret = processors.unaryOp(["+", "-"]);
		if (ret != null) return ret;

		ret = processors.unaryOp(["~"]);
		if (ret != null) return ret;

		ret = processors.binaryOp(["**"]);
		if (ret != null) return ret;

		/*
		至此进入递归终点，剩下的token是：
			0. 数字字面量		123, 1.23
			1. 字符串转换		'expression,...'
			2. 字典显示		{key:data, ...}
			3. 列表显示		[expression, ...]
			   变量值			a
			4. 函数调用		f()
			5. 寻址段			x[i:j]
			6. 下标			x[i]
			7. 属性参考		x.attr
		*/
		ret = processors.identifierProcessor();
		if (ret != null) return ret;

		ret = processors.literalProcessor();
		if (ret != null) return ret;

		// 表达式什么都不是
		throw "SyntaxError: invalid expression: " + tokenArr.join(" ");

	} catch (e) {
		throw e;
	}

}














