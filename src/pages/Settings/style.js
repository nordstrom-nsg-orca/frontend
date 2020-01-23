const style = theme => ({
  main: {
    width: '100%',
    height: '100vh',
    minHeight: '100vh',
    background: theme.background,
    color: theme.color
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
});

export default style;
