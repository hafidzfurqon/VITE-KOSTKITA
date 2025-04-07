import { Fab, Select } from '@mui/material';
import React from 'react';
import { TextField } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { IconButton } from '@mui/material';
import { MenuItem } from '@mui/material';
import {
  Box,
  Typography,
  Stepper,
  Step,
  Button,
  Grid,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  StepConnector,
  styled,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DialogCreate } from 'src/component/DialogCreate';
import { Iconify } from 'src/components/iconify';
import { Container } from '@mui/material';
import { useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function PartnerColivingWithKostKita() {
  const [opened, setOpened] = useState(false);
  const { register, handleSubmit: handleSubmitForm, reset } = useForm();
  const [countryCode, setCountryCode] = useState('+62');
  const countryCodes = [{ code: '+62', label: 'Indonesia' }];
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const steps = [
    {
      label: 'Daftarkan Properti',
      description: 'Tim kami akan melakukan evaluasi',
    },
    {
      label: 'Tanda Tangan Kontrak',
      description: 'Periksa kontrak dan tanda tangan kontrak',
    },
    {
      label: 'Nikmati Hasilnya',
      description: 'Duduk manis dan nikmati hasil dari Rukita',
    },
  ];

  const faqs = [
    {
      question: 'Apa benefit yang saya dapat jika bergabung menjadi partner agent KostKita?',
      answer:
        'Sebagai partner, Anda akan mendapatkan dukungan penuh operasional, akses ke jaringan penyewa, dan potensi income tambahan tanpa ribet.',
    },
    {
      question: 'Saya menangani banyak aset yang sulit laku, apa solusi KostKita?',
      answer:
        'KostKita dapat membantu pemilik aset, seperti tanah kosong, ruko, atau properti apa pun yang sulit laku, menjadi bisnis kost coliving bernilai tinggi. Semua operasional Rukita yang urus sehingga pemilik aset tinggal merasakan income tak terbatas tanpa ribet.',
    },
    {
      question: 'Saya menangani banyak aset yang sulit laku, apa solusi KostKita?',
      answer:
        'KostKita dapat membantu pemilik aset, seperti tanah kosong, ruko, atau properti apa pun yang sulit laku, menjadi bisnis kost coliving bernilai tinggi. Semua operasional Rukita yang urus sehingga pemilik aset tinggal merasakan income tak terbatas tanpa ribet.',
    },
    {
      question: 'Saya menangani banyak aset yang sulit laku, apa solusi KostKita?',
      answer:
        'KostKita dapat membantu pemilik aset, seperti tanah kosong, ruko, atau properti apa pun yang sulit laku, menjadi bisnis kost coliving bernilai tinggi. Semua operasional Rukita yang urus sehingga pemilik aset tinggal merasakan income tak terbatas tanpa ribet.',
    },
  ];

  // Custom connector
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.MuiStepConnector-root`]: {
      top: 10,
      left: 'calc(-50% + 20px)',
      right: 'calc(50% + 20px)',
    },
    [`& .MuiStepConnector-line`]: {
      borderColor: '#FFD600',
      borderTopWidth: 2,
      borderRadius: 1,
    },
  }));

  // Custom step icon
  function CustomStepIcon({ active, completed, className, icon }) {
    return (
      <Box
        className={className}
        sx={{
          backgroundColor: '#FFD600',
          zIndex: 1,
          color: '#fff',
          width: 36,
          height: 36,
          display: 'flex',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        {icon}
      </Box>
    );
  }
  const FieldRHF = (
    <>
      <TextField
        {...register('name')}
        autoFocus
        required
        margin="dense"
        id="nama"
        label="Nama Pemilik"
        type="text"
        fullWidth
        variant="outlined"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          margin="dense"
          sx={{ height: 56, mt: 1 }}
        >
          {countryCodes.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              {option.code}
            </MenuItem>
          ))}
        </Select>
        {/* <TextField placeholder="+62" margin="dense" sx={{ width: 80 }} /> */}
        <TextField
          {...register('phone')}
          margin="dense"
          fullWidth
          type="text"
          inputMode="numeric"
          variant="outlined"
          label="e.g. 81234567890"
        />
      </Box>
      <TextField
        {...register('email')}
        autoFocus
        required
        margin="dense"
        id="nama"
        label="Alamat Email anda"
        type="text"
        fullWidth
        variant="outlined"
      />
      <TextField
        fullWidth
        {...register('password')}
        label="Password"
        // InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        {...register('password_confirmation')}
        label="Konfirmasi Password"
        // InputLabelProps={{ shrink: true }}
        type={showPassword2 ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                <Iconify icon={showPassword2 ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
    </>
  );
  const handleClickOpened = useCallback(() => setOpened(true), []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Box
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          height: { md: '100vh', xs: 'auto' },
          padding: 0,
          background: 'linear-gradient(135deg, #FFCC00, #800000)',
          color: 'white',
          borderTopLeftRadius: '80px',
        }}
      >
        {/* Bagian Kanan (Gambar) */}

        <Box
          component="img"
          loading="lazy"
          alt={`sdsd`}
          src={`https://img.freepik.com/premium-photo/excited-woman-hijab-using-cell-phone-residential-background_8595-30348.jpg?w=1380`}
          sx={{
            width: { xs: '100%', md: '50%' },
            height: '100%',
            maxWidth: 'unset',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            padding: { xs: '40px', md: '60px' },
          }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Tingkatkan Potensi Bisnis Properti Anda Bersama Kami
          </Typography>
          <Typography variant="h6">
            Tingkatkan pendapatan anda dengan menjadi partner KostKita dan nikmati keuntungganya.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0, md: 3 },
              flexDirection: { xs: 'column', md: 'row-reverse' },
            }}
          >
            <Button
              variant="outlined"
              // fullWidth
              sx={{
                mt: 3,
                width: { xs: '100%' },
                borderColor: '#25D366',
                color: 'common.white',
                textTransform: 'none',
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '8px',
                // ':hover': { backgroundColor: '#ddd' },
              }}
            >
              <Iconify width={24} icon="ic:baseline-whatsapp" sx={{ mr: 1 }} /> Hubungi Tim KostKita
            </Button>
            <Button
              variant="contained"
              // fullWidth
              sx={{
                mt: 3,
                width: { xs: '100%' },
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '8px',
                ':hover': { backgroundColor: '#ddd' },
              }}
              onClick={handleClickOpened}
            >
              Daftarkan Properti Anda
            </Button>
          </Box>
        </Box>
      </Box>
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
          sx={{
            padding: 0,
            background: 'white',
            color: 'black',
            px: '2rem',
            pt: { xs: 3, md: 10 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', pb: 5 }}>
            Kenapa Perlu Menjadi Partner KostKita?
          </Typography>
          <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={12} sm={4}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'left', md: 'center' },
                  // gap: 3,
                  textAlign: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ color: '#FFCC00' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width="50"
                    role="img"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {/* <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /> */}
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                  Penghasilan Bebas Ribet
                </Typography>
                <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                  Kami mengelola aset properti Anda dan menjalankannya bisnisnya sebagai properti
                  rental yang menguntungkan.
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'left', md: 'center' },
                  // gap: 3,
                  textAlign: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ color: '#FFCC00' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width="50"
                    role="img"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                  Layanan Penghuni
                </Typography>
                <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                  Staff yang berpengalaman lebih dari 10 tahun dan siap memberi pengalaman positif
                  bagi penghuni properti Anda.
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'left', md: 'center' },
                  // gap: 3,
                  textAlign: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ color: '#FFCC00' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width="50"
                    role="img"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                  Aman dari Penyalahgunaan
                </Typography>
                <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                  Dengan sistem yang terintegrasi teknologi, kami membuat bisnis properti jadi lebih
                  praktis dan canggih.
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'left', md: 'center' },
                  // gap: 3,
                  textAlign: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ color: '#FFCC00' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width="50"
                    role="img"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                  Pemasukan & Bagi Hasil Terjamin
                </Typography>
                <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                  Dengan sistem yang terintegrasi teknologi, kami membuat bisnis properti jadi lebih
                  praktis dan canggih.
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
          sx={{
            bgcolor: '#F0EFEA',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            px: '2rem',
            pt: { xs: 3, md: 6 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', pb: 5 }}>
            3 Langkah untuk Jadi Partner KostKita
          </Typography>
          <Stepper
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            connector={<ColorlibConnector />}
            activeStep={2}
            sx={{
              py: isMobile ? 1 : 3,
              px: isMobile ? 2 : 0,
            }}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Box sx={{ mt: isMobile ? 1 : 2 }}>
                    <Typography
                      variant={isMobile ? 'body1' : 'h5'}
                      fontWeight="bold"
                      align="center"
                    >
                      {step.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  mt: 5,
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                    KostKita X IPB Bogors
                  </Typography>
                </Box>
                <img
                  src="https://backend-koskita.hafidzfrqn.serv00.net//storage/banner_images/2/8sfikdpc48ilITfQXbYUQPA62kJU0sDaOUhtn5R8.jpg"
                  alt="Property Image"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  mt: 5,
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    backgroundColor: '',
                    // backgroundColor: 'grey.800',
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                    KostKita X IPB Bogor
                  </Typography>
                </Box>
                <img
                  src="https://backend-koskita.hafidzfrqn.serv00.net//storage/property_files/3/839f45fa-f3f.jpg"
                  alt="Property Image"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  mt: 5,
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    backgroundColor: '',
                    // backgroundColor: 'grey.800',
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                    KostKita X IPB Bogor
                  </Typography>
                </Box>
                <img
                  src="https://backend-koskita.hafidzfrqn.serv00.net//storage/property_files/2/ff8357cd-cf2.jpg"
                  alt="Property Image"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ px: '2rem', pt: { xs: 3, md: 12 }, pb: 16 }}>
        <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ color: '#FFCC00' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="50"
                role="img"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
                {/* <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    /> */}
              </svg>
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Masih ragu untuk bekerja sama dengan KostKita? Kami bantu jawab semua pertanyaan Anda.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Box>
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
          sx={{
            padding: 0,
            backgroundImage: `url('https://backend-koskita.hafidzfrqn.serv00.net//storage/banner_images/2/8sfikdpc48ilITfQXbYUQPA62kJU0sDaOUhtn5R8.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            px: '2rem',
            pt: { xs: 3, md: 24 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', pb: 5 }}>
            Daftarkan Properti Anda & Rasakan Keuntungannya
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 0, md: 3 },
              mx: 'auto',
              maxWidth: { xs: '100%', md: '50%' },
              flexDirection: { xs: 'column', md: 'row-reverse' },
            }}
          >
            <Button
              variant="outlined"
              // fullWidth
              sx={{
                mt: 3,
                width: { xs: '100%' },
                borderColor: '#25D366',
                color: 'common.white',
                textTransform: 'none',
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '8px',
                // ':hover': { backgroundColor: '#ddd' },
              }}
            >
              <Iconify width={24} icon="ic:baseline-whatsapp" sx={{ mr: 1 }} /> Hubungi Tim KostKita
            </Button>
            <Button
              variant="contained"
              // fullWidth
              sx={{
                mt: 3,
                width: { xs: '100%' },
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '8px',
                ':hover': { backgroundColor: '#ddd' },
              }}
              onClick={handleClickOpened}
            >
              Daftarkan Properti Anda
            </Button>
          </Box>
        </Box>
      </Box>
      <DialogCreate
        // pending={isPendingMutate}
        // SubmitFormValue={handleCreate}
        // coliving={true}
        info={`Mohon Isi Form Berikut Agar Tim KostKita Bisa menghubungi anda`}
        open={opened}
        title="Pendaftaran Property"
        subTitle="Form pendaftaran properti"
        setOpen={setOpened}
        field={FieldRHF}
        SubmitForm={handleSubmitForm}
      />
    </>
  );
}
