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
      initialData: null,
      currentData: null,
      currentID: null,
    };
  }

  componentDidMount() {
    this.setState({initialData: JSON.parse(JSON.stringify(this.props.data))});
  }

  componentDidUpdate() {
    // console.log(this.state.initialData);
  }

  handlePopoverOpen = (event, action) => {
    this.setState({isPopoverOpen: event.currentTarget, popoverMessage: popoverMessages[action]});
  }

  handlePopoverClose = () => {
    this.setState({isPopoverOpen: null, popoverMessage: null});
  }

  handleDialogExit = () => {
    this.setState({isAdd: false, isEdit: false, currentID: null, currentData: null});
  }

  handleCreateButton = () => {
      this.setState({isAdd: true});
  }

  handleOtherActions = (event, name, id, data) => {
    if (name === 'update') {
      this.setState({isEdit: true, currentData: data, currentID: id});
    }
  }

  handleInput = (index, event) => {
    var data = this.state.currentData;
    data[index] = event.target.value;
    this.setState({currentData: data});
  }

  render() {
    const { classes } = this.props;
    const data = JSON.parse(JSON.stringify(this.props.data));
    const actionButtons = [
      {name: 'update', icon: <CreateRoundedIcon />},
      {name: 'delete', icon: <DeleteRoundedIcon />},
      // {name: 'encrypt', icon: <RemoveRedEyeRoundedIcon onClick = {event => this.props.handleActionButtons('encrypt', event)}/>},
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
              <Button onClick={this.props.actions.create} color="primary">
                Save
              </Button>
            }
            { this.state.isEdit &&
              <Button onClick={event => this.props.actions.update(this.state.currentID, this.state.currentData)} color="primary">
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
          <Grid item md = {6} align = 'center'>
            <h1> {this.props.title} </h1>
          </Grid>
          <Grid item md = {6} align = 'center'>
            <AddCircleRoundedIcon className = {classes.addButton} onClick = {event => this.handleCreateButton(event)}
              onMouseEnter = {event => this.handlePopoverOpen(event, 'add')} onMouseLeave = {this.handlePopoverClose}/>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md = {6}>
            <Paper className={classes.root}>
              <div className={classes.tableWrapper}>
                  <Table stickyHeader aria-label="sticky table" >
                    <TableHead >
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
                      {data.map(rows => {
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
                                      onClick = {event => this.handleOtherActions(event, name, rows.id, rows.data)} >
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

                </div>

            </Paper>
          </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            {this.props.hasCreateTable &&
              <Grid item xs = {6} >
                  <PlaylistAddRoundedIcon className = {classes.createNewTableButton}
                    onMouseEnter = {event => this.handlePopoverOpen(event, 'addTable')} onMouseLeave = {this.handlePopoverClose}/>

              </Grid>
            }

          </Grid>
      </div>

    );
  }

}
export default withStyles(useStyles)(DataPage);
