import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// components
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Image from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import Loading from 'src/components/loading/loading';

// Data Dummy
const name = "Amazing Bali Tour";
const ratingNumber = 4.8;
const destination = "Bali, Indonesia";
const tourGuides = [
  { name: "John Doe", phoneNumber: "+62 812 3456 7890" },
  { name: "Jane Smith", phoneNumber: "+62 811 2233 4455" }
];
const available = { startDate: "2024-08-01", endDate: "2024-08-15" };


// Component utama
export default function PropertyDetail() {
  const {slug} = useParams()
  const { data = [], isLoading, isFetching, error } = useFetchPropertySlug(slug);
  const allFiles = data?.files?.map((file) => file)
  const slides = allFiles ? allFiles.map((files) => files.file_url) : []
  console.log(allFiles)
  console.log(slides)
  console.log("Data:", data);
  
  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const renderGallery = (
    <>
      <Box
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <m.div
          key={slides[0].src}
          whileHover="hover"
          variants={{
            hover: { opacity: 0.8 },
          }}
          transition={varTranHover()}
        >
          <Image
            alt={slides[0].src}
            src={slides[0].src}
            ratio="1/1"
            onClick={() => handleOpenLightbox(slides[0].src)}
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
        </m.div>

        <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {slides.slice(1, 5).map((slide) => (
            <m.div
              key={slide.src}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => handleOpenLightbox(slide.src)}
                sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </m.div>
          ))}
        </Box>
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );
  
  
  if(isLoading || isFetching) {
    return <Loading/>
  }
  const renderHead = (
    <>
    <Container>
      <Stack direction="row" sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
  {data?.name || "Loading..."}
</Typography>


        <IconButton>
          <Iconify icon="solar:share-bold" />
        </IconButton>

        <Checkbox
          defaultChecked
          color="error"
          icon={<Iconify icon="solar:heart-outline" />}
          checkedIcon={<Iconify icon="solar:heart-bold" />}
        />
      </Stack>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {ratingNumber}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>(234 reviews)</Link>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {destination}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
          <Iconify icon="solar:flag-bold" sx={{ color: 'info.main' }} />
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Guide by
          </Box>
          {tourGuides.map((tourGuide) => tourGuide.name).join(', ')}
        </Stack>
      </Stack>
    </Container>
    </>
  );

  const renderOverview = (
    <Container>
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      {[
        {
          label: 'Available',
          value: `${available.startDate} - ${available.endDate}`,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Contact name',
          value: tourGuides?.map((guide) => guide.name).join(', '),
          icon: <Iconify icon="solar:user-rounded-bold" />,
        },
        // {
        //   label: 'Durations',
        //   value: durations,
        //   icon: <Iconify icon="solar:clock-circle-bold" />,
        // },
        {
          label: 'Contact phone',
          value: tourGuides?.map((guide) => guide.phoneNumber).join(', '),
          icon: <Iconify icon="solar:phone-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText primary={item.label} secondary={item.value} />
        </Stack>
      ))}
    </Box>
    </Container>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {/* Google Maps */}
        <Container>
        <Box sx={{ width: '100%', height: 400, mb: 5 }}>
          <iframe
            src={data?.link_googlemaps}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Box>
        </Container>

        {/* <Markdown children={content} /> */}
      </Stack>
    </>
  );
}