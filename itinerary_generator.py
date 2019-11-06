import numpy as np 
import geopy.distance
#from equal_groups import EqualGroupsKMeans
import mlrose
from collections import OrderedDict



def cal_dist(coords_1, coords_2, unit='km'):
	""" calculate distance bewtween two points

	example:
		coords_1 = (52.2296756, 21.0122287) # lat, lon
		coords_2 = (52.406374, 16.9251681)  # lat, lon
 
		=> 279.352901604 
	"""
	if unit == 'km':
		return geopy.distance.vincenty(coords_1, coords_2).km
	elif unit == 'miles':
		return geopy.distance.vincenty(coords_1, coords_2).miles
	else:
		raise ValueError('wrong unit!')



class ItineraryGen(object):
	"""	itinerary generator 

	Args:
		num_days: int 
		places: list of dicts
	"""

	def __init__(self, num_days, places):

		assert (len(places) / num_days <= 3)

		self._num_days = num_days
		self._places = places

	'''
	# use for even-size cluster 
	def _cluster(self, data, k):
		""" equal-size cluster """

		clf = EqualGroupsKMeans(n_clusters=k, random_state=0)
		clf.fit(data)
		return clf.labels_
	'''

	def _coords(self, place):
		coords = place['coordinates']
		return (coords['latitude'], coords['longitude'])

	def _build_dist_list(self):
		""" build distance list 
		
		example:
			# Create list of distances between pairs of places 
			dist_list = [(0, 1, 3.1623), (0, 2, 4.1231), (0, 3, 5.8310), (0, 4, 4.2426), 
						 (0, 5, 5.3852), (0, 6, 4.0000), (0, 7, 2.2361), (1, 2, 1.0000), 
						 (1, 3, 2.8284), (1, 4, 2.0000), (1, 5, 4.1231), (1, 6, 4.2426), 
						 (1, 7, 2.2361), (2, 3, 2.2361), (2, 4, 2.2361), (2, 5, 4.4721), 
						 (2, 6, 5.0000), (2, 7, 3.1623), (3, 4, 2.0000), (3, 5, 3.6056), 
						 (3, 6, 5.0990), (3, 7, 4.1231), (4, 5, 2.2361), (4, 6, 3.1623), 
						 (4, 7, 2.2361), (5, 6, 2.2361), (5, 7, 3.1623), (6, 7, 2.2361)]
		"""
	
		n = len(self._places)
		dist_list = []
		for i in range(n-1):
			for j in range(i+1, n):
				coord1 = self._coords(self._places[i])
				coord2 = self._coords(self._places[j])
				dist_list.append((i, j, cal_dist(coord1, coord2)))

		return dist_list


	def _cal_route(self):
		""" based on TSP solver """

		dist_list = self._build_dist_list()
		fitness_dists = mlrose.TravellingSales(distances=dist_list)
		problem_fit = mlrose.TSPOpt(
			length=len(self._places), fitness_fn=fitness_dists, maximize=False)
		best_state, best_fitness = mlrose.genetic_alg(problem_fit, random_state=2)

		return best_state


	def _plan(self, route):
		""" make a plan for each day """
		day_plan = OrderedDict()
		chuncks = np.array_split(route, self._num_days)
		for i, chunck in enumerate(chuncks):
			day_plan[i] = tuple(self._places[j]['name'] for j in chunck)

		return day_plan

	def make(self):
		""" make an itnerary """

		route = self._cal_route()
		plan = self._plan(route)
		return plan


		'''
		# even clustering 

		num_places = len(self._places)
		data = np.zeros((num_places, num_places))

		for i, place in enumerate(self._places):
			coords = place['coordinates']
			data[i] = [coords['latitude'], coords['longitude']]

		num_clusters = int(
			np.ceil(num_places / self._max_num_places_per_day))

		labels = self._cluster(data, num_clusters)

		plan = self._plan(data, labels)

		return plan
		'''


	def add_places(self, places):
		""" add places
		
		Args:
			places: can be a dict OR a list of dicts 
		"""

		if instance(places, list):
			self._places += places
		else:
			self._places.append(places)



	def remove_places(self, placenames):
		raise NotImplementedError 

	@property
	def places(self):
		return self._places
	
	@property
	def num_places(self):
		return len(self._places)
	
	@property
	def num_days(self):
		return self._num_days
	




if __name__ == '__main__':
	places = [
		{'name': 'a',
		 'coordinates': { 
						  'latitude':32,
						  'longitude':-82
						}
		},

		{'name': 'b',
		 'coordinates': { 
						  'latitude':33,
						  'longitude':-77
						}
		},

		{'name': 'c',
		 'coordinates': { 
						  'latitude':35,
						  'longitude':-89
						}
		}

	]


	it_gen = ItineraryGen(2, places)
	plan = it_gen.make()
	print(plan)

















