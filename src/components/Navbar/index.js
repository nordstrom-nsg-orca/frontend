import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Auth, withAuth } from '@okta/okta-react';

import Sidebar from './sidebar';
import Topbar from './topbar';


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Topbar auth={this.props.auth} logout={this.props.logout}/>
        
        {this.props.auth.authenticated &&
          <Sidebar />
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
  }
});

export default withStyles(styles)(Navbar);
