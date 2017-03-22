import os 
import sys

def network_directory_parent():
	dir_path = os.getcwd()
	path_length=len(dir_path)
	parent_path = dir_path[0:path_length-24]
	os.chdir(parent_path)

def network_directory_return():
	dir_path = os.getcwd()
	dir_path = dir_path + "/twitter-network-creator"
	os.chdir(dir_path)






