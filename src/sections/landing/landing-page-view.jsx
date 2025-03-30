import { Box, Fab, Typography, Container, Button, IconButton, Stack, Card } from '@mui/material';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Iconify } from 'src/components/iconify';
import Header from './header';
import HeroContent from './hero-content';
import HeroSection from './hero-section';
import PropertyGrid from './property-grid';
import Footer from './footer';
import PromoPage from './promo-page';
import PropertyBudget from './property-budget';
import 'keen-slider/keen-slider.min.css';
import ApartementGrid from '../apartement/view/apartement-landing-grid';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropertyBaseLocation from './property-location/propety-base-location';
import { Helmet } from 'react-helmet-async';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { PostSort } from '../blog/post-sort';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useState, useCallback } from 'react';
import Directory from 'src/component/QuickAccessPage';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('kost');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Terbaru'); // Default ke "Populer"
  const [sortBy, setSortBy] = useState(['coliving', 'kost']);
  const { data, isLoading, isFetching } = useListProperty();
  // const [searchParams, setSearchParams] = useState({
  //   query: '',
  //   date: '',
  //   type: '',
  // });

  // const filteredData = Object.values(searchParams).some((val) => val.trim() !== '')
  //   ? data?.filter((property) => {
  //       const query = searchParams.query.trim().toLowerCase();
  //       const dateQuery = searchParams.date.trim();
  //       const typeQuery = searchParams.type.trim().toLowerCase();
  // const [searchParams, setSearchParams] = useState({
  //   query: '',
  //   date: '',
  //   type: '',
  // });

  // const filteredData = Object.values(searchParams).some((val) => val.trim() !== '')
  //   ? data?.filter((property) => {
  //       const query = searchParams.query.trim().toLowerCase();
  //       const dateQuery = searchParams.date.trim();
  //       const typeQuery = searchParams.type.trim().toLowerCase();

  //       const matchesQuery = query
  //         ? [
  //             property.name,
  //             property.state?.name,
  //             property.city?.name,
  //             property.sector?.name,
  //             property.address,
  //           ]
  //             .filter(Boolean)
  //             .map((item) => item.toLowerCase())
  //             .some((item) => item.includes(query))
  //         : true;

  //       const matchesDate = dateQuery ? property.created_at === dateQuery : true;

  //       const matchesType = typeQuery
  //         ? property.type?.name?.toLowerCase().includes(typeQuery)
  //         : true;

  //       return matchesQuery && matchesDate && matchesType;
  //     })
  //   : data;

  const handleSort = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);
  const categories = {
    kost: [
      { name: 'Populer', icon: <ThumbUpIcon sx={{ color: 'black' }} /> },
      { name: 'Terbaru', icon: <AutoAwesomeIcon sx={{ color: 'black' }} /> },
      { name: 'Bogor', icon: <LocationCityIcon sx={{ color: 'black' }} /> },
    ],
    apartemen: [{ name: 'Bogor', icon: <LocationCityIcon sx={{ color: 'black' }} /> }],
  };
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
          mr: 1,
          boxShadow: 2,
        }}
      >
        Live Chat
      </Typography>

      <Fab
        size="medium"
        aria-label="WhatsApp"
        href="https://wa.me/628123456789"
        sx={{
          width: 44,
          height: 44,
          bgcolor: '#25D366',
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
      <Helmet>
        <meta property="og:url" content="http://kostkita-ids.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KostKita Property & Kost" />
        <meta
          name="description"
          content="Temukan kost terbaik dengan harga terjangkau dan lokasi strategis. Cek sekarang!"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="public/asset/images/Kost.pdf (2).png" />
      </Helmet>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <HeroSection>
            <Header />
            <HeroContent data={data} />
          </HeroSection>
        </Box>

        <SimpleBar style={{ maxHeight: '100%', width: '100%' }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, px: 4, pb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                mb: { xs: 5, md: 10 },
                flexWrap: 'wrap',
                alignItems: { xs: 'left', md: 'center' },
                gap: 3,
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                <span style={{ color: '#FFCC00' }}>Property</span> terbaru dari kami
              </Typography>
              <PostSort
                sortBy={sortBy}
                onSort={handleSort}
                options={[
                  { value: ['coliving', 'kost'], label: 'Kost Coliving' }, // ✅ Array untuk multiple filter
                  { value: ['apartment'], label: 'Apartement' },
                ]}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                gap: 7,
                pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
              }}
              onWheel={(e) => {
                const container = e.currentTarget;
                container.scrollLeft += e.deltaY;
              }}
            >
              {categories[selectedCategory].map((category) => (
                <Box
                  key={category.name}
                  sx={{ textAlign: 'center', flex: '0 0 auto', cursor: 'pointer' }}
                  onClick={() => setSelectedSubCategory(category.name)}
                >
                  <IconButton
                    sx={{
                      backgroundColor: '#FFD700',
                      width: 48,
                      height: 48,
                      mb: 1,
                      '&:hover': { backgroundColor: '#FFC700' },
                    }}
                  >
                    {category.icon}
                  </IconButton>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      color: 'black',
                      fontWeight: selectedSubCategory === category.name ? 'bold' : 'normal',
                      borderBottom:
                        selectedSubCategory === category.name ? '3px solid black' : 'none',
                      // display: 'inline-block',
                      paddingBottom: 1,
                    }}
                  >
                    {category.name}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Container
              sx={{
                bgcolor: '#F0EFEA',
                pb: 8,
                borderRadius: '16px',
                mt: 5,
                // border: { md: 'solid rgba(255, 255, 255, 0.6) 1px' },
                border: { md: 'solid white 1px ' },
                boxShadow: { md: '0 0 5px rgba(255, 255, 255, 0.5)' },
              }}
            >
              <PropertyGrid
                data={data}
                isLoading={isLoading}
                isFetching={isFetching}
                sortCardBy={sortBy}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  sx={{
                    width: { xs: '100%', md: 'auto' },
                    p: 2,
                    color: 'black',
                    bgcolor: 'white',
                    mx: 3,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() =>
                    sortBy[0] === 'apartment' ? navigate('/apartment') : navigate('/coliving')
                  }
                >
                  Lihat Semua
                </Button>
              </Box>
            </Container>
          </Box>
        </SimpleBar>
        <Box sx={{ backgroundColor: 'white', pt: 5, pb: 5 }}>
          <Container>
            <PromoPage />
          </Container>
        </Box>
        <Box sx={{ backgroundColor: 'white', pt: 5, pb: 5 }}>
          {/* <Container> */}
          <PropertyBaseLocation />
          {/* </Container> */}
        </Box>

        {/* <Box sx={{ bgcolor: 'white', pt: 5, pb: 10, px: 3 }}>
          <Box sx={{ mt: 2 }}>
            <Container>
              <ApartementGrid />
            </Container>
          </Box>
        </Box> */}
        <PropertyBudget />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            sx={{
              width: { xs: '100%', md: 'auto' },
              p: 2,
              color: 'black',
              bgcolor: 'white',
              mx: 3,
              mb: 5,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => navigate('/coliving')}
          >
            Lihat Semua
          </Button>
        </Box>

        <Box>
          <Box sx={{ bgcolor: 'white', pt: 10, pb: 15 }}>
            <Typography
              sx={{
                fontSize: { xs: '22px', md: '30px' },
                fontWeight: 'bold',
                textAlign: 'center',
                mb: { xs: 6, md: 12 },
              }}
            >
              Mengapa Tinggal di <span style={{ color: '#FFCC00' }}>KostKita?</span>
            </Typography>
            <Container>
              <Stack
                direction={{ xs: 'column', md: 'row-reverse', mt: 4 }}
                spacing={4}
                alignItems="center"
              >
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Harga <span style={{ color: '#FFCC00' }}>Terjangkau</span>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ maxWidth: '500px', fontWeight: 200, letterSpacing: '1px' }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit atque, ipsam
                    necessitatibus corporis minima dignissimos rem. Quas soluta natus eos magni
                    ducimus vitae libero molestias, ut unde, alias autem fuga? Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Itaque cum quis aspernatur nesciunt
                    asperiores mollitia ratione explicabo corporis dicta nostrum!
                  </Typography>
                  <Button
                    variant="outlined"
                    href="/coliving"
                    // download
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderColor: 'primary',
                      color: 'primary',
                      ':hover': { backgroundColor: 'black', color: 'white' },
                    }}
                  >
                    Cari Hunian
                  </Button>
                </Box>

                <Box
                  sx={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}
                >
                  <Card
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: 'primary',
                      p: 1,
                      borderRadius: 1,
                      boxShadow: 3,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Aesthetic
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      backgroundColor: 'primary',
                      p: 1,
                      borderRadius: 1,
                      boxShadow: 3,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Murah
                    </Typography>
                  </Card>
                  <img
                    src="https://backend-koskita.hafidzfrqn.serv00.net//storage/banner_images/2/8sfikdpc48ilITfQXbYUQPA62kJU0sDaOUhtn5R8.jpg"
                    alt="Muhammad Hafidz"
                    loading="lazy"
                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </Box>
              </Stack>
            </Container>
          </Box>
        </Box>
        <Box>
          <Box sx={{ pt: 10, pb: 15 }}>
            <Container>
              <Stack direction={{ xs: 'column', md: 'row', mt: 4 }} spacing={4} alignItems="center">
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Tempat <span style={{ color: '#FFCC00' }}>Aesthetic</span>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ maxWidth: '500px', fontWeight: 200, letterSpacing: '1px' }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit atque, ipsam
                    necessitatibus corporis minima dignissimos rem. Quas soluta natus eos magni
                    ducimus vitae libero molestias, ut unde, alias autem fuga? Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Itaque cum quis aspernatur nesciunt
                    asperiores mollitia ratione explicabo corporis dicta nostrum!
                  </Typography>
                  <Button
                    variant="outlined"
                    href="/coliving"
                    // download
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderColor: 'primary',
                      color: 'primary',
                      ':hover': { backgroundColor: 'black', color: 'white' },
                    }}
                  >
                    Cari Kost
                  </Button>
                </Box>

                <Box
                  sx={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}
                >
                  <Card
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: 'primary',
                      p: 1,
                      borderRadius: 1,
                      boxShadow: 3,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Aesthetic
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      backgroundColor: 'primary',
                      p: 1,
                      borderRadius: 1,
                      boxShadow: 3,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Elegant
                    </Typography>
                  </Card>
                  <img
                    src="https://backend-koskita.hafidzfrqn.serv00.net//storage/property_files/4/b25bf50d-8f4.jpg"
                    alt="Muhammad Hafidz"
                    loading="lazy"
                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </Box>
              </Stack>
            </Container>
          </Box>
        </Box>
        <Box>
          <Box sx={{ pt: 10, pb: 15 }}>
            <Container>
              <Directory />
            </Container>
          </Box>
        </Box>
        <Footer />
      </Box>

      {WhatsAppButton}
    </>
  );
}
