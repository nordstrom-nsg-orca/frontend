const style = theme => ({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    },
    dialogContent: {
		minHeight: '70vh',
	    maxHeight: '70vh'
    },
    closeButton: {
	    position: 'absolute',
	    right: theme.spacing(1),
	    top: theme.spacing(1),
	    color: theme.palette.grey[500]
  	}
});
export default style;