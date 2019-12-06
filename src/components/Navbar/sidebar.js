import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';


const drawerWidth = 240;

const pages = [
  {
    "url": "/acl",
    "text": "Edit ACLs",
    "icon": <ViewHeadlineIcon />
  },
]


class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { classes } = this.props;

    return (
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
    )
  }
}

const styles = theme => ({
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
    ...theme.mixins.toolbar,
  },
});

export default withStyles(styles)(Sidebar);