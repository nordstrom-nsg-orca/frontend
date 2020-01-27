
const style = theme => ({
  main: {
    width: '100%',
    height: '100vh',
    minHeight: '100vh',
    background: theme.bodyBackground,
    color: theme.color
  },
  root: {
    width: '100%',
  },
  expansion: {
    background: theme.background,
    color: theme.color
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  }
});


export default style;
