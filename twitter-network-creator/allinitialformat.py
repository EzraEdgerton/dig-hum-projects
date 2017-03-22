"""
allininitialformat.py 

for formatting the appropriate filtered data generated from allsearch.py

USAGE:
first argument: 
		the filename(excluding the day at the beginning and the .json at the end)
		of the filtered data you wish to format

second through fourth (or fifth) from last argument:
		all of the terms you wish to create the formatted data for

fourth from last argument is an optional:
		if it is '-range' then allinitialformat will format the data in the day range as 
		one file.

		if not included then allinitialformat will create one formatted file for each 
		day in the range provided

third from last argument:
		search type, either 'hashtag', 'text' or 'username'

second from last argument:
		first day in range

last argument: 
		last day in range (inclusive)

e.g.

if the data is stored in  files like 
	9allMondaysMondaysAreTheWorstBeginningOfTheWeekTwitterDays.json

and I want to format data for MondaysAreTheWorst and TwitterDays hashtags
from the 3rd to the 13th with each day stored in its own file I would run:

	python allinitialformat.py allMondaysMondaysAreTheWorstBeginningOfTheWeekTwitterDays MondaysAreTheWorst TwitterDays hashtag 3 14

If I wanted to do that same thing but store the entire range in one formatted file I would run:

	python allinitialformat.py allMondaysMondaysAreTheWorstBeginningOfTheWeekTwitterDays MondaysAreTheWorst TwitterDays -range hashtag 3 14

Stores data in the formatted_data folder

"""
import sys
import json
import os
import secondaryformat
import twitter_folder_change


arg_len = len(sys.argv)

day_range = False
subtractor = 3
if sys.argv[arg_len - 4] == '-range':
	day_range = True
	subtractor = 4

start_day =  int(sys.argv[arg_len - 2])
end_day = int(sys.argv[arg_len - 1])
searchtype = sys.argv[arg_len - 3]

filename = sys.argv[1]
terms = []


for t in range(2, arg_len - subtractor):
	terms.append(sys.argv[t])

#print terms

def typecheck(term_type, term):
	if term_type == 'hashtag':
		return term
	elif term_type == 'username' or term_type == 'text':
		return term
	else:
		sys.exit('USAGE: use either "hashtag", "handle", or "text" for type of term')

def search(values, searchFor):
	for k in values:
		if k['name'] == searchFor:
			return k
	return -1


def additional_group(value, additional_terms,term_type):
	#print value['text']
	terms_number = len(additional_terms)
	group = 0
	finder = ''
	group_list = []
	terms_list = []
	for i in range(0, terms_number):
		if term_type == 'text':
			val = value['text'].find(additional_terms[i])
			if val!= -1:
				#group = group + i
				#finder = value['text'][val: val + 2]
				group_list.append(i)
				terms_list.append(additional_terms[i])
				#print finder
		if term_type == 'hashtag':
			for tag in value['entities']['hashtags']:
				if tag['text'] == additional_terms[i]:
					group_list.append(i)
					terms_list.append(additional_terms[i])
		if term_type == 'username':
			if value['user']['screen_name'].find(additional_terms[i]) != -1:
				group_list.append(i)
				terms_list.append(additional_terms[i])
	#print terms_list
	return [group_list, terms_list]

def create_circle_lists(groups, list_of_terms, index):
	#print groups
	if len(groups) == 0:
		return []
	ratio = (float(1)/float(len(groups))) * len(list_of_terms)
	angles = []
	#print ratio
	for i in range(0, len(groups)):
		angles.append([i * ratio, (i + 1) * ratio, groups[i], 1, index])
	return angles

def combine_no_duplicates(first, second):
	for val1 in first:
		for val2 in second:
			if val1 == val2:
				second.remove(val2)
	return first + second

def firstformat(start_day, end_day, search_terms, filename, search_type):
	search_term = search_terms[0]
	additional_terms = search_terms
	day_user_data=[]
	index = 0
	for day in range(start_day, end_day):
		#with open('twitter-network-creator/filtered_data/'+str(day)+filename+'.json') as data_file:
		with open('filtered_data/'+str(day)+filename+'.json') as data_file:
		#with open('filtered_data/all10BlackLivesMatterAllLivesMatterMichaelBrownFergusonPolice.json') as data_file:	 
			data = json.load(data_file)
			for d in data:
				searchval=search(day_user_data, d['user']['screen_name'])
				sub_searched = additional_group(d, additional_terms, search_type)
				groups_in_tweet = sub_searched[0]
				if len(groups_in_tweet) == 0:
					continue
				terms_in_tweet = sub_searched[1]
				angles =  create_circle_lists(groups_in_tweet, search_terms, index)
				if 'created_at' in d:
					time_created = d['created_at']
				else:
					time_created = ''
				if searchval != -1:
					if 'retweeted_status' in d:
						searchval['links'].append(d['retweeted_status']['user']['screen_name'])
					searchval['score'] = searchval['score'] + 1
					searchval['text'].append(d['text'])
					searchval['tweets_in_text'] = combine_no_duplicates(searchval['tweets_in_text'], terms_in_tweet)#list(set(searchval['tweets_in_text']) - set(terms_in_tweet))
					searchval['group'] = combine_no_duplicates(searchval['group'], groups_in_tweet)
					searchval['angles'] = create_circle_lists(searchval['group'], search_terms, index)
					for angle in searchval['angles']:
						angle[3] = searchval['score']
					searchval['time'].append(time_created)
				else:
					if 'retweeted_status' not in d:
						thing={
							'text' : [d['text']],
							'name': d['user']['screen_name'],
							'score': 1,
							'links': [],
							'group' : groups_in_tweet,#additional_group(d, additional_terms, search_type),
							'url' : d['id'],
							'index' : index,
							'retweets' : 0,
							'angles' : angles,
							'tweets_in_text': terms_in_tweet,
							'time': [time_created]

							}
					else:
						thing={
							'text' : [d['text']],
							'name': d['user']['screen_name'],
							'score': 1,
							'links': [d['retweeted_status']['user']['screen_name']],
							'group' : groups_in_tweet,#additional_group(d, additional_terms, search_type),
							'url' : d['id'],
							'index' : index,
							'retweets' : 0,
							'angles' : angles,
							'tweets_in_text': terms_in_tweet,
							'time': [time_created]
							}
						addnode=search(day_user_data, d['retweeted_status']['user']['screen_name'])
						if addnode == -1:
							index = index + 1
							newnode={
								'text' : [d['text']],
								'name': d['retweeted_status']['user']['screen_name'],
								'score': 1,
								'links': [],
								'group' : groups_in_tweet,#additional_group(d, additional_terms, search_type),
								'url' : d['retweeted_status']['id'],
								'index' : index,
								'retweets' : 0,
								'angles' : angles,
								'tweets_in_text': terms_in_tweet,
								'time': [time_created]
								}
							day_user_data.append(newnode)
					index = index + 1
					day_user_data.append(thing)
		print day
	with open('half_formatted_data/half_formatted'+ str(start_day) + '-' + str(end_day) + '-' + filename +'.json', 'w') as outfile:
	#with open('twitter-network-creator/half_formatted_data/half_formatted'+ str(start_day) + '-' + str(end_day) + '-' + filename +'.json', 'w') as outfile:
		json.dump(day_user_data, outfile)
	secondaryformat.secondformat(start_day, end_day, search_terms, filename)


if day_range:
	firstformat(start_day, end_day, terms, filename, searchtype)
else:
	for day in range(start_day, end_day):
		firstformat(day, day + 1, terms, filename, searchtype)

