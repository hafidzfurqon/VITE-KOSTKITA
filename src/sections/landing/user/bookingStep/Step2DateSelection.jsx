import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useSearchParams } from 'react-router-dom';
import { useFetchAllServices } from 'src/hooks/services';
import { Divider } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import { Autocomplete } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import { PeraturanPenghuni } from 'src/component/PeraturanPenghuni';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

export default function Step2DateSelection({
  onNext,
  discounts,
  savedData,
  room,
  setValue,
  properti,
  watch,
  // prevStep,
}) {
  // const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  // console.log('price:', startPrice);
  const [checkIn, setCheckIn] = useState(() => {
    const date = searchParams.get('checkInDate');
    console.log(date);
    return date ? new Date(date) : null;
  });
  console.log(checkIn);
  const [months, setMonths] = useState(savedData?.duration || 1);
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedPromos, setSelectedPromos] = useState([]);

  useEffect(() => {
    if (savedData) {
      if (savedData.check_in) {
        setCheckIn(new Date(savedData.check_in));
      }
      setMonths(savedData?.duration || 1);
    }
  }, [savedData]);

  useEffect(() => {
    console.log('Selected promos: ', selectedPromos);
  }, [selectedPromos]);

  const handleOpen = () => {
    return setOpen(true);
  };

  const actualStartPrice = savedData?.base_price ?? 0;

  const applicableDiscount = useMemo(() => {
    return discounts?.find(
      (discount) => months >= discount?.min_month && months <= discount?.max_month
    );
  }, [months, discounts]);

  const discountedPrice = useMemo(() => {
    const totalPrice = actualStartPrice * months;
    return applicableDiscount ? applicableDiscount.price_after_discount : totalPrice;
  }, [actualStartPrice, months, applicableDiscount]);

  const finalPrice = useMemo(() => {
    if (!selectedPromos || selectedPromos.length === 0) {
      return discountedPrice;
    }

    let totalDiscount = 0;
    selectedPromos.forEach((promo) => {
      if (promo.promo_type === 'fixed_amount') {
        totalDiscount += Number(promo.promo_value);
      }

      if (promo.promo_type === 'percentage') {
        const percentageValue = (Number(promo.promo_value) / 100) * discountedPrice;
        totalDiscount += percentageValue;
      }
    });

    return Math.max(discountedPrice - totalDiscount, 0);
  }, [discountedPrice, selectedPromos]);

  const Voucher = discountedPrice - finalPrice;

  const applicablePromos = useMemo(() => {
    return (properti?.promos ?? []).filter((promo) => {
      // Contoh: hanya tampilkan promo untuk properti ini
      if (promo.apply_to === 'specific_property' && promo.applicable_to_owner_property !== 1) {
        return false;
      }
      return true;
    });
  }, [properti?.promos]);

  const handleNext = () => {
    if (!agreed) {
      enqueueSnackbar({
        message: 'Kamu harus menyetujui peraturan terlebih dahulu.',
        variant: 'warning',
      });
      return;
    }

    const nextData = {
      booking_date: dayjs(checkIn).format('YYYY-MM-DD'),
      total_booking_month: months,
      discounted_price: discountedPrice,
      final_price: finalPrice,
      biaya_akhir: savedData?.total_price - Voucher,
      promos: selectedPromos.map((p) => p.id),
    };

    onNext(nextData);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          // px: { xs: 5, sm: 0 },
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
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                Pilih Voucher
              </Typography>
              <Autocomplete
                id="select-service"
                multiple
                limitTags={5}
                options={applicablePromos ?? []}
                autoHighlight
                sx={{ zIndex: 1500 }}
                getOptionLabel={(option) => `${option.name}`}
                value={(properti.promos ?? []).filter((s) =>
                  (watch('promos') ?? []).includes(s.id)
                )}
                onChange={(event, value) => {
                  setValue(
                    'promos',
                    value.map((v) => v.id)
                  );
                  setSelectedPromos(value);
                }}
                noOptionsText="Belum Ada Promo Nih"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lebih hemat pakai voucher"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
              />
            </Box>
            {selectedPromos?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="success.main">
                  {`Yeay, kamu hemat total promo sebesar: ${fCurrency(discountedPrice - finalPrice)}`}
                </Typography>
              </Box>
            )}
            {selectedPromos?.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                  Voucher yang Dipilih
                </Typography>
                <Grid container spacing={2}>
                  {selectedPromos.map((promo) => (
                    <Grid item xs={12} md={6} key={promo.id}>
                      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={promo.promo_image_url}
                          alt={promo.name}
                        />
                        <CardContent>
                          <Typography variant="h6">{promo.name}</Typography>
                          <Link
                            to={`/promo/${promo.slug}`}
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                            target="_blank"
                          >
                            Lihat Detail
                          </Link>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Potongan:{' '}
                            {promo.promo_type === 'fixed_amount'
                              ? fCurrency(promo.promo_value)
                              : `${promo.promo_value}% dari ${fCurrency(discountedPrice)}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 3,
                border: '1px solid #F1EFEC',
                borderRadius: '5px',
                py: 2,
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                Rincian Pembayaran
              </Typography>
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Harga Per {savedData?.duration} Bulan</Typography>
                <Typography variant="body2">{fCurrency(savedData?.base_price || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Diskon Durasi</Typography>
                <Typography variant="body2" color="error.main">
                  - {fCurrency(savedData?.discount_amount || 0)}
                </Typography>
              </Box>
              {selectedPromos?.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Promo Voucher</Typography>
                  <Typography variant="body2" color="error.main">
                    - {fCurrency(discountedPrice - finalPrice)}
                  </Typography>
                </Box>
              )}
              {savedData?.selected_services?.map((data, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1, // memberi jarak antar item
                  }}
                >
                  <Typography variant="body2">
                    +{data?.name} (
                    {data?.payment_type === 'monthly' ? `x${data?.price} / bulan` : 'Per hari'})
                  </Typography>
                  <Typography variant="subtitle1">
                    {fCurrency(
                      data?.payment_type === 'monthly'
                        ? data?.price * savedData.duration
                        : data.price
                    )}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">
                  <strong>Total Bayar</strong>
                </Typography>
                <Typography variant="subtitle1">
                  {fCurrency(savedData?.total_price - Voucher || 0)}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 3,
                py: 2,
              }}
            >
              <Divider sx={{ mt: 2 }} />
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                Informasi Pembatalan
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  Pembatalan dapat dilakukan dengan biaya minimal 50% dari deposit atau sewa.{' '}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 3,
                py: 2,
              }}
            >
              <Divider sx={{ mt: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  }
                  label="Saya Menyetujui Semua Peraturan KostKita"
                />
                <Button
                  variant="body2"
                  sx={{ textDecoration: 'underline' }}
                  onClick={handleOpen}
                  mt={2}
                >
                  Peraturan Penghuni KostKita
                </Button>
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              // mt={4}
              gap={{ xs: 0, md: 3 }}
            >
              <Button
                onClick={handleNext}
                sx={{ mt: 3, py: '12px' }}
                fullWidth
                variant="contained"
                color="inherit"
                // disabled={!isFormValid}
              >
                Bayar Sekarang
              </Button>
            </Box>
          </Grid>
          <PeraturanPenghuni open={open} setOpen={setOpen} />
          {/* Kolom 2 */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #F1EFEC',
                p: { xs: 0, md: 5 },
                //   py : 2,

                borderRadius: '5px',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                Pesanan Anda
              </Typography>
              {/*  */}
              <ImageSlider images={room.room_files || []} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
              >
                <Typography variant="subtitle1">{room?.name}</Typography>
                <Typography variant="caption">Ganti</Typography>
              </Box>
              <Typography variant="caption" sx={{ mt: 2 }}>
                {room?.capacity} Orang • {room.room_gender_type === 'both' && 'Umum'}{' '}
                {room.room_gender_type === 'male' && 'Laki-Laki'}{' '}
                {room.room_gender_type === 'female' && 'Perempuan'} • 8.4m² • Lantai {room?.floor}
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
                <Link to={`/property/${properti?.slug}`} target="_blank" style={{ color: 'black' }}>
                  <span>{properti?.name}</span>
                  <ArrowForwardIosIcon fontSize="inherit" />
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
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
