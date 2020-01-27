import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import style from './style.js';

class Home extends React.Component {

  componentDidMount() {
  }


  render() {
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


export default withStyles(style)(Home);
