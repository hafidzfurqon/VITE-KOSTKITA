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
    <Box
      display="flex" // Pastikan flex digunakan
      justifyContent="center" // Posisi horizontal tengah
      alignItems="center" // Posisi vertikal tengah (jika diperlukan)
      flexWrap="wrap" // Agar responsif
      gap={2}
      sx={{ mb: { xs: 3, md: 5 } }}
    >
      {slides.map((src, index) => (
        <Box 
          key={index} 
          onClick={() => handleOpenLightbox(index)} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100%', // Biar gambar tidak meluas berlebihan
            maxWidth: '400px', // Batasi ukuran maksimal gambar
            cursor: 'pointer' 
          }}
        >
          <img
            src={src}
            alt={`Image ${index + 1}`}
            style={{
              width: '100%', // Agar tetap responsif
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </Box>
      ))}
    </Box>
  );
  
  // Tambahkan Lightbox agar gambar bisa diperbesar
  <Lightbox
    slides={slides}
    open={openLightbox}
    close={handleCloseLightbox}
    selected={selectedImage}
  />
  
  
  
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
          {data.address}
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
     
        {/* <Typography variant="body1">{data.description}</Typography> */}
        <Typography variant="subtitle1">Tipe: {data.type}</Typography>
        {/* <Typography variant="subtitle1">Harga Mulai: Rp {data.start_price?.toLocaleString()}</Typography> */}
        <Typography variant="subtitle1">Alamat: {data.address}</Typography>
        <Typography variant="subtitle1">Kota: {data.city?.name}</Typography>
        <Typography variant="subtitle1">Provinsi: {data.state?.name}</Typography>
      
    </Box>
    </Container>
  );

  return (
    <>
    <Stack sx={{mx: 'auto'}}>
      {renderGallery}
      </Stack>
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