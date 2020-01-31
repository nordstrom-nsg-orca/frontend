const maxWidth = '900px';
const lightTheme = {
  bodyBackground: '#fafafa',
  background: '#fff',
  color: '#1F1F1F',
  colorSecondary: 'rgba(0, 0, 0, 0.50)',
  maxWidth: maxWidth
};

const darkTheme = {
  bodyBackground: '#303030',
  background: '#424242',
  color: '#fff',
  colorSecondary: 'rgba(255, 255, 255, 0.55)',
  maxWidth: maxWidth
};

const style = theme => ({
  main: {
    width: '100%',
    minHeight: '100vh',
    margin: '0 auto',
    padding: '0',
    backgroundColor: theme.bodyBackground,
    color: theme.color
  }
});

export { lightTheme, darkTheme, style };
