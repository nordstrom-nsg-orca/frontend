import React from 'react';
import ThemeSelection from './themeSelection.js';
import { withStyles } from '@material-ui/core/styles';
import style  from './style.js';
import Typography from '@material-ui/core/Typography';
import SettingGroup from '../../components/SettingGroup';
class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <Typography variant='h4' style={{paddingBottom: '10px'}}> My Settings </Typography>
        <SettingGroup title="Appearance">
          <ThemeSelection classes={classes} changeTheme={this.props.changeTheme} light={this.props.light}/>
        </SettingGroup>

        <SettingGroup title="App Info">
          <div>
            <Typography className={classes.version}> Version: {process.env.REACT_APP_VERSION} </Typography>
          </div>
        </SettingGroup>

      </div>
    );
  }

}




export default withStyles(style)(Settings);
