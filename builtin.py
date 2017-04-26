class list(object):
	def __init__(self, list):
		self.__arr = list
	def get(self, index):
		return self.__arr[index]
	def append(self, v):
		self.__arr[self.__arr.length] = v
	def pop(self):
		ret = self.__arr[self.__arr.length - 1]
		self.__arr = self.__arr[0:self.__arr.length-1]
		return ret
	def getLength(self):
		return self.__arr.length
	def map(self, f):
		arr = self.__arr
		i = 0
		while i < arr.length:
			arr[i] = f(arr[i])
			i += 1
		return arr
	def reduce(self, f):
		arr = self.__arr
		i = 1
		ret = arr[0]
		while i < arr.length:
			ret = f(ret, arr[i])
			i += 1
		return ret
	def toArray(self):
		return self.__arr


def range(beg, end):
	cnt = 0
	ret = []
	num = beg
	while num < end:
		ret[cnt] = num
		num += 1
		cnt += 1
	return ret

def map(f, arr):
	i = 0
	while i < arr.length:
		arr[i] = f(arr[i])
		i += 1
	return arr

def reduce(f, arr):
	i = 1
	ret = arr[0]
	while i < arr.length:
		ret = f(ret, arr[i])
		i += 1
	return ret
