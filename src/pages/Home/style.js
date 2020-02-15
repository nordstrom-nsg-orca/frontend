import { withStyles, fade } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const style = theme => ({
  main: {
    width: '400px',
    margin: '0 auto',
    marginTop: '50px',
    textAlign: 'center',
    background: theme.background,
    color: theme.color
  },
  expansionRoot: {
    background: theme.background,
    color: theme.color
  },
  inputLabel: {
    color: theme.color
  },
  inputFocused: {
    color: theme.color + ' !important'
  },
  formControl: {
    marginBottom: '10px'
  }
});

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      boxShadow: `${fade(theme.background, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.color
    }
  }
}))(InputBase);

export { style, BootstrapInput };
