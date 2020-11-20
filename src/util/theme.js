import { createMuiTheme } from '@material-ui/core/styles';

function buildTheme (theme) {
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return createMuiTheme({
    typography: { useNextVariants: true },
    palette: {
      background: {
        default: colors.bodyBackground,
        paper: colors.background
      },
      text: { primary: colors.fontColor },
      primary: { main: '#26c6da' },
      error: { main: '#f95959' },
      success: { main: '#63a063' }
    },
    overrides: {
      MuiAppBar: {
        root: {
          backgroundColor: `${colors.background} !important`,
          zIndex: 1201
        }
      },
      MuiSvgIcon: {
        root: {
          color: colors.fontColor
        }
      },
      MuiIconButton: {
        root: {
          padding: '3px'
        }
      },
      MuiOutlinedInput: {
        root: {
          color: colors.fontColor
        },
        notchedOutline: {
          borderColor: colors.fontColor
        }
      },
      MuiInputLabel: {
        root: {
          color: colors.fontColor,
          padding: '0px'
        }
      },
      // TODO FIX USER DROPDOWN POSITIONING - MESSES UP SCHEMA TYPE
      // MuiMenu: {
      //   paper: {
      //     marginTop: '30px'
      //   }
      // },
      MuiList: {
        root: {
          color: colors.fontColor,
          backgroundColor: colors.bodyBackground,
          border: '2px solid ' + colors.background
        }
      },
      MuiListItem: {
        root: {
          color: colors.fontColor
        }
      },
      MuiMenuItem: {
        root: {
          fontSize: '0.875rem',
          color: colors.fontColor,
          textDecoration: 'none',
          padding: '2px 8px !important',
          '&:hover': {
            backgroundColor: colors.background
          }
        }
      },
      MuiTableCell: {
        sizeSmall: {
          padding: '2px 24px 2px 16px'
        }
      },
      MuiSelect: {
        icon: {
          color: colors.fontColor
        }
      }

    }
  });
}

const lightTheme = {
  bodyBackground: '#E2E2E2',
  background: '#EEEEEE',
  fontColor: '#1F1F1F'
};

const darkTheme = {
  bodyBackground: '#303030',
  background: '#424242',
  fontColor: '#fff'
};

export { buildTheme };
