import React from 'react';
import { Container, Typography, Card, CardContent, Box, Paper, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchPromoDetail } from 'src/hooks/promo';
import Loading from 'src/components/loading/loading';
import { useSnackbar } from 'notistack';
import { ContentCopy } from '@mui/icons-material';
import { fDate } from 'src/utils/format-time';

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Banner Image */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden' }}>
        <Box
          component="img"
          src={data.promo_image_url}
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

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Promo Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {data.name}
          </Typography>
          <Typography
            variant="subtitle1"
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
        </Grid>

        {/* Cara Pakai */}
        <Grid item xs={12} md={4}>
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

      {/* Disclaimer */}
      <Typography variant="h6" sx={{ mt: 4, fontWeight: 'bold' }}>
        Disclaimer
      </Typography>
      <Typography variant="subtitle1">{data.disclaimer}</Typography>
    </Container>
  );
};

export default PromoDetails;
