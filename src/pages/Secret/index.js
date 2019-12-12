import React from 'react';
import DataPage from '../../components/DataPage';

const DEFAULT_TABLE_NAME = 'Name';

class Secret extends React.Component {

  constructor(props) {
    super();
    this.state = {
      page: 0,
      rowsPerPage: 10,
      currentNewTableCount: 0,
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


  /**
  * Creates a new data in a specific table.
  * @param: tableName - name of the table
  * @param: id - new id of the data
  * @param: createdData - new data value to be created
  */
  create = (tableName, id, createdData) => {
    var copy = this.state.data;
    var data = copy[tableName];
    data.push({id: id, data: createdData});
    copy[tableName] = data;
    this.setState({data: copy});
  }

  /**
  * Updates an existing data value in a table
  * @param: tableName - name of the table
  * @param: id -  id of the data
  * @param: updatedData - updated data value
  */
  update = (tableName, id, updatedData) => {
    var copy = this.state.data;
    copy[tableName].map(value => {
      if (id === value.id) {
        value.data = updatedData;
      }
    });
    this.setState({data: copy});
  }

  /**
  * Deletes an existing data.
  * @param: tableName - name of the table
  * @param: id - id of the data
  */
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

  /**
  * Creates a new table.
  */
  createTable = () => {
    var copyTables = this.state.tables;
    var copyData = this.state.data;
    var tableName;
    var currentNewTableCount = this.state.currentNewTableCount;
    if (currentNewTableCount == 0) {
      tableName = DEFAULT_TABLE_NAME;
    } else { tableName = DEFAULT_TABLE_NAME + '' + currentNewTableCount; }

    copyTables.push(tableName);
    copyData[tableName] = [];
    this.setState({tables: copyTables, data: copyData, currentNewTableCount: currentNewTableCount + 1});
  }

  /**
  * Deletes a table.
  * @param: tableName - name of the table
  * @param: id - new id of the data
  * @param: createdData - new data value to be created
  */
  deleteTable = (tableName) => {
    var currentNewTableCount = this.state.currentNewTableCount;
    if (tableName.includes(DEFAULT_TABLE_NAME)) {
      currentNewTableCount--;
    }
    var copyData = this.state.data;
    var copyTables = this.state.tables;
    delete copyData[tableName];
    var index = copyTables.indexOf(tableName);
    copyTables.splice(index, 1);
    this.setState({tables: copyTables, data: copyData, currentNewTableCount: currentNewTableCount});
  }

  /**
  * Updates a table.
  * @param: oldTableName - old name of the table
  * @param: newTableName - new name of the table
  */
  updateTable = (oldTableName, newTableName) => {
    if (oldTableName === newTableName) return;
    var copy = this.state.data;
    var valueCopy = copy[oldTableName];
    copy[newTableName] = valueCopy;
    delete copy[oldTableName];
    var currentTables = this.state.tables;
    currentTables[currentTables.indexOf(oldTableName)] = newTableName;
    this.setState({tables: currentTables, data: copy});
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
      'delete': this.delete,
      'createTable': this.createTable,
      'deleteTable': this.deleteTable,
      'updateTable': this.updateTable,
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
