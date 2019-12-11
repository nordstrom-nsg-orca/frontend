import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import Input from '@material-ui/core/Input';
import IconButton from "@material-ui/core/IconButton";


const popoverMessages = {
  add: 'Create',
  update: 'Edit',
  delete: 'Delete',
  encrypt: 'Encrypt',
  addTable: 'Create Table',
  closeTable: 'Close Table'
};


class TableClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      popoverMessage: null,
      isPopoverOpen: null,
    };
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

  render() {
    return (
      <div>
      <Popover
        id="mouse-over-popover"
        className={this.props.classes.popover}
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
      {
        this.props.currentTables.map(table => {
          return (
            <Paper className={this.props.classes.root} style = {{marginBottom : '20px'}}>
              <div className={this.props.classes.tableWrapper} >
                <div style={{float:'right', marginRight: '5px', marginTop: '2px'}} onMouseEnter = {event => this.handlePopoverOpen(event, 'closeTable')}
                    onMouseLeave = {this.handlePopoverClose} onClick = {this.handlePopoverClose}>
                  <IconButton color='inherit'>
                    <CancelRoundedIcon onClick = {() => this.props.closeTable(table)}
                    />
                  </IconButton>
                </div>
                <div align='center' style = {{marginTop: '5px', marginBottom: '5px'}}>
                <Input
                  value={table}
                  inputProps={{ style: {textAlign: 'center'} }}
                  disableUnderline={true}
                  style={{ width: '220px' }}
                  onChange = {event => {this.props.updateTable(table, event)}}
                />
                </div>
                <Table stickyHeader aria-label="sticky table" style = {{paddingBottom: '10px',}}>
                  <TableHead>
                    <TableRow>
                      {this.props.headers.map(column => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth, fontWeight: 'bold'}}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.props.data[table].map(rows => {
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
                          { this.props.actionButtons.map((action, index) => {
                            const name = action.name;
                            return (
                              <span>
                                <span style = {{marginRight: '1px'}} onMouseEnter = {event => this.handlePopoverOpen(event, action.name)}
                                  onMouseLeave = {this.handlePopoverClose}
                                  onClick = {() => this.props.handleUpdateDelete(name, table, rows.id, rows.data)} >
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
                  <IconButton color='inherit'>
                    <AddCircleRoundedIcon className = {this.props.classes.addButton} onClick = {() => this.props.handleCreate(table)}
                      onMouseEnter = {event => this.handlePopoverOpen(event, 'add')} onMouseLeave = {this.handlePopoverClose}/>
                  </IconButton>
                </div>
              </div>
            </Paper>
          );
        })
      }
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        {this.props.hasCreateTable &&
          <Grid item md = {12} align ='center'>
              <IconButton color='inherit'>
                <PlaylistAddRoundedIcon className = {this.props.classes.createNewTableButton}
                  onMouseEnter = {event => this.handlePopoverOpen(event, 'addTable')} onMouseLeave = {this.handlePopoverClose}
                  onClick = {() => this.props.createTable()}/>
              </IconButton>

          </Grid>
        }

      </Grid>
      </div>
    );
  }


}

export default TableClass;
