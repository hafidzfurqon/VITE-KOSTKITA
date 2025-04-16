import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Box } from '@mui/material';
import ReactLightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import 'yet-another-react-lightbox/styles.css';
import { AnimatePresence, motion } from 'framer-motion';
// motion
// AnimatePresence

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// Konfigurasi ukuran untuk setiap gambar
const imageConfig = [
  { cols: 2, rows: 2 }, // Gambar pertama besar
  { cols: 1, rows: 1 },
  { cols: 1, rows: 1 },
  { cols: 2, rows: 2 },
];

export default function FullScreenDialog({ open, handleClose, title, data }) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (data.length === 0) return <div>No data...</div>;

  const slides = data.map((image) => ({ src: image }));
  // const slides = data.map((image) => ({ src: image.original || image }));

  return (
    <>
      <AnimatePresence>
        <Dialog fullScreen open={open} onClose={handleClose} hideBackdrop>
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            style={{ height: '100%' }}
          >
            <AppBar sx={{ position: 'fixed', backgroundColor: '#f5f5f5' }}>
              <Toolbar>
                <IconButton edge="start" color="black" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6">
                  {title}
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', mt: 10, mx: 1, pb: 3, justifyContent: 'center' }}>
              <ImageList
                sx={{ width: '100%', maxWidth: 700, mx: 'auto', height: 'auto' }}
                cols={2}
                gap={8}
              >
                {data.map((image, index) => {
                  const config = imageConfig[index] || { cols: 1, rows: 1 };
                  return (
                    <ImageListItem
                      key={index}
                      cols={config.cols}
                      rows={config.rows}
                      onClick={() => {
                        setCurrentIndex(index);
                        setLightboxOpen(true);
                      }}
                      sx={{
                        '&:hover': { cursor: 'pointer', filter: 'brightness(0.9)' },
                      }}
                    >
                      <img
                        src={image}
                        alt={`Gallery Image ${index + 1}`}
                        loading="lazy"
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          borderRadius: '7px',
                        }}
                      />
                    </ImageListItem>
                  );
                })}
              </ImageList>
            </Box>
            {/* Container untuk Grid Gambar */}
          </motion.div>
        </Dialog>
      </AnimatePresence>
      {/* Lightbox untuk menampilkan gambar fullscreen */}
      <ReactLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentIndex}
        plugins={[Zoom, Fullscreen, Slideshow]}
        carousel={{ imageFit: 'contain' }}            
      />
    </>
  );
}
