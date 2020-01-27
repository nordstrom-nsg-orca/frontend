import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import InputBase from '@material-ui/core/InputBase';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import Typography from '@material-ui/core/Typography';
import Form from './form.js';
import Table from './table.js';
import style from "./style.js";


class DataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formAction: null,
      formOpen: false,
      formHeaders: [],
      formData: null
    };
    this.actionButtons = [
      {name: 'update', icon: <CreateRoundedIcon style={{fontSize: '20px'}} />},
      {name: 'delete', icon: <DeleteRoundedIcon style={{fontSize: '20px'}} />},
    ];
  }

  handleCreate = (tableName) => {
    this.setState({formOpen: true, currentTableName: tableName});
  }

  handleFormExit = (action) => {
    if (action === 'update') {
      this.props.actions.update(this.state.formData);
    } else if (action === 'delete')
      this.props.actions.delete(this.state.formData);
    else if (action === 'create')
      this.props.actions.create(this.state.formData, this.state.currentTableName);

    this.setState({
      // formAction: null,
      formOpen: false,
      // currentID: null,
      // formData: null,
      // currentTableName: null,
      // currentTableData: null,
    });
  }

  handleAction = (action, tableId, id, data) => {
    if (action === 'create') {
      data = {};
      for (let i in this.props.headers)
        data[this.props.headers[i]] = '';
    } else if (action === 'createTable') {
      data = {};
      for (let i in this.props.parentheaders)
        data[this.props.parentheaders[i]] = '';
    }
    let headers = (action.includes('Table'))? this.props.parentheaders : this.props.headers;
    this.setState({
      formOpen: true,
      formAction: action,
      formHeaders: headers,
      formData: data,
      currentID: id,
      currentTableName: tableId
    });
  }

  handleInput = (index, event) => {
    var data;
    if (this.state.isAdd && this.state.formData === null) {
      data = [];
    } else {
      data = JSON.parse(JSON.stringify(this.state.formData));
    }
    data[index] = event.target.value;
    this.setState({formData: data});

  }

  render() {
    const { classes } = this.props;


    return (
      <div className={classes.root}>

        <Form
            open={this.state.formOpen}
            action={this.state.formAction}
            title={this.props.title}
            headers={this.state.formHeaders}
            data={this.state.formData}
            handleInput={this.handleInput}
            handleFormExit={this.handleFormExit}
            classes={classes}
        />

        <div style ={{display: 'flex'}}>
          <Typography variant="h4">{this.props.title}</Typography>

          <div style={{marginLeft: 'auto'}}>

            <SearchRoundedIcon className={classes.searchIcon} />
            <InputBase
              placeholder="Search"
              className={classes.searchInput}
              onChange = {this.props.handleSearch}
            />
          </div>
        </div>

        {this.props.data.map((table, index) =>
          <Table
            key={index}
            deleteTable={this.deleteTable}
            headers={this.props.headers}
            data={table}
            actionButtons={this.actionButtons}
            handleAction={this.handleAction}
            handleCreate={this.handleCreate}
            classes={classes}
          />
        )}
      </div>
    );
  }
}


export default withStyles(style)(DataPage);
