const drawerWidth = 240;

const style = theme => ({
  // navbar
  root: {
    display: 'flex',
    overflowY: 'auto'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '30px'
  },
  toolbar: {
    ...theme.mixins.toolbar
  },

  // topbar
  logo: {
    height: '90px',
    position: 'absolute',
    top: '-20px',
    left: '0px'
  },
  user: {
    marginLeft: 'auto'
  },

  // sidebar
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  }
});

export default style;
