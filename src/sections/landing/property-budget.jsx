import { Box, Typography, Chip, Stack, Container, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import Loading from 'src/components/loading/loading';

// import 'react-multi-carousel/lib/styles.css';
import { useKeenSlider } from 'keen-slider/react';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'keen-slider/keen-slider.min.css';
import { Home } from '@mui/icons-material';
import ApartmentList from './apartement/apartemen-page-list';
import { fCurrency } from 'src/utils/format-number';

export default function PropertyBudgety() {
  const { data, isLoading, isFetching } = useListProperty();
  const [selectedRange, setSelectedRange] = useState(null);

  if (isLoading || isFetching) return <Loading />;
  if (!data || data.length === 0)
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="textSecondary">
          Tidak ada data properti yang tersedia.
        </Typography>
      </Container>
    );

  const priceRanges = [
    { label: '< 3 Jt', min: 0, max: 3000000 },
    { label: '3 - 5 Jt', min: 3000000, max: 5000000 },
    { label: '> 5 Jt', min: 5000000, max: Infinity },
  ];

  const filteredProperties = selectedRange
    ? data.filter(
        (property) =>
          property.start_price >= selectedRange.min && property.start_price <= selectedRange.max
      )
    : data;

  return (
    <Container>
      <Box sx={{ mt: 10 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
          Cari hunian sesuai <span style={{ color: '#FFCC00' }}>budgetmu</span>
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {priceRanges.map((range) => (
            <Chip
              key={range.label}
              label={range.label}
              variant="filled"
              sx={{
                backgroundColor: selectedRange?.label === range.label ? '#009688' : 'white',
                color: selectedRange?.label === range.label ? 'white' : 'black',
                border: '2px solid #009688',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { backgroundColor: '#00796B', color: 'white' },
              }}
              onClick={() => setSelectedRange(selectedRange === range ? null : range)}
            />
          ))}
        </Stack>

        {filteredProperties.length === 0 && (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Tidak ada properti dengan rentang harga tersebut.
          </Typography>
        )}
      </Box>

      <Box mt={2} maxWidth="100%" sx={{ px: 0 }}>
        <Box sx={{ position: 'relative', width: '100%', p: 2 }}>
          {/* Grid Layout for Desktop */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {filteredProperties.slice(0, 8).map((coliving) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={coliving.id}>
                <PropertyCard coliving={coliving} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

function PropertyCard({ coliving }) {
  const hasDiscount = coliving.discounts.length > 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Box component={Link} to={`/property/${coliving.slug}`} style={{ textDecoration: 'none' }}>
        <ImageSlider images={coliving.files || []} />
        <Chip
          icon={<Home fontSize="small" sx={{ mr: 0.5 }} />}
          label={coliving.type.name}
          sx={{ my: 2, fontWeight: 600 }}
        />
        <Typography variant="subtitle1" sx={{ color: 'black' }}>
          {coliving.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray', fontSize: '12px', mb: 1 }}>
          {coliving.address}, {coliving.city.name}
        </Typography>

        {hasDiscount ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
              <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
              <Typography
                variant="subtitle1"
                sx={{ textDecoration: 'line-through', fontWeight: 700, fontSize: '12px' }}
              >
                {fCurrency(coliving.start_price)}
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
                {fCurrency(coliving.discounts[0]?.price_after_discount)}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
          >
            {fCurrency(coliving.start_price)} / bulan
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function ImageSlider({ images }) {
  return (
    <Box sx={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 2 }}>
      <img
        src={images[0].file_url}
        alt="Property Image"
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
    </Box>
  );
  // }
}
