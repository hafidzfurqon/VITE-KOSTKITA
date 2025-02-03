import 'src/global.css';

import Fab from '@mui/material/Fab';
import { Box, Typography } from '@mui/material';
import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import { UserProvider } from './context/user-context';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

 

  return (
    <ThemeProvider>
      <UserProvider>
      <Router />
      </UserProvider>
    </ThemeProvider>
  );
}
