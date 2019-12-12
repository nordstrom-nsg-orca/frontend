import React from 'react';
import DataPage from '../../components/DataPage';

class Secret extends React.Component {

  constructor(props) {
    super();
    this.state = {
      page: 0,
      rowsPerPage: 10,
      data: {
        'API Keys': [
          {id: 0, data: ['LiveAction_API', 'nsg']},
          {id: 1, data: ['CLEARPASS_API', 'nsg2']},
          {id: 2, data: ['AWS_API', 'nsg3']}
        ],
      },
      tables: ['API Keys']
    };
  }
  handleChangePage(event, newPage)  {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage(event) {
    this.setState({page: 0, rowsPerPage: event.target.value});

  };



  create = (tableName, id, createdData) => {
    var copy = this.state.data;
    var data = copy[tableName];
    data.push({id: id, data: createdData});
    copy[tableName] = data;
    // console.log(copy);
    this.setState({data: copy});
  }

  update = (tableName, id, updatedData) => {
    var copy = this.state.data;
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
      { id: 'name', label: 'Name', minWidth: 100, align: 'left', index: 0},
      { id: 'key', label: 'Key', minWidth: 200, align: 'left', index: 1 },
      { id: 'action', label: 'Actions', minWidth: 50, align: 'left' },
    ];

    const actions = {
      'create': this.create,
      'update': this.update,
      'delete': this.delete
    };
    // const tables = ['API Keys'];
    return (
      <div>
        <DataPage
          title = 'Secrets'
          headers = {headers}
          data = {this.state.data}
          hasCreateTable = {true}
          actions = {actions}
          tables = {this.state.tables}
        />
      </div>

    );
  }
}

export default Secret;
