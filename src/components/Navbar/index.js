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
    this.changeSidebar = this.changeSidebar.bind(this);
  }

  componentDidMount () {
    if (this.state.currentTab === null) {
      const path = window.location.pathname;

      for (var i = 0; i < this.props.tabs.length; i++) {
        const tab = this.props.tabs[i];
        if (tab.url === path.substring(0, tab.url.length))
          this.setState({ currentTab: tab });
      }
    }
  }

  changeSidebar = (index) => {
    if (index === null)
      this.setState({ currentTab: index });
    else
      this.setState({ currentTab: this.props.tabs[index] });
  }

  render () {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Topbar
          auth={this.props.auth}
          logout={this.props.auth.isDbUser ? this.props.adminLogout : this.props.logout}
          tabs={this.props.tabs}
          classes={classes}
          changeSidebar={this.changeSidebar}
        />
        {this.props.auth.authenticated && (
          <Sidebar
            classes={classes}
            currentTab={this.state.currentTab}
          />
        )}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
          {this.state.pages}
        </main>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  adminLogout: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  tabs: PropTypes.array
};
export default withStyles(style)(Navbar);
