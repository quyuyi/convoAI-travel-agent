def get(data, default, *args):
	""" get value from a chain of combinations of dict & list

	Args:
		data: dict
		default: default value 
		args: series of keys to retrieve the value

	Returns:
		default if nothing got else the value retrieved
	"""
	res = data
	for arg in args:
		if isinstance(res, list): 
			if isinstance(arg, str):
				raise ValueError('index for list should be an integer')
			elif len(res) > arg:
				res = res[arg]
			else:
				raise KeyError('index out of range')
		else:
			res = res.get(arg, None)
		if res is None:
			return default
	
	return res




if __name__ == '__main__':
	data = {'a': [1, 2, {'c':3}, 4], 'b': 1}
	print(get(data, '', 'a', 2, 'c'))
	print(get(data, '', 'a', 4, 'c'))   # => KeyError
	print(get(data, '', 'a', 'd', 'c')) # => ValueError