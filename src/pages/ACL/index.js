import React from 'react';
import DataPage from '../../components/DataPage';

const DEFAULT_TABLE_NAME = 'Name';

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
      tables: ['REMOTE_MANAGEMENT2', "REMOTE_MANAGEMENT"],
      currentNewTableCount: 0,
    };
  }

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
      { id: 'ip', label: 'IP', minWidth: 80, align: 'left', index: 0},
      { id: 'allowed', label: 'Allowed', minWidth: 50, align: 'left', index: 1 },
      { id: 'description', label: 'Description', minWidth: 200, align: 'left', index: 2 },
      { id: 'action', label: 'Actions', minWidth: 150, align: 'left' },
    ];

    const actions = {
      'create': this.create,
      'update': this.update,
      'delete': this.delete,
      'createTable': this.createTable,
      'deleteTable': this.deleteTable,
      'updateTable': this.updateTable,
    };
    // const tables = ['REMOTE_MANAGEMENT2', "REMOTE_MANAGEMENT"]
    return (
      <div>
        <DataPage
          title = 'ACL Management'
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



export default ACLList;
