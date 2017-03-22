# All this created by Ezra Edgerton June 2016 - March 2017 for the University of Cincinnati. Copyright Free Software Copyright etc. to me.
#
#
import sys
import os
import json
#import allinitialformat
import secondaryformat
import twitter_folder_change



start_day =  int(sys.argv[1])
end_day = int(sys.argv[2])


argument_len = len(sys.argv)

search_type = sys.argv[argument_len - 1]

def search(values, searchFor):
    for k in values:
    	if k == searchFor:
    		return k
    return -1 

search_terms = []

filename = ''
start_args = 3
all_search = False
if sys.argv[3] == '-a' or sys.argv[3] == '-all':
	start_args = 4
	all_search = True

for i in range(start_args, argument_len - 1):
	filename = filename + sys.argv[i]
	
for i in range(start_args, argument_len - 1):
	search_terms.append(sys.argv[i])

if all_search:
	search_terms_two = search_terms
else:
	search_terms_two = [search_terms[0]]


print filename

if all_search:
		filename = 'all' + filename

print search_terms_two


twitter_folder_change.network_directory_parent()


for day in range(start_day, end_day):
	tweets=[]
	if day < 10:
		daystring='0' + str(day)
	else:
		daystring=str(day)
	for hour in range(0, 24):
	#test for hour in range(6, 18):
		if hour < 10:
				hourstring='0'+str(hour)
		else:
			hourstring=str(hour)
		for minute in os.listdir(daystring+'/'+hourstring):
			if minute.startswith('.'):
				continue
			if minute < 10:
				minutestring='0'+str(minute)
			else:
				minutestring=str(minute)
			print str(day)+'/'+hourstring+'/'+minutestring
			for line in open(daystring+'/'+hourstring+'/'+minutestring, 'r'):
				tweet = json.loads(line)
				for search_term in search_terms_two:
					if search_type == 'username':
						if 'user' not in tweet:
							continue
						if tweet['user']['screen_name'].find(search_term) != -1:
							if tweets.find(tweet) == -1:
								print tweet["text"]
								print tweet['user']['screen_name']
								tweets.append(tweet)
					if search_type == 'text':
						if "text" not in tweet:
							continue
						if tweet["text"].find(search_term) != -1:
							if search(tweets, tweet) == -1:
								print tweet["text"]
								tweets.append(tweet)
					if search_type == 'hashtag':
						if "entities" not in tweet:
							continue
						entities = tweet['entities']
						
						if "hashtags" not in entities:
							continue
						for tag in entities['hashtags']:
							if tag['text'] == search_term:
								if search(tweets, tweet) == -1:
									print tweet['text']
									tweets.append(tweet)

	
	with open('twitter-network-creator/filtered_data/'+str(day)+filename + '.json', 'w') as outfile:
		json.dump(tweets, outfile, indent=4)

#allinitialformat.firstformat(start_day, end_day, search_terms, filename, search_type)


