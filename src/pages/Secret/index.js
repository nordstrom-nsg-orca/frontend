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

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'key', label: 'Key', minWidth: 100 },
  { id: 'action', label: 'Actions', minWidth: 100 },
];

const rows = [
  {name: 'LiveAction_API', key: 'nsg', action: [<CreateRoundedIcon/>, <DeleteRoundedIcon/>, <RemoveRedEyeRoundedIcon/>]}

]


const useStyles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

class Secret extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10
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
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
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
                  <TableCell key={row.name}>
                    {row.action[0]}
                    <span style = {{marginRight: '10px'}}> </span>
                    {row.action[1]}
                    <span style = {{marginRight: '10px'}}> </span>
                    {row.action[2]}
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
    );
  }

}
export default withStyles(useStyles)(Secret);
