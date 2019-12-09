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


const columns = [
  { id: 'name', label: 'Name', minWidth: 100, align: 'left' },
  { id: 'key', label: 'Key', minWidth: 250, align: 'left' },
  { id: 'action', label: 'Actions', minWidth: 150, align: 'left' },
];
const actionButtons = [
  {name: 'edit', icon: <CreateRoundedIcon />},
  {name: 'delete', icon: <DeleteRoundedIcon/>},
  {name: 'encrypt', icon: <RemoveRedEyeRoundedIcon/>},

];

const rows = [
  {name: 'LiveAction_API', key: 'nsg', actions: actionButtons}
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
 }
});

class SecretTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }
  handleChangePage(event, newPage)  {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage(event) {
    this.setState({page: 0, rowsPerPage: event.target.value});

  };

  render() {
    const { classes } = this.props;
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
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                            <TableCell key={row.name}>
                              {row.name}
                            </TableCell>
                            <TableCell key={row.key}>
                              {row.key}
                            </TableCell>
                            <TableCell key = 'actions'>
                            { row.actions.map((action, index) => {
                              return (
                                  <span style = {{marginRight: '5px'}}> {action.icon} </span>
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
              <AddCircleRoundedIcon className = {classes.addButton} onClick = {event => this.props.handleActionButtons('add', event)}/>
          </Grid>
          </Grid>
      </div>

    );
  }

}
export default withStyles(useStyles)(SecretTable);
