import React from 'react';
import DataPage from '../../components/DataPage';

const data = [
  ['LiveAction_API', 'nsg'],
  ['LiveAction_API', 'nsg2'],
  ['LiveAction_API', 'nsg3']
];


class Secret extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
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

  create = (event) => {
    console.log('Creating...');
  }

  update = (event) => {
    console.log('Updating...');
  }

  delete = (event) => {
    console.log('Deleting..');
  }



  render() {
    const columns = [
      { id: 'name', label: 'Name', minWidth: 100, align: 'left' },
      { id: 'key', label: 'Key', minWidth: 250, align: 'left' },
      { id: 'action', label: 'Actions', minWidth: 150, align: 'left' },
    ];
    const forms = [
      {name: 'Name', id: 'name', description: 'Key\'s name'},
      {name: 'Key', id: 'key', description: 'Key to Encrypt'},
    ]
    const actions = {
      create: this.create,
      update: this.update,
      delete: this.delete
    }
    return (
      <div>
        <DataPage
          title = 'Secrets'
          headers = {columns}
          data = {data}
          forms = {forms}
          handleActionButtons = {this.handleActionButtons}
          hasCreateTable = {false}
          actions = {actions}
        />
      </div>

    );
  }
}

export default Secret;
