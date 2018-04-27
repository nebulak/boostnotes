import json
# https://github.com/avakar/pycson
import cson


# returns [(color, name, key)]
def getFolders():
    with open('boostnote.json', 'r') as f:
        array = json.load(f)
        #print array['folders'][1]['color']
        return array['folders']
        # print (array['folders'])


def getFolderKey(folder_name):
    folders = getFolders()

    for i in range(len(folders)):
        if folders[i]['name'] == folder_name:
            print(folders[i]['key'])


def getNotesInFolder(folder_name):
    key = getFolderKey(folder_name)
    # //TODO: iterate over all files, check if file is part of folder


'''
db structure:
tables:
- notes
- tags
- folders

table-contents:
notes:
- createdAt
- updatedAt
- type
- folder
- title
- content
- tags
- isStarred
- isTrashed

tags:
- name

folders:
- name
- key
- color

'''


getFolderKey('SysAdmin')
