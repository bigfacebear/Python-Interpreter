beg = "    code += \""
end = "\\n\";\n"

outFile = open("./js/preBuiltin.js", 'w')

inFile = open('builtin.py', 'r')
try:
	lines = [line[0:len(line)-1] for line in inFile.readlines()]
	lines = list(map(lambda str: str.replace('\t', '    '), lines))
	lines = list(map(lambda str: str.replace('\\', '\\\\'), lines))
	lines = list(map(lambda str: str.replace('\"', '\\\"'), lines))
	lines = list(map(lambda str: str.replace('\'', '\\\''), lines))
	lines = list(map(lambda str: beg+str+end, lines))
	lines = list(map(lambda str: "    parser(code);\n    code = \"\";\n" if str == beg+end else str, lines))
	lines = ["function preBuiltin(){\n", "    var code = \"\";\n"] + lines + ["    parser(code);\n}"]
	outFile.writelines(lines)
finally:
	outFile.close()
	inFile.close()
