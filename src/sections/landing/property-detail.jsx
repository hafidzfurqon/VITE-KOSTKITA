import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
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
import PaymentIcon from '@mui/icons-material/Payment';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Button } from '@mui/material';
import { WhatsApp } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export default function PropertyDetail() {
  const { slug } = useParams();
  const { data, isLoading, isFetching, error } = useFetchPropertySlug(slug);
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
        <meta property="og:image" content={`${data.files[0].file_url}`} />
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
            <Grid item xs={12} sm={8} sx={{ mt: 2 }}>
              <Typography variant="h4" gutterBottom>
                {data.name}
              </Typography>
            </Grid>

            {/* Bagian Tombol Favorite dan Share */}
            <Grid item xs={12} sm={4} sx={{ textAlign: 'right', mt: 2 }}>
              <IconButton onClick={() => setIsFavorite(!isFavorite)} color="error">
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
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
                {/* <Typography variant="subtitle1">Price:</Typography> */}
                <Typography color="primary.main" variant="h5" sx={{ mb: 1 }}>
                  {formatPrice(data.start_price)}/{data.payment_type}
                </Typography>
                {/* Tombol WhatsApp */}
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<WhatsApp />}
                  href={`https://wa.me/${data.phone}`}
                  target="_blank"
                  fullWidth
                >
                  WhatsApp
                </Button>
              </Card>
            </Grid>
          </Grid>

          {/* Description */}
          {data.description && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="subtitle1">Description</Typography>
                <Typography color="text.secondary">{data.description}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Google Maps */}
          {data.link_googlemaps && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Location
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1660035799!2d106.8363308!3d-6.2418409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3004387f7ad%3A0xe5f8396672af0f36!2sKementerian%20UMKM!5e0!3m2!1sid!2sid!4v1739507646343!5m2!1sid!2sid`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </>
  );
}
