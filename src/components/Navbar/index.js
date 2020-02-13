import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Sidebar from './sidebar';
import Topbar from './topbar';
import style from './style.js';

class Navbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      currentTab: this.props.tabs[0]
    };
  }

  render () {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Topbar
          auth={this.props.auth}
          logout={this.props.logout}
          login={this.props.login}
          tabs={this.props.tabs}
          classes={classes}
        />
        {this.props.auth.authenticated &&
          <Sidebar
            classes={classes}
            pages={this.state.currentTab.pages}
          />}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};
export default withStyles(style)(Navbar);
