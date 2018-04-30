import os
import json
# https://github.com/avakar/pycson
import cson


# returns [(color, name, key)]
def getFolders():
    with open('../Boostnote/boostnote.json', 'r') as f:
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

def buildFolderJson():
    folders = getFolders()
    print(json.dumps(folders))
    with open('./folders.json', 'w+') as outfile:
        json.dump(folders, outfile)

def buildNotesJson():
    notes = []
    rootdir = ('../Boostnote/notes')
    for folder, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.cson'):
                fullpath = os.path.join(folder, file)
                with open(fullpath, 'r') as f:
                    #fullpath = os.path.join(folder, file)
                    note = cson.load(f)
                    notes.append(note)
    print(json.dumps(notes))
    with open('./notes.json', 'w+') as outfile:
        json.dump(notes, outfile)


buildFolderJson()
buildNotesJson()

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



#getFolderKey('SysAdmin')
