import React from 'react';
import { Container, Typography, Card, CardContent, Box, Paper, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchPromoDetail } from 'src/hooks/promo';
import Loading from 'src/components/loading/loading';
import { useSnackbar } from 'notistack';
import { ContentCopy } from '@mui/icons-material';
import { fDate } from 'src/utils/format-time';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

const PromoDetails = () => {
  const { slug } = useParams();
  const { data, isLoading, isFetching } = useFetchPromoDetail(slug);
  const { enqueueSnackbar } = useSnackbar();

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.code);
    enqueueSnackbar('Kode Berhasil Disalin', { variant: 'success' });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Promo', href: '/promo' },
          { name: <span dangerouslySetInnerHTML={{ __html: data.slug }} />, href: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box
        component="img"
        src={data.promo_image_url}
        alt={data.name}
        sx={{
          width: '100%',
          height: '100%',
          maxHeight: 500,
          borderRadius: '10px',
          objectFit: 'cover',
        }}
      />
      {/* </Box> */}

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Promo Details */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: 'bolder' }}>
            {data.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2 }}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {/* Syarat & Ketentuan */}
          <Typography variant="h6" sx={{ mt: 4, fontWeight: 'bold' }}>
            Syarat & Ketentuan
          </Typography>
          <ul>
            <li>
              Periode promo berlaku {fDate(data.start_date)} - {fDate(data.end_date)}
            </li>
          </ul>
          <Typography variant="h6" sx={{ mt: 4, fontWeight: 'bold' }}>
            Disclaimer
          </Typography>
          <Typography variant="subtitle1">{data.disclaimer}</Typography>
        </Grid>

        {/* Cara Pakai */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#F5ECE0' }}>
            <Typography variant="h6" color={`black`}>
              Cara Pakai
            </Typography>
            <Box
              component="button"
              onClick={handleCopyCode}
              mt={3}
              sx={{
                width: '100%',
                display: 'flex',
                p: 2,
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'white',
                cursor: 'pointer',
                borderRadius: '10px',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {data.code}
              </Typography>
              <ContentCopy />
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: data.how_to_use }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PromoDetails;
