import { Box, Typography, Chip, Stack, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import 'keen-slider/keen-slider.min.css';
import { Home, Apartment } from '@mui/icons-material';
import Loading from 'src/components/loading/loading';
import { fPercent } from 'src/utils/format-number';

export default function PropertyGrid({ data, isLoading, isFetching, sortCardBy }) {
  // const { data, isLoading, isFetching } = useListProperty();
  // const numberSortsortCardBy[0] === 'apartment' ?

  // const router = useRouter();

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const getPropertyIcon = (type) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const filteredDataToColiving = data.filter((item) =>
    sortCardBy.includes(item.type.name.toLowerCase())
  );
  console.log(sortCardBy);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 10,
    },
  };

  if (
    !filteredDataToColiving ||
    (Array.isArray(filteredDataToColiving) && filteredDataToColiving.length === 0)
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

  return (
    <Container maxWidth="100%" sx={{ px: 0, mt: 3 }}>
      {/* <Box position="relative"> */}
      {/* <Box */}
      {/* displayedData */}
      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4500}
        keyBoardControl={true}
        transitionDuration={500}
        containerClass="carousel-container"
        itemClass="carousel-item-padding"
      >
        {filteredDataToColiving?.map((property) => {
          const hasDiscount = property.discounts.length > 0;
          return (
            <Box
              key={property.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
                m: 1, // Tambahkan margin agar tidak menempel
              }}
            >
              <Link
                to={`/property/${property.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 3 },
                  }}
                >
                  <img
                    src={property?.files[0]?.file_url}
                    alt={`Property Image`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Box>
                {/* ))} */}

                <Box sx={{ p: 2 }}>
                  <Chip
                    icon={getPropertyIcon(property.type.name)}
                    label={property.type.name}
                    sx={{ mb: 1, fontWeight: 600 }}
                  />
                  <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                    {property.name}
                  </Typography>
                  <Box sx={{ color: 'gray' }}>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
                      {property.address}, {property.city.name}
                    </Typography>
                  </Box>
                  {property.discount_profile_price ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="body2"
                        sx={{ color: 'gray', textDecoration: 'line-through' }}
                      >
                        {formatCurrency(property.start_price)}
                      </Typography>
                      <Chip label="-12%" color="error" size="small" />
                    </Stack>
                  ) : null}
                  {/* {property.} */}

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
                          {formatCurrency(property.start_price)}
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
                          -Rp {fPercent(property.discounts[0]?.discount_value)}
                        </Box>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                          {formatCurrency(
                            property.discounts.map((discount) => discount.price_after_discount)
                          )}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                    >
                      {formatCurrency(property.start_price)} / bulan
                    </Typography>
                  )}
                </Box>
              </Link>
            </Box>
          );
        })}
      </Carousel>
    </Container>
  );
}
