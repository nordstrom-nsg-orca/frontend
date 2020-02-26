const style = theme => ({
  cancel: { color: theme.palette.error.main },
  accept: { color: theme.palette.success.main },
  errorMessage: {
    fontSize: '1.5em',
    margin: '0 auto'
  },
  errorIcon: {
    fontSize: '4em',
    color: theme.palette.error.main
  }
});
export default style;
