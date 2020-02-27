import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class NoAccess extends React.Component {
  render () {
    return (
      <div>
        <Paper style={{ 'text-align': 'center', padding: '20px' }}>
          <Typography>
            Sorry, you don't have access to this resource.
            Please contact and Admin to request access.
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default (NoAccess);
