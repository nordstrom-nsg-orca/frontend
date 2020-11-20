const style = theme => ({
  dialogPaper: {
    minHeight: '90vh',
    maxHeight: '90vh'
  },
  dialogContent: {
    minHeight: '80vh',
    maxHeight: '80vh',
    overflowY: 'hidden'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

export default style;
