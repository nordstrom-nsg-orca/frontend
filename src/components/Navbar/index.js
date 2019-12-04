import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { Auth, withAuth } from '@okta/okta-react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


const drawerWidth = 240;

const pages = [
  {
    "url": "/acl",
    "text": "Edit ACLs",
    "icon": <ViewHeadlineIcon />
  },
]


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: null,
      userAnchor: null,
      authenticated: false
    };
  }
  
  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.user) {
      const userinfo = await this.props.auth.getUser();
      this.setState({ 
        authenticated: true,
        user: userinfo 
      });
    }
  }

  async componentDidMount() { this.checkAuthentication(); }
  async componentDidUpdate() { this.checkAuthentication(); }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

  handleUserClick = (e) => {
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
    this.props.auth.logout('/');
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {this.state.authenticated && // don't render if not auth
          <div>
            <AppBar
              position="fixed"
              className={classes.appBar}>
              <Toolbar>
                <Link to="/">
                  <img className={classes.logo} src="/images/logo.svg" alt="NSG_LOGO"/>
                </Link>
                <Button color="inherit" className={classes.user} onClick={this.handleUserClick}>
                  {this.state.user != null? this.state.user.name : ""}
                </Button>
                <Menu anchorEl={this.state.userAnchor} keepMounted className={classes.menu}
                  open={Boolean(this.state.userAnchor)} onClose={this.handleCloseMenu}>
                  <MenuItem>Settings</MenuItem>
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              </Toolbar>
            </AppBar>
            
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: this.state.open,
                  [classes.drawerClose]: !this.state.open,
                }),
              }}
              open={this.state.open}
            >
              <div className={classes.toolbar} />
              <Divider />
              <IconButton onClick={this.toggleDrawer} style={{width: '100%', borderRadius:'0'}}>
                  {this.state.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
              <Divider />
              <List>
                {pages.map((item, index) => 
                  <Link key={index} to={item.url} style={{textDecoration: 'none', color: 'black'}}>
                    <Tooltip title={this.state.open? "" : item.text} placement="right">
                    <ListItem button>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText>{item.text}</ListItemText>
                    </ListItem>
                    </Tooltip>
                  </Link>
                )}
              </List>
            </Drawer>
          </div>
        }
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>
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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  user: {
    marginLeft: 'auto',
  }
});

export default withAuth(withStyles(styles)(Navbar));
