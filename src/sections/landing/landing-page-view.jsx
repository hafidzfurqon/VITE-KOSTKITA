import { Box, Fab, Typography, Container, Button, IconButton } from '@mui/material';
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

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('kost');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Terbaru'); // Default ke "Populer"
  const [sortBy, setSortBy] = useState(['coliving', 'kost']);
  const { data, isLoading, isFetching } = useListProperty();
  const [searchParams, setSearchParams] = useState({
    query: '',
    date: '',
    type: '',
  });

  const filteredData = Object.values(searchParams).some((val) => val.trim() !== '')
    ? data?.filter((property) => {
        const query = searchParams.query.trim().toLowerCase();
        const dateQuery = searchParams.date.trim();
        const typeQuery = searchParams.type.trim().toLowerCase();

        const matchesQuery = query
          ? [
              property.name,
              property.state?.name,
              property.city?.name,
              property.sector?.name,
              property.address,
            ]
              .filter(Boolean)
              .map((item) => item.toLowerCase())
              .some((item) => item.includes(query))
          : true;

        const matchesDate = dateQuery ? property.created_at === dateQuery : true;

        const matchesType = typeQuery
          ? property.type?.name?.toLowerCase().includes(typeQuery)
          : true;

        return matchesQuery && matchesDate && matchesType;
      })
    : data;

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
            <HeroContent setSearchParams={setSearchParams} />
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
                Property terbaru dari kami
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
            <Box
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
                data={filteredData}
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
            </Box>

            <PromoPage />

            <Container
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
            >
              <Typography sx={{ fontSize: { xs: '20px', md: '30px' }, fontWeight: 'bold' }}>
                Cari hunian sesuai lokasi
              </Typography>
            </Container>

            <PropertyBaseLocation />

            <Container
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
            >
              <Typography sx={{ fontSize: { xs: '20px', md: '30px' }, fontWeight: 'bold' }}>
                Cari Apartement
              </Typography>
              <Link to="/apartment">
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
