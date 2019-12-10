import React from 'react';
import DataPage from '../../components/DataPage';

const data = [
  {id: 0, data: ['LiveAction_API', 'nsg']},
  {id: 1, data: ['LiveAction_API', 'nsg2']},
  {id: 2, data: ['LiveAction_API', 'nsg3']}
];


class Secret extends React.Component {

  constructor(props) {
    super();
    this.state = {
      page: 0,
      rowsPerPage: 10,
      data: [
        {id: 0, data: ['LiveAction_API', 'nsg']},
        {id: 1, data: ['LiveAction_API', 'nsg2']},
        {id: 2, data: ['LiveAction_API', 'nsg3']}
      ]
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

  }

  delete = (event) => {
    console.log(event);
  }



  render() {
    const columns = [
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
