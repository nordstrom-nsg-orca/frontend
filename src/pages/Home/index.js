import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import style from './style.js';
import PropTypes from 'prop-types';

class Home extends React.Component {
  render () {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.root}>
          <Typography>
            Please Log in to continue
          </Typography>
        </Paper>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(Home);
