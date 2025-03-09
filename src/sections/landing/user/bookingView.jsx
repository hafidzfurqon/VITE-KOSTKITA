import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import ModalBookingSuccess from 'src/components/booking/ModalBookingSuccess';
import Step1Penghuni from './bookingStep/Step1Penghuni';
import Step2DateSelection from './bookingStep/Step2DateSelection';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import { userBooking } from 'src/hooks/users/userBooking';
import { useAppContext } from 'src/context/user-context';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ModalJasaLayanan from './bookingStep/modalJasaLayanan';
import DetailDataPenghuni from './bookingStep/detailDataPenghuni';

export default function BookingView() {
  const [step, setStep] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);
  const { UserContextValue: authUser } = useAppContext();
  const [searchParams] = useSearchParams();
  const roomIdFromUrl = searchParams.get('room_id');
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

  const nextStep = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const { register, handleSubmit, reset } = useForm({ defaultValues });
  const { mutate, isPending } = userBooking({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      enqueueSnackbar('Properti berhasil dibooking', { variant: 'success' });
      reset();
      setOpenSuccessModal(true);
      setBookingCode(response?.data?.booking_code ?? 'Kode booking tidak ditemukan');
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.errors || 'Terjadi kesalahan', { variant: 'error' });
    },
  });

  const confirmBooking = () => {
    const finalBookingData = {
      ...bookingData,
      room_id: roomIdFromUrl, // Pastikan room_id diisi
      property_id: defaultValues?.id,
    };
    mutate(finalBookingData);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        links={[
          { name: defaultValues?.slug, href: `/property/${slug}` },
          { name: 'Booking', href: '' },
        ]}
        sx={{ mb: 3 }}
      />
      <Card>
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

          <Typography variant="h5" sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
            Booking Properti {defaultValues?.name}
          </Typography>

          {step === 1 && <Step1Penghuni savedata={bookingData} onNext={nextStep} user={user} />}
          {step === 2 && (
            <>
              <Step2DateSelection
                onNext={nextStep}
                discounts={defaultValues?.discounts || []}
                startPrice={defaultValues?.start_price || 0}
                savedData={bookingData}
              />
              <Button variant="outlined" onClick={prevStep}>
                Kembali
              </Button>
            </>
          )}
          {step === 3 && (
            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ringkasan Booking
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Penghuni:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={() => setModalUser(true)}>
                    <Typography fontWeight="bold">Detail Penghuni</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Check-in:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">{bookingData.check_in}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Check-out:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">{bookingData.check_out}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Durasi:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">{bookingData.months} Bulan</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Harga</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">
                    Rp {parseInt(bookingData.discounted_price).toLocaleString()}{' '}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="body1">Layanan Tambahan:</Typography>
              <Button variant="outlined" onClick={() => setOpenModal(true)}>
                Pilih Jasa Layanan
              </Button>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedServices.length ? (
                  selectedServices.map((service, index) => (
                    <Chip key={index} label={service} color="primary" />
                  ))
                ) : (
                  <Typography>Tidak ada Servis Tambahan</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={prevStep}>
                  Kembali
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={confirmBooking}
                  disabled={isPending}
                >
                  {isPending ? 'Memproses...' : 'Konfirmasi'}
                </Button>
              </Box>
            </Paper>
          )}
        </CardContent>
      </Card>
      <ModalJasaLayanan
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={setSelectedServices}
      />
      <DetailDataPenghuni open={modalUser} onClose={() => setModalUser(false)} data={bookingData} />
      <ModalBookingSuccess
        open={openSuccessModal}
        bookingCode={bookingCode}
        onReset={() => setOpenSuccessModal(false)}
      />
    </Container>
  );
}
