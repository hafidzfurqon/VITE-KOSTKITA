import { useState } from 'react';
import { Box, Typography, Chip, Stack, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useRouter } from 'src/routes/hooks';
import Loading from 'src/components/loading/loading';
import 'keen-slider/keen-slider.min.css';
import { Home, Apartment } from '@mui/icons-material';
import { useKeenSlider } from 'keen-slider/react';

export default function PropertyBudgety() {
  const { data, isLoading, isFetching } = useListProperty();
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState(null);
  console.log(selectedRange)
  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="textSecondary">
          Tidak ada data properti yang tersedia.
        </Typography>
      </Container>
    );
  }

  // Urutkan properti berdasarkan start_price (tertinggi ke terendah)
  const sortedProperties = [...data].sort((a, b) => b.start_price - a.start_price);

  // Ambil harga tertinggi & terendah dari properti
  const maxPrice = Math.max(...data.map((p) => p.start_price));
  const minPrice = Math.min(...data.map((p) => p.start_price));

  // Buat rentang harga secara dinamis berdasarkan harga tertinggi & terendah
  const step = Math.floor((maxPrice - minPrice) / 4); // Bagi jadi 4 range


  // Filter properti berdasarkan rentang harga yang dipilih
  const filteredProperties = selectedRange
    ? sortedProperties.filter(
        (property) =>
          property.start_price >= selectedRange.min && property.start_price <= selectedRange.max
      )
    : sortedProperties;

  // const formatPriceLabel = (price) => {
  //   if (price >= 1_000_000_000) {
  //     return `${(price / 1_000_000_000).toFixed(1)} M`;
  //   } else if (price >= 1_000_000) {
  //     return `${(price / 1_000_000).toFixed(1)} Jt`;
  //   } else if (price >= 1_000) {
  //     return `${(price / 1_000).toFixed(0)}Rb`;
  //   }
  //   return price.toString();
  // };
  const formatShortCurrency = (price) => {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(0)} M`;
    } else if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(0)} Jt`;
    } else if (price >= 1_000) {
      return `${(price / 1_000).toFixed(0)} Rb`;
    }
    return price.toString();
  };
  const priceRanges = Array.from({ length: 4 }, (_, i) => {
    const min = minPrice + step * i;
    const max = i === 3 ? maxPrice : min + step;
    return {
      label: `${formatShortCurrency(max)} - ${formatShortCurrency(min)}`,
      min,
      max,
    };
  }).reverse(); // Urutkan dari harga tertinggi ke terendah
    
  return (
    <Container>
      <Box sx={{ mt: 10 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
          Cari hunian sesuai budgetmu
        </Typography>

        {/* Filter berdasarkan range harga */}
        <Stack
  sx={{
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    gap: 2,
    pb: 1, // Agar scrollbar tidak menutupi konten
    '&::-webkit-scrollbar': {
      display: 'none', // Sembunyikan scrollbar
    },
  }}
  direction="row"
  spacing={1}
  mb={3}
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
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: '#00796B',
          color: 'white',
        },
      }}
      
      onClick={() => setSelectedRange(selectedRange === range ? null : range)}
    />
  ))}
</Stack>

{/* Tampilkan pesan jika tidak ada properti yang sesuai */}
{filteredProperties.length === 0 && (
  <Typography variant="body1" color="textSecondary" textAlign="center">
    Tidak ada properti dengan rentang harga tersebut. {selectedRange.label}
  </Typography>
)}

      </Box>

      {/* List Properti */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
          mt: 4,
          mb: 4,
        }}
      >
        {filteredProperties.map((property) => (
          <Box
            key={property.id}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 1,
              '&:hover': { boxShadow: 3 },
            }}
          >
            <ImageSlider images={property.files} />
            <Link
              to={`/property/${property.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                  {property.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray', fontSize: '12px' }}>
                  {property.address}, {property.city.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                >
                  {formatCurrency(property.start_price)} / bulan
                </Typography>
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </Container>
  );

  function ImageSlider({ images }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef, instanceRef] = useKeenSlider({
      loop: true,
      slides: { perView: 1 },
      mode: 'free-snap',
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
    });

    const prevSlide = () => instanceRef.current?.prev();
    const nextSlide = () => instanceRef.current?.next();

    return (
      <Box
        sx={{
          position: 'relative',
          height: 200,
          backgroundColor: 'grey.300',
          '&:hover .slider-arrow': { opacity: 1 },
        }}
      >
        <Box ref={sliderRef} className="keen-slider">
          {images.length > 0 ? (
            images.map((image, index) => (
              <Box sx={{ borderRadius: 2 }} key={index} className="keen-slider__slide">
                <img
                  src={image.file_url}
                  alt={`Property Image ${index}`}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </Box>
            ))
          ) : (
            <Box
              className="keen-slider__slide"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: 'gray',
              }}
            >
              <Typography variant="caption" color="white">
                No Image Available
              </Typography>
            </Box>
          )}
        </Box>

        {images.length > 1 && (
          <>
            <Box
              className="slider-arrow"
              sx={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: 'black',
                p: 1,
                borderRadius: '20%',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
              onClick={prevSlide}
            >
              {'<'}
            </Box>
            <Box
              className="slider-arrow"
              sx={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: 'black',
                p: 1,
                borderRadius: '20%',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
              onClick={nextSlide}
            >
              {'>'}
            </Box>
          </>
        )}

        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === currentSlide ? 'black' : 'white',
                  opacity: index === currentSlide ? 1 : 0.5,
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }
}
