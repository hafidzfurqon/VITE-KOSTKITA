import { Box } from '@mui/material';
import { Container, Toolbar } from '@mui/material';
import React from 'react';
import Footer from 'src/sections/landing/footer';
import Header from 'src/sections/landing/header';

export function LandingLayoutNoContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* <Container sx={{ flex: 1 }}> */} {/* Flex 1 agar mengisi sisa tinggi */}
      <Toolbar sx={{ marginBottom: '10px' }} />
      {children}
      {/* <Toolbar sx={{ marginTop: '2px' }} /> */}
      {/* </Container> */}
      <Footer />
    </Box>
  );
}
