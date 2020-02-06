import { encode } from "base-64";

export async function getGroupsPermission () {
  const groups = await getGroups('nsg', 'nsgseattle');
  const results = [];
  if (groups) {
    for (var index in groups) {
      const roles = groups[index].roles;
      const grp = groups[index];
      if (roles.length > 0) {
        for (var i = 0; i < roles.length; i++) {
          const role = roles[i];
          const permission = await getPermissionByRole('nsg', 'nsgseattle', role);
          if (permission) {
            if ('permission' in grp) {
              const temp = grp.permission;
              temp.concat(permission);
              grp.permission = temp;
            }
            else grp.permission = permission;
            groups[index] = grp;
          }
        }
        results.push(grp);
      }

    }
    return {
      json: [{
        results: {
          data: formatData(results),
          headers: ['permission', 'resource_type', 'role']
        }
      }]
    };
  } else return null;
}

function formatData (results) {
  const finalData = [];
  for (var i = 0; i < results.length; i++) {
    const temp = results[i];
    for (var j = 0; j < temp.permission.length; j++) {
      temp.permission[j].id = j;
    }
    const data = { id: i, name: temp.name, rows: temp.permission};
    finalData.push(data);
  }
  return finalData;
}


async function getPermissionByRole (username, password, role) {
  try {
    const fields = `role=${role}`;
    const opts = {
      method: 'GET',
      headers: { Authorization: 'Basic ' + encode(username + ':' + password) }
    };
    const response = await fetch(`/permission?${fields}`, opts)
    return await response.json();
  } catch(err) {
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
    const response = await fetch(`/admingroup?${fields}`, opts)
    return await response.json()
  } catch (err) {
    console.log(err);
    return null;
  }
}
