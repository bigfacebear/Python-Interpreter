# Python-Interpreter

A Python-like Interpreter implemented by JavaScript.

## Features

* Fundamental Expressions

```python
1 + 1
3 * (4 - 1) / ((12 % 9)+++1------1)

def f():
    return "hello"
str = f() + " world"

class T(object):
    def f(self):
        return "world"
t = T()
str = f() + t.f() + "!"
```

* Control Flow

```python
def printGrade(score):
    for s in score:
        grade = None
        if s >= 90:
            grade = "A"
        elif s >= 80:
            grade = "B"
        elif s >= 70:
            grade = "C"
        elif s >= 60:
            grade = "D"
        else:
            grade = "F"
        print(grade)
        
score = [80, 62, 55, 74, 90]
printGrade(score)
```

* Variable scope

```python
# Case of global and local variable
a = 0 # a is a global variable
def f(a): # a is a local variable
    print(a) # print local a
    a = 1 # modify local a without effect on global a
    return a # return the value of local a

print(f(a))
# 0
# 1
a
# 0
```

```python
# Case of manipulate global variable in a function
a = [1, 2, 3]
def f():
    global a # declare global a
    print(a[1])
    a[1] = "hello"
    print(a[1])

f()
# 2
# hello
a
# [1, "hello", 3]
```

```python
# Case of nested function
a = [1, 2, 3]
def f():
    b = "yes"
    def g():
        print(b)
        b = "hello"
        print(a[1])
        a[1] = " world!"
        print(b + a[1])
    g()
    
f()
# yes
# 2
# hello world!
a
# [1, " world!", 3]
```

* Array

```python
a = [1, 2, 3]
a[1] = [4, 5, 6]
a
# [ 1, [ 4, 5, 6], 3 ]
a[1][1] = "hello"
a
# [ 1, [ 4, "hello", 6], 3 ]
a[1][0:2]
# [ 4, "hello" ]
a.length
# 3
a[6] = "end"
a
# [ 1, [ 4, "hello", 6 ], 3, None, None, None, "end" ]
a.length
# 7
```

* Object Oriented Programming

```python
class Base(object): # Base class
    def __init__(self):
        self.basePublicVar = "This is a Base's public var"
        self.__basePrivateVar = "This is a Base's private var"
    def f(self):
        print("I am function f() in class Base")
        
class Sub(Base): # Sub class
    def __init__(self):
        Base.__init__(self)
        self.subPublicVar = "This is a Sub's public var"
        self.__subPrivateVar = "This is a Sub's private var"
    def f(self):
        print("I am function f() in class Sub")
```

* Lambda, map, reduce

```python
reduce((lambda a, b: a*10+b), [1,2,3,4])
map((lambda x:x+1), [1,2,3,4])
```

## Contributors

Qiancheng Zhao - Implemented main functions

Jiawei Wu - Implemented GUI

Mengge Jin - Designed the architecture

Yunhan Lan - Tested the system