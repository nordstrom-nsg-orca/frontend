import React from 'react';
import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class Error extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.errorType = {
      notFound: '404 Page Not Found',
      noAccess: 'Sorry, you don\'t have access to this resource. Please contact an Admin to request access.'
    };
  }

  componentDidUpdate () {
    console.log(this.props);
  }

  render () {
    return (
      <Paper style={{ 'text-align': 'center', padding: '20px' }}>
        <Typography>
          {this.errorType[this.props.errorType]}
        </Typography>
      </Paper>
    );
  }
}

Error.propTypes = {
  errorType: PropTypes.string.isRequired
};

export default (Error);
