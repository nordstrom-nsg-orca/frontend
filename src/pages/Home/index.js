import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import style from './style.js';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import IconButton from '@material-ui/core/IconButton';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpansion = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render () {
    const { classes } = this.props;
    return (
      <Paper className={classes.main}>
        <ExpansionPanel expanded={this.state.expanded} style={{ boxShadow: 'none' }}>
          <ExpansionPanelSummary>
            <div className={classes.center}>
              <Button
                name='okta'
                variant='contained'
                color='primary'
                onClick={this.props.login}
              >
                Login with Okta
              </Button>
            </div>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <div className={classes.center}>
              <div style={{ marginBottom: '8px' }}>
                <Typography color='error' style={{ margin: '8px', display: 'inline' }}>
                  {this.props.loginError && 'Incorrect username/password'}
                </Typography>
              </div>

              <form onSubmit={this.props.login} name='orca'>
                <TextField
                  name='username'
                  size='small'
                  type='text'
                  autoComplete='off'
                  label='username'
                  variant='outlined'
                />
                <TextField
                  size='small'
                  style={{ marginTop: '8px' }}
                  type='password'
                  label='password'
                  name='password'
                  variant='outlined'
                />
                <div>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    style={{ marginTop: '8px' }}
                  >
                    Login
                  </Button>
                </div>
              </form>

            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <IconButton color='inherit' onClick={this.handleExpansion}>
          {this.state.expanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        </IconButton>
      </Paper>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  loginError: PropTypes.bool.isRequired
};
export default withStyles(style)(Home);
