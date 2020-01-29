const style = theme => ({
  main: {
    width: '100%',
    background: theme.background,
    color: theme.color
  },
  root: {
    width: '900px',
    margin: '0 auto',
    background: theme.bodyBackground,
    color: theme.color
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
  addButton: {
    width: 25,
    height: 25,
    align: 'center',
    justifyContent: 'center',
  },
  createNewTableButton: {
    marginTop: '5px',
    width: 35,
    height: 35,
    align: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    height: '15px'
  },
  searchInput: {
    borderRadius: '3px',
    paddingLeft: theme.spacing(5),
    backgroundColor: '#EFEFEF',
    '&:hover': {
      backgroundColor: '#DDDDDD'
    },
    paddingRight: theme.spacing(1)
  },
  searchIcon: {
    color: '#333333',
    position: 'relative',
    left: '30px',
    top: '8px',
    zIndex: '9999'
  },
  select: {
    marginLeft: '3px'
  },
  menuItem: {
    padding: '3px'
  },
  dialogPaper: {
    backgroundColor: theme.bodyBackground,
  },
  inputLabel: {
    color: theme.colorSecondary
  },
  inputFocused: {
    color: theme.color + ' !important'
  },
  dialogUnderline: {
    '&:before': {
      borderBottom: '2px solid ' + theme.colorSecondary + ' !important',
    },
    '&:after': {
      borderBottom: '2px solid ' + theme.color + ' !important',
    }
  },
  dialogInput: {
    color: theme.color
  },
  tablePaper: {
    marginBottom : '20px',
    background: theme.background,
    color: theme.color
  }
});
export default style;
