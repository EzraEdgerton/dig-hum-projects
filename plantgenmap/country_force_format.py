"""

creates country files for each of the fields in the plantgenmap folder.

stores each country file in country_force folder or (if focalspecies) in spec_country_force folder.



"""

import os
import json
import sys

openfiles = ['funding', 'authors', 'firstauthor', 'lastauthor', 'focalspecies']
openfiles_reasonable = ['funding', 'authors', 'firstauthor', 'lastauthor']
test = ['focalspecies']

fieldlist = openfiles_reasonable

#fieldlist = test

field_last = fieldlist[len(fieldlist) - 1]



def search_links_for_format(index, links):
	country_links = []
	for link in links:
		if link['source'] == index or link['target'] == index:
			country_links.append(link)
	return country_links

def format_country(country, data, field_name):

	country_name = country['properties']['name']
	country_index = country['index']
	countries = data[0]['cities']
	links = data[1]['links']

	co_links = search_links_for_format(country_index, links)

	nodes = [country]

	for link in co_links:
		if link['source'] == country_index and link['target'] == country_index:
			continue
		if link['source'] == country_index:
			nodes.append(countries[link['target']])
		if link['target'] == country_index:
			nodes.append(countries[link['source']])
	field_data = { 
		'nodes' : nodes,
		'links' : co_links,
		'field' : field_name
		
	}
	country_file_name = country_name.replace(' ', '_')

	folderstring = 'country_force/'
	if field_name == 'focalspecies':
		folderstring = 'spec_country_force/'

	country_file = open(folderstring + country_file_name + '.json', 'a')
	written = os.stat(folderstring + country_file_name + '.json').st_size == 0
	if written:
		country_file.write('[\n')
	if not written:
		country_file.write(',\n')

	json.dump(field_data, country_file, indent=4)
	if field_name == field_last:
		country_file.write('\n]')

	return -1

def format_force_field(filename):
	file = open(filename + '.json', 'r')

	file_data = json.load(file)

	for country in file_data[0]['cities']:
		print country['properties']['name']
		format_country(country, file_data, filename)


for file in fieldlist:
	format_force_field(file)


