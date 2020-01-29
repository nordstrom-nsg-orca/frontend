import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";

class DataTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.tablePaper}>

        <div style = {{padding: '15px 0px 5px 15px', marginTop: '8px', display: 'flex'}}>
          <Typography variant='h5'>{this.props.data.name}</Typography>
        </div>

        <Table size='small' align='center'>

          <TableHead>
            <TableRow >
              {this.props.headers.map((column, index) => (
                <TableCell size='small' key={index} className={classes.tablePaper}>
                  <b>{column.toUpperCase()}</b>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {this.props.data.rows.map(row =>
              <TableRow key={row.id}>


              {this.props.headers.map((column, index) =>
                <TableCell size='small' key={index} className={classes.tablePaper}>
                  {row[column]}
                </TableCell>
              )}

              <TableCell size='small' style={{width: '100px'}} className={classes.tablePaper}>
              {this.props.actionButtons.map((action, index) =>
                <IconButton key={index} size='small' color='inherit'
                  onClick={this.props.handleAction.bind(this, action.name, this.props.data.id, row.id, row)}>
                  {action.icon}
                </IconButton>
              )}
              </TableCell>

              </TableRow>
            )}
          </TableBody>

        </Table>
        <div align='center' >
          <IconButton color='inherit' onClick={this.props.handleAction.bind(this, 'POST', this.props.data.id, null, null)}>
            <AddCircleRoundedIcon className={classes.addButton} />
          </IconButton>
        </div>
      </Paper>
    );
  }
}


export default DataTable;
