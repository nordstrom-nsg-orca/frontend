import json
import sys

PATCH = 'PATCH'
MAJOR = 'MAJOR'
MINOR = 'MINOR'
x = 0
y = 1
z = 3
file_path = './package.json'


def main(args):

    commit_message = args
    prefix = commit_message[0]
    with open(file_path, 'r') as package_file:
        package = package_file.read()

    data = json.loads(package)
    version = str(data['version'])
    xyz = version.split('.') ## split version x.y.z into [x,y,z]

    ## determines which has changed, updates version accordingly
    if prefix.upper() == PATCH:
        z_version = int(xyz[z]) + 1
        xyz[z] = str(z_version)
    elif prefix.upper() == MINOR:
        y_version = int(xyz[y]) + 1
        xyz[y] =  str(y_version)
    elif prefix.upper() == MAJOR:
        x_version = int(xyz[x]) + 1
        xyz[x] =  str(x_version)
    else:
        print('Version is not updated.')
        exit(1)

    ## write back to package.json
    version = '.'.join(xyz)
    data['version'] = version
    print(data)
    with open(file_path, 'w') as package_file:
        json.dump(data, package_file)


if __name__ == '__main__':
    main(sys.argv[1:])
