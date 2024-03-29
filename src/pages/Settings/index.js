import React from 'react';
import ThemeSelection from './themeSelection.js';
import { withStyles } from '@material-ui/core/styles';
import style from './style.js';
import Typography from '@material-ui/core/Typography';
import SettingGroup from '../../components/SettingGroup';
import PropTypes from 'prop-types';

class Settings extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <Typography variant='h4' style={{ paddingBottom: '10px' }}> My Settings </Typography>
        <SettingGroup title='Appearance'>
          <ThemeSelection classes={classes} changeSetting={this.props.changeSetting} theme={this.props.settings.theme} />
        </SettingGroup>
        <SettingGroup title='App Info'>
          <Typography className={classes.label}> Version: {process.env.REACT_APP_VERSION} </Typography>
        </SettingGroup>

      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  changeSetting: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};
export default withStyles(style)(Settings);
