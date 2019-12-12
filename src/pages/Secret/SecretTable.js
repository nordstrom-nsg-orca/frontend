import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import RemoveRedEyeRoundedIcon from '@material-ui/icons/RemoveRedEyeRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const columns = [
  { id: 'name', label: 'Name', minWidth: 100, align: 'left' },
  { id: 'key', label: 'Key', minWidth: 250, align: 'left' },
  { id: 'action', label: 'Actions', minWidth: 150, align: 'left' },
];


const rows = [
  {name: 'LiveAction_API', key: 'nsg'}
]

const forms = [
  {name: 'Name', id: 'name', description: 'Key\'s name'},
  {name: 'Key', id: 'key', description: 'Key to Encrypt'},
]



const useStyles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
  addButton: {
    marginTop: '20px',
    width: 35,
    height: 35
  },
  dialog: {
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
 },
 popover: {
    pointerEvents: 'none',
  }
});

const popoverMessages = {
  add: 'Add Key',
  edit: 'Edit',
  delete: 'Delete',
  encrypt: 'Encrypt'
};


class SecretTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      isPopoverOpen: null,
      popoverMessage: null,
    };
  }

  handlePopoverOpen = (event, action) => {
    // console.log(popoverMessages[action]);
    this.setState({isPopoverOpen: event.currentTarget, popoverMessage: popoverMessages[action]});
  }

  handlePopoverClose = () => {
    this.setState({isPopoverOpen: null, popoverMessage: null});
  }

  render() {
    const { classes } = this.props;
    const actionButtons = [
      {name: 'edit', icon: <CreateRoundedIcon onClick = {event => this.props.handleActionButtons('edit', event)}/>},
      {name: 'delete', icon: <DeleteRoundedIcon onClick = {event => this.props.handleActionButtons('delete', event)}/>},
      {name: 'encrypt', icon: <RemoveRedEyeRoundedIcon onClick = {event => this.props.handleActionButtons('encrypt', event)}/>},
    ];

    return (

      <div>
        <Dialog open={this.props.isAdd} aria-labelledby="form-dialog-title" className = {classes.dialog} >
          <DialogContent>
            <DialogTitle id="form-dialog-title">Add Key</DialogTitle>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing = {5}
              style = {{marginBottom: '10px'}}
            >
            { forms.map(form => {
              return (
                <Grid item md = {6} >
                  <FormControl>
                    <InputLabel htmlFor="my-input"> {form.name} </InputLabel>
                    <Input id={form.id} aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text"> {form.description} </FormHelperText>
                  </FormControl>
                </Grid>
              );
            })
            }
            </Grid>
          </DialogContent>

          <DialogActions >
            <Button onClick={this.props.handleDialogExit} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.handleDialogExit} color="primary">
              Encrypt & Save
            </Button>
          </DialogActions>

        </Dialog>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md = {12} >
            <h1 style = {{textAlign: 'center'}}> Secrets </h1>
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
                        {columns.map(column => (
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
                      {rows.map(row => {
                        return (
                          <TableRow role="checkbox" tabIndex={-1} key={row.name}>
                            <TableCell key={row.name}>
                              {row.name}
                            </TableCell>
                            <TableCell key={row.key}>
                              {row.key}
                            </TableCell>
                            <TableCell key = 'actions'>
                            { actionButtons.map((action, index) => {
                              return (
                                <span>
                                  <span style = {{marginRight: '10px'}} onMouseEnter = {event => this.handlePopoverOpen(event, action.name)}  onMouseLeave = {this.handlePopoverClose}>
                                    {action.icon}
                                  </span>
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
                                </span>
                              );
                            })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={10}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
          <Grid item xs = {6} >
              <AddCircleRoundedIcon className = {classes.addButton} onClick = {event => this.props.handleActionButtons('add', event)}
                onMouseEnter = {event => this.handlePopoverOpen(event, 'add')} onMouseLeave = {this.handlePopoverClose}/>
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
          </Grid>
          </Grid>
      </div>

    );
  }

}
export default withStyles(useStyles)(SecretTable);
