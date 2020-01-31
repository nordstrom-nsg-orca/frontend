const topPadding = '10px';
const fontSize = '1.1em';
const leftPadding = '10px';
const style = theme => ({
  main: {
    width: theme.maxWidth,
    background: theme.bodyBackground,
    color: theme.color,
  },
  childMain: {
    display: "flex",
    justifyContent: "center"
  },
  themeForm: {
    fontSize: fontSize,
    marginLeft: 'auto'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
  themeTitle: {
    paddingTop: topPadding,
    fontSize: fontSize,
    marginLeft: leftPadding
  },
  version: {
    paddingTop: topPadding,
    fontSize: fontSize,
    marginLeft: leftPadding
  }
});


export default style;
