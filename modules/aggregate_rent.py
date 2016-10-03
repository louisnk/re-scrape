import sys, json

# simple JSON echo script
listings = sys.argv[1:]
means = {}
totals = {}

for line in listings:
	listing = json.loads(line)
	beds = str(listing['beds'])
	key = beds + 'br'
	if key not in means:
		means[key] = {
			'rent': listing['price'],
			'count': 1,
			'pft2': float(listing['price']) / listing['sqft'],
			'sqft': listing['sqft']
		}
	else:
		means[key]['rent'] = means[key]['rent'] + listing['price']
		means[key]['sqft'] = means[key]['sqft'] + listing['sqft']
		means[key]['pft2'] = means[key]['pft2'] + (float(listing['price']) / listing['sqft'])
		means[key]['count'] = means[key]['count'] + 1

	# print json.dumps(json.loads(line))

for key, val in means.iteritems():
	if key not in totals:
		totals[key] = {
			'meanRent': means[key]['rent'] / means[key]['count'],
			'meanRPB': (means[key]['rent'] / means[key]['count']) / int(key[0]),
			'meanPft2': float(means[key]['pft2']) / means[key]['count'],
			'meanSqft': means[key]['sqft'] / means[key]['count'],
			'count': means[key]['count']
		}
	else:
		totals[key]['meanRent'] = means[key]['rent'] / means[key]['count']
		totals[key]['meanPft2'] = float(means[key]['pft2']) / means[key]['count']
		totals[key]['meanSqft'] = means[key]['sqft'] / means[key]['count']
		totals[key]['count'] = means[key]['count']

print json.dumps(totals)