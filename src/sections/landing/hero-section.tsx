import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import 'keen-slider/keen-slider.min.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useFetchBannerPublic } from 'src/hooks/banner';
import Loading from 'src/components/loading/loading';

interface HeroSectionProps {
  children?: ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const { data, isLoading, isFetching } = useFetchBannerPublic();

  if (isLoading || isFetching) {
    return <Loading />;
  }

  // Pastikan data ada sebelum mapping
  const banners = Array.isArray(data) ? data : [];

  // Mengumpulkan semua gambar dari promo dan property
  const carouselImages = banners.flatMap((banner) => {
    const images = [];
    if (banner.promo?.promo_image_url) {
      images.push(banner.promo.promo_image_url);
    }
    if (banner.property?.files) {
      images.push(banner.property.files[0].file_url);
    }
    return images;
  });

  console.log("Banner Images:", carouselImages);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '600px',
        borderBottomLeftRadius: '50px',
        borderBottomRightRadius: '50px',
        overflow: 'hidden',
      }}
    >
      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        infinite={true}
        showDots={true}
        autoPlay={true}
        autoPlaySpeed={3500}
        transitionDuration={500}
      >
        {carouselImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              height: '600px',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottomLeftRadius: '50px',
              borderBottomRightRadius: '50px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderBottomLeftRadius: '50px',
                borderBottomRightRadius: '50px',
              },
            }}
          />
        ))}
      </Carousel>
      {children && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            color: '#fff',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}
