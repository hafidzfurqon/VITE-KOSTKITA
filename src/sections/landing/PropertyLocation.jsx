import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Container, Chip, Stack } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { Home, Apartment } from '@mui/icons-material';
import Loading from 'src/components/loading/loading';

const PropertyBaseLocation = ({ data: cityCode, id }) => {
  const { data: allProperties, isLoading, isFetching } = useListProperty();

  const propertyList = Array.isArray(allProperties)
    ? allProperties.filter(
        (item) =>
          item.city?.city_code === cityCode && // hanya kota yang sesuai
          item.id !== id // kecuali id yang sama
      )
    : [];
  // console.log(id);
  const getPropertyIcon = (type) => {
    if (!type) return null; // Jika type kosong, tidak menampilkan ikon
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };
  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Hunian Lain Dekat Sini
      </Typography>

      {propertyList?.length === 0 && (
        <Typography sx={{ textAlign: 'center', mt: 3 }}>
          Belum ada properti di dekat kota ini
        </Typography>
      )}
      {
        <Carousel responsive={responsive} infinite autoPlay>
          {propertyList?.map((item) => {
            const hasDiscount = item.discounts && item.discounts.length > 0;
            const currentDate = new Date();
            const activePromos = item.promos; // Menampilkan semua promo tanpa filter tanggal


            console.log(item);
            console.log('Item Promos:', item.promos);
            console.log('Active Promos:', activePromos);

            return (
              <Box key={item.id}>
                <Link
                  to={`/sewa/kost/kota/${item.city.city_code}`}
                  style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 190,
                      overflow: 'hidden',
                      borderRadius: 1,
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item?.files[0]?.file_url}
                      alt={item?.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: '#FFBF00',
                        color: '#fff',
                        padding: '2px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                      }}
                    >
                      {item.status}
                    </Box>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mt: 1, display: 'flex', alignItems: 'center' }}
                  >
                    {getPropertyIcon(item.type?.name || '')}{' '}
                    <Typography component="span" variant="">
                      {item?.type?.name}
                    </Typography>
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'gray', my: '2px' }}>
                    {item.sector?.name}, {item.city?.name}
                  </Typography>

                  {hasDiscount ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                        <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            textDecoration: 'line-through',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {formatCurrency(item.start_price)}
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
                          -Rp {fPercent(item.discounts[0]?.discount_value)}
                        </Box>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                          {formatCurrency(item.discounts[0]?.price_after_discount)}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {item.discounts.some((d) => d.discount_value >= 10) && (
                          <Chip
                            label="Diskon sewa 12 Bulan"
                            variant="outlined"
                            color="primary"
                            size="small"
                          />
                        )}
                        {activePromos.length > 0 && (
                          <Chip
                            label="Promo"
                            color="primary"
                            sx={{ position: 'absolute', top: 10, left: 10 }}
                          />
                        )}
                      </Stack>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                    >
                      {formatCurrency(item.start_price)} /
                      {item?.payment_type === 'yearly' ? 'Tahun' : 'bulan'}
                    </Typography>
                  )}

                  {/* <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    📍 {item.distance} km dari {item.nearestLandmark}
                  </Typography> */}
                </Link>
              </Box>
            );
          })}
        </Carousel>
      }
    </Container>
  );
};

export default PropertyBaseLocation;
