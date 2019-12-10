import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import Form from './Form.js';
import Table from './Table.js';



const useStyles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
  addButton: {
    width: 30,
    height: 30,
    paddingBottom: 5
  },
  dialog: {
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
 },
 popover: {
    pointerEvents: 'none',
  },
  tableFooter: {
    align: 'center',
    justifyContent: 'center',
  },
  createNewTableButton: {
    marginTop: '20px',
    width: 35,
    height: 35
  }
});


class DataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAdd: false,
      isEdit: false,
      currentTables: null,
      currentTableIndex: null,
      currentData: null,
      currentID: null,
      currentTableName: null,
    };
  }

  componentWillMount() {
    this.setState({currentTables: [this.props.tables[0]], currentTableIndex: 0})
    // console.log(this.props.data[this.props.tables[0]]);
  }
  componentDidMount() {
    // this.setState({initialData: JSON.parse(JSON.stringify(this.props.data))});
    // console.log(this.state.currentTables);
  }

  componentDidUpdate() {
  }

  /**
  * Handles Event on Dialog buttons (eg. Cancel, Save, Update)
  */
  handleDialogExit = () => {
    if (this.state.isEdit) {
      this.props.actions.update(this.state.currentTableName, this.state.currentID, this.state.currentData);
    } else if (this.state.isAdd && this.state.currentData !== null && this.state.currentTableName !== null) {
      var id = this.props.data[this.state.currentTableName].length + 1;
      this.props.actions.create(this.state.currentTableName, id, this.state.currentData);
    }
    this.setState({isAdd: false, isEdit: false, currentID: null, currentData: null, currentTableName: null});
  }


  /**
  * Handles on Create button action.
  */
  handleCreate = (tableName) => {
      this.setState({isAdd: true, currentTableName: tableName});
  }


  /**
  * Handles on Update and Delete buttons action.
  * @param: name - name of the action (eg. update, delete)
  * @param: id - the id of the data.
  * @param: data - the list of data value.
  */
  handleUpdateDelete = (action, tableName, id, data) => {
    if (action === 'update') {
        this.setState({isEdit: true, currentData: data, currentID: id, currentTableName: tableName});
    } else if (action === 'delete') {
      this.props.actions[action](tableName, id);
    }
  }


  /**
  * Handles Input event on update and create actions.
  * @param: index - the index of the value.
  * @param: event - the event information.
  */
  handleInput = (index, event) => {
    var data;
    if (this.state.isAdd && this.state.currentData === null) {
      data = [];
    } else {
      data = this.state.currentData;
    }
    data[index] = event.target.value;
    this.setState({currentData: data});

  }

  closeTable = (tableName) => {
    if (this.props.tables.length === 1) {
      return;
    }
    var copy = JSON.parse(JSON.stringify(this.state.currentTables));
    var index = copy.indexOf(tableName);
    copy.splice(index, 1);
    console.log(copy);
    var tableIndex = this.state.currentTableIndex - 1;
    this.setState({currentTables: copy, currentTableIndex: tableIndex});
  }

  createTable = () => {
    if (this.state.currentTableIndex + 1 >= this.props.tables.length) {
      return;
    }
    var tableIndex = this.state.currentTableIndex + 1;
    var copy = this.state.currentTables;
    copy.push(this.props.tables[tableIndex]);
    this.setState({currentTables: copy, currentTableIndex: tableIndex});
  }


  render() {
    const { classes } = this.props;
    const data = JSON.parse(JSON.stringify(this.props.data));
    const actionButtons = [
      {name: 'update', icon: <CreateRoundedIcon />},
      {name: 'delete', icon: <DeleteRoundedIcon />},
    ];

    return (

      <div>
        {<Form
            classes = {classes}
            isAdd = {this.state.isAdd}
            isEdit = {this.state.isEdit}
            title = {this.props.title}
            headers = {this.props.headers}
            currentData = {this.state.currentData}
            handleInput = {this.handleInput}
            handleDialogExit = {this.handleDialogExit}
        />}

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md = {12} align = 'center'>
            <h1> {this.props.title} </h1>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md = {6}>
              {<Table
                currentTables = {this.state.currentTables}
                classes = {classes}
                closeTable = {this.closeTable}
                headers = {this.props.headers}
                data = {data}
                actionButtons = {actionButtons}
                handleUpdateDelete = {this.handleUpdateDelete}
                handleCreate = {this.handleCreate}
                createTable = {this.createTable}
                hasCreateTable = {this.props.hasCreateTable}
              />}
          </Grid>
          </Grid>

      </div>

    );
  }

}
export default withStyles(useStyles)(DataPage);
