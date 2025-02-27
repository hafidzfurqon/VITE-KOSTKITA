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
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Loading from 'src/components/loading/loading';
import ApartementGrid from '../apartement/view/apartement-landing-grid';
import { Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropertyBaseLocation from './property-location/propety-base-location';


export function LandingPage() {
  const navigate = useNavigate()
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
          bgcolor: '#f5f5f5',
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
            <Box sx={{ 
          bgcolor: '#FAF9F6', 
          pb: 8, 
          borderRadius: '16px', 
          mt: 5, 
          border: {md : "solid black 1px"}
        }}>
    <PropertyGrid />

    {/* Container untuk pusatkan button */}
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant='outlined' 
          sx={{ 
            width : {xs : '100%', md : 'auto'},
            p: 2, 
            color: 'black', 
            bgcolor: 'white', 
            mx: 3, 
            display: 'flex', 
            alignItems: 'center'
          }}
          onClick={() => navigate('/coliving')}
          >
            Lihat Semua
        </Button>
    </Box>
</Box>

            <PromoPage />
            <Container sx={{ display : 'flex', alignItems : 'center', justifyContent : 'space-between', mb : 3}}>
              <Typography sx={{ fontSize: { xs: '20px', md: '30px', fontWeight: 'bold' } }}>
                Cari hunian sesuai lokasi
              </Typography>
              <hr />
            </Container>
              <PropertyBaseLocation/>
            <Container sx={{ display : 'flex', alignItems : 'center', justifyContent : 'space-between'}}>
              <Typography sx={{ fontSize: { xs: '20px', md: '30px', fontWeight: 'bold' } }}>
                Cari Apartement
              </Typography>
              <Link to="/promo">
            <Button
              sx={{
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: '500',
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '10px', md: 10 } }} />}
            >
              <Typography
                sx={{ fontSize: { xs: '12px', md: '16px' }, textDecoration: 'underline' }}
              >
                Lihat Semua
              </Typography>
            </Button>
          </Link>
            </Container>
            <ApartementGrid />
            <PropertyBudget />
          </Box>
        </SimpleBar>
        <Footer />
      </Box>
      {WhatsAppButton}
    </>
  );
}
