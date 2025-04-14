import { Box, Button, Divider, Radio, Typography } from '@mui/material';
import { Grid, Stack } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useKeenSlider } from 'keen-slider/react';
import { useMemo, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { fDate } from 'src/utils/format-time';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllPropertyRoomDetail } from 'src/hooks/property_room';
import Loading from 'src/components/loading/loading';
import { useFetchAllServices } from 'src/hooks/services';
import { Link } from 'react-router-dom';

export function TransactionStepThree({ data }) {
  // console.log();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const isOwnerProperty =
    Array.isArray(user?.roles) && user.roles.some((role) => role.name === 'owner_property');

  const {
    data: detail_property = [],
    isLoading: isloadingRoomDetail,
    isFetching: isfetchingRoomDetail,
  } = useFetchAllPropertyRoomDetail(data.room_number, isOwnerProperty);
  const { data: service = [], isLoading: isLoadingService } = useFetchAllServices();
  const filteredServices = useMemo(() => {
    const selectedIds = data.additional_services?.map((item) => item) || [];
    return service.filter((s) => selectedIds.includes(s.id));
  }, [service, data.additional_services]);
  console.log(detail_property);
  const oneMonthPrice = detail_property.room_prices?.find((item) => item.duration === '1_month');

  console.log(oneMonthPrice);
  if (isloadingRoomDetail || isfetchingRoomDetail || isLoadingService) {
    return <Loading />;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: { xs: 'column-reverse', md: 'row' },
        }}
      >
        {/* Kolom 1 */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
              Data Penghuni
            </Typography>
            <Stack spacing={2}>
              {data.booking_user_data.map((person, idx) => (
                <Box key={idx}>
                  <Typography variant="body1">{person?.fullname}</Typography>
                  <Typography variant="body1">+62{person?.phone_number}</Typography>
                  <Typography variant="body1">{person?.email}</Typography>
                </Box>
              ))}
              <Divider />
              <Typography variant="caption">
                Kartu identitas asli (KTP/KITAS) dan Surat Nikah (untuk pasangan) dibutuhkan saat
                check-in
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', my: 2 }}>
              Tanggal Penyewaan
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body2">Check-in: {fDate(data?.checkin)}</Typography>
              <Typography variant="body2">Check-out: {fDate(data?.checkout)}</Typography>
              <Typography variant="body2">Durasi: {data?.duration} Bulan</Typography>
              <Divider />
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', my: 2 }}>Add On</Typography>
            <Stack spacing={2}>
              {filteredServices.map((data, idx) => (
                <Typography variant="body2" key={idx}>
                  +{data?.name}
                </Typography>
              ))}
              <Divider />
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 3,
              border: '1px solid #F1EFEC',
              borderRadius: '5px',
              // p: 2,
            }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', my: 2 }}>
              Rincian Pembayaran
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Harga Per 1 Bulan</Typography>
              <Typography variant="subtitle1">{fCurrency(oneMonthPrice?.price)}</Typography>
            </Box>
            {/* Jika ada diskon */}
            {/* 
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Diskon 14% untuk pemesanan 3 bulan</Typography>
              <Typography variant="subtitle1">{fCurrency(325000)}</Typography>
            </Box> */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Pesan selama {data?.duration} bulan</Typography>
              <Typography variant="subtitle1">{fCurrency(1500000 + 1500000 + 1500000)}</Typography>
            </Box>
            {filteredServices.map((data, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1, // memberi jarak antar item
                }}
              >
                <Typography variant="body2">+{data?.name}</Typography>
                <Typography variant="subtitle1">{fCurrency(data?.price)}</Typography>
              </Box>
            ))}
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Total</Typography>
              <Typography variant="subtitle1">{fCurrency(4794147 - 325000)}</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Kolom 2 */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #F1EFEC',
              p: { xs: 0, md: 2 },
              //   py : 2,
              borderRadius: '5px',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
              Pesanan
            </Typography>
            {/* https://images.rukita.co/buildings/roomvariantphoto/photo/2bb5274e-3c6.jpg?tr=c-at_max%2Cw-800 */}
            <ImageSlider images={detail_property?.room_files || []} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Typography variant="subtitle1">{detail_property?.name}</Typography>
              <Typography variant="caption">Ganti</Typography>
            </Box>
            <Typography variant="caption" sx={{ mt: 2 }}>
              {detail_property?.capacity} Orang •{' '}
              {detail_property.room_gender_type === 'both' && 'Umum'}{' '}
              {detail_property.room_gender_type === 'male' && 'Laki-Laki'}{' '}
              {detail_property.room_gender_type === 'female' && 'Perempuan'} • 8.4m² • Lantai{' '}
              {detail_property?.floor}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                // justifyContent: 'space-between',
              }}
            >
              <span>Fasilitas Unit</span>
              <ArrowForwardIosIcon fontSize="inherit" />
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 'bold',
              }}
            >
              <Link
                to={`/property/${detail_property?.property?.slug}`}
                target="_blank"
                style={{ color: 'black' }}
              >
                <span>{detail_property?.property?.name}</span>
                <ArrowForwardIosIcon fontSize="inherit" />
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function ImageSlider({ images }) {
  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 1 },
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box
              key={index}
              className="keen-slider__slide"
              sx={{
                position: 'relative',
                // aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '5px',
              }}
            >
              <img
                src={image?.file_url}
                loading="lazy"
                alt={`Property Image ${index}`}
                style={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  //   borderRadius: '5px',
                }}
              />
            </Box>
          ))
        ) : (
          <Box
            className="keen-slider__slide"
            sx={{ textAlign: 'center', p: 2, backgroundColor: 'gray' }}
          >
            <Typography variant="caption" color="white">
              Tidak ada image yang tersedia
            </Typography>
          </Box>
        )}
      </Box>

      {/* Prev & Next Button */}
      <Button
        disabled={currentSlide === 0}
        onClick={() => slider.current?.prev()}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          minWidth: 0,
          padding: 1,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ArrowBackIosIcon fontSize="small" sx={{ ml: '5px' }} />
      </Button>

      {/* Next Arrow */}
      <Button
        disabled={currentSlide === images.length - 1}
        onClick={() => slider.current?.next()}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          minWidth: 0,
          padding: 1,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </Button>
    </Box>
  );
}
