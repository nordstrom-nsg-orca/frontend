import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class ThemeSelection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { classes } = this.props;
    const checkBoxColor = this.props.light === true ? "#424242": "#fff";
    return (
      <div className={classes.root}>
        <ExpansionPanel className={classes.expansion}>
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
                  <Checkbox checked={!this.props.light} onChange={event => this.props.changeTheme(event, 'dark')} value='dark'
                    style={{color: checkBoxColor}}/>
                }
                label="Dark"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.props.light} onChange={event => this.props.changeTheme(event, 'light')} value='light'
                    style={{color: checkBoxColor}}/>
                }
                label="Light"
              />

            </FormGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>
    );
  }

}





export default ThemeSelection;
