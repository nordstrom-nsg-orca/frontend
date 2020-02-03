import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';


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
      <div className={classes.childMain}>
        <Typography className={classes.label}>Theme</Typography>
        <FormGroup row className={classes.themeForm}>
          <FormControlLabel
            control={
              <Radio checked={!this.props.light} onChange={event => this.props.changeTheme(event, 'dark')} value='dark'
                style={{color: checkBoxColor}}/>
            }
            label="Dark"
          />
          <FormControlLabel
            control={
              <Radio checked={this.props.light} onChange={event => this.props.changeTheme(event, 'light')} value='light'
                style={{color: checkBoxColor}}/>
            }
            label="Light"
          />
        </FormGroup>
      </div>
    );
  }

}

export default ThemeSelection;
