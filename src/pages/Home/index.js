import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { style, BootstrapInput } from './style.js';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import IconButton from '@material-ui/core/IconButton';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: false,
      username: null,
      password: null
    };
  }

  handleExpansion = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  handleInput = (type, event) => {
    if (type === 'username') this.setState({ username: event.target.value });
    else if (type === 'password') this.setState({ password: event.target.value });
  }

  handleLogin = () => {
    // do some checking here.
    console.log(this.state.username);
    console.log(this.state.password);
    console.log('Login as Admin');
  }

  render () {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        <ExpansionPanel
          square
          expanded={this.state.expanded}
          classes={{ root: classes.expansionRoot }}
        >
          <ExpansionPanelSummary
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography style={{ margin: '0 auto', marginTop: '10px' }}>
              <Button
                variant='contained'
                color='primary'
                onClick={this.props.login}
              >
                Login with Okta
              </Button>
              <div style={{ paddingTop: '5px' }}>
                <IconButton color='inherit' onClick={() => this.handleExpansion()}>
                  <ExpandMoreRoundedIcon />
                </IconButton>
              </div>
            </Typography>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <Typography style={{ margin: '0 auto', marginTop: '10px' }}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  htmlFor='bootstrap-input'
                  className={classes.inputLabel}
                  classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
                >
                  Username
                </InputLabel>
                <BootstrapInput
                  defaultValue=''
                  id='bootstrap-input-username'
                  onChange={event => this.handleInput('username', event)}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  htmlFor='bootstrap-input'
                  className={classes.inputLabel}
                  classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
                >
                  Password
                </InputLabel>
                <BootstrapInput
                  defaultValue=''
                  id='bootstrap-input-password'
                  onChange={event => this.handleInput('password', event)}
                />
              </FormControl>
              <div style={{ marginTop: '15px' }}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleLogin}
                >
                  Login as Admin
                </Button>
              </div>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired
};
export default withStyles(style)(Home);
