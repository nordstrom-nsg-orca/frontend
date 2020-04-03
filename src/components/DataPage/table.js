import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

class DataTable extends React.Component {
  render () {
    return (
      <Paper>

        <div style={{ padding: '15px 0px 5px 15px', marginTop: '8px', display: 'flex' }}>
          <Typography variant='h5'>{this.props.data.name}</Typography>
        </div>
        <Table size='small' align='center'>
          <TableHead>
            <TableRow>
              {this.props.headers.map((column, index) => (
                <TableCell size='small' key={index}>
                  <b>{column.column_name.toUpperCase()}</b>
                </TableCell>))}
              {(this.props.handleAction && this.props.write) &&
                <TableCell />}
            </TableRow>
          </TableHead>

          <TableBody>
            {this.props.data.rows.map(row => (
              <TableRow key={row.id}>

                {this.props.headers.map((column, index) => (
                  <TableCell size='small' key={index}>
                    {row[column.column_name] != null && row[column.column_name].toString()}
                  </TableCell>
                ))}

                {(this.props.handleAction && this.props.write) &&
                  <TableCell size='small' style={{ width: '100px' }}>
                    {this.props.actionButtons.map((action, index) => (
                      <IconButton
                        key={index}
                        size='small'
                        color='inherit'
                        onClick={this.props.handleAction(action.name, this.props.data.id, row.id, row)}
                      >
                        {action.icon}
                      </IconButton>
                    ))}
                  </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(this.props.handleAction && this.props.write) &&
          <div align='center'>
            <IconButton color='inherit' onClick={this.props.handleAction('POST', this.props.data.id, null, {})}>
              <AddCircleRoundedIcon />
            </IconButton>
          </div>}
      </Paper>
    );
  }
}

DataTable.propTypes = {
  handleAction: PropTypes.func,
  actionButtons: PropTypes.array,
  headers: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  write: PropTypes.bool.isRequired
};

export default DataTable;
