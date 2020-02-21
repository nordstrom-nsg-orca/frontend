import { Link } from 'react-router-dom';
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

class Topbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userAnchor: null,
      tabAnchor: []
    };
  }

  handleUserMenu = (open) => (event) => {
    this.setState({
      userAnchor: (open) ? event.currentTarget : null
    });
  }

  handleTabMenu = (index, open) => (event) => {
    const copy = [...this.state.tabAnchor];
    copy[index] = (open) ? event.currentTarget : null;
    this.setState({ tabAnchor: copy });
  }

  handleLink = (index, key) => () => {
    this.props.changeSidebar(key);
    this.handleTabMenu(index, false)(null);
  }

  handleLogout = () => {
    this.props.logout();
    this.handleUserMenu(false, null);
  }

  render () {
    const { classes } = this.props;
    const link = this.props.auth.authenticated ? '/dashboard' : '/';
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <Link to={link}>
              <img className={classes.logo} src='/images/logo.svg' alt='NSG_LOGO' />
            </Link>

            {this.props.auth.authenticated && (
              <div style={{ marginLeft: '140px' }}>
                {Object.entries(this.props.tabs).map(([key, tab], index) => (
                  tab.allowed && (
                    <div key={index} style={{ display: 'inline' }}>
                      <Button
                        index={index}
                        color='inherit'
                        onClick={this.handleTabMenu(index, true)}
                      >
                        {tab.name}
                      </Button>
                      <Menu
                        autoFocus={false}
                        className={classes.menu}
                        classes={{ paper: classes.menuPaper, list: classes.menuList }}
                        anchorEl={this.state.tabAnchor[index]}
                        open={Boolean(this.state.tabAnchor[index])}
                        onClose={this.handleTabMenu(index, false)}
                      >
                        {Object.entries(tab.pages).map(([pkey, page], index2) => (
                          page.allowed && (
                            <Link
                              key={index2}
                              to={`/${key}/${pkey}`}
                              underline='none'
                              className={classes.link}
                              onClick={this.handleLink(index, key)}
                            >
                              <MenuItem key={index2} className={classes.menuItem}>
                                {page.name}
                              </MenuItem>
                            </Link>
                          )
                        ))}
                      </Menu>
                    </div>
                  )
                ))}
              </div>
            )}

            <div className={classes.user}>
              {this.props.auth.user != null && (
                <Link to='/api/doc' target='_blank'>
                  <Tooltip title='API Documentation'>
                    <IconButton tooltip='API Documentation' style={{ color: 'white' }}>
                      <DescriptionRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              )}
              <Button color='inherit' onClick={this.handleUserMenu(true)}>
                {this.props.auth.user != null ? this.props.auth.user.name : ''}
              </Button>
            </div>

            <Menu
              anchorEl={this.state.userAnchor}
              keepMounted
              className={classes.menu}
              classes={{ paper: classes.menuPaper, list: classes.menuList }}
              open={Boolean(this.state.userAnchor)}
              onClose={this.handleUserMenu(false)}
              onClick={this.handleUserMenu(false)}
            >
              <MenuItem className={classes.menuItem}>
                <Link to='/settings' className={classes.link}>
                  Settings
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleLogout} className={classes.menuItem}>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Topbar.propTypes = {
  classes: PropTypes.object.isRequired,
  changeSidebar: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  tabs: PropTypes.object.isRequired
};
export default Topbar;
