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
import { Divider } from '@material-ui/core';

class Topbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userAnchor: null,
      // tabAnchor: []
      schemaAnchor: null
    };
  }

  handleUserMenu = (open) => (event) => {
    this.setState({
      userAnchor: (open) ? event.currentTarget : null
    });
  }

  handleSchemaMenu = (open) => (event) => {
    this.setState({
      schemaAnchor: (open) ? event.currentTarget : null
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
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position='fixed'>
          <Toolbar>
            <Link to='/'>
              <img className={classes.logo} src='/images/logo.svg' alt='NSG_LOGO' />
            </Link>

            {this.props.auth.authenticated && (
              <div style={{ marginLeft: '140px' }}>
                <Button onClick={this.handleSchemaMenu(true)}>Schemas</Button>
                <Menu
                  style={{ marginTop: '24px' }}
                  anchorEl={this.state.schemaAnchor}
                  keepMounted
                  open={Boolean(this.state.schemaAnchor)}
                  onClose={this.handleSchemaMenu(false)}
                  onClick={this.handleSchemaMenu(false)}
                >
                  <Link to='/schemas' underline='none'>
                    <MenuItem>EDIT SCHEMAS</MenuItem>
                  </Link>
                  <Divider style={{ backgroundColor: '#808080', margin: '3px' }} />
                  {this.props.schemas.map((schema, index) => (
                    <Link
                      color='inherit'
                      key={index}
                      to={`/schemas/${schema.id}`}
                      underline='none'
                      // onClick={this.handleLink(index, key)}
                    >
                      <MenuItem key={index} color='inherit'>
                        {schema.name}
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
                {/* {Object.entries(this.props.tabs).map(([key, tab], index) => (
                  tab.allowed && (
                    <div key={index} style={{ display: 'inline' }}>
                      <Button
                        index={index}
                        onClick={this.handleTabMenu(index, true)}
                      >
                        {tab.name}
                      </Button>
                      <Menu
                        autoFocus={false}
                        anchorEl={this.state.tabAnchor[index]}
                        open={Boolean(this.state.tabAnchor[index])}
                        onClose={this.handleTabMenu(index, false)}
                      >
                        {Object.entries(tab.pages).map(([pkey, page], index2) => (
                          page.allowed && (
                            <Link
                              color='inherit'
                              key={index2}
                              to={`/${key}/${pkey}`}
                              underline='none'
                              onClick={this.handleLink(index, key)}
                            >
                              <MenuItem key={index2} color='inherit'>
                                {page.name}
                              </MenuItem>
                            </Link>
                          )
                        ))}
                      </Menu>
                    </div>
                  )
                ))} */}
              </div>
            )}

            <div className={classes.user}>
              {this.props.auth.user != null && (
                <Link to='/api/doc' target='_blank'>
                  <Tooltip title='API Documentation'>
                    <IconButton tooltip='API Documentation'>
                      <DescriptionRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              )}
              {this.props.auth.user !== null &&
                <Button onClick={this.handleUserMenu(true)}>
                  {this.props.auth.user != null ? this.props.auth.user.name : ''}
                </Button>}
            </div>

            <Menu
              style={{ marginTop: '24px' }}
              anchorEl={this.state.userAnchor}
              keepMounted
              open={Boolean(this.state.userAnchor)}
              onClose={this.handleUserMenu(false)}
              onClick={this.handleUserMenu(false)}
            >
              <Link to='/settings'>
                <MenuItem>
                  Settings
                </MenuItem>
              </Link>
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
  changeSidebar: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
  // tabs: PropTypes.object.isRequired
};
export default Topbar;
