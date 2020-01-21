import { Link } from 'react-router-dom';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAnchor: null
    };
  }

  handleMenu = (e) => {
    // console.log(this.props.auth);
    if (this.props.auth.user == null) {
      this.props.login();
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
    this.props.logout();
    this.setState({
      userAnchor: null,
    });
  }

  render() {
    const { classes } = this.props;
    let link;
    if (this.props.auth.authenticated) {
      link = '/dashboard';
    } else link = '/';
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Link to={link}>
              <img className={classes.logo} src="/images/logo.svg" alt="NSG_LOGO"/>
            </Link>

            <div className={classes.user} >
              {this.props.auth.user != null &&
                <Link to="/api/doc" target='_blank'>
                  <Tooltip title="API Documentation" placement="down">
                    <IconButton tooltip="API Documentation" style = {{color: "white"}}>
                        <DescriptionRoundedIcon/>
                    </IconButton>
                  </Tooltip>
                </Link>
              }
              <Button color="inherit" onClick={this.handleMenu}>
                {this.props.auth.user != null? this.props.auth.user.name : "Login"}
              </Button>
            </div>


            <Menu anchorEl={this.state.userAnchor} keepMounted className={classes.menu}
              open={Boolean(this.state.userAnchor)} onClose={this.handleCloseMenu}>
              <MenuItem>
                <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit'}} > Settings </Link>
              </MenuItem>
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
    left: '0px'
  },
  menu: {
    marginTop: '30px',
  },
  user: {
    marginLeft: 'auto',
  },
});

export default withStyles(styles)(Topbar);
