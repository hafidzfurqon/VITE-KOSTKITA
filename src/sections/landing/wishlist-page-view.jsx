import { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import { Bookmark, Home } from '@mui/icons-material';
import { useFetchWishlist } from 'src/hooks/users/useFetchWishlist';
import { useMutationRemoveWishlist } from 'src/hooks/users/useMutationRemoveWishlist';
import Loading from 'src/components/loading/loading';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Apartment } from '@mui/icons-material';

export default function WishlistPageView() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetchWishlist();

  const { mutateAsync: removeWishlist, isLoading: isRemoving } = useMutationRemoveWishlist({
    onSuccess: () => {
      enqueueSnackbar('Dihapus dari wishlist', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['all.wishlist'] });
    },
    onError: () => {
      enqueueSnackbar('Gagal menghapus dari wishlist', { variant: 'error' });
    },
  });

  const getPropertyIcon = (type) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  if (isLoading) return <Loading />;

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const handleRemoveClick = (item) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedItem) return;
    try {
      await removeWishlist({ wishlist_ids: [selectedItem.id] });
      setConfirmOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Gagal menghapus item:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* <Typography variant="h5" gutterBottom fontWeight="bold">
        Daftar wishlist
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Tempat untuk menyimpan wishlist Anda!
      </Typography> */}
      <CustomBreadcrumbs
        heading="Daftar wishlist"
        links={[{ name: 'Home', href: '/' }, { name: 'Wishlist' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box mt={2} maxWidth="100%">
        <Grid container spacing={2}>
          {data?.map((item) => {
            const property = item.property;
            const hasDiscount = property.discounts?.length > 0;
            const activePromos = property.promos || [];
            const hasPromo = activePromos.length > 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2, minHeight: 320 }}>
                  <ImageSlider images={property.files} />

                  <CardContent>
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Chip
                        icon={getPropertyIcon(property.type.name)}
                        label={property.type.name}
                        sx={{ mb: 1, fontWeight: 600 }}
                      />
                      <IconButton onClick={() => handleRemoveClick(item)}>
                        <Bookmark color="primary" />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {property?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {property?.sector?.name}, {property?.city?.name}, {property?.state?.name}
                    </Typography>
                    {hasDiscount ? (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                          <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ textDecoration: 'line-through', fontSize: '12px' }}
                          >
                            {formatCurrency(property.start_price)}
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
                            -Rp {property.discounts[0]?.discount_value}
                          </Box>
                          <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                            {formatCurrency(property.discounts[0]?.price_after_discount)}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {hasPromo &&
                            activePromos.map((promo, index) => (
                              <Chip key={index} label={promo.code} color="primary" />
                            ))}
                        </Stack>
                      </>
                    ) : (
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '14px' }}>
                        {formatCurrency(property.start_price)} /{' '}
                        {property?.payment_type === 'yearly' ? 'Tahun' : 'Bulan'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Hapus dari Wishlist?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Batal</Button>
          <Button
            onClick={handleConfirmRemove}
            color="error"
            variant="contained"
            disabled={isRemoving}
          >
            {isRemoving ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function ImageSlider({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    mode: 'free-snap',
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const prevSlide = () => instanceRef.current?.prev();
  const nextSlide = () => instanceRef.current?.next();

  return (
    <Box
      sx={{
        position: 'relative',
        height: 200,
        backgroundColor: 'grey.300',
        '&:hover .slider-arrow': { opacity: 1 },
      }}
    >
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box sx={{ borderRadius: 2 }} key={index} className="keen-slider__slide">
              <img
                src={image.file_url}
                alt={`Apartement Image ${index}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </Box>
          ))
        ) : (
          <Box
            className="keen-slider__slide"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: 'gray',
            }}
          >
            <Typography variant="caption" color="white">
              No Image Available
            </Typography>
          </Box>
        )}
      </Box>

      {images.length > 1 && (
        <>
          <Box
            className="slider-arrow"
            sx={{
              position: 'absolute',
              top: '50%',
              left: 10,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'black',
              p: 1,
              borderRadius: '20%',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            onClick={prevSlide}
          >
            {'<'}
          </Box>
          <Box
            className="slider-arrow"
            sx={{
              position: 'absolute',
              top: '50%',
              right: 10,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'black',
              p: 1,
              borderRadius: '20%',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            onClick={nextSlide}
          >
            {'>'}
          </Box>
        </>
      )}

      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? 'black' : 'white',
                opacity: index === currentSlide ? 1 : 0.5,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
