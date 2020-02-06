import json
import sys
import re

PATCH = 'PATCH:'
MAJOR = 'MAJOR:'
MINOR = 'MINOR:'
x = 0
y = 1
z = 2

def main():
    merge_message = sys.argv[1]
    pattern = r'^Merge branch \'.+\' (.*) See merge request.*$'
    commit_message = re.search(pattern, merge_message).group(1)

    print('commit message: "' + commit_message + '"')

    package_file = open('./package.json', 'r+')
    package_json = json.loads(package_file.read())
    

    version = str(package_json['version'])
    print('previous version: "' + version + '"')
    # xyz = version.split('.') ## split version x.y.z into [x,y,z]
    # print(prefix)

    # ## determines which has changed, updates version accordingly
    # if prefix.upper() == PATCH:
    #     z_version = int(xyz[z]) + 1
    #     xyz[z] = str(z_version)
    # elif prefix.upper() == MINOR:
    #     y_version = int(xyz[y]) + 1
    #     xyz[y] =  str(y_version)
    # elif prefix.upper() == MAJOR:
    #     x_version = int(xyz[x]) + 1
    #     xyz[x] =  str(x_version)
    # else:
    #     print('Version is not updated.')
    #     exit(1)

    # ## write back to package.json
    # version = '.'.join(xyz)
    # data['version'] = version
    # with open(file_path, 'w') as package_file:
    #     json.dump(data, package_file, indent = 4)
    #     # package_file.close()


if __name__ == '__main__':
    main()
