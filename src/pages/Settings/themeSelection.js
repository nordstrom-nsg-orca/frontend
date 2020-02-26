import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import PropTypes from 'prop-types';

class ThemeSelection extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const { classes } = this.props;
    const dark = this.props.theme === 'dark';
    console.log(dark);
    return (
      <div className={classes.childMain}>
        <Typography className={classes.label}> Theme </Typography>
        <FormGroup className={classes.themeForm}>
          <RadioGroup row onChange={this.props.changeSetting} name='theme'>
            <FormControlLabel
              value='dark'
              label='dark'
              control={
                <Radio checked={dark} color='primary' />
              }
            />
            <FormControlLabel
              value='light'
              label='light'
              control={
                <Radio checked={!dark} color='primary' />
              }
            />
          </RadioGroup>
        </FormGroup>

      </div>
    );
  }
}

ThemeSelection.propTypes = {
  classes: PropTypes.object.isRequired,
  changeSetting: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
};

export default ThemeSelection;
