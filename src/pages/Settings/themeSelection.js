import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

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
        <Paper className={classes.expansion}>
          <FormGroup row className={classes.form}>
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
        </Paper>

      </div>
    );
  }

}

export default ThemeSelection;