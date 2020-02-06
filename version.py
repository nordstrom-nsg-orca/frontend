import json
import sys
import re

print sys.argv

merge_message = sys.argv[1]
commit_message = merge_message.split('\\n\\n')[1].lower()
prefix = re.search(r'^(.*):.*$', commit_message).group(1)

print('commit message: "' + commit_message + '"')
print('prefix: "' + prefix + '"')

package_file = open('./package.json', 'r+')
package_json = json.loads(package_file.read())

version = package_json['version']
print('previous version: "' + version + '"')

ind = 'majorminorpatch'.find(prefix) / 5
semvar = version.split('.')
semvar[ind] = str(int(semvar[ind]) + 1)

package_json['version'] = '.'.join(semvar)
print('new version: "' + package_json['version'] + '"')    

package_file.seek(0)
json.dump(package_json, package_file, indent=4)
package_file.close()
