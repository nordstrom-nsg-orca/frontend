import React from 'react';
import SecretTable from './SecretTable';


class Secret extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      isAdd: false,
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    // this.handleActionButtons = this.handleActionButtons.bind(this);
    // this.handleModal = this.handleModal.bind(this);
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
    }
  };

  handleDialogExit = () => {
    this.setState({isAdd: false});

  }

  render() {
    return (
      <div>

        <SecretTable handleActionButtons = {this.handleActionButtons} isAdd = {this.state.isAdd} handleDialogExit = {this.handleDialogExit}/>
      </div>

    );
  }
}

export default Secret;
