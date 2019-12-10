import React from 'react';
import DataPage from '../../components/DataPage';


class ACLList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:  {
        'REMOTE_MANAGEMENT2': [
          {
            id: 0,
            data: ["10.10.10.10/23", "SSH", "Test decription of what could actually go here"],
          },
          {
            id: 1,
            data: ["10.10.10.11/23", "SSH", "Test decription of what could actuall go here"],
          },
          {
            id: 2,
            data: ["10.10.10.12/23", "SNMP", "Test decription of what could actuall go here"],
          },
        ],
        'REMOTE_MANAGEMENT': [
          {
            id: 0,
            data: ["10.10.10.10/23", "SSH", "Test decription of what could actually go here"],
          },
          {
            id: 1,
            data: ["10.10.10.11/23", "SSH", "Test decription of what could actuall go here"],
          },
          {
            id: 2,
            data: ["10.10.10.12/23", "SNMP", "Test decription of what could actuall go here"],
          },
        ],
      },
    };
  }

  create = () => {
    console.log('Create')
  }

  delete = () => {
    console.log('Delete');
  }

  update = () => {
    console.log('Update');
  }


  render() {
    const headers = [
      { id: 'ip', label: 'IP', minWidth: 80, align: 'left' },
      { id: 'allowed', label: 'Allowed', minWidth: 50, align: 'left' },
      { id: 'description', label: 'Description', minWidth: 250, align: 'left' },
      { id: 'action', label: 'Actions', minWidth: 50, align: 'left' },
    ];
    const forms = [
      {name: 'IP', id: 'ip', index :0, description: 'IP Address'},
      {name: 'Allowed', id: 'allowed', index: 1,  description: 'Type of Allowed'},
      {name: 'Description', id: 'description', index: 2,  description: 'Description'},
      {name: 'Description', id: 'description', index: 3,  description: 'Key to Encrypt'},
    ]
    const actions = {
      'create': this.create,
      'update': this.update,
      'delete': this.delete
    }
    const tables = ['REMOTE_MANAGEMENT2', "REMOTE_MANAGEMENT"]
    return (
      <div>
        <DataPage
          title = 'ACL Management'
          headers = {headers}
          data = {this.state.data}
          forms = {forms}
          hasCreateTable = {true}
          actions = {actions}
          tables = {tables}
        />
      </div>

    );
  }

}



export default ACLList;
