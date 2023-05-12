// from https://dev.to/hpouyanmehr/nextjs-mui-v5-typescript-tutorial-and-starter-3pab

import { ThemeOptions, createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const darkThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue.A700,
    },
    secondary: {
      main: '#ff6666',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      // '"Segoe UI"',
      // 'Roboto',
      // '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default darkThemeOptions;