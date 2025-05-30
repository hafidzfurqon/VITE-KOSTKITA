// PropertyLocationDetail
import { Apartment, Home } from '@mui/icons-material';
import { Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { Container } from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Loading from 'src/components/loading/loading';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { fPercent } from 'src/utils/format-number';

interface Property {
  type: {
    name: string;
    city: string;
  };
}

const data: Property[] | any = [
  { type: { name: 'coliving' } },
  { type: { name: 'apartement' } },
  { type: { name: 'coliving' } },
];

const PropertyLocationDetail = () => {
  const { slug } = useParams();
  const { data, isLoading, isFetching } = useListProperty();
  console.log(slug);
  const getPropertyIcon = (type: string) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  const formatCurrency = (price: any) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  // console.log(slug);
  const filteredDataToState: Property[] | any = data.filter(
    (item: any) => String(item.city?.city_code) === slug
  );

  // console.log(data.filter((item: any) => String(item.city?.city_code)));

  if (
    !filteredDataToState ||
    (Array.isArray(filteredDataToState) && filteredDataToState.length === 0)
  ) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <img
              src="/assets/no-data.svg"
              alt="No Data"
              style={{ width: 250, marginBottom: 16 }}
            /> */}
          <Typography variant="h6" color="textSecondary">
            Tidak ada data properti yang tersedia.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Coba lagi nanti atau cari kategori lainnya.
          </Typography>
        </Box>
      </Container>
    );
  }

  // console.log(filteredDataToState)
  return (
    <>
      <CustomBreadcrumbs
        links={[{ name: 'Home', href: '/' }, { name: filteredDataToState[0]?.city?.name }]}
        sx={{ mb: { xs: 2, md: 3 } }}
        action={null}
        heading=""
        moreLink={[]}
        activeLast={true}
      />
      <Typography sx={{ mb: 4, fontSize: { xs: '18px', md: '30px' }, fontWeight: 'bold' }}>
        Sewa Kost di {filteredDataToState[0]?.city?.name}
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 16 }}
        sx={{ placeItems: 'center', mt: 3 }}
      >
        {filteredDataToState.map((coliving: any, index: number) => {
          const hasDiscount = coliving.discounts.length > 0;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link
                to={`/property/${coliving.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Box
                  key={coliving.id}
                  sx={{
                    width: '95%',
                    height: 190,
                    overflow: 'hidden',
                    mb: 3,
                    borderRadius: 1,
                  }}
                >
                  <img
                    src={coliving.files[0]?.file_url}
                    alt={coliving.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Chip
                  icon={getPropertyIcon(coliving.type.name)}
                  label={coliving.type.name}
                  sx={{ mb: 1, fontWeight: 600 }}
                />
                <Typography variant="subtitle1" sx={{ color: 'black' }}>
                  {coliving.name}
                </Typography>
                <Box sx={{ color: 'gray' }}>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
                    {coliving.address}, {coliving.city.name}
                  </Typography>
                </Box>
                {coliving.discount_prifile_urlce ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{ color: 'gray', textDecoration: 'line-through' }}
                    >
                      {formatCurrency(coliving.start_price)}
                    </Typography>
                    <Chip label="-12%" color="error" size="small" />
                  </Stack>
                ) : null}
                {hasDiscount ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                      <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ textDecoration: 'line-through', fontWeight: 700, fontSize: '12px' }}
                      >
                        {formatCurrency(coliving.start_price)}
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
                        -Rp {fPercent(coliving.discounts[0]?.discount_value)}
                      </Box>
                      <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                        {formatCurrency(
                          coliving.discounts.map((discount: any) => discount.price_after_discount)
                        )}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                  >
                    {formatCurrency(coliving.start_price)} / bulan
                  </Typography>
                )}
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default PropertyLocationDetail;
