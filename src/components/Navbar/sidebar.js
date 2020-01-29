import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';

import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import StorageIcon from '@material-ui/icons/Storage';

const pages = [
  {
    "url": "/acl",
    "text": "Edit ACLs",
    "icon": <ViewHeadlineIcon />
  },
  {
    "url": "/server",
    "text": "Edit Servers",
    "icon": <StorageIcon />
  }
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
          paper: clsx(classes.paper, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          }),
        }}

        open={this.state.open}
      >
        <div className={classes.toolbar} />
        <Divider />
        <IconButton onClick={this.toggleDrawer} className={classes.leftIcon}>
            {this.state.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Divider />
        <List>
          {pages.map((item, index) =>
            <Link key={index} to={item.url} className={classes.sideBarLink}>
              <Tooltip title={this.state.open? "" : item.text} placement="right">
              <ListItem button>
                <ListItemIcon className={classes.sideBarLink}>{item.icon}</ListItemIcon>
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


export default Sidebar;
