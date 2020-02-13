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

  handleMenu = (e) => {
    if (this.props.auth.user == null) {
      this.props.login();
      return;
    }
    this.setState({
      userAnchor: e.currentTarget
    });
  }

  handleMouseEnter = (index, e) => {
    let copy = JSON.parse(JSON.stringify(this.state.tabAnchor));
    copy[index] = e.currentTarget;
    this.setState({ tabAnchor: copy })
  }
  handleMouseLeave = (index, e) => {
    let copy = [...this.state.tabAnchor]
    copy[index] = null;
    this.setState({ tabAnchor: copy })
  }

  handleCloseMenu = () => {
    this.setState({
      userAnchor: null
    });
  }

  handleLogout = () => {
    this.props.logout();
    this.setState({
      userAnchor: null
    });
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
            
            <div style={{marginLeft:'140px'}}>
              {this.props.tabs.map((item, index) =>
                <div key={index} style={{display:'inline'}}>
                  <Button index={index} color='inherit'
                    onClick={this.handleMouseEnter.bind(this, index)}
                  >
                    {item.name}
                  </Button>
                  <Menu
                    
                    className={classes.menu}
                    anchorEl={this.state.tabAnchor[index]}
                    open={Boolean(this.state.tabAnchor[index])}
                    onClose={this.handleMouseLeave.bind(this, index)}
                  >
                  {item.pages.map((page, index2) => 
                    <MenuItem key={index2}>
                      <Link to={page.url}>
                        {page.name}
                      </Link>
                    </MenuItem>
                  )}
                  </Menu>
                </div>
              )}
            </div>

            <div className={classes.user}>
              {this.props.auth.user != null &&
                <Link to='/api/doc' target='_blank'>
                  <Tooltip title='API Documentation'>
                    <IconButton tooltip='API Documentation' style={{ color: 'white' }}>
                      <DescriptionRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Link>}
              <Button color='inherit' onClick={this.handleMenu}>
                {this.props.auth.user != null ? this.props.auth.user.name : 'Login'}
              </Button>
            </div>

            <Menu
              anchorEl={this.state.userAnchor}
              keepMounted
              className={classes.menu}
              open={Boolean(this.state.userAnchor)}
              onClose={this.handleCloseMenu} onClick={this.handleCloseMenu}
            >
              <MenuItem>
                <Link to='/settings'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Settings
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleLogout}>
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
  auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};
export default Topbar;
