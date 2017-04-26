/*
定义基本的运算，运算的操作数都是封装好的Var变量
*/
var Ops = {
	"unary": {
		"+": function (rightVar) {
			if(rightVar.type == "int" || rightVar.type == "float"){
				return rightVar;
			}else{
				throw "TypeError: doesn't match!";
			}
		},
		"-": function (rightVar) {
			if(rightVar.type == "int" || rightVar.type == "float"){
				return Var.createNew(rightVar.type,-rightVar.value);
			}else{
				throw "TypeError: doesn't match!";
			}	
		},
		"not": function (rightVar) {
			var value = !rightVar.value;
			var type = "bool";
			return Var.createNew(type, value);
		},
		"return": function (rightVar) {
			return rightVar;
		}
	},
	"binary": {
		"or": function (leftVar, rightVar) {
			var value;
			var type;
			if (leftVar.value != false && leftVar.value != 0 && leftVar.value != null && leftVar.value != undefined) {
				value = leftVar.value;
				type = leftVar.type;
			} else {
				value = rightVar.value;
				type = rightVar.type;
			}
			return Var.createNew(type, value);
		},
		"and": function (leftVar, rightVar) {
			var value;
			var type;
			if (leftVar.value === false || leftVar.value === 0 || leftVar.value === null || leftVar.value === undefined) {
				value = leftVar.value;
				type = leftVar.type;
			} else {
				value = rightVar.value;
				type = rightVar.type;
			}
			return Var.createNew(type, value);
		},
		
		"in": function (leftVar, rightVar) {
			// TODO: depending on PyList, ...
		},
		"not in": function (leftVar, rightVar) {
			// TODO: depending on PyList, ...
		},
		"==": function (leftVar, rightVar) {
			if( (leftVar.type == rightVar.type) && (leftVar.value == rightVar.value) ){
				if(leftVar.value == false){
					return Var.createNew("bool",false);
				}else{
					return Var.createNew("bool",true);	
				}
			}else{
				if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
					if(leftVar.value == true){
						return Var.createNew("bool",1==rightVar.value);
					}else if(leftVar.value == false){
						return Var.createNew("bool",0==rightVar.value);
					}
				}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
					if(rightVar.value == true){
						return Var.createNew("bool",leftVar.value==1);
					}else if(rightVar.value == false){
						return Var.createNew("bool",leftVar.value==0);
					}
				}else{
					return Var.createNew("bool",false);	
				}
			}
		},
		"!=": function (leftVar, rightVar) {
			if( (leftVar.type == rightVar.type) && (leftVar.value == rightVar.value) ){
				if(leftVar.value == false){
					return Var.createNew("bool",true);
				}else{
					return Var.createNew("bool",false);	
				}
			}else{
				if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
					if(leftVar.value == true){
						return Var.createNew("bool",1!=rightVar.value);
					}else if(leftVar.value == false){
						return Var.createNew("bool",0!=rightVar.value);
					}
				}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
					if(rightVar.value == true){
						return Var.createNew("bool",leftVar.value!=1);
					}else if(rightVar.value == false){
						return Var.createNew("bool",leftVar.value!=0);
					}
				}else{
					return Var.createNew("bool",true);	
				}
			}	
		},
		"<=": function (leftVar, rightVar) {
			if( (leftVar.type == "float" || leftVar.type == "int") && (rightVar.type == "float" || rightVar.type == "int") ){
				return Var.createNew("bool",leftVar.value <= rightVar.value);
			}else if(leftVar.type == "str" && rightVar == "str"){
				return Var.createNew("bool",leftVar.value <= rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1<=rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0<=rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value<=1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value<=0);
				}
			}else{
				throw "TypeError: unorderable types: "+leftVar.type+"() <= "+rightVar.type+"()\n";
			}
		},
		">=": function (leftVar, rightVar) {
			if( (leftVar.type == "float" || leftVar.type == "int") && (rightVar.type == "float" || rightVar.type == "int") ){
				return Var.createNew("bool",leftVar.value >= rightVar.value);
			}else if(leftVar.type == "str" && rightVar == "str"){
				return Var.createNew("bool",leftVar.value >= rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1>=rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0>=rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value>=1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value>=0);
				}
			}else{
				throw "TypeError: unorderable types: "+leftVar.type+"() >= "+rightVar.type+"()\n";
			}	
		},
		"<": function (leftVar, rightVar) {
			if( (leftVar.type == "float" || leftVar.type == "int") && (rightVar.type == "float" || rightVar.type == "int") ){
				return Var.createNew("bool",leftVar.value < rightVar.value);
			}else if(leftVar.type == "str" && rightVar == "str"){
				return Var.createNew("bool",leftVar.value < rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1<rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0<rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value<1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value<0);
				}
			}else{
				throw "TypeError: unorderable types: "+leftVar.type+"() < "+rightVar.type+"()\n";
			}
		},
		">": function (leftVar, rightVar) {
			if( (leftVar.type == "float" || leftVar.type == "int") && (rightVar.type == "float" || rightVar.type == "int") ){
				return Var.createNew("bool",leftVar.value > rightVar.value);
			}else if(leftVar.type == "str" && rightVar == "str"){
				return Var.createNew("bool",leftVar.value > rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1>rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0>rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value>1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value>0);
				}
			}else{
				throw "TypeError: unorderable types: "+leftVar.type+"() > "+rightVar.type+"()\n";
			}
		},
		"|": function (leftVar, rightVar) {
			if(leftVar.type == "int" && leftVar.type == "int"){
				return Var.createNew("bool",leftVar.value | rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1|rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0|rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value|1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value|0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for | :" + leftVar.type + " and " + rightVar.type + "\n";
			}
		},
		"^": function (leftVar, rightVar) {
			if(leftVar.type == "int" && leftVar.type == "int"){
				return Var.createNew("bool",leftVar.value ^ rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1^rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0^rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value^1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value^0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for ^ :" + leftVar.type + " and " + rightVar.type + "\n";
			}	
		},
		"&": function (leftVar, rightVar) {
			if(leftVar.type == "int" && leftVar.type == "int"){
				return Var.createNew("bool",leftVar.value & rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1&rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0&rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value&1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value&0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for & :" + leftVar.type + " and " + rightVar.type + "\n";
			}
		},
		"<<": function (leftVar, rightVar) {
			if(leftVar.type == "int" && leftVar.type == "int"){
				return Var.createNew("int",leftVar.value << rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1<<rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0<<rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value<<1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value<<0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for << :" + leftVar.type + " and " + rightVar.type + "\n";
			}	
		},
		">>": function (leftVar, rightVar) {
			if(leftVar.type == "int" && leftVar.type == "int"){
				return Var.createNew("int",leftVar.value >> rightVar.value);
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type =="float")){
				if(leftVar.type == true){
					return Var.createNew("bool",1>>rightVar.value);
				}else if(leftVar.type == false){
					return Var.createNew("bool",0>>rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(leftVar.type == true){
					return Var.createNew("bool",leftVar.value>>1);
				}else if(leftVar.type == false){
					return Var.createNew("bool",leftVar.value>>0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for >> :" + leftVar.type + " and " + rightVar.type + "\n";
			}
		},
		"+": function (leftVar, rightVar) {
			if( (leftVar.type == "int" || leftVar.type == "float") && (rightVar.type == "int" || rightVar.type == "float") ){
				if(leftVar.type == "int" && rightVar.type == "int"){
					return Var.createNew("int",leftVar.value+rightVar.value);	
				}else{
					return Var.createNew("float",leftVar.value+rightVar.value);
				}
			}else if(leftVar.type == "str"){
				if(rightVar.type == "str"){
					return Var.createNew("str",leftVar.value+rightVar.value);
				}else{
					throw "TypeError: Can't convert " + rightVar.type + " object to str implicitly\n";
				}
			}else if(leftVar.type == "bool" && rightVar.type == "bool"){
				if(leftVar.value == false && rightVar.value == false){
					return Var.createNew("int",0);
				}else if(leftVar.value == false && rightVar.value == true){
					return Var.createNew("int",1);
				}else if(leftVar.value == true && rightVar.value == false){
					return Var.createNew("int",1);
				}else {
					return Var.createNew("int",2);
				}
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
				if(leftVar.value == true){
					return Var.createNew(rightVar.type,1+rightVar.value);
				}else if(leftVar.value == false){
					return Var.createNew(rightVar.type,0+rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(rightVar.value == true){
					return Var.createNew(leftVar.type,leftVar.value+1);
				}else if(rightVar.value == false){
					return Var.createNew(leftVar.type,leftVar.value+0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for +: " + leftVar.type + " and " + rightVar.type + "\n"; 
			}

		},
		"-": function (leftVar, rightVar) {
			if( (leftVar.type == "int" || leftVar.type == "float") && (rightVar.type == "int" || rightVar.type == "float") ){
				if(leftVar.type == "int" && rightVar.type == "int"){
					return Var.createNew("int",leftVar.value-rightVar.value);	
				}else{
					return Var.createNew("float",leftVar.value-rightVar.value);
				}
			}else if(leftVar.type == "bool" && rightVar.type == "bool"){
				if(leftVar.value == false && rightVar.value == false){
					return Var.createNew("int",0);
				}else if(leftVar.value == false && rightVar.value == true){
					return Var.createNew("int",-1);
				}else if(leftVar.value == true && rightVar.value == false){
					return Var.createNew("int",1);
				}else {
					return Var.createNew("int",0);
				}
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
				if(leftVar.value == true){
					return Var.createNew(rightVar.type,1-rightVar.value);
				}else if(leftVar.value == false){
					return Var.createNew(rightVar.type,0-rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(rightVar.value == true){
					return Var.createNew(leftVar.type,leftVar.value-1);
				}else if(rightVar.value == false){
					return Var.createNew(leftVar.type,leftVar.value-0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for -: " + leftVar.type + " and " + rightVar.type + "\n"; 
			}
		},
		"*": function (leftVar, rightVar) {
			if( (leftVar.type == "int" || leftVar.type == "float") && (rightVar.type == "int" || rightVar.type == "float") ){
				if(leftVar.type == "int" && rightVar.type == "int"){
					return Var.createNew("int",leftVar.value*rightVar.value);	
				}else{
					return Var.createNew("float",leftVar.value*rightVar.value);
				}
			}else if(leftVar.type == "bool" && rightVar.type == "bool"){
				if(leftVar.value == false && rightVar.value == false){
					return Var.createNew("int",0);
				}else if(leftVar.value == false && rightVar.value == true){
					return Var.createNew("int",0);
				}else if(leftVar.value == true && rightVar.value == false){
					return Var.createNew("int",0);
				}else {
					return Var.createNew("int",1);
				}
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
				if(leftVar.value == true){
					return Var.createNew(rightVar.type,1*rightVar.value);
				}else if(leftVar.value == false){
					return Var.createNew(rightVar.type,0*rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(rightVar.value == true){
					return Var.createNew(leftVar.type,leftVar.value*1);
				}else if(rightVar.value == false){
					return Var.createNew(leftVar.type,leftVar.value*0);
				}
			}else if(leftVar.type == "str"){
				if(rightVar.type == "int"){
					var tmpStr = "";
					for(var i = 0 ; i < rightVar.value ; i++){
						tmpStr += leftVar.value;
					}
					return Var.createNew("str",tmpStr);
				}else if(rightVar.type == "bool"){
					if(rightVar.value == true){
						return Var.createNew("str",leftVar.value);
					}else{
						return Var.createNew("str","");
					}
				}else{
					throw "TypeError: can't multiply sequence by non-int of type " + rightVar.type +"\n";
				}
			}else if(rightVar.type == "str"){
				if(leftVar.type == "int"){
					var tmpStr = "";
					for(var i = 0 ; i < leftVar.value ; i++){
						tmpStr += rightVar.value;
					}
					return Var.createNew("str",tmpStr);
				}else if(leftVar.type == "bool"){
					if(leftVar.value == true){
						return Var.createNew("str",rightVar.value);
					}else{
						return Var.createNew("str","");
					}
				}else{
					throw "TypeError: can't multiply sequence by non-int of type " + leftVar.type +"\n";
				}
			}else{
				throw "TypeError: unsupported operand type(s) for *: " + leftVar.type + " and " + rightVar.type + "\n"; 
			}
		},
		"/": function (leftVar, rightVar) {
			if( (leftVar.type == "int" || leftVar.type == "float") && (rightVar.type == "int" || rightVar.type == "float")){
				if(leftVar.type == "int" && rightVar.type == "int"){
					if(rightVar.value == 0){
						throw "ZeroDivisionError: division by zero\n";
					}else{
						return Var.createNew("float",leftVar.value/rightVar.value);
					}
				}else{
					if(rightVar.type == "int" && rightVar.value == 0){
						throw "ZeroDivisionError: division by zero\n";
					}else{
						return Var.createNew("float",leftVar.value/rightVar.value);
					}
				}
			}else if(leftVar.type == "bool" && rightVar.type == "bool"){
				if(leftVar.value == true && rightVar.value == true){
					return Var.createNew("float",1.0);
				}else if(leftVar.value == true && rightVar.value == false){
					throw "ZeroDivisionError: division by zero\n";
				}else if(leftVar.value == false && rightVar.value == true){
					return Var.createNew("float",0.0);
				}else{
					throw "ZeroDivisionError: division by zero\n";
				}
			}else if(leftVar.type == "bool"){
				if(rightVar.type == "float" || rightVar.type == "int"){
					if(rightVar.value == 0){
						throw "ZeroDivisionError: division by zero\n";
					}else{
						if(leftVar.value == true){
							return Var.createNew("float",1/rightVar.value);
						}else{
							return Var.createNew("float",0/rightVar.value);
						}
					}
				}else{
					throw "TypeError: unsupported operand type(s) for /: " + leftVar.type + " and " + rightVar.type +"\n";
				}
			}else if(rightVar.type == "bool"){
				if(rightVar.value == false){
					throw "ZeroDivisionError: division by zero\n";
				}else if(leftVar.type == "int" || leftVar.type == "float"){
					return Var.createNew("float",leftVar.value/1);
				}else{
					throw "TypeError: unsupported operand type(s) for /: " + leftVar.type + " and " + rightVar.type + "\n";
				}
			}
		},
		"%": function (leftVar, rightVar) {
			if( (leftVar.type == "int" || leftVar.type == "float") && (rightVar.type == "int" || rightVar.type == "float") ){
				if(leftVar.type == "int" && rightVar.type == "int"){
					return Var.createNew("int",leftVar.value%rightVar.value);	
				}else{
					return Var.createNew("float",leftVar.value%rightVar.value);
				}
			}else if(leftVar.type == "bool" && rightVar.type == "bool"){
				if(rightVar.value == false){
					throw "ZeroDivisionError: division by zero\n";
				}else if(leftVar.value == false && rightVar.value == true){
					return Var.createNew("bool",false);
				}else if(leftVar.value == true && rightVar.value == true){
					return Var.createNew("int",0);
				}
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
				if(leftVar.value == true){
					if(rightVar.type == "int"){
						return Var.createNew("bool",true);
					}else{
						return Var.createNew("float",1%rightVar.value);
					}
				}else if(leftVar.value == false){
					if(rightVar.type == "int"){
						return Var.createNew("bool",false);
					}else{
						return Var.createNew("float",0.0);
					}
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(rightVar.value == false){
					throw "ZeroDivisionError: division by zero\n";
				}else if(rightVar.value == true){
					if(leftVar.type == "int"){
						return Var.createNew("int",0);
					}else{
						return Var.createNew("float",0.0);
					}
				}
			}else{
				throw "TypeError: unsupported operand type(s) for %: " + leftVar.type + " and " + rightVar.type + "\n"; 
			}
		},
		"**": function (leftVar, rightVar) {
			if( (leftVar.type == "int" || leftVar.type == "float") && (rightVar.type == "int" || rightVar.type == "float") ){
				if(leftVar.type == "int" && rightVar.type == "int"){
					return Var.createNew("int",leftVar.value**rightVar.value);	
				}else{
					return Var.createNew("float",leftVar.value**rightVar.value);
				}
			}else if(leftVar.type == "bool" && rightVar.type == "bool"){
				if(leftVar.value == false && rightVar.value == false){
					return Var.createNew("int",1);
				}else if(leftVar.value == false && rightVar.value == true){
					return Var.createNew("int",0);
				}else if(leftVar.value == true && rightVar.value == false){
					return Var.createNew("int",1);
				}else {
					return Var.createNew("int",1);
				}
			}else if(leftVar.type == "bool" && (rightVar.type == "int" || rightVar.type == "float")){
				if(leftVar.value == true){
					return Var.createNew(rightVar.type,1**rightVar.value);
				}else if(leftVar.value == false){
					return Var.createNew(rightVar.type,0**rightVar.value);
				}
			}else if((leftVar.type == "int" || leftVar.type == "float") && rightVar.type == "bool"){
				if(rightVar.value == true){
					return Var.createNew(leftVar.type,leftVar.value**1);
				}else if(rightVar.value == false){
					return Var.createNew(leftVar.type,leftVar.value**0);
				}
			}else{
				throw "TypeError: unsupported operand type(s) for **: " + leftVar.type + " and " + rightVar.type + "\n"; 
			}
		}/*,
		"//": function (leftVar, rightVar) {
			
		}*/
	},
	"special" : {
		".": function (leftVar, varName) {  //需检查leftVar.value有没有getVar属性
			try {
				if (leftVar === null || !leftVar.value.hasOwnProperty("getVar")) {
					throw "error: " + varName + " can not be fetched";
				}
				var retVar = leftVar.value.getVar(varName)
				if (retVar === undefined) {
					throw "error: " + varName + " is not defined";
				}
				return retVar;
			} catch (e) {
				throw e;
			}
		},
		"[index]": function (leftVar, index) {  // 需要检查leftVar.type是不是list, tuple, dict
			try {
				var type = leftVar.type;
				if (type != "array") {
					throw "error: invalid operation for [index]";
				}
				return leftVar.value.getVar(index);
			} catch (e) {
				throw e;
			}
		},
		"[:]": function (leftVar, start, end) {  // 需要检车leftVal.type是不是list, tuple
			try {
				var type = leftVar.type;
				if (type != "array") {
					throw "error: invalid operation for [:]";
				}
				return leftVar.value.getSlice(start, end);
			} catch (e) {
				throw e;
			}
		},
		"func": function (leftVar, paraList, dict, objVar) {  //  需要检查leftVar.value是不是func
			function runFunc(funcDef, paraList, dict) {
				var funcDefParaList = funcDef.getParaList();
				var funcDefCode = funcDef.getCode();

				if (funcDefParaList.length != paraList.length) {
					throw "error: the number of parameters is not matched";
				}

				// 将函数参数的名字和值加入新的dict，创建新的block并执行
				for (var i = 0; i < paraList.length; i++) {
					dict.addVar(funcDefParaList[i], paraList[i]); // varName, v
				}

				// 将函数的代码，和当前作用域字典送入blockProcessor
				return generalBlockProcessor(funcDefCode, dict);
			}

			try {
				if (leftVar.type != "function" && leftVar.type != "class") {
					throw "error: invalid function call";
				}
				var newVarDict = VarDict.createNew(dict, "func scope");
				if (leftVar.type === "function") {
					var funcDef = leftVar.value;
					if (objVar != undefined && objVar.type != "class") {
						paraList.unshift(objVar);
					}
					return runFunc(funcDef, paraList, newVarDict);
				}
				else { // class __init__
					var classDef = leftVar.value;
					var newClassInst = ClassInst.createNew(classDef);
					var newVar = Var.createNew(classDef.getClassName(), newClassInst);
					var initDef = classDef.getVar("__init__");
					if (initDef != undefined) {
						var funcDef = initDef.value;
						paraList.unshift(newVar);
						runFunc(funcDef, paraList, newVarDict);
					}
					return newVar;
				}
			} catch (e) {
				throw e;
			}
		}
	}
}