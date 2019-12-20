import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import IconButton from "@material-ui/core/IconButton";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Form from './form.js';
import Table from './table.js';

class DataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formAction: null,
      formOpen: false,
      formHeaders: [],
      formData: null,
      isDropdown: false,
      searchFilter: 'All',
      currentSearchPhrase: null,
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
    }
    console.log(data);
    this.setState({
      formOpen: true,
      formAction: action,
      formHeaders: this.props.headers,
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

  dropdownChange = (action) => {
    if (action === 'open') this.setState({isDropdown: true});
    else if (action === 'close') this.setState({isDropdown: false});
  }

  selectChange = (event) => {
    this.setState({searchFilter: event.target.value});
  }

  handleSearchEvent= (event) => {
    var phrase = event.target.value;
    if (phrase === '') {
      phrase = null;
      this.setState({currentTableData: JSON.parse(JSON.stringify(this.props.data)), currentTables: JSON.parse(JSON.stringify(this.props.tables))});
      return;
    }
    var currentSearchFilter = this.state.currentSearchFilter;
    var currentTableData = {};
    var currentTables = new Set();
    var copyData;
    if (currentSearchFilter === 'Table') {
      copyData = JSON.parse(JSON.stringify(this.props.data));
      for (var name in copyData) {
        if (name.toLowerCase().includes(phrase)) {
          currentTableData[name] = copyData[name];
          currentTables.add(name);
        }
      }

    } else {
      var index;
      this.props.headers.map(header => {
        if (header.label === currentSearchFilter) index = header.index;
      });
      copyData = JSON.parse(JSON.stringify(this.props.data));
      for (var name in copyData) {
        copyData[name].map(value => {
          if (value.data[index].toLowerCase().includes(phrase)) {
            if (name in currentTableData) {
              var copy = currentTableData[name];
              copy.push(value);
              currentTableData[name] = copy;

            } else {
              currentTableData[name] = [value];
            }
            currentTables.add(name);
          }
        });
      }

    }

    if (Object.entries(currentTableData).length > 0 && currentTableData.constructor === Object) {
      this.setState({currentTableData: currentTableData, currentTables: Array.from(currentTables)});
    }
    this.setState({currentSearchPhrase: phrase});
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
        />

        <div style ={{display: 'flex'}}>
          <Typography variant="h4">{this.props.title}</Typography>
          
          <div style={{marginLeft: 'auto'}}>
            
            <SearchRoundedIcon className={classes.searchIcon} />
            <InputBase
              placeholder="Search"
              className={classes.searchInput}
              onChange = {this.searchChange}
            />
            <Select
              open={this.state.isDropdown}
              onClose={this.dropdownChange.bind(this, 'close')}
              onOpen={this.dropdownChange.bind(this, 'open')}
              value={this.state.searchFilter}
              onChange={event => this.selectChange(event)}
              autoWidth={true}
              className={classes.select}
            >
              <MenuItem className={classes.menuItem} value="All">
                All
              </MenuItem>
              {this.props.headers.map((header, index) =>
                <MenuItem key={index} className={classes.menuItem} value={header}>{header}</MenuItem>
              )}
              <MenuItem className={classes.menuItem} value='Table'>Table</MenuItem>
            </Select>
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
          />
        )}

        <Grid item md = {12} align ='center'>
            <IconButton color='inherit' onClick={this.props.createTable}>
              <PlaylistAddRoundedIcon className={this.props.classes.createNewTableButton}/>
            </IconButton>

        </Grid>


      </div>

    );
  }

}


const style = theme => ({
  root: {
    width: '900px',
    margin: '0 auto',
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
  createNewTableButton: {
    marginTop: '5px',
    width: 35,
    height: 35,
    align: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    height: '15px'
  },
  table: {

  },
  searchInput: {
    borderRadius: '3px',
    paddingLeft: theme.spacing(5),
    backgroundColor: '#EFEFEF',
    '&:hover': {
      backgroundColor: '#DDDDDD'
    },
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(2)
  },
  searchIcon: {
    // height: '100%',
    color: '#333333',
    position: 'relative',
    left: '30px',
    top: '8px',
    zIndex: '9999'
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingLeft: '5px'
  },
  select: {
    marginLeft: '3px'
  },
  menuItem: {
    padding: '3px',
  }

});

export default withStyles(style)(DataPage);
