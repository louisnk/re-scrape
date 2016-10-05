import sys, json

# simple JSON echo script
means = sys.argv[1]
listings = sys.argv[2:]

toReturn = {}

for listing in listings:
	listing = json.loads(listing)

	print json.dumps(listing)
# 	listingId = listing['id']
# 	brKey = str(listing['beds']) + 'br'
# 	baKey = str(listing['baths']) + 'ba'

# 	if brKey not in toReturn:
# 		toReturn[brKey] = {}

# 	if baKey not in sums[brKey]:
# 		sums[brKey][baKey] = {
# 			'rent': listing['price'],
# 			'count': 1,
# 			'pft2': float(listing['price']) / listing['sqft'],
# 			'sqft': listing['sqft']
# 		}
# 	else:
# 		sums[brKey][baKey]['rent'] = sums[brKey][baKey]['rent'] + listing['price']
# 		sums[brKey][baKey]['sqft'] = sums[brKey][baKey]['sqft'] + listing['sqft']
# 		sums[brKey][baKey]['pft2'] = sums[brKey][baKey]['pft2'] + (float(listing['price']) / listing['sqft'])
# 		sums[brKey][baKey]['count'] = sums[brKey][baKey]['count'] + 1

# 	# print json.dumps(json.loads(line))


# for key, val in sums.iteritems():
# 	if key not in means:
# 		means[key] = {}

# 	if len(sums[key]) > 0:
# 		for mKey, mVal in sums[key].iteritems():
# 			# print mVal
# 			if mKey not in means[key]:
# 				means[key][mKey] = {
# 					'meanRent': sums[key][mKey]['rent'] / sums[key][mKey]['count'],
# 					'meanPft2': float(sums[key][mKey]['pft2']) / sums[key][mKey]['count'],
# 					'meanSqft': sums[key][mKey]['sqft'] / sums[key][mKey]['count'],
# 					'count': sums[key][mKey]['count']
# 				}

# 			else:
# 				means[key][mKey]['meanRent'] = sums[key][mKey]['rent'] / sums[key][mKey]['count']
# 				means[key][mKey]['meanPft2'] = float(sums[key][mKey]['pft2']) / sums[key][mKey]['count']
# 				means[key][mKey]['meanSqft'] = sums[key][mKey]['sqft'] / sums[key][mKey]['count']
# 				means[key][mKey]['count'] = sums[key][mKey]['count']

# print json.dumps(means)