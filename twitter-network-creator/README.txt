PART 1 - Setup and unzip

1. Download file for the month you wish to explore. 

2. Unzip the tarball and copy the entire twitter-network-creator folder into the month folder. So if the month you downloaded is November 2014, then put it in the 11 folder that is within the 14 folder.

!!!!!!DO NOT change the name of the 'twitter-network-creator' folder.!!!!!!

3. Open terminal and make your working folder the one you just copied. (using 'cd *foldername*' to change and 'pwd' to see your current working directory. A helpful usage description is at the following link under 'File and Directory Commands' https://help.ubuntu.com/community/UsingTheTerminal )

4. input 'bash unzipper' into the terminal. This will take a minute as it unzips each of the individual data files for each minute in that month.


Part 2 - Filter the right range and format the json files.

1. Now that everything is set up and unzipped, choose your range of days and choose your search term.


2. To get the filtered data, run allsearch.py:

 	the first argument as the start day in the range you wish to search

 	the second argument as the end day in the range you wish to search  (inclusive)

 	the third term is an optional '-a' or '-all' which if included would run the search treating each of the subsequent search terms equally, rather than filtering out only tweets containing the first term.

 	the next arguments are the search terms you are looking for. If the search terms are hashtags (e.g. #BlackLivesMatter) exclude the hashtag. If this term includes spaces, every space must have a backslash immediately preceding it.

 	!!!! 
 	Remember, spaces  and special characters in terminal must be written with a preceding '\' otherwise they will be interpreted as seperate arguments.
 	If you wish to search for 'black lives matter,' then the proper input would be 'black\ lives\ matter'
 	!!!!

 	If you did not include the '-all' tag the first search term will be the main search term and each of the following search terms will be looking within tweets containing the main search term.

 	Otherwise, if the  '-all' tag is included, all tweets containing any of the search terms will be included

 	the final argument informs the program whether or not the search term is a hashtag, plain text in the tweet, or a username . If the search term is a hashtag or in the text, then the fourth argument should be 'text'. If the search term is a username then this argument should be 'username' 



EXAMPLES:

If I wanted to look at '#BlackLivesMatter' tweets from the third to the tenth of the month I would run:

	'python search.py 3 11 BlackLivesMatter hashtag'

for only the fifth of the month I would run:

	'python search.py 5 6 BlackLivesMatter hashtag'

If I wanted to look at tweets containing the phrase 'interesting find' in the first two weeks of a month I would run:

	'python search.py 1 15 interesting\ find text'

If I wanted to look at tweets by user '#BlackLivesMatter' for the first two weeks of a month, while changing node colors for tweets that also contain the tweets '#AllLivesMatter' and 'hello world' I would run:

	'python search.py 1 15 \#BlackLivesMatter \#AllLivesMatter hello\ world text'

And if I wanted to look at tweets for the first eight days of the month while changing node colors for tweets that contain '#BlackLivesMatter', '#AllLivesMatter,' '#ICantBreathe,' and '#HandsUpDontShoot' I would run:

	'python search.py 1 9 -a BlackLivesMatter AllLivesMatter 
	ICantBreathe HandsUpDontShoot hashtag'



!!!!If you want to use the older version, you still can use search.py unaltered, that readme is at searchREADME.txt


After this, your data will be filtered and stored in the filtered_data folder.

PART 3 – Format Data (NEW STEP):
Now it is time to format the data. Run allinitialformat.py whose usage is as follows:

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

Your data will be stored data in the formatted_data folder


Part 4 – Create Visualization

	1. Now that you've got the data file(s) formatted properly, you will need to copy 'all-vis.html' which is in the 'twitter-network-creator' folder, rename it(without spaces in the name), and open it with a text editor. Keep this new file in the 'twitter-network-creator' folder.

	You can change the settings on TextEdit to open the file and see the html encoding with this tutorial (http://osxdaily.com/2013/01/14/view-html-source-code-textedit-mac-os-x/) or you can download an outside text editor like Sublime Text (my preferred text editor).

	2. After opening this file, go to line 135 (in TextEdit you can do this by hitting command+l and entering the line number) and change the filepath from "formatted_data/formatted.json" to "formatted_data/" + the name of the file you just created in Part 2. (e.g I would make this new filepath "formatted_data/formatted1-2-#BlackLivesMatter.json")

	3. It is time to create a simple server for this web page to run on. Back in terminal (making sure you are still in the 'twitter-network-creator' folder), run the command 'python -m SimpleHTTPServer'. This will start a local server running on port 8000 (most likely). It will tell you what port it is running on.

	4. Go to your favorite web browser and navigate to 'localhost:8000/twitter.html', replacing the 8000 with the port that you are running on and the twitter.html with what you named your new .html file. 

	NOTE ON DAY RANGES:

	The new functionality (creating files for each day in a range) can be incorporated by naming the day files something simple with the day in the range at the start (i.e. renaming each of the files in formatted_data 1blmmikebrown.json, 2blmmikebrown.json etc). You can then add the name(without the preceding number) into the filepath at line 98 and make the range of numbers in line 109 go from the beginning to the end(inclusive) of your day range. If you make include $scope.day at the beginning of your file name path as it is in the sample all-vis.html file it will give you the option of switching files by using the dropdown selector.

		NOTE FOR Multiple Months:
			This is where things get a little complicated to explain. If you look at the all-vis-nov-dec.html for how to perhaps format things with leading nov and dec filenames. The relevant code is from lines 108-115 and 136-143. If you look at the data fetch line at 147 you can see how the getMonth function is called with the day to return the correct month name that you presumably named in your file.



FORMATTING BASIC DATA:

The basic data page is highly informative interactive overview of the tweet data that you made in filtered_data.

1. GENERATE THE BASIC DATA

run basic_stats.py its usage is as follows:

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

It Stores data in the basic_stats folder


NOTE ON MULTIPLE MONTHS

if you want to generate a file with a range of dates that passes through more than one month, the trouble will be with running basicstats.py on that day range.
I have found that by changing the leading day in the filtered_data files so that the days continue past the end of the month.

For example, if I were trying to generate basic stats for the range from August 28th to September 4th I would change the september file leading numbers to continue as if August had 35 days.

	so it would be:
	28thing.json
	29thing.json
	30thing.json
	31thing.json
	32thing.json //changed from 1thing.json
	33thing.json //changed from 2thing.json
	34thing.json //changed from 3thing.json
	35thing.json

Then when running basicstats.py your range would be 28 to 36

2. ALTER HTML AND VISUALIZE

Similarly to the all-vis.html alterations, change the filepath on line 157 to the name of the file you generated in the previous step.

Next you will want to change the date range of two of the graphs:
	 At line 300:
	  .x(d3.time.scale().domain([new Date(2014, 7, 9), new Date(2014, 7, 24)]))

	  You will have to change the numbers within the Date()s to the year, month and day range you generated the files with. Remember that the month starts at 0, so currently the range is from August 7th 2014 to August 24th 2014.

	 You will want to do the same for line 338.




