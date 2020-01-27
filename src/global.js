const lightTheme = {
  bodyBackground: '#fafafa',
  background: '#fff',
  color: '#1F1F1F',
};

const darkTheme = {
  bodyBackground: '#303030',
  background: '#424242',
  color: '#fff',
};

const style = theme => ({
  root: {
    width: '100%',
    minHeight: '100vh',
    margin: '0 auto',
    padding: '0',
    backgroundColor: theme.bodyBackground,
    color: theme.color
  }
});

export { lightTheme, darkTheme, style };
