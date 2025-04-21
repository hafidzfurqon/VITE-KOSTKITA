import { Apartment, Home } from '@mui/icons-material';
import { Chip, Grid, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { Container } from '@mui/material';
import { useKeenSlider } from 'keen-slider/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingPropertyPage from 'src/components/loading/LoadingPropertyPage';
import { useResponsive } from 'src/hooks/use-responsive';
import SearchIcon from '@mui/icons-material/Search';
import FilterModal from 'src/component/FilterModal';
import { useDebounce } from 'src/hooks/use-debounce';
interface Property {
  type: {
    name: string;
  };
  rooms: any;
}
type Filters = {
  query: string;
  date: string;
  type: string;
  gender: string[];
  category: string;
  tipeHunian: string[];
  jumlahOrang: string[];
  priceRange: [number, number];
  colors: string[];
  rating: string;
};

const data: any = [
  { type: { name: 'coliving' } },
  { type: { name: 'apartement' } },
  { type: { name: 'coliving' } },
];

const ColivingPage = () => {
  const { data, isLoading, isFetching } = useListProperty();
  const [searchValues, setSearchValues] = useState({
    query: '',
    date: '',
    type: '',
  });
  const debouncedQuery = useDebounce(searchValues.query);
  const [allFilters, setAllFilters] = useState<Filters>({
    query: '',
    date: '',
    type: '',
    gender: [],
    category: '',
    tipeHunian: [],
    jumlahOrang: [],
    priceRange: [0, 10000000],
    colors: [],
    rating: '',
  });
  const [filters, setFilters] = useState({
    gender: [],
    category: '',
    tipeHunian: [],
    jumlahOrang: [],
    priceRange: [0, 10000000],
    colors: [],
    rating: '',
  });
  const filteredDataToColiving: Property[] = data?.filter(
    (item: Property) => item.rooms.length > 0
  );
  const [sortBy, setSortBy] = useState<any>();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleFilterChange = useCallback((filters: any) => {
    console.log('Filters updated in LandingPage:', filters);
    setAllFilters(filters);
  }, []);
  const onFilterChange = handleFilterChange;
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    onFilterChange({ ...searchValues, ...newFilters }); // Send all filters to parent
  };
  const handleResetFilters = () => {
    const resetFilters = {
      gender: [],
      category: '',
      tipeHunian: [],
      jumlahOrang: [],
      priceRange: [0, 10000000],
      colors: [],
      rating: '',
    };
    setFilters(resetFilters);
    onFilterChange({ ...searchValues, ...resetFilters }); // Update parent with reset filters
  };

  const filteredData = useMemo(() => {
    if (!filteredDataToColiving) return [];

    return filteredDataToColiving.filter((property: any) => {
      // Text search filters
      const query = allFilters.query?.trim().toLowerCase();
      const matchesQuery = query
        ? [
            property.name,
            property.state?.name,
            property.city?.name,
            property.sector?.name,
            property.address,
          ]
            .filter(Boolean)
            .some((item) => item.toLowerCase().includes(query))
        : true;

      // Type filters
      const matchesType = allFilters.type
        ? property.type?.name?.toLowerCase().includes(allFilters.type.toLowerCase())
        : true;

      // Date filters
      const matchesDate = allFilters.date ? property.created_at === allFilters.date : true;

      // Tipe Hunian filter
      const matchesTipeHunian =
        allFilters.tipeHunian && allFilters.tipeHunian.length > 0
          ? allFilters.tipeHunian.includes(property.type?.name)
          : true;

      // Price range filter
      const [minPrice, maxPrice] = allFilters.priceRange || [0, 10000000];

      // Ambil semua harga "1_month" dari setiap room (kalau ada)
      const monthlyPrices = property.rooms
        ?.map(
          (room: any) => room.room_prices?.find((price: any) => price.duration === '1_month')?.price
        )
        .filter(Boolean); // Buang undefined

      // Ambil harga terkecil (atau bisa juga terbesar, tergantung keperluan)
      const lowestMonthlyPrice = Math.min(...monthlyPrices);

      // Bandingkan apakah harga itu masuk dalam rentang
      const matchesPriceRange = lowestMonthlyPrice >= minPrice && lowestMonthlyPrice <= maxPrice;

      // Only filter by sortBy if it's specified
      const matchesPropertyType =
        Array.isArray(sortBy) && sortBy.length > 0
          ? sortBy.includes(property.type?.name?.toLowerCase())
          : true;

      // Gender filter
      const matchesGender =
        allFilters.gender && allFilters.gender.length > 0
          ? allFilters.gender.includes(property.gender) || property.gender === 'both'
          : true;

      // Category filter (payment type)
      const matchesCategory =
        allFilters.category && allFilters.category !== 'all'
          ? property.payment_type === allFilters.category
          : true;

      // Jumlah Orang filter
      const matchesJumlahOrang =
        allFilters.jumlahOrang && allFilters.jumlahOrang.length > 0
          ? property.rooms?.some((room: any) =>
              allFilters.jumlahOrang.includes(String(room.capacity))
            )
          : true;

      // Rating filter
      const matchesRating = allFilters.rating
        ? property.rooms?.some((room: any) => room.average_rating >= parseFloat(allFilters.rating))
        : true;

      return (
        matchesQuery &&
        matchesType &&
        matchesDate &&
        matchesTipeHunian &&
        matchesPriceRange &&
        matchesPropertyType &&
        matchesGender &&
        matchesCategory &&
        matchesJumlahOrang &&
        matchesRating
      );
    });
  }, [filteredDataToColiving, allFilters, sortBy]);

  const categoryOptions = useMemo(() => {
    if (!data || data.length === 0) return ['all'];
    const all = data.map((p: any) => p?.payment_type).filter(Boolean);
    return ['all', ...Array.from(new Set(all))];
  }, [data]);

  const tipeHunianOptions = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Array.from(new Set(data.map((p: any) => p?.type?.name).filter(Boolean)));
  }, [data]);

  const jumlahOrangOptions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const capacities = data.flatMap((p: any) =>
      p.rooms?.map((r: any) => r?.capacity).filter(Boolean)
    );
    return Array.from(new Set(capacities));
  }, [data]);

  const ratingOptions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const ratings = data.flatMap((p: any) =>
      p.rooms?.map((r: any) => r?.average_rating).filter(Boolean)
    );
    return Array.from(new Set(ratings));
  }, [data]);

  // Update parent component with search values changes
  useEffect(() => {
    onFilterChange({ ...searchValues, ...filters });
  }, [searchValues, onFilterChange]);

  const handleChange = (field: any, value: any) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isMobile = useResponsive('down', 'sm');

  console.log(filteredDataToColiving);
  const getPropertyIcon = (type: string) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  const formatCurrency = (price: any) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  if (isLoading || isFetching) {
    return <LoadingPropertyPage />;
  }

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

  // console.log(filteredDataToColiving)
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CustomBreadcrumbs
          links={[{ name: 'Home', href: '/' }, { name: 'Kost & Coliving' }]}
          sx={{ mb: { xs: 2, md: 3 } }}
          action={null}
          heading=""
          moreLink={[]}
          activeLast={true}
        />
        <Button
          onClick={handleOpenFilterModal}
          variant="contained"
          sx={{
            bgcolor: '#FFD700',
            color: 'black',
            p: 2,
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            '&:hover': { bgcolor: '#FFC107' },
          }}
        >
          <SearchIcon />
          {!isMobile && 'Filter'}
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ placeItems: 'center', mt: 3 }}>
        {filteredData.map((coliving: any, index: number) => {
          const oneMonthData = (() => {
            if (!coliving?.rooms) return null;

            // Ambil semua data harga "1_month" + diskonnya
            const pricesWithDiscount = coliving?.rooms
              .map((room: any) => {
                const priceItem = room?.room_prices?.find(
                  (price: any) => price?.duration === '1_month'
                );
                if (!priceItem) return null;

                const discount = priceItem?.room_discounts?.[0]; // ambil diskon pertama jika ada
                return {
                  price: priceItem.price,
                  discountValue: discount?.discount_value
                    ? parseFloat(discount.discount_value)
                    : null,
                };
              })
              .filter(Boolean); // hapus null

            if (pricesWithDiscount.length === 0) return null;

            // Ambil harga dengan diskon termurah
            return pricesWithDiscount.reduce((min: any, curr: any) => {
              const currFinal = curr.discountValue
                ? curr.price - curr.price * (curr.discountValue / 100)
                : curr.price;
              const minFinal = min.discountValue
                ? min.price - min.price * (min.discountValue / 100)
                : min.price;

              return currFinal < minFinal ? curr : min;
            });
          })();

          const originalPrice = oneMonthData?.price ?? 0;
          const discount = oneMonthData?.discountValue;
          const finalPrice = discount
            ? originalPrice - originalPrice * (discount / 100)
            : originalPrice;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={coliving.id}>
              <Box sx={{ mb: 3 }}>
                <ImageSlider images={coliving.files || []} />
              </Box>
              <Box
                component={Link}
                to={`/property/${coliving.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Chip
                  icon={getPropertyIcon(coliving.type.name)}
                  label={coliving.type.name}
                  sx={{ mb: 1, fontWeight: 600 }}
                />
                <Typography variant="subtitle1" sx={{ color: 'black' }}>
                  {coliving.name}
                </Typography>
                <Box sx={{ color: 'gray' }}>
                  <Typography variant="body2" sx={{ fontSize: '12px' }}>
                    {coliving.address}, {coliving.city.name}
                  </Typography>
                </Box>

                {/* Price */}
                {/*  */}
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '12px' }}>
                      Mulai dari{' '}
                      <span style={{ textDecoration: 'line-through' }}>
                        {formatCurrency(originalPrice)}
                      </span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', pt: '2px' }}>
                      {discount && (
                        <Typography
                          variant="overline"
                          sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            px: '2px',
                            mr: '4px',
                          }}
                        >
                          -{discount}%
                        </Typography>
                      )}
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                      >
                        {formatCurrency(finalPrice)} <span>/bulan</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <FilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onOpen={handleOpenFilterModal}
        filters={filters}
        onFilters={handleApplyFilters}
        canReset={Object.values(filters).some((val) =>
          Array.isArray(val)
            ? val.length > 0
            : val !== '' && JSON.stringify(val) !== JSON.stringify([0, 10000000])
        )}
        onResetFilters={handleResetFilters}
        ratingOptions={ratingOptions as any}
        categoryOptions={categoryOptions as any}
        tipeHunianOptions={tipeHunianOptions as any}
        jumlahOrangOptions={jumlahOrangOptions as any}
      />
    </>
  );
};

function ImageSlider({ images }: any) {
  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 1 },
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ❗ jika hanya 1 gambar, return biasa
  if (images.length === 1) {
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
  }

  // ❗ jika lebih dari 1, pakai slider
  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image: any, index: number) => (
            <Box
              key={index}
              className="keen-slider__slide"
              sx={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 2 }}
            >
              <img
                src={image.file_url}
                loading="lazy"
                alt={`Property Image ${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
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
      {images.length > 1 && isHovered && (
        <>
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
        </>
      )}

      {/* Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px 10px',
          borderRadius: '20px',
        }}
      >
        {images.map((_: any, idx: number) => (
          <Box
            key={idx}
            onClick={() => slider.current?.moveToIdx(idx)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentSlide === idx ? 'white' : 'grey',
              mx: 0.5,
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
export default ColivingPage;
