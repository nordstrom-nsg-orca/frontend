import React from 'react';
import DataPage from '../../components/DataPage';

class Secret extends React.Component {

  constructor(props) {
    super();
    this.state = {
      page: 0,
      rowsPerPage: 10,
      data: {
        'NSG Mystery': [
          {id: 0, data: ['LiveAction_API', 'nsg']},
          {id: 1, data: ['LiveAction_API', 'nsg2']},
          {id: 2, data: ['LiveAction_API', 'nsg3']}
        ],
      }
    };
  }
  handleChangePage(event, newPage)  {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage(event) {
    this.setState({page: 0, rowsPerPage: event.target.value});

  };

  handleActionButtons = (action, event) => {
    if (action === 'add') {
      this.setState({isAdd: true});
    } else if (action === 'edit') {

    }
  }

  create = (tableName, id, createdData) => {
    var copy = JSON.parse(JSON.stringify(this.state.data));
    var data = copy[tableName];
    data.push({id: id, data: createdData});
    copy[tableName] = data;
    this.setState({data: copy});
  }

  update = (tableName, id, updatedData) => {
    var copy = JSON.parse(JSON.stringify(this.state.data));
    copy[tableName].map(value => {
      if (id === value.id) {
        value.data = updatedData;
      }
    });
    this.setState({data: copy});
  }

  delete = (tableName, id) => {
    var copy = [];
    var tempData = this.state.data;
    tempData[tableName].map(value => {
      if (id !== value.id) {
        copy.push({id: value.id, data: value.data});
      }
    });
    tempData[tableName] = copy;
    this.setState({data: tempData});
  }



  render() {
    const headers = [
      { id: 'name', label: 'Name', minWidth: 100, align: 'left' },
      { id: 'key', label: 'Key', minWidth: 250, align: 'left' },
      { id: 'action', label: 'Actions', minWidth: 150, align: 'left' },
    ];
    const forms = [
      {name: 'Name', id: 'name', index :0, description: 'Key\'s name'},
      {name: 'Key', id: 'key', index: 1,  description: 'Key to Encrypt'},
    ]
    const actions = {
      'create': this.create,
      'update': this.update,
      'delete': this.delete
    }
    const tables = ['NSG Mystery']
    return (
      <div>
        <DataPage
          title = 'Secrets'
          headers = {headers}
          data = {this.state.data}
          forms = {forms}
          handleActionButtons = {this.handleActionButtons}
          hasCreateTable = {false}
          actions = {actions}
          tables = {tables}
        />
      </div>

    );
  }
}

export default Secret;
