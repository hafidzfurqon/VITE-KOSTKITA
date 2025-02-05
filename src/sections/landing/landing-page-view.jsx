import { Box, Fab, Typography } from '@mui/material';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Iconify } from 'src/components/iconify';
import Header from './header';
import HeroContent from './hero-content';
import HeroSection from './hero-section';
import CategorySection from './category-section';
import PropertyGrid from './property-grid';
import Footer from './footer';
import PromoPage from './promo-page';
import PropertyBudget from './property-budget';
// import { TourListView } from '../tour/view';



export function LandingPage() {
  const WhatsAppButton = (
    <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      position: 'fixed',
      right: 20,
      bottom: 20,
      zIndex: 9,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        bgcolor: 'grey.800',
        color: 'common.white',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        mr: 1, // Jarak ke Fab
        boxShadow: 2,
      }}
    >
      Live Chat
    </Typography>

    <Fab
      size="medium"
      aria-label="WhatsApp"
      href="https://wa.me/628123456789" // Ganti dengan nomor WhatsApp Anda
      sx={{
        width: 44,
        height: 44,
        bgcolor: '#25D366', // Warna khas WhatsApp
        color: 'common.white',
        '&:hover': { bgcolor: '#1EBE5D' },
      }}
    >
      <Iconify width={24} icon="ic:baseline-whatsapp" />
    </Fab>
  </Box>
  );
  
  return (
    <>
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden', // Mencegah scroll ganda
        bgcolor: '#f5f5f5' 
      }}
    >
      {/* Hero Section (tetap di atas, tidak scroll) */}
      <Box sx={{ flexShrink: 0 }}>
        <HeroSection>
          <Header />
          <HeroContent />
        </HeroSection>
      </Box>

      {/* Konten Scrollable */}
      {/* <Box sx={{ flex: 1, overflow: 'hidden' }}> */}
        <SimpleBar style={{ maxHeight: '100%', width: '100%' }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, px: 4, pb: 4 }}>
            <CategorySection />
            {/* <TourListView /> */}
            <PropertyGrid/>
        <PromoPage/>

        <PropertyBudget/>

          </Box>
        </SimpleBar>




      {/* </Box> */}

      <Footer/>
    </Box>
    {WhatsAppButton}
    </>
  );
}
