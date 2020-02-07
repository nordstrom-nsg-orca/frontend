import { encode } from 'base-64';

export async function getGroupsPermission () {
  const groups = await getGroups('nsg', process.env.REACT_APP_INFOBLOX_PASS);
  if (!groups) return null;

  const permissions = await getPermissions('nsg', process.env.REACT_APP_INFOBLOX_PASS);
  if (!permissions) return null;

  const permissionByRole = { };
  for (var i = 0; i < permissions.length; i++) {
    const role = permissions[i].role;
    if (role in permissionByRole) {
      var temp = permissionByRole[role];
      temp.push(permissions[i]);
      permissionByRole[role] = temp;
    } else permissionByRole[role] = [];
  }

  const data = {};
  for (i = 0; i < groups.length; i++) {
    const name = groups[i].name;
    const roles = groups[i].roles;
    for (var j = 0; j < roles.length; j++) {
      const role = roles[j];
      if (!(role in permissionByRole)) continue;
      if (name in data) {
        temp = data[name];
        temp.concat(permissionByRole[role]);
        data[name] = temp;
      } else data[name] = permissionByRole[role];
    }
  }
  return {
    json: [{
      results: {
        data: formatData(data),
        headers: ['permission', 'resource_type', 'role']
      }
    }]
  };
}

function formatData (results) {
  const finalData = [];
  var index = 0;
  for (var group in results) {
    const permissions = results[group];
    for (var i = 0; i < permissions.length; i++) permissions[i].id = i;
    const data = { id: index++, name: group, rows: permissions };
    finalData.push(data);
  }
  return finalData;
}

async function getPermissions (username, password) {
  try {
    const opts = {
      method: 'GET',
      headers: { Authorization: 'Basic ' + encode(username + ':' + password) }
    };
    const response = await fetch('/infoblox/permission', opts);
    return await response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getGroups (username, password) {
  try {
    const fields = '_return_fields=roles,name';
    const opts = {
      method: 'GET',
      headers: { Authorization: 'Basic ' + encode(username + ':' + password) }
    };
    const response = await fetch(`/infoblox/admingroup?${fields}`, opts);
    return await response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}
