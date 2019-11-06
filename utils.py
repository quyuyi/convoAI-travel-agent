def get(data, default, *args):
	"""
	Args:
		data: dict
		default: default value 
		args: series of keys to retrieve the value

	Returns:
		default if nothing got else the value retrieved
	"""
	res = data
	for arg in args:
		if isinstance(res, list) and len(res) > arg: 
			res = res[arg]
		else:
			res = res.get(arg, None)
		if res is None:
			return default
	
	return res
