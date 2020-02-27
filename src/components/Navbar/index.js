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
      currentTab: null
    };
  }

  changeSidebar = (key) => {
    this.setState({ currentTab: key });
  }

  componentWillReceiveProps (props) {
    if (this.state.currentTab === null) {
      const tab = window.location.pathname.split('/')[1];
      if (props.tabs[tab] && props.tabs[tab].allowed)
        this.setState({ currentTab: tab });
    }
  }

  render () {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Topbar
          auth={this.props.auth}
          logout={this.props.logout}
          tabs={this.props.tabs}
          classes={classes}
          changeSidebar={this.changeSidebar}
        />
        {this.props.auth.authenticated && (
          <Sidebar
            classes={classes}
            tabs={this.props.tabs}
            currentTab={this.state.currentTab}
          />
        )}
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
  logout: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
};
export default withStyles(style)(Navbar);
