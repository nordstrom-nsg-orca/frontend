import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import style from './style.js';
import PropTypes from 'prop-types';

class SettingGroup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant='h5'> {this.props.title} </Typography>
        <Paper className={classes.paperStyle}>
          {this.props.children}
        </Paper>
      </div>
    );
  }
}

SettingGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};

export default withStyles(style)(SettingGroup);
