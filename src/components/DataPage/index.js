import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import IconButton from "@material-ui/core/IconButton";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Form from './form.js';
import Table from './table.js';



const useStyles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
  addButton: {
    width: 25,
    height: 25,
    align: 'center',
    justifyContent: 'center',
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
    marginTop: '5px',
    width: 35,
    height: 35,
    align: 'center',
    justifyContent: 'center',
  },
  ui: {
		position: 'absolute',
		right: theme.spacing.unit,
		top: theme.spacing.unit * 2,
		margin: 'auto',
	},
	searchIcon: {
	},
	searchInput: {
		borderRadius: '3px',
		paddingLeft: theme.spacing.unit * 5,
		backgroundColor: '#EFEFEF',
		'&:hover': {
			backgroundColor: '#DDDDDD'
		},
		paddingRight: theme.spacing.unit,
		marginRight: theme.spacing.unit * 2
	},



});


class DataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isDropdown: false,
      currentSearchFilter: this.props.headers[0].label,
      currentSearchPhrase: null,
      currentTables: null,
      currentTableIndex: null,
      currentInputData: null,
      currentID: null,
      currentTableName: null,
      currentTableData: JSON.parse(JSON.stringify(this.props.data)),
    };
  }

  componentWillMount() {
    this.setState({currentTables: [this.props.tables[0]], currentTableIndex: 0})
  }
  componentDidMount() {

  }

  componentDidUpdate() {

    console.log(this.state.currentSearchPhrase);
  }

  /**
  * Handles Event on Dialog buttons (eg. Cancel, Save, Update)
  */
  handleDialogExit = () => {
    if (this.state.isEdit) {
      this.props.actions.update(this.state.currentTableName, this.state.currentID, this.state.currentInputData);
    } else if (this.state.isAdd && this.state.currentInputData !== null && this.state.currentTableName !== null) {
      var id = this.props.data[this.state.currentTableName].length + 1;
      this.props.actions.create(this.state.currentTableName, id, this.state.currentInputData);
    }
    this.setState({isAdd: false, isEdit: false, isDelete: false, currentID: null, currentInputData: null, currentTableName: null});
  }


  /**
  * Handles on Create button action.
  */
  handleCreate = (tableName) => {
      this.setState({isAdd: true, currentTableName: tableName});
  }

  /**
  * Handles deletion confirmation.
  */
  handleDeleteConfrim = () => {
    this.props.actions.delete(this.state.currentTableName, this.state.currentID);
    this.handleDialogExit();
  }

  /**
  * Handles on Update and Delete buttons action.
  * @param: name - name of the action (eg. update, delete)
  * @param: id - the id of the data.
  * @param: data - the list of data value.
  */
  handleUpdateDelete = (action, tableName, id, data) => {
    if (action === 'update') {
        this.setState({isEdit: true, currentInputData: data, currentID: id, currentTableName: tableName});
    } else if (action === 'delete') {
      this.setState({isDelete: true, currentTableName: tableName, currentID: id});

    }
  }


  /**
  * Handles Input event on update and create actions.
  * @param: index - the index of the value.
  * @param: event - the event information.
  */
  handleInput = (index, event) => {
    var data;
    if (this.state.isAdd && this.state.currentInputData === null) {
      data = [];
    } else {
      data = this.state.currentInputData;
    }
    data[index] = event.target.value;
    this.setState({currentInputData: data});

  }

  /**
  * Handles close event on table.
  * @param: tableName - name of table to close.
  */
  closeTable = (tableName) => {
    if (this.props.tables.length === 1) {
      return;
    }
    var copy = JSON.parse(JSON.stringify(this.state.currentTables));
    var index = copy.indexOf(tableName);
    copy.splice(index, 1);
    var tableIndex = this.state.currentTableIndex - 1;
    this.setState({currentTables: copy, currentTableIndex: tableIndex});
  }


  /**
  * Handles create event on table.
  */
  createTable = () => {
    var copyData = this.props.data;
    var copyTable = this.props.tables;
    copyData['Name'] = [];
    copyTable.push('Name');
    var currentTables = this.state.currentTables;
    currentTables.push('Name');
    this.setState({currentTables: currentTables});
  }

  /**
  * Handles change on table name.
  * @param: oldTableName - previous name of the table.
  * @param: event - the event information
  */
  updateTable = (oldTableName, event) => {
    if (oldTableName === event.target.value) return;
    var copy = this.props.data;
    var valueCopy = copy[oldTableName];
    copy[event.target.value] = valueCopy;
    delete copy[oldTableName];
    var currentTables = this.state.currentTables;
    currentTables[currentTables.indexOf(oldTableName)] = event.target.value;
    this.setState({currentTables: currentTables, currentTableData: JSON.parse(JSON.stringify(copy))});
  }

  /**
  * Handles dropdown event on close and open.
  * @param: action - action name (eg. close or open)
  */
  handleDropdownEvent = (action) => {
    if (action === 'open') this.setState({isDropdown: true});
    else if (action === 'close') this.setState({isDropdown: false});
  }

  /**
  * Handles filter event on selection from Dropdown.
  * @param: event - the event information
  */
  handleFilterEvent = (event) => {
    this.setState({currentSearchFilter: event.target.value});
    console.log(event.target.value);
  }

  /**
  * Handles search event.
  * @param: event - the event information
  */
  handleSearchEvent= (event) => {
    var phrase = event.target.value;
    if (phrase === '') {
      phrase = null;
      this.setState({currentTableData: JSON.parse(JSON.stringify(this.props.data))});
      return;
    }
    var index;
    var currentSearchFilter = this.state.currentSearchFilter;
    if (currentSearchFilter === 'Table') {
      var currentTableData = {};
      var currentTables = [];
      var copyData = JSON.parse(JSON.stringify(this.props.data));
      for (var name in copyData) {
        if (name.toLowerCase().includes(phrase)) {
          currentTableData[name] = copyData[name];
          currentTables.push(name);
        }
      }
      console.log(currentTableData);
      if (Object.entries(currentTableData).length > 0 && currentTableData.constructor === Object) {
        this.setState({currentTableData: currentTableData, currentTables: currentTables});
      }
    } else {
      this.props.headers.map(header => {
        if (header.label === currentSearchFilter) index = header.index;
      });
      var copyData = JSON.parse(JSON.stringify(this.props.data));
      for (var name in copyData) {
        copyData[name].map(value => {
          console.log(value);
        });
      }
    }

    this.setState({currentSearchPhrase: phrase});
  }


  render() {
    const { classes } = this.props;
    const data = JSON.parse(JSON.stringify(this.props.data));
    const actionButtons = [
      {name: 'update', icon: <IconButton color='inherit'> <CreateRoundedIcon /> </IconButton>},
      {name: 'delete', icon: <IconButton color='inherit'> <DeleteRoundedIcon /> </IconButton>},
    ];

    return (

      <div>
        {<Form
            classes = {classes}
            isAdd = {this.state.isAdd}
            isEdit = {this.state.isEdit}
            isDelete = {this.state.isDelete}
            title = {this.props.title}
            headers = {this.props.headers}
            currentInputData = {this.state.currentInputData}
            handleInput = {this.handleInput}
            handleDialogExit = {this.handleDialogExit}
            handleDeleteConfrim = {this.handleDeleteConfrim}
        />}
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md = {6} align = 'center'>
            <h1> {this.props.title} </h1>
          </Grid>
          <Grid item md = {6} align = 'center'>
              <IconButton>
                <SearchRoundedIcon/>
              </IconButton>
  						<InputBase
                placeholder="Search"
                className={classes.searchInput}
                onChange = {event => this.handleSearchEvent(event)}
              />
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={this.state.isDropdown}
                onClose={() => {this.handleDropdownEvent('close')}}
                onOpen={() => {this.handleDropdownEvent('open')}}
                value={this.state.currentSearchFilter}
                onChange={event => this.handleFilterEvent(event)}
                autoWidth={true}
                inputProps ={{

                }}
              >
                <MenuItem value="Filter" disabled>
                  <em>Filter</em>
                </MenuItem>
                {this.props.headers.map(header => {
                  if (header.label === 'Actions') return;
                    return (
                      <MenuItem value={header.label}>{header.label}</MenuItem>
                    );

                })

                }
                <MenuItem value='Table'>Table</MenuItem>
              </Select>


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
                data = {this.state.currentTableData}
                actionButtons = {actionButtons}
                handleUpdateDelete = {this.handleUpdateDelete}
                updateTable = {this.updateTable}
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
