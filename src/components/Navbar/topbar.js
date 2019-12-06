import { Link } from 'react-router-dom';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const pages = [
  {
    "url": "/acl",
    "text": "Edit ACLs",
    "icon": <ViewHeadlineIcon />
  },
]


class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAnchor: null
    };
  }

  handleMenu = (e) => {
    console.log(this.props.auth);
    if (this.props.auth.user == null) {
      this.props.auth.login();
      return;
    }
    this.setState({
      userAnchor: e.currentTarget
    })
  }

  handleCloseMenu = () => {
    this.setState({
      userAnchor: null
    })
  }

  logout = () => {
    console.log(this.props.auth.logout)
    this.props.logout();
    this.setState({
      userAnchor: null,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Link to="/">
              <img className={classes.logo} src="/images/logo.svg" alt="NSG_LOGO"/>
            </Link>
            
            <Button color="inherit" className={classes.user} onClick={this.handleMenu}>
              {this.props.auth.user != null? this.props.auth.user.name : "Login"}
            </Button>
            
            <Menu anchorEl={this.state.userAnchor} keepMounted className={classes.menu}
              open={Boolean(this.state.userAnchor)} onClose={this.handleCloseMenu}>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#323232'
  },
  logo: {
    height: '90px',
    position: 'absolute',
    top: '-20px',
    'left': '0px'
  },
  menu: {
    marginTop: '30px',
  },
  user: {
    marginLeft: 'auto',
  }
});

export default withStyles(styles)(Topbar);
