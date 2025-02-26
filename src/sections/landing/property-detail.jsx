import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
// icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Button } from '@mui/material';
import { WhatsApp } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
import { fPercent } from 'src/utils/format-number';
import PropertyRoom from './property-room';

export default function PropertyDetail() {
  const { slug } = useParams();
  const { data, isLoading, isFetching, error } = useFetchPropertySlug(slug);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const allFiles = data?.files?.map((file) => file) || [];
  const slides = allFiles.map((file) => file.file_url);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const hasDiscount = data?.discounts && data?.discounts?.length > 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading || isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading property details. Please try again later.</Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No property details found.</Alert>
      </Container>
    );
  }
  return (
    <>
      <Helmet>
        <meta property="og:url" content={`http://kostkita-id.vercel.app/property/${data.slug}`} />
        <meta property="og:type" content={`website`} />
        <meta property="og:title" content={`KostKita Property ${data.name}`} />
        <meta property="og:description" content={`${data.description}`} />
        {/* <meta property="og:image" content={`${data?.files[0].file_url}`} /> */}
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ display: 'grid', width: '100%' }}>
          <CustomBreadcrumbs
            links={[
              { name: 'Home', href: '/' },
              { name: <span dangerouslySetInnerHTML={{ __html: data.slug }} />, href: '' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </Box>

        {/* Image Gallery */}
        {slides.length > 0 && (
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '56.25%',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={slides[currentImageIndex]}
                alt={data.name}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {slides.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}

            {/* Thumbnails */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {slides.map((slide, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: index === currentImageIndex ? 2 : 0,
                    borderColor: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={slide}
                    alt={`${data.name} ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Property Details */}
        <Box sx={{ mb: 4 }}>
          <Grid sx={{ mb: 5 }} container spacing={3} alignItems="center">
            {/* Bagian Judul */}
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" gutterBottom>
                {data.name}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <IconButton onClick={() => setIsFavorite(!isFavorite)} color="error">
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Bagian Lokasi dan Jenis Properti */}
            <Grid item xs={12} sm={8}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon color="action" />
                <Typography color="text.secondary">
                  {data.address}, {data.city?.name}, {data.state?.name}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <HomeIcon color="action" />
                <Typography>{data.type.name}</Typography>
              </Stack>
            </Grid>

            {/* Bagian Harga dengan Card */}
            <Grid item xs={12} sm={4} sx={{ mt: 1 }}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                {hasDiscount ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                      <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ textDecoration: 'line-through', fontWeight: 700, fontSize: '12px' }}
                      >
                        {formatCurrency(data.start_price)}/
                        {data.payment_type === 'monthly' ? 'bulan' : 'Tahun'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={{
                          backgroundColor: 'red',
                          color: 'white',
                          fontSize: '11px',
                          borderRadius: '10px',
                          px: '5px',
                        }}
                      >
                        -Rp {fPercent(data.discounts[0].discount_value)}
                      </Box>
                      <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                        {formatCurrency(data.discounts[0].price_after_discount)}/
                        {data.payment_type === 'monthly' ? 'bulan' : 'Tahun'}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                    {formatCurrency(data.start_price)}/
                    {data.payment_type === 'monthly' ? 'bulan' : 'Tahun'}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button variant="outlined" color="primary" sx={{ mb: 2, height: 48 }} fullWidth>
                    Lihat Kamar
                  </Button>

                  {/* Tombol WhatsApp */}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<WhatsApp />}
                    href={`https://wa.me/${data.phone}`}
                    target="_blank"
                    fullWidth
                    sx={{
                      color: '#25D366 ',
                      height: 48,
                    }}
                  >
                    WhatsApp
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/booking/${data.slug}`)}
                >
                  Booking Sekarang
                </Button>
              </Card>
            </Grid>
          </Grid>

          {/* Description */}
          {data.description && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="subtitle1">Description</Typography>
                <Typography
                  color="text.secondary"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
                <Typography color="text.secondary">
                  <span dangerouslySetInnerHTML={{ __html: data.description }} />
                </Typography>
              </CardContent>
            </Card>
          )}
          {data.facilities.length > 0 && (
            <>
              <hr />
              <Box sx={{ mx: 2, my: 3 }}>
                <Typography variant="subtitle1">Fasilitas Bersama</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    mt: 4,
                    gap: 2,
                    pb: 1, // Agar scrollbar tidak menutupi konten
                    '&::-webkit-scrollbar': {
                      display: 'none', // Sembunyikan scrollbar
                    },
                  }}
                  direction="row"
                  spacing={1}
                  mb={3}
                >
                  {data.facilities?.slice(0, 5).map((fasilitas, idx) => (
                    <>
                      {/* <Iconify icon="material-symbols:check" /> */}
                      <Iconify icon="mingcute:check-line" />
                      <Typography color="text.secondary" key={idx}>
                        {fasilitas.name}
                      </Typography>
                    </>
                  ))}
                </Box>
                <Typography variant="subtitle1" sx={{ textDecoration: 'underline' }}>
                  Lihat Selengkapnya
                </Typography>
                {/* Kalau fasilitas lebih dari 5 ke selengkapnya aja fi */}
              </Box>
              <hr />
            </>
          )}
          {/* Google Maps */}
          {data.link_googlemaps && (
            <Card sx={{ mt: 5 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Location
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',

                    height: 400,
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.link_googlemaps
                        .replace(/width="\d+"/, 'width="100%"')
                        .replace(/height="\d+"/, 'height="100%"'),
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
        <Divider />
        <PropertyRoom rooms={data.rooms} />
      </Container>
    </>
  );
}
