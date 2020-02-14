const drawerWidth = 240;

const style = theme => ({
  root: {
    display: 'flex',
    overflowY: 'auto'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '30px'
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
  },
  paper: {
    background: theme.background,
    color: theme.color
  },
  leftIcon: {
    width: '100%',
    borderRadius: '0',
    color: theme.color
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#424242'
  },
  logo: {
    height: '90px',
    position: 'absolute',
    top: '-20px',
    left: '0px'
  },
  icon: {
    color: theme.color
  },
  menu: {
    marginTop: '30px',
    color: theme.color
  },
  menuList: {
    padding: 0,
    color: theme.color
  },
  menuPaper: {
    backgroundColor: theme.bodyBackground
  },
  menuItem: {
    fontSize: '0.875rem',
    color: theme.color
  },
  link: {
    color: theme.color,
    textDecoration: 'none'
  },
  user: {
    marginLeft: 'auto'
  }
});

export default style;
