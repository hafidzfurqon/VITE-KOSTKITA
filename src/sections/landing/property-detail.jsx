import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
// icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Button } from '@mui/material';
import { BookmarkBorder, DateRange, WhatsApp } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
import PropertyRoom from './property-room';
import FacilityModal from './modal-facility';
import { useAppContext } from 'src/context/user-context';
import { Bookmark } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import ModalVisit from './visit/modal-visit';
import { useMutationAddWishlist } from 'src/hooks/users/useMutationAddWishlist';
import { useMutationRemoveWishlist } from 'src/hooks/users/useMutationRemoveWishlist';
import Review from './review';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PolicyPage from './policy-page';
import PropertyBaseLocation from './PropertyLocation';
import NearbyPlaces from './nearbly-places';

export default function PropertyDetail() {
  const { slug } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, error } = useFetchPropertySlug(slug);

  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [visitModal, setVisitModal] = useState(false);
  const { UserContextValue: authUser } = useAppContext();
  const [isWishlist, setIsWishlist] = useState(data?.is_wishlist ?? false);
  const { user } = authUser;
  const isOwnerId = user?.id;
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

  // const hasDiscount = data?.discounts && data?.discounts?.length > 0;

  const { mutateAsync: addWishlist, isLoading: isAdding } = useMutationAddWishlist({
    onSuccess: () => {
      setIsWishlist(true);
      enqueueSnackbar('Ditambahkan ke wishlist', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Gagal menambahkan ke wishlist', { variant: 'error' });
    },
  });

  const { mutateAsync: removeWishlist, isLoading: isRemoving } = useMutationRemoveWishlist({
    onSuccess: () => {
      setIsWishlist(false);
      enqueueSnackbar('Dihapus dari wishlist', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Gagal menghapus dari wishlist', { variant: 'error' });
    },
  });

  const [selectedMonthRange, setSelectedMonthRange] = useState(0);

  const discountRanges = useMemo(() => data?.discounts || [], [data?.discounts]);

  const currentMonths = useMemo(() => {
    switch (selectedMonthRange) {
      case 0:
        return 1;
      case 1:
        return 3;
      case 2:
        return 6;
      case 3:
        return 12;
      default:
        return 1;
    }
  }, [selectedMonthRange]);

  const applicableDiscount = useMemo(
    () =>
      discountRanges.find(
        (discount) => currentMonths >= discount.min_month && currentMonths <= discount.max_month
      ),
    [currentMonths, discountRanges]
  );

  const priceAfterDiscount = useMemo(() => {
    const basePrice = data?.start_price || 0;
    return applicableDiscount && applicableDiscount.discount_value
      ? basePrice * (1 - applicableDiscount.discount_value / 100)
      : basePrice;
  }, [applicableDiscount, data?.start_price]);

  const hasDiscount = useMemo(() => applicableDiscount?.discount_value > 0, [applicableDiscount]);

  useEffect(() => {
    setIsWishlist(data?.is_wishlist ?? false); // Pastikan selalu ada nilai
  }, [data?.is_wishlist]);

  const handleWishlistToggle = async () => {
    if (!user) {
      enqueueSnackbar('Anda harus login untuk menambahkan ke wishlist', { variant: 'warning' });
      return;
    }

    if (!data?.id) {
      enqueueSnackbar('Data tidak valid', { variant: 'error' });
      return;
    }

    const propertyId = data.id;
    const propertyRoomId = data.rooms?.length ? data.rooms[0].id : null;

    const wishlistData = {
      property_id: propertyId,
      ...(propertyRoomId && { property_room_id: propertyRoomId }),
    };

    try {
      if (isWishlist) {
        await removeWishlist({ wishlist_ids: Array.isArray(data.id) ? data.id : [data.id] });
        setIsWishlist(false);
        enqueueSnackbar('Dihapus dari wishlist', { variant: 'success' });
      } else {
        await addWishlist(wishlistData);
        setIsWishlist(true);
        enqueueSnackbar('Ditambahkan ke wishlist', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Terjadi kesalahan, coba lagi', { variant: 'error' });
    }
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

  const tipeProperty = data.type.name.toLowerCase();
  // console.log(tipeProperty)
  return (
    <>
      <Helmet>
        <title>{data.name} - KostKita</title>
        <meta name="title" content={data.name} />
        <meta name="description" content={data.description.replace(/<[^>]*>?/gm, '')} />
        <meta property="og:image" content={data?.files[0]?.file_url} />
        <meta name="keywords" content={data.name} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`http://kostkita-ids.vercel.app/property/${data.slug}`} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.description.replace(/<[^>]*>?/gm, '')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.name} />
        <meta property="twitter:description" content={data.description.replace(/<[^>]*>?/gm, '')} />
        <meta name="twitter:image" content={data?.files[0]?.file_url} />
        <meta
          property="twitter:url"
          content={`http://kostkita-ids.vercel.app/property/${data.slug}`}
        />
        <meta property="og:type" content={`website`} />
        <meta property="og:title" content={`KostKita Property ${data.name}`} />
        <meta property="og:description" content={`${data.description}`} />
        <meta property="og:image" content={`${data?.files[0]?.file_url}`} />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ display: 'grid', width: '100%' }}>
          <CustomBreadcrumbs
            links={[
              { name: 'Home', href: '/' },
              tipeProperty === 'apartment'
                ? { name: 'Apartment', href: '/apartment' }
                : { name: 'Kost & Coliving', href: '/coliving' },
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
        <Box sx={{ mb: 2 }}>
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
                <IconButton
                  onClick={handleWishlistToggle}
                  color="primary"
                  disabled={isAdding || isRemoving}
                >
                  {isWishlist ? <Bookmark color="primary" /> : <BookmarkBorder />}
                </IconButton>

                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Bagian Lokasi dan Jenis Properti */}
            <Grid item xs={12} sm={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <HomeIcon color="action" />
                <Typography>{data.type.name}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <StarIcon color="warning" fontSize="small" />
                  <Typography>{data.average_rating}</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ my: 2 }} direction="row" spacing={1} alignItems="center">
                <LocationOnIcon color="action" />
                <Typography color="text.secondary">
                  {data.address}, {data.city?.name}, {data.state?.name}
                </Typography>
              </Stack>
            </Grid>

            {/* Bagian Harga dengan Card */}
            <Grid item xs={12} sm={4} sx={{ mt: 1 }}>
              <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', mb: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  {[0, 1, 2, 3].map((rangeIndex) => (
                    <Box
                      key={rangeIndex}
                      onClick={() => setSelectedMonthRange(rangeIndex)}
                      sx={{
                        p: 1,
                        flex: '1 1 25%',
                        textAlign: 'center',
                        borderRight: rangeIndex < 3 ? '1px solid #e0e0e0' : 'none',
                        backgroundColor:
                          selectedMonthRange === rangeIndex ? '#f0f7ff' : 'transparent',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: selectedMonthRange === rangeIndex ? 600 : 500,
                        }}
                      >
                        {rangeIndex === 0
                          ? '1-2'
                          : rangeIndex === 1
                            ? '3-5'
                            : rangeIndex === 2
                              ? '6-11'
                              : '>12'}{' '}
                        <Typography component="span" sx={{ fontSize: '12px', color: '#666' }}>
                          bulan
                        </Typography>
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {hasDiscount ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{ textDecoration: 'line-through', color: 'gray' }}
                    >
                      {formatCurrency(data?.start_price)}/
                      {data?.payment_type === 'yearly' ? 'Tahun' : 'bulan'}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      {priceAfterDiscount}/bulan
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" sx={{ color: 'black' }}>
                    {formatCurrency(data?.start_price)}/
                    {data?.payment_type === 'yearly' ? 'Tahun' : 'bulan'}
                  </Typography>
                )}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 3,
                    justifyContent: { xs: 'center', sm: 'space-between' },
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  {data?.rooms?.length > 0 && (
                    <Button
                      href="#room"
                      variant="outlined"
                      color="primary"
                      sx={{
                        height: 48,
                        minWidth: '150px',
                        flexGrow: { xs: 1, sm: 0 },
                      }}
                    >
                      Lihat Tipe Kamar
                    </Button>
                  )}

                  {data.rooms.length === 0 && !['admin', 'owner_property'].includes(user.roles) && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isOwnerId === data.created_by.id}
                      sx={{ mt: 2 }}
                      onClick={() => {
                        if (user.length === 0) {
                          enqueueSnackbar('Anda harus login terlebih dahulu!', {
                            variant: 'error',
                          });

                          navigate(`/sign-in`);
                        } else {
                          navigate(`/booking/${data.slug}`);
                        }
                      }}
                    >
                      {isOwnerId === data.created_by.id
                        ? 'Property ini milik Anda'
                        : 'Booking Sekarang'}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth={data?.rooms?.length === 0}
                    startIcon={<WhatsAppIcon />}
                    href={`https://wa.me/6289668078854?text=${encodeURIComponent(`Halo KostKita,\n\nSaya ingin menanyakan Kost ${data?.name}, Boleh dibantu?\n\nTerima kasih`)}`}
                    target="_blank"
                    sx={{
                      color: '#25D366',
                      height: 48,
                      minWidth: '150px',
                      flexGrow: { xs: 1, sm: 0 },
                    }}
                  >
                    Chat KostKita
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Description */}
          {data.description && (
            <>
              <Typography variant="subtitle1">Description :</Typography>
              <Typography
                color="text.secondary"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </>
          )}

          {data.facilities.length > 0 && (
            <>
              <hr />
              <Box sx={{ mx: 2, my: 3 }}>
                <Typography variant="subtitle1">Fasilitas Bersama</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // 1 kolom di HP, 2 kolom di layar lebih besar
                    gap: 2,
                    mt: 4,
                  }}
                >
                  {data.facilities?.slice(0, 4).map((fasilitas, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="mingcute:check-line" />
                      <Typography color="text.secondary">{fasilitas.name}</Typography>
                    </Box>
                  ))}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ textDecoration: 'underline', cursor: 'pointer', mt: 2 }}
                  onClick={() => setOpen(true)}
                >
                  Lihat Selengkapnya
                </Typography>
                <FacilityModal
                  isOpen={open}
                  title="Fasilitas Bersama"
                  onClose={() => setOpen(false)}
                  facilities={data.facilities}
                />
              </Box>

              <hr />
            </>
          )}
          <Review propertyId={data.id} />

          <hr />
          <NearbyPlaces data={data} />
          <hr />

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
        <hr />
        <Box sx={{ my: 5 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Visit Hunian
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Jika kamu ingin melihat hunian secara langsung, kamu bisa menjadwakan visit ke hunian
            ini
          </Typography>
          <Button
            onClick={() => setVisitModal(true)}
            variant="outlined"
            sx={{ p: 2 }}
            display={'flex'}
            alignItems={'center'}
          >
            <DateRange />
            <Typography variant="subtitle1" ml={1}>
              Jadwalkan Visit
            </Typography>
          </Button>
        </Box>
        {/* Modal visit */}
        <ModalVisit isOpen={visitModal} onClose={() => setVisitModal(false)} data={data} />
        <hr />
        <Box sx={{ mt: 5, mb: 5 }} id="room">
          <PropertyRoom
            rooms={data?.rooms}
            payment={data?.payment_type}
            namaProperty={data?.name}
            slug={data?.slug}
          />
          {/* <PropertyRoom rooms={data.rooms} data={data} /> */}
        </Box>
        <hr />
        <PolicyPage />
        <hr />
        <PropertyBaseLocation data={data?.city?.city_code} />
      </Container>
    </>
  );
}
