import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import ModalBookingSuccess from 'src/components/booking/ModalBookingSuccess';
import Step1Penghuni from './bookingStep/Step1Penghuni';
import Step2DateSelection from './bookingStep/Step2DateSelection';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import { userBooking } from 'src/hooks/users/userBooking';
import { useAppContext } from 'src/context/user-context';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DetailDataPenghuni from './bookingStep/detailDataPenghuni';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useKeenSlider } from 'keen-slider/react';
import { fCurrency } from 'src/utils/format-number';
import { LoadingButton } from '@mui/lab';
import { useMutationBookingPaymentMidtrans } from 'src/hooks/payment/useMutationBookingPaymentMidtrans';
// Link

export default function BookingView() {
  // const [searchParams] = useSearchParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  const [step, setStep] = useState(initialStep);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [modalUser, setModalUser] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);
  const { UserContextValue: authUser } = useAppContext();
  const roomIdFromUrl = searchParams.get('room_id');
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { user } = authUser;
  const steps = ['Data Penghuni', 'Check-in & Check-out', 'Konfirmasi & Selesai'];

  const { slug } = useParams();
  const { data: defaultValues, isLoading } = useFetchPropertySlug(slug);

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleStepClick = (selectedStep) => {
    // Hanya izinkan pindah ke step yang sudah pernah dikunjungi atau sebelumnya
    if (selectedStep <= step) {
      setStep(selectedStep);
    }
  };

  useEffect(() => {
    searchParams.set('step', step.toString());
    setSearchParams(searchParams);
  }, [step]);

  const nextStep = (data) => {
    const updatedData = { ...bookingData, ...data };
    setBookingData(updatedData);
    sessionStorage.setItem('bookingData', JSON.stringify(updatedData));
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    const savedData = sessionStorage.getItem('bookingData');
    if (savedData) {
      setBookingData(JSON.parse(savedData));
    }
  }, []);

  const { watch, reset, setValue } = useForm({ defaultValues });

  const { mutate: paymentMutation } = useMutationBookingPaymentMidtrans({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      queryClient.invalidateQueries({ queryKey: ['fetch.nontification'] });
      enqueueSnackbar('Properti berhasil dibooking', { variant: 'success' });
      reset();
      setBookingCode(response?.data?.booking_code ?? 'Kode booking tidak ditemukan');

      const snapToken = response?.data?.snap_token; // ✅ Deklarasi di atas dulu
      console.log('Snap Token:', snapToken);
      console.log('Window.snap:', window?.snap); // opsional: pakai optional chaining biar aman

      if (window?.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log('Pembayaran berhasil:', result);
          },
          onPending: function (result) {
            console.log('Pembayaran pending:', result);
          },
          onError: function (result) {
            console.log('Pembayaran gagal:', result);
          },
          onClose: function () {
            console.log('User menutup popup tanpa menyelesaikan pembayaran');
          },
        });
      } else {
        enqueueSnackbar('Gagal memuat pembayaran. Silakan coba lagi.', { variant: 'error' });
      }
    },
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const { mutate, isPending } = userBooking({
    onSuccess: (response) => {
      console.log(response.data.id);

      enqueueSnackbar('Properti berhasil dibooking', { variant: 'success' });

      reset();

      const bookingId = response?.data?.id; // Ubah sesuai dengan field ID di response kamu
      setBookingCode(response?.data?.booking_code ?? 'Kode booking tidak ditemukan');

      // Hit API pembayaran setelah booking sukses
      if (bookingId) {
        const paymentFormData = convertToFormData({
          ...bookingData,
          room_id: roomIdFromUrl,
          property_id: defaultValues?.id,
          additional_services: bookingData.selected_services.map((service) => service.id),
        });

        paymentMutation({ id: bookingId, data: paymentFormData }); // Pastikan sesuai cara `useMutationBookingPaymentMidtrans` kamu menangani parameternya
      }
    },
    onError: (error) => {
      const errors = error?.response?.data?.errors;
      enqueueSnackbar(errors || 'Terjadi kesalahan Check Semua Data Booking', {
        variant: 'error',
      });
      console.log(error);
    },
  });

  const convertToFormData = (data) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key];

      if (Array.isArray(value)) {
        if (key === 'booking_user_data') {
          value.forEach((user, i) => {
            for (const field in user) {
              formData.append(`${key}[${i}][${field}]`, user[field]);
            }
          });
        } else if (key === 'additional_services') {
          value.forEach((v, i) => {
            formData.append(`${key}[${i}]`, v);
          });
        } else {
          formData.append(key, JSON.stringify(value)); // fallback
        }
      } else {
        formData.append(key, value);
      }
    }

    return formData;
  };

  const confirmBooking = () => {
    if (!Array.isArray(selectedServices)) {
      console.error('selectedServices bukan array:', selectedServices);
      return;
    }

    setOpenConfirmModal(false);

    const finalBookingData = {
      ...bookingData,
      room_id: roomIdFromUrl,
      property_id: defaultValues?.id,
      additional_services: bookingData.selected_services.map((service) => service.id),
    };

    console.log(finalBookingData);

    const formData = convertToFormData(finalBookingData);
    mutate(formData);
  };

  // console.log(selectedServices);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const selectedRoom = defaultValues.rooms.find((room) => room.id === parseInt(roomIdFromUrl));
  const totalHargaBulanan =
    bookingData.harga_per_bulanan_dikali_bulan +
    bookingData.total_service_price -
    bookingData.harga_promo_bulanan_dikali_bulan;
  const FEE = totalHargaBulanan * 0.02;
  const PPN = totalHargaBulanan * 0.11;
  const hargaAkhirs = totalHargaBulanan + FEE + PPN;
  const totalHarga = bookingData.total_harian + bookingData.total_service_price;

  const dailyPPN = totalHarga * 0.11;
  const dailyFEE = totalHarga * 0.02;

  console.log(bookingData);

  return (
    <Box>
      <CustomBreadcrumbs
        links={[
          { name: defaultValues?.slug, href: `/property/${slug}` },
          { name: 'Booking', href: '' },
          { name: selectedRoom.name, href: '' },
        ]}
        sx={{ mb: 3, px: 2 }}
      />
      <Box>
        <CardContent>
          <Stepper activeStep={step - 1} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  onClick={() => handleStepClick(index + 1)}
                  sx={{ cursor: index + 1 <= step ? 'pointer' : 'default' }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {step === 1 && (
            <Step1Penghuni
              room={selectedRoom}
              savedata={bookingData}
              step={step}
              properti={defaultValues}
              onNext={nextStep}
              setStep={setStep}
              user={user}
              setSelectedServices={setSelectedServices}
              selectedServices={selectedServices}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 2 && (
            <>
              <Step2DateSelection
                room={selectedRoom}
                watch={watch}
                setValue={setValue}
                properti={defaultValues}
                setStep={setStep}
                onNext={nextStep}
                savedData={bookingData}
                prevStep={prevStep}
              />
            </>
          )}
          {step === 3 && (
            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ringkasan Booking
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {/* <ModalBookingSuccess/> */}
              <ModalBookingSuccess
                open={openSuccessModal}
                bookingCode={bookingCode}
                onReset={() => setOpenSuccessModal(false)}
              />

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
                      {/* {selectedPromos?.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="success.main">
                            {`Yeay, kamu hemat total promo sebesar: ${fCurrency(discountedPrice - finalPrice)}`}
                          </Typography>
                        </Box>
                      )} */}
                      {/* {selectedPromos?.length > 0 && (
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
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 1 }}
                                    >
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
                      )} */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          mt: 3,

                          borderRadius: '5px',
                          py: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                          Rincian Pembayaran
                        </Typography>
                        <Divider sx={{ mt: 2 }} />
                        {bookingData?.duration === 0 ? (
                          <>
                            {' '}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">
                                Harga Per {bookingData?.jumlah_hari} Hari
                              </Typography>
                              <Typography variant="body2">
                                {fCurrency(bookingData?.total_harian || 0)}
                              </Typography>
                            </Box>
                            {bookingData?.property_room_discount_id && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Diskon Durasi</Typography>
                                <Typography variant="body2" color="error.main">
                                  - {fCurrency(bookingData?.discount_amount || 0)}
                                </Typography>
                              </Box>
                            )}
                          </>
                        ) : (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">
                                Harga Per {bookingData?.duration} Bulan
                              </Typography>
                              <Typography variant="body2">
                                {fCurrency(bookingData?.harga_per_bulanan_dikali_bulan || 0)}
                              </Typography>
                            </Box>
                            {bookingData?.property_room_discount_id && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Diskon Durasi</Typography>
                                <Typography variant="body2" color="error.main">
                                  - {fCurrency(bookingData?.harga_promo_bulanan_dikali_bulan || 0)}
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}

                        {bookingData?.selected_services?.map((data, idx) => (
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
                              {data?.payment_type === 'monthly'
                                ? `x${data?.price} / bulan`
                                : 'Per hari'}
                              )
                            </Typography>
                            <Typography variant="subtitle1">
                              {fCurrency(
                                data?.payment_type === 'monthly'
                                  ? data.price * bookingData.duration
                                  : data.price
                              )}
                            </Typography>
                          </Box>
                        ))}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Platform Fee (2%)</Typography>
                          <Typography variant="body2">
                            {bookingData.book_type === 'dayly'
                              ? fCurrency(dailyFEE)
                              : fCurrency(FEE)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">PPN (11%)</Typography>
                          <Typography variant="body2">
                            {bookingData.book_type === 'dayly'
                              ? fCurrency(dailyPPN)
                              : fCurrency(PPN)}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">
                            <strong>Total Bayar</strong>
                          </Typography>
                          {bookingData.book_type === 'dayly' ? (
                            <Typography variant="subtitle1">
                              {fCurrency(
                                bookingData?.total_harian +
                                  dailyPPN +
                                  dailyFEE +
                                  bookingData?.total_service_price
                              )}
                            </Typography>
                          ) : (
                            <Typography variant="subtitle1">{fCurrency(hargaAkhirs)}</Typography>
                          )}
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        // mt={4}
                        gap={{ xs: 0, md: 3 }}
                      >
                        <LoadingButton
                          loading={isPending}
                          onClick={() => setOpenConfirmModal(true)}
                          sx={{ mt: 3, py: '12px' }}
                          fullWidth
                          variant="contained"
                          color="inherit"
                          // disabled={!isFormValid}
                        >
                          Bayar Sekarang
                        </LoadingButton>
                      </Box>
                    </Grid>
                    {/* Kolom 2 */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          p: { xs: 0, md: 5 },
                          borderRadius: '5px',
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                          Pesanan Anda
                        </Typography>
                        {/*  */}
                        <ImageSlider images={selectedRoom.room_files || []} />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 2,
                          }}
                        >
                          <Typography variant="subtitle1">{selectedRoom?.name}</Typography>
                          <Typography variant="caption">Ganti</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ mt: 2 }}>
                          {selectedRoom?.capacity} Orang •{' '}
                          {selectedRoom.room_gender_type === 'both' && 'Umum'}{' '}
                          {selectedRoom.room_gender_type === 'male' && 'Laki-Laki'}{' '}
                          {selectedRoom.room_gender_type === 'female' && 'Perempuan'} • 8.4m² •
                          Lantai {selectedRoom?.floor}
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
                            to={`/property/${defaultValues?.slug}`}
                            target="_blank"
                            style={{ color: 'black' }}
                          >
                            <span>{defaultValues?.name}</span>
                            <ArrowForwardIosIcon fontSize="inherit" />
                          </Link>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          )}
        </CardContent>
      </Box>

      <DetailDataPenghuni open={modalUser} onClose={() => setModalUser(false)} data={bookingData} />
      <ModalBookingSuccess
        open={openSuccessModal}
        bookingCode={bookingCode}
        onReset={() => setOpenSuccessModal(false)}
      />

      <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
        <DialogTitle>Konfirmasi Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin melakukan booking dengan detail yang sudah dimasukkan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModal(false)} color="secondary">
            Batal
          </Button>
          <Button onClick={confirmBooking} color="primary" variant="contained">
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>
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
