import React from 'react';
import DataPage from 'components/DataPage';
import { encode } from 'base-64';
import { postToSlack } from 'util/reporter.js';

class InfobloxGroup extends React.Component {
  loadData = async () => {
    return this.getGroupsPermission();
  }

  getGroupsPermission = async () => {
    const groups = await this.getGroups('nsg', process.env.REACT_APP_INFOBLOX_PASS);
    if (!groups) return null;
    const permissions = await this.getPermissions('nsg', process.env.REACT_APP_INFOBLOX_PASS);
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
          data: this.formatData(data),
          headers: ['permission', 'resource_type', 'role']
        }
      }]
    };
  }

  formatData = (results) => {
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

  getPermissions = async (username, password) => {
    let response;
    try {
      const opts = {
        method: 'GET',
        headers: { Authorization: 'Basic ' + encode(username + ':' + password) }
      };
      // response = await fetch('/api/infoblox/permission', opts);
      response = await fetch('https://infoblox.nordstrom.net/wapi/v2.10.3/permission', opts);
      return await response.json();
    } catch (err) {
      const message = `ErrorMessage:* ${err}\n*ErrorCode:* ${response.status}`;
      await postToSlack(window.location, message);
      return null;
    }
  }

  getGroups = async (username, password) => {
    let response;
    try {
      const fields = '_return_fields=roles,name';
      const opts = {
        method: 'GET',
        headers: { Authorization: 'Basic ' + encode(username + ':' + password) }
      };
      // response = await fetch(`/api/infoblox/admingroup?${fields}`, opts);
      response = await fetch(`https://infoblox.nordstrom.net/wapi/v2.10.3/admingroup?${fields}`, opts);
      return await response.json();
    } catch (err) {
      const message = `ErrorMessage:* ${err}\n*ErrorCode:* ${response.status}`;
      await postToSlack(window.location, message);
      return null;
    }
  }

  render () {
    return (
      <div>
        <DataPage
          title='Group Permission'
          loadData={this.loadData}
        />
      </div>
    );
  }
}

export default InfobloxGroup;
