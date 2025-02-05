import 'src/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { UserProvider } from './context/user-context';
// ----------------------------------------------------------------------

export default function App() {

  useScrollToTop();
  const queryClient  = new QueryClient();
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
      <UserProvider>
      <Router />
      </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
