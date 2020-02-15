import React from 'react';
import DataPage from 'components/DataPage';
import { postToSlack } from 'util/reporter.js';

class InfobloxGroup extends React.Component {
  loadData = async () => {
    return this.getGroupPermission();
  }

  getGroupPermission = async () => {
    let response;
    try {
      const url = `${process.env.REACT_APP_DB_API_URL}/infoblox`;
      const opts = {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
      const fields = '_return_fields=roles,name';
      response = await fetch(`${url}/admingroup?${fields}`, opts);
      let json = await response.json();
      const groups = json.data;
      response = await fetch(`${url}/permission`, opts);
      json = await response.json();
      const permissions = json.data;

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
            headers: [
              { column_name: "permission", data_type: "character varying" },
              { column_name: "resource_type", data_type: "character varying" },
              { column_name: "role", data_type: "character varying" }
            ]
          }
        }]
      };
    } catch (err) {
      console.log(err);
      const message = `ErrorMessage:* ${response.statusText}\n*ErrorCode:* ${response.status}`;
      await postToSlack(window.location, message);
      return null;
    }

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
