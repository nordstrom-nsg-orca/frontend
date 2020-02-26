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

  handleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <Drawer
          variant='permanent'
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open
            })
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar} />
          <Divider />
          <IconButton onClick={this.handleDrawer} style={{ borderRadius: '0' }}>
            {this.state.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Divider />
          {(this.props.currentTab && window.location.pathname !== '/') && (
            <List color='inherit'>
              {Object.entries(this.props.tabs[this.props.currentTab].pages).map(([key, page], index) => (
                page.allowed && (
                  <Link key={index} to={`/${this.props.currentTab}/${key}`} color='textPrimary'>
                    <Tooltip title={this.state.open ? '' : page.name} placement='right'>
                      <ListItem button>
                        <ListItemIcon>
                          {page.icon}
                        </ListItemIcon>
                        <ListItemText>
                          {page.name}
                        </ListItemText>
                      </ListItem>
                    </Tooltip>
                  </Link>
                )
              ))}
            </List>
          )}
        </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  currentTab: PropTypes.string,
  tabs: PropTypes.object.isRequired
};

export default Sidebar;
