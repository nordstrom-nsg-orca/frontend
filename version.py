import json
import sys


def main(args):

    commit_message = args
    print(commit_message)
    with open('./package.json', 'r') as package_file:
        package = package_file.read()

    data = json.loads(package)
    print(data)

if __name__ == '__main__':
    main(sys.argv[1:])
