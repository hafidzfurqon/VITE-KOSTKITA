import { Container, Toolbar } from '@mui/material';
import React from 'react';
import Footer from 'src/sections/landing/footer';
import Header from 'src/sections/landing/header';

export function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Container>
        <Toolbar sx={{ marginBottom: '40px' }} /> {/* Tambahkan Toolbar sebelum konten */}
        {children}
        <Toolbar sx={{ marginTop: '40px' }} />
      </Container>
      <Footer />
    </>
  );
}
