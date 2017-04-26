var command_str_interact = ">>> ";
var pre_code = "";//save the previous code (without extra "<<< ")
var pre_content = "";// save the previous code (with extra "<<< ")
var pre_line = new Array();//save the previous code (without extra "<<< ")
var pre_line_cnt = 0;
var pre_line_ptr = 0;
var now_line = "";//save the previous code (with extra "<<< ")
var processContent = "";
var ifCompleteContent = true;
var NaN = "";

document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==13){ // enter 键
        if(pre_content!=""){
            pre_content += "<br>" + command_str_interact;// + now_line; 
            for(var i = 0 ; i < now_line.length ; i++){
                if(now_line[i] == ' '){
                    pre_content += "&ensp;";
                }else{
                    pre_content += now_line[i];
                }
            }
        }else{
            pre_content += command_str_interact ;//+ now_line;
            for(var i = 0 ; i < now_line.length ; i++){
                if(now_line[i] == ' '){
                    pre_content += "&ensp;";
                }else{
                    pre_content += now_line[i];
                }
            }
        }
        if(now_line == ''){
            command_str_interact = '>>> ';
            ifCompleteContent = true;
        }else{
            pre_line[pre_line_cnt] = now_line;
            pre_line_ptr = pre_line_cnt + 1;
            pre_line_cnt += 1;
        }
        if(now_line.substring(0,3) == "for"){
            command_str_interact = '... ';
            ifCompleteContent = false;
        }else if(now_line.substring(0,3) == "def"){
            command_str_interact = '... ';
            ifCompleteContent = false;
        }else if(now_line.substring(0,5) == "class"){
            command_str_interact = '... ';
            ifCompleteContent = false;
        }else if(now_line.substring(0,2) == "if"){
            command_str_interact = '... ';
            ifCompleteContent = false;
        }else if(now_line.substring(0,5) == "while"){
            command_str_interact = '... ';
            ifCompleteContent = false;
        }
        /*pre_code += "<br>";// + now_line;
        for(var i = 0 ; i < now_line.length ; i++){
            if(now_line[i] == " "){
                pre_code += "&ensp;";
            }else{
                pre_code += now_line[i];
            }
        }*/
        processContent += now_line + "\n";
        //console.log(command_str_interact);
        //console.log(pre_content);
        
        //console.log("!!!");
        //console.log(now_line);
        
        if(ifCompleteContent == true){
            try{
                console.log(processContent);
                var result = parser(processContent);
                //result = "";
                pre_content += "<br>";
				document.getElementById("demo").innerHTML += "<br>";
                if(result != ""){
                    for(var i = 0 ; i < result.length ; i++){
                        if(result[i] == ' '){
                            pre_content += "&ensp;";
							document.getElementById("demo").innerHTML += "&ensp;";
                        }else if(result == '\n'){
                            pre_content += "<br>";
							document.getElementById("demo").innerHTML += "<br>";
                        }else{
                            pre_content += result[i];
							document.getElementById("demo").innerHTML += result[i];
                        }
                    }
                }
                console.log("???");
                processContent = "";
                console.log(processContent);
            }catch(err){
				console.log("= =");
				pre_content += "<br>";
				document.getElementById("demo").innerHTML += "<br>";
                for(var i = 0 ; i < err.length ; i++){
                    if(err[i] == ' '){
                        pre_content += "&ensp;";
						document.getElementById("demo").innerHTML += "&ensp;";
                    }else if(err[i] == '\n'){
                        pre_content += "<br>";
						document.getElementById("demo").innerHTML += "<br>";
                    }else{
                        pre_content += err[i];
						document.getElementById("demo").innerHTML += err[i];
                    }
                }
				processContent = "";
				
            }
        }
        now_line = "";
        document.getElementById("demo").innerHTML += "<br>" + command_str_interact;
        /*if(tmpResult != ""){
            document.getElementById("demo").innerHTML += "<br>" + tmpResult + "<br>" + command_str_interact;
        }else{
            document.getElementById("demo").innerHTML += "<br>" + command_str_interact;    
        }*/
        //Display("<b>"+command_str_interact);
    }
    /* a to z */
    //document.getElementById("test").innerHTML = "???";
    if(e && e.keyCode >=65 && e.keyCode <=90 && e.shiftKey == true){
        now_line = now_line + String.fromCharCode(e.keyCode);
        document.getElementById("demo").innerHTML += String.fromCharCode(e.keyCode);
    }else if(e && e.keyCode >=97 && e.keyCode <=112 && e.shiftKey == false){
        now_line = now_line + String.fromCharCode(e.keyCode-32);
        document.getElementById("demo").innerHTML += String.fromCharCode(e.keyCode-32);
    }else if(e && e.keyCode >=65 && e.keyCode <=90 && e.shiftKey == false){
        now_line = now_line + String.fromCharCode(e.keyCode+32);
        document.getElementById("demo").innerHTML += String.fromCharCode(e.keyCode+32);
    }else if(e && e.keyCode >=97 && e.keyCode <=112 && e.shiftKey == true){
        now_line = now_line + String.fromCharCode(e.keyCode);
        document.getElementById("demo").innerHTML += String.fromCharCode(e.keyCode);
    }

    /*number*/
    if(e && e.keyCode >= 48 && e.keyCode <= 57 && e.shiftKey == false){
        now_line += String.fromCharCode(e.keyCode);
        document.getElementById("demo").innerHTML += String.fromCharCode(e.keyCode);
    }

    /*operators*/
    if(e && e.keyCode == 48 && e.shiftKey == true){
        now_line += ")";
        document.getElementById("demo").innerHTML += ")";   
    }
    if(e && e.keyCode == 49 && e.shiftKey == true){
        now_line += "!";
        document.getElementById("demo").innerHTML += "!";   
    }
    if(e && e.keyCode == 50 && e.shiftKey == true){
        now_line += "@";
        document.getElementById("demo").innerHTML += "@";   
    }
    if(e && e.keyCode == 51 && e.shiftKey == true){
        now_line += "#";
        document.getElementById("demo").innerHTML += "#";   
    }
    if(e && e.keyCode == 52 && e.shiftKey == true){
        now_line += "$";
        document.getElementById("demo").innerHTML += "$";   
    }
    if(e && e.keyCode == 53 && e.shiftKey == true){
        now_line += "%";
        document.getElementById("demo").innerHTML += "%";   
    }
    if(e && e.keyCode == 54 && e.shiftKey == true){
        now_line += "^";
        document.getElementById("demo").innerHTML += "^";   
    }
    if(e && e.keyCode == 55 && e.shiftKey == true){
        now_line += "&";
        document.getElementById("demo").innerHTML += "&";   
    }
    if(e && e.keyCode == 56 && e.shiftKey == true){
        now_line += "*";
        document.getElementById("demo").innerHTML += "*";   
    }
    if(e && e.keyCode == 57 && e.shiftKey == true){
        now_line += "(";
        document.getElementById("demo").innerHTML += "(";   
    }
    if(e && e.keyCode == 187 && e.shiftKey == true){//= +
        now_line += "+";
        document.getElementById("demo").innerHTML += "+";   
    }else if(e && e.keyCode == 187 && e.shiftKey == false){
        now_line += "=";
        document.getElementById("demo").innerHTML += "=";
    }
    if(e && e.keyCode == 186 && e.shiftKey == true){//; :
        now_line += ":";
        document.getElementById("demo").innerHTML += ":";
    }else if(e && e.keyCode == 186 && e.shiftKey == false){
        now_line += ";";
        document.getElementById("demo").innerHTML += ";";
    }
    if(e && e.keyCode == 188 && e.shiftKey == true){//, <
        now_line += "<";
        document.getElementById("demo").innerHTML += "<";
    }else if(e && e.keyCode == 188 && e.shiftKey == false){
        now_line += ",";
        document.getElementById("demo").innerHTML += ",";
    }
    if(e && e.keyCode == 189 && e.shiftKey == true){//- _
        now_line += "_";
        document.getElementById("demo").innerHTML += "_";
    }else if(e && e.keyCode == 189 && e.shiftKey == false){
        now_line += "-";
        document.getElementById("demo").innerHTML += "-";
    }
        if(e && e.keyCode == 190 && e.shiftKey == true){//. >
        now_line += ">";
        document.getElementById("demo").innerHTML += ">";
    }else if(e && e.keyCode == 190 && e.shiftKey == false){
        now_line += ".";
        document.getElementById("demo").innerHTML += ".";
    }
    if(e && e.keyCode == 191 && e.shiftKey == true){// / ?
        now_line += "?";
        document.getElementById("demo").innerHTML += "?";
    }else if(e && e.keyCode == 191 && e.shiftKey == false){
        now_line += "/";
        document.getElementById("demo").innerHTML += "/";
    }
    if(e && e.keyCode == 192 && e.shiftKey == true){//` ~
        now_line += "~";
        document.getElementById("demo").innerHTML += "~";
    }else if(e && e.keyCode == 192 && e.shiftKey == false){
        now_line += "`";
        document.getElementById("demo").innerHTML += "`";
    }
    if(e && e.keyCode == 219 && e.shiftKey == true){//[ {
        now_line += "{";
        document.getElementById("demo").innerHTML += "{";
    }else if(e && e.keyCode == 219 && e.shiftKey == false){
        now_line += "[";
        document.getElementById("demo").innerHTML += "[";
    }
    if(e && e.keyCode == 220 && e.shiftKey == true){//\ |
        now_line += "|";
        document.getElementById("demo").innerHTML += "|";
    }else if(e && e.keyCode == 220 && e.shiftKey == false){
        now_line += "\\";
        document.getElementById("demo").innerHTML += "\\";
    }
    if(e && e.keyCode == 221 && e.shiftKey == true){//]}
        now_line += "}";
        document.getElementById("demo").innerHTML += "}";
    }else if(e && e.keyCode == 221 && e.shiftKey == false){
        now_line += "]";
        document.getElementById("demo").innerHTML += "]";
    }
    if(e && e.keyCode == 222 && e.shiftKey == true){//' "
        now_line += "\"";
        document.getElementById("demo").innerHTML += "\"";
    }else if(e && e.keyCode == 222 && e.shiftKey == false){
        now_line += "'";
        document.getElementById("demo").innerHTML += "'";
    }
    /* spacebar */
    if(e && e.keyCode==32){
        now_line += " ";
        document.getElementById("demo").innerHTML += "&ensp;";
    }
    /* backspace */
    if(e && e.keyCode==8 && now_line.length > 0){
        //str = str.substring(0,str.length-1);
        //document.getElementById("demo").innerHTML=str;
        now_line = now_line.substring(0,now_line.length-1);
        if(pre_content != ""){
            document.getElementById("demo").innerHTML = pre_content + "<br>" + command_str_interact;
            // + now_line;
            for(var i = 0 ; i < now_line.length ; i++){
                if(now_line[i] == " "){
                    document.getElementById("demo").innerHTML += "&ensp;";       
                }else{
                    document.getElementById("demo").innerHTML += now_line[i];
                }
            }        
        }else{
            document.getElementById("demo").innerHTML = command_str_interact;
            // + now_line;    
            for(var i = 0 ; i < now_line.length ; i++){
                if(now_line[i] == " "){
                    document.getElementById("demo").innerHTML += "&ensp;";       
                }else{
                    document.getElementById("demo").innerHTML += now_line[i];
                }
            }
        }
    }
    /*tab*/
    if(e && e.keyCode == 9){
        e.preventDefault();
        now_line += "    ";
        document.getElementById("demo").innerHTML += "&ensp;&ensp;&ensp;&ensp;";   
        //document.body.focus();
    }
    /* up */
    if(e && e.keyCode==38){
        if(pre_line_ptr > 0){
            pre_line_ptr -= 1;
            now_line = pre_line[pre_line_ptr];
            document.getElementById("demo").innerHTML = pre_content + "<br>" + command_str_interact;// + now_line; 
            for(var i = 0 ; i < now_line.length ; i++){
                if(now_line[i] != " "){
                    document.getElementById("demo").innerHTML += now_line[i];
                }else{
                    document.getElementById("demo").innerHTML += "&ensp;";
                }
            }   
        }
    }
    /* down */
    if(e && e.keyCode==40){
        if(pre_line_ptr < pre_line_cnt - 1){
            pre_line_ptr += 1;
            now_line = pre_line[pre_line_ptr];
            document.getElementById("demo").innerHTML = pre_content + "<br>" + command_str_interact;//+ now_line;
            for(var i = 0 ; i < now_line.length ; i++){
                if(now_line[i] != " "){
                    document.getElementById("demo").innerHTML += now_line[i];
                }else{
                    document.getElementById("demo").innerHTML += "&ensp;";
                }
            }       
        }
    }


    //document.getElementById('test').innerHTML = pre_code;
}; 

function Output(string) {
    // body...
	pre_content += "<br>";
	document.getElementById("demo").innerHTML += "<br>";
    for(var i = 0 ; i < string.length ; i++){
        if(string[i] == " "){
            pre_content += "&ensp;";
			document.getElementById("demo").innerHTML += "&ensp;";
        }else if(string[i] == "\n"){
            pre_content += "<br>";
			document.getElementById("demo").innerHTML += "\n";
        }else{
            pre_content += string[i];
			document.getElementById("demo").innerHTML += string[i];
        }
    }
}