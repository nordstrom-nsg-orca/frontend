import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import RemoveRedEyeRoundedIcon from '@material-ui/icons/RemoveRedEyeRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Popover from '@material-ui/core/Popover';
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

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

const popoverMessages = {
  add: 'Create',
  update: 'Edit',
  delete: 'Delete',
  encrypt: 'Encrypt',
  addTable: 'Add Table'
};


class DataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPopoverOpen: null,
      popoverMessage: null,
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
  * Handles Popover Event on open.
  * @param: event - the event information
  * @param: action - type of actions that have been invoked (eg. update, delete, create)
  */
  handlePopoverOpen = (event, action) => {
    this.setState({isPopoverOpen: event.currentTarget, popoverMessage: popoverMessages[action]});
  }

  /**
  * Handles Popover Event on close.
  */
  handlePopoverClose = () => {
    this.setState({isPopoverOpen: null, popoverMessage: null});
  }

  /**
  * Handles Event on Dialog buttons (eg. Cancel, Save, Update)
  */
  handleDialogExit = () => {
    if (this.state.isEdit) {
      this.props.actions.update(this.state.currentTableName, this.state.currentID, this.state.currentData);
    } else if (this.state.isAdd && this.state.currentData !== null && this.state.currentTableName !== null) {
      var id = this.props.data.length + 1;
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
        <Dialog open={this.state.isAdd || this.state.isEdit} aria-labelledby="form-dialog-title" className = {classes.dialog} >
          <DialogContent>
            <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing = {5}
              style = {{marginBottom: '10px'}}
            >
            {this.state.isAdd &&
               this.props.forms.map(form => {
                const gridSpace = 12 / this.props.forms.length;
                return (
                  <Grid item md = {6} >
                    <FormControl>
                      <InputLabel htmlFor="my-input"> {form.name} </InputLabel>
                      <Input id={form.name} aria-describedby="my-helper-text" onChange = {event => this.handleInput(form.index, event)}/>
                      <FormHelperText id="my-helper-text"> {form.description} </FormHelperText>
                    </FormControl>
                  </Grid>
                );
              })
            }

            {this.state.isEdit &&
               this.props.forms.map(form => {
                 const gridSpace = 12 / this.props.forms.length;
                return (
                  <Grid item md = {6} >
                    <FormControl>
                      <InputLabel htmlFor="my-input"> {form.name} </InputLabel>
                      <Input id={form.name} aria-describedby="my-helper-text" onChange = {event => this.handleInput(form.index, event)}
                          value = {this.state.currentData[form.index]}/>
                      <FormHelperText id={form.name}> {form.description} </FormHelperText>
                    </FormControl>
                  </Grid>
                );
              })
            }

            </Grid>
          </DialogContent>

          <DialogActions >
            <Button onClick={this.handleDialogExit} color="primary">
              Cancel
            </Button>
            { this.state.isAdd &&
              <Button onClick={() => this.handleDialogExit()} color="primary">
                Save
              </Button>
            }
            { this.state.isEdit &&
              <Button onClick={() => this.handleDialogExit()} color="primary">
                Update
              </Button>
            }
          </DialogActions>

        </Dialog>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          open={Boolean(this.state.isPopoverOpen)}
          anchorEl={this.state.isPopoverOpen}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          {this.state.popoverMessage}
        </Popover>
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

              {
                this.state.currentTables.map(table => {
                  return (
                    <Paper className={classes.root} style = {{marginBottom : '20px'}}>
                      <div className={classes.tableWrapper} >
                        <div>
                          <span style={{float: "left", width: "95%", textAlign: "center"}}> {table} </span>
                          <span style={{float: "left", width: "5%", textAlign: "right"}} onClick = {() => this.closeTable(table)}> <CancelRoundedIcon/> </span>
                        </div>
                        <Table stickyHeader aria-label="sticky table" style = {{paddingBottom: '10px'}}>
                          <TableHead>
                            <TableRow>
                              {this.props.headers.map(column => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                          {data[table].map(rows => {
                             var cells = rows.data.map(row => {
                              return (
                                <TableCell key ={row}>
                                  {row}
                                </TableCell>
                              );
                            })
                            return (
                                <TableRow role="checkbox" tabIndex={-1} key={rows.id}>
                                  {cells}
                                  <TableCell key = 'actions'>
                                  { actionButtons.map((action, index) => {
                                    const name = action.name;
                                    return (
                                      <span>
                                        <span style = {{marginRight: '10px'}} onMouseEnter = {event => this.handlePopoverOpen(event, action.name)}
                                          onMouseLeave = {this.handlePopoverClose}
                                          onClick = {() => this.handleUpdateDelete(name, table, rows.id, rows.data)} >
                                          {action.icon}
                                        </span>
                                      </span>
                                    );
                                  })}
                                  </TableCell>
                                </TableRow>
                            );
                            })
                          }
                          </TableBody>

                        </Table>
                        <div align='center' >
                          <AddCircleRoundedIcon className = {classes.addButton} onClick = {() => this.handleCreate(table)}
                            onMouseEnter = {event => this.handlePopoverOpen(event, 'add')} onMouseLeave = {this.handlePopoverClose}/>
                        </div>
                      </div>
                    </Paper>
                  );
                })

              }

          </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            {this.props.hasCreateTable &&
              <Grid item md = {12} align ='center'>
                  <PlaylistAddRoundedIcon className = {classes.createNewTableButton}
                    onMouseEnter = {event => this.handlePopoverOpen(event, 'addTable')} onMouseLeave = {this.handlePopoverClose}
                    onClick = {() => this.createTable()}/>

              </Grid>
            }

          </Grid>
      </div>

    );
  }

}
export default withStyles(useStyles)(DataPage);


// <div className={classes.tableWrapper} >
// <div>
//   <span style={{float: "left", width: "95%", textAlign: "center"}}> {this.props.data.length === 0 ? '' : data[0].table} </span>
//   <span style={{float: "left", width: "5%", textAlign: "right"}}> <CancelRoundedIcon/> </span>
// </div>
// <Table stickyHeader aria-label="sticky table" style = {{paddingBottom: '10px'}}>
//   <TableHead>
//     <TableRow>
//       {this.props.headers.map(column => (
//         <TableCell
//           key={column.id}
//           align={column.align}
//           style={{ minWidth: column.minWidth }}
//         >
//           {column.label}
//         </TableCell>
//       ))}
//     </TableRow>
//   </TableHead>
//   <TableBody>
//   {data.map(rows => {
//      var cells = rows.data.map(row => {
//       return (
//         <TableCell key ={row}>
//           {row}
//         </TableCell>
//       );
//     })
//     return (
//         <TableRow role="checkbox" tabIndex={-1} key={rows.id}>
//           {cells}
//           <TableCell key = 'actions'>
//           { actionButtons.map((action, index) => {
//             const name = action.name;
//             return (
//               <span>
//                 <span style = {{marginRight: '10px'}} onMouseEnter = {event => this.handlePopoverOpen(event, action.name)}
//                   onMouseLeave = {this.handlePopoverClose}
//                   onClick = {() => this.handleUpdateDelete(name, rows.id, rows.data)} >
//                   {action.icon}
//                 </span>
//               </span>
//             );
//           })}
//           </TableCell>
//         </TableRow>
//     );
//     })
//   }
//   </TableBody>
//
// </Table>
// <div align='center' >
//   <AddCircleRoundedIcon className = {classes.addButton} onClick = {event => this.handleCreate(event)}
//     onMouseEnter = {event => this.handlePopoverOpen(event, 'add')} onMouseLeave = {this.handlePopoverClose}/>
// </div>
// </div>
