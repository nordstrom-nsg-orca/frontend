import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
}));

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      light: true,
    };
  }

  handleChange = (event, label) => {
    if (label === 'dark') this.setState({light: !event.target.checked});
    else this.setState({light: event.target.checked});
  }


  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1> My Settings </h1>
        <div className={classes.root}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}> Theme </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormGroup col>
                <FormControlLabel
                  control={
                    <Checkbox checked={!this.state.light} color="primary" onChange={event => this.handleChange(event, 'dark')} value='dark'/>
                  }
                  label="Dark"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={this.state.light} color="primary" onChange={event => this.handleChange(event, 'light')} value='light'/>
                  }
                  label="Light"
                />

              </FormGroup>
            </ExpansionPanelDetails>
          </ExpansionPanel>

        </div>
      </div>
    );
  }

}

export default withStyles(useStyles)(Settings);
