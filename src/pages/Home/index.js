import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class Home extends React.Component {
  constructor(props) {
    super(props);
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
const styles = theme => ({
  root: {
    width: '300px',
    height: '100px',
    margin: 'auto',
    marginTop: '50px',
    textAlign: 'center',
    padding: '30px'
  },
});

export default withStyles(styles)(Home);