import json
import twitter_folder_change

def search(values, searchFor):
    for k in values:
    	if k['name'] == searchFor:
    		return k
    return -1

def extract_index(json):
	return json['index']


def secondformat(start_day, end_day, search_terms, filename):
	#with open('twitter-network-creator/half_formatted_data/half_formatted'+ str(start_day) + '-' + str(end_day) + '-' + filename + '.json') as data_file: 
	with open('half_formatted_data/half_formatted'+ str(start_day) + '-' + str(end_day) + '-' + filename + '.json') as data_file: 
	
		data = json.load(data_file)
		data.sort(key=extract_index)
		links=[]
		for d in data:
			for l in d['links']:
				searchval=search(data,l)
				if searchval != -1:
					link={
						'source': searchval['index'],
						'target': d['index'],
						'value': 1.0
					}
					searchval['retweets'] = searchval['retweets'] + 1
					links.append(link)

		formattedthing ={
			'terms': search_terms,
			'nodes': data,
			'links': links
		}
		
		#with open('twitter-network-creator/formatted_data/formatted' + str(start_day) + '-' + str(end_day) + '-' + filename + '.json', 'w') as outfile:
		with open('formatted_data/formatted' + str(start_day) + '-' + str(end_day) + '-' + filename + '.json', 'w') as outfile:
			json.dump(formattedthing, outfile)#, indent=4)





