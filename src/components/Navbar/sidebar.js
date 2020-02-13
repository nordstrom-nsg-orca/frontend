import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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

class Sidebar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render () {
    const { classes } = this.props;

    return (
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: this.state.open,
          [classes.drawerClose]: !this.state.open
        })}
        classes={{
          paper: clsx(classes.paper, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open
          })
        }}

        open={this.state.open}
      >
        <div className={classes.toolbar} />
        <Divider />
        <IconButton onClick={this.handleToggleDrawer} className={classes.leftIcon}>
          {this.state.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Divider />
        <List>
          {this.props.pages.map((item, index) =>
            <Link key={index} to={item.url} className={classes.sideBarLink}>
              <Tooltip title={this.state.open ? '' : item.name} placement='right'>
                <ListItem button>
                  <ListItemIcon className={classes.sideBarLink}>{item.icon}</ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </ListItem>
              </Tooltip>
            </Link>)}
        </List>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Sidebar;
