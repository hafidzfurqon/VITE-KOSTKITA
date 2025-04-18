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

import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Avatar, Button, Divider, useMediaQuery } from '@mui/material';
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
import { ImageList } from '@mui/material';
import { ImageListItem } from '@mui/material';
import FullScreenDialog from 'src/component/DialogFull';
import PropertyBaseLocation from './PropertyLocation';
import NearbyPlaces from './nearbly-places';
import { LoadingButton } from '@mui/lab';
import { RoomWithTabs } from 'src/component/RoomPrice';

export default function PropertyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, error } = useFetchPropertySlug(slug);
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [visitModal, setVisitModal] = useState(false);
  const { UserContextValue: authUser } = useAppContext();
  const [isWishlist, setIsWishlist] = useState(data?.is_wishlist ?? false);
  const { user } = authUser;
  const isOwnerId = user?.id;
  const isAlreadyBooked = data?.bookings?.some((booking) => booking.user_id === user.id);
  const allFiles = data?.files?.map((file) => file) || [];
  const slides = allFiles.map((file) => file.file_url);
  console.log(slides);
  const handleCloseDialog = () => {
    setOpened(false);
  };

  const handleOpenDialog = () => {
    setOpened(true);
  };

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
        await removeWishlist({ wishlist_ids: [data.id] });
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
  function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  }
  if (slides.length === 0) return null;

  const imageConfig = [
    { cols: 1, rows: 1 }, // First image (larger)
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ];

  const oneMonthData = (() => {
    if (!data?.rooms) return null;

    // Ambil semua data harga 1 bulan + diskonnya
    const pricesWithDiscount = data.rooms
      .map((room) => {
        const priceItem = room.room_prices.find((price) => price.duration === '1_month');
        if (!priceItem) return null;

        const discount = priceItem.room_discounts?.[0];
        const discountValue = discount?.discount_value ? parseFloat(discount.discount_value) : 0;

        const finalPrice = priceItem.price - priceItem.price * (discountValue / 100);

        return {
          room,
          price: priceItem.price,
          discountValue,
          finalPrice,
        };
      })
      .filter(Boolean);

    if (pricesWithDiscount.length === 0) return null;

    // Cari finalPrice termurah
    const minData = pricesWithDiscount.reduce((min, curr) =>
      curr.finalPrice < min.finalPrice ? curr : min
    );

    return minData;
  })();

  const matchedRooms = (() => {
    if (!oneMonthData || !data?.rooms) return [];

    return data.rooms.filter((room) => {
      const priceItem = room.room_prices.find((price) => price.duration === '1_month');
      if (!priceItem) return false;

      const discount = priceItem.room_discounts?.[0];
      const discountValue = discount?.discount_value ? parseFloat(discount.discount_value) : 0;

      const finalPrice = priceItem.price - priceItem.price * (discountValue / 100);

      return finalPrice === oneMonthData.finalPrice;
    });
  })();

  return (
    <>
      <Helmet>
        <title>{data.name} - Kost Exclusive</title>
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
      <Box>
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
            sx={{ mt: { xs: 1, md: 2 }, mb: 5 }}
          />
        </Box>

        {/* Image Gallery */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: { xs: 'column', md: 'row' },
          }}
          onClick={handleOpenDialog}
        >
          {slides.length > 0 && (
            <ImageList
              sx={{
                width: '100%',
                maxWidth: 600,
                height: { xs: 'auto', md: 500 },
                mr: { xs: 0, md: 1 },
                mb: { xs: 1, md: 0 },
                '&:hover': {
                  cursor: 'pointer',
                  filter: 'brightness(0.9)',
                },
              }}
              variant="quilted"
              cols={2}
              gap={8}
            >
              {slides.slice(0, 1).map((image, index) => (
                <ImageListItem key={index} cols={2} rows={2}>
                  <img
                    {...srcset(image, 121)}
                    alt={`Gallery Image ${index + 1}`}
                    loading="lazy"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      borderTopLeftRadius: '5px',
                      borderBottomLeftRadius: '5px',
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          {slides.length > 0 && (
            <ImageList
              sx={{ width: '100%', maxWidth: 600, height: 'auto' }}
              variant="quilted"
              cols={2}
              gap={8}
            >
              {slides.slice(1, 5).map((image, index) => {
                const remainingImages = slides.length - 5;
                return (
                  <ImageListItem
                    key={index}
                    cols={imageConfig[index]?.cols || 1}
                    rows={imageConfig[index]?.rows || 1}
                    style={{ position: 'relative' }}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        filter: 'brightness(0.9)',
                      },
                    }}
                  >
                    <img
                      {...srcset(image, 121)}
                      alt={`Gallery Image ${index + 1}`}
                      loading="lazy"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    {index === 3 && remainingImages > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        +{remainingImages}
                        {/* <ImageIcon */}
                      </div>
                    )}
                  </ImageListItem>
                );
              })}
            </ImageList>
          )}
        </Box>
        <FullScreenDialog
          open={opened}
          handleClose={handleCloseDialog}
          title={data.name}
          data={slides}
        />
        {/* Property Details */}
        <Box sx={{ mb: 4, pt: { xs: 5, md: 10 } }}>
          <Grid sx={{ mb: 3 }} container spacing={3} alignItems="center">
            {/* Bagian Judul */}
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {data.name}
                </Typography>
                <span>
                  {data.sector?.name}, {data.city?.name}
                </span>
              </Box>
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
            <Grid item xs={12} sm={7}>
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
              <Box sx={{ mt: 3 }}>
                <Divider /> {/* Garis atas */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingY: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 2 }}>
                    <Avatar
                      src={`https:\/\/backend-koskita.hafidzfrqn.serv00.net\/\/storage\/users_photo_profile\/G8RuEIsSKlT1HpL3cnqX93L2FKH4CKXDr9TLfxNg.png`}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Dikelola oleh Hafidz
                      </Typography>
                      <Typography variant="body2" color="gray">
                        sejak November 2024
                      </Typography>
                    </Box>
                  </Box>
                  {/* <ArrowForwardIosIcon sx={{ color: 'gray', fontSize: 16 }} /> */}
                </Box>
                <Divider /> {/* Garis bawah */}
              </Box>
            </Grid>
            {/* Bagian Harga dengan Card */}
            <Grid item xs={12} sm={5} sx={{ mt: 1 }}>
              <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                {matchedRooms &&
                  matchedRooms.map((room) => <RoomWithTabs key={room.id} room={room} />)}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 2,
                    justifyContent: { xs: 'center', sm: 'space-between' },
                    flexDirection: 'column',
                  }}
                >
                  {data?.rooms?.length > 0 && (
                    <LoadingButton
                      href="#room"
                      variant="contained"
                      color="inherit"
                      sx={{
                        height: 48,
                        minWidth: '150px',
                        flexGrow: { xs: 1, sm: 0 },
                      }}
                    >
                      Lihat Tipe Kamar
                    </LoadingButton>
                  )}

                  {data.rooms.length === 0 && !['admin', 'owner_property'].includes(user.roles) && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isOwnerId === data.created_by.id || isAlreadyBooked} // Tambahkan validasi booking
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
                        : isAlreadyBooked
                          ? 'Sudah Dipesan'
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
            <>
              <Typography variant="h6" gutterBottom sx={{ px: 2, fontWeight: 'bold', mt: 3 }}>
                Lokasi
              </Typography>
              <Card sx={{ mt: 2 }}>
                <CardContent>
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
            </>
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
            color="inherit"
            variant="outlined"
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              width: {
                xs: '100%', // full width on small screens
                sm: 'auto', // auto width on small-medium+
              },
            }}
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
        <PolicyPage name={data?.name} description={data?.description} />
        <hr />
        <PropertyBaseLocation id={data.id} data={data.city.city_code} />
      </Box>
    </>
  );
}
