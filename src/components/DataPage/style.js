const style = theme => ({
  root: {
    width: '900px',
    margin: '0 auto',
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
  table: {

  },
  searchInput: {
    borderRadius: '3px',
    paddingLeft: theme.spacing(5),
    backgroundColor: '#EFEFEF',
    '&:hover': {
      backgroundColor: '#DDDDDD'
    },
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(2)
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
    padding: '3px',
  },
  dialog: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

});
export default style;
