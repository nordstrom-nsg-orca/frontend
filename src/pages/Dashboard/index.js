import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import SchemaDataPage from 'components/SchemaDataPage';

class Dashboard extends React.Component {
  render () {
    return (
      <div>
        <Paper style={{ textAlign: 'center', padding: '16px' }}>
          <Typography variant='h4'>WELCOME TO ORCA (WIP)!</Typography>
          <img src='images/ORCA.png' />
        </Paper>
      </div>
    );
  }
}

export default Dashboard;
