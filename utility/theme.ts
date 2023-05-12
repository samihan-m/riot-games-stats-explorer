// from https://tech.sycamore.garden/material-ui-next-js-typescript#heading-initializing-the-project

import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue.A700,
    },
    secondary: {
      main: '#ff6666',
    },
  },
});

export default theme;