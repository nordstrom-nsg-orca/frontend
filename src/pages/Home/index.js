import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { style, BootstrapInput } from './style.js';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import IconButton from '@material-ui/core/IconButton';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpansion = () => {
    this.setState({expanded: !this.state.expanded});
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
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ margin: '0 auto', marginTop: '10px' }}>
              <Button variant="contained" color="primary">
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
                  htmlFor="bootstrap-input"
                  className={classes.inputLabel}
                  classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
                >
                  Username
                </InputLabel>
                <BootstrapInput defaultValue="" id="bootstrap-input-username" />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  htmlFor="bootstrap-input"
                  className={classes.inputLabel}
                  classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
                >
                  Password
                </InputLabel>
                <BootstrapInput defaultValue="" id="bootstrap-input-password" />
              </FormControl>
              <div style={{ marginTop: '15px' }}>
                <Button variant="contained" color="primary">
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
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(Home);
// <Paper className={classes.root}>
// <FormControl className={classes.formControl}>
//   <InputLabel
//     shrink
//     htmlFor="bootstrap-input"
//     className={classes.inputLabel}
//     classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
//   >
//     Username
//   </InputLabel>
//   <BootstrapInput defaultValue="" id="bootstrap-input-username" />
// </FormControl>
// <FormControl className={classes.formControl}>
//   <InputLabel
//     shrink
//     htmlFor="bootstrap-input"
//     className={classes.inputLabel}
//     classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
//   >
//     Password
//   </InputLabel>
//   <BootstrapInput defaultValue="" id="bootstrap-input-password" />
// </FormControl>
// <div style={{ marginTop: '15px' }}>
//   <Button variant="contained" color="primary">
//     Login as Admin
//   </Button>
// </div>
// <div style={{ marginTop: '15px' }}>
//   <Button variant="contained" color="primary">
//     Login with Okta
//   </Button>
// </div>
// </Paper>
