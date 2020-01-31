const spaceBetweenSection = '20px';
const titleBottomSpace = '10px';
const style = theme => ({
  root: {
    width: theme.maxWidth
  },
  paperStyle: {
    background: theme.background,
    color: theme.color,
    marginBottom: spaceBetweenSection,
    height: '50px'

  },
  title: {
    fontSize: '1.3em',
    marginBottom: titleBottomSpace
  }
});


export default style;
