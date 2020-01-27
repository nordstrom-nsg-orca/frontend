import React from 'react';
import ThemeSelection from './themeSelection.js';
import { withStyles } from '@material-ui/core/styles';
import style  from './style.js';


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
        <h1> My Settings </h1>
        <ThemeSelection changeTheme={this.props.changeTheme} light={this.props.light} classes={classes}/>
      </div>
    );
  }

}




export default withStyles(style)(Settings);
