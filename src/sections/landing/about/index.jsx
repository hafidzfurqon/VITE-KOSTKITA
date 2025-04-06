import { Avatar } from '@mui/material';
import { Card } from '@mui/material';
import { CardContent, Container, IconButton, Box, Typography, Grid, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react'; // ✅ Impor dengan benar
import { Pagination } from 'swiper/modules'; // ✅ Impor modul yang diperlukan
import 'swiper/css';
import 'swiper/css/pagination';
import { GitHub, YouTube, LinkedIn } from '@mui/icons-material';

export default function About() {
  const testimonials = [
    {
      name: 'Muhammad Hafidz',
      position: 'Mahasiswa',
      image:
        'https://backend-koskita.hafidzfrqn.serv00.net//storage/users_photo_profile/G8RuEIsSKlT1HpL3cnqX93L2FKH4CKXDr9TLfxNg.png',
      message:
        'Kostkita mempermudah saya ketika mencari kost sebagai mahasiswa baru di Bogor. Juga dengan harga pelajar seperti saya sangat worth it!',
    },
    {
      name: 'Ibnu Fajar',
      position: 'Karyawan',
      image:
        'https://experiment.riansudrajat.serv00.net/storage/news_thumbnail/6LHeX6mvsn3nad6Ob55k88vqZr8Z67OqTJZ6gSJs.jpg',
      message:
        'Semua pelayanan di kostkita sangat nyaman dan ramah, serta desain yang estetik juga membuat sangat membuat nyaman untuk ditinggali',
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        // maxWidth=""
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          alignItems: 'center',
          height: '100vh',
          padding: 0,
          background: '#7A5F00',
          color: 'white',
          // borderTopLeftRadius: '80px',
        }}
      >
        <Box
          component="img"
          loading="lazy"
          alt={`sdsd`}
          src={`https://images.rukita.co/buildings/building/b37581a1-604.jpg?tr=c-at_max%2Cw-800`}
          sx={{
            width: { xs: '100%', md: '50%' },
            height: '100%',
            maxWidth: 'unset',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            padding: { xs: '40px', md: '60px' },
          }}
        >
          <Typography variant="h1" fontWeight="bold" gutterBottom>
            Home That Grows With You
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '500px', opacity: 0.8 }}>
            Mewujudkan hunian berkualitas dan terjangkau untuk semua orang, di setiap fase
            kehidupan.
          </Typography>
          <Button
            variant="contained"
            // fullWidth
            color="inherit"
            sx={{
              mt: 3,
              width: { xs: '100%' },
              // backgroundColor: 'white',
              color: 'white',
              textTransform: 'none',
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '8px',
              ':hover': { backgroundColor: '#4D4D4D' },
            }}
          >
            Cari Hunian Sekarang
          </Button>
        </Box>
      </Box>
      {/* Why section */}
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
          sx={{
            padding: 0,
            background: 'white',
            color: 'black',
            px: '2rem',
            pt: { xs: 3, md: 10 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', pb: 5 }}>
            Keuntungan Tinggal di KostKita
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  <Box>
                    <img
                      src={`https://images.rukita.co/buildings/building/c9fabe7b-3c0.jpg?tr=c-at_max%2Cw-1040`}
                      alt="Promo"
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                      }}
                    />
                  </Box>
                  <Box sx={{ px: { xs: 0, md: 0 } }}>
                    <Typography variant="h5" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Desain Estetik
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4D4D4D' }}>
                      Desain yang nyaman, stylish, dan juga modern membuat hunian sangat cocok
                      ditinggali untuk siapapun
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  <Box>
                    <img
                      src={`https://img.freepik.com/free-photo/man-doing-professional-home-cleaning-service_23-2150359015.jpg?ga=GA1.1.1374719570.1742115385&semt=ais_hybrid`}
                      alt="Promo"
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                      }}
                    />
                  </Box>
                  <Box sx={{ px: { xs: 0, md: 2 } }}>
                    <Typography variant="h5" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Layanan Menyeluruh
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4D4D4D' }}>
                      Pembersihan kamar, laundry, maintenance, dan Customer Service yang siap
                      membantu.
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  <Box>
                    <img
                      src={`https://img.freepik.com/free-photo/men-shake-hands-enclosure-business-agreement-understanding-business-partners_1157-44618.jpg?ga=GA1.1.1374719570.1742115385&semt=ais_hybrid`}
                      alt="Promo"
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                      }}
                    />
                  </Box>
                  <Box sx={{ px: { xs: 0, md: 2 } }}>
                    <Typography variant="h5" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Harga Terjangkau
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4D4D4D' }}>
                      hunian berkualitas dan terjangkau untuk semua orang, di setiap fase kehidupan.
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Apa kata mereka section */}
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
          sx={{
            padding: 0,
            background: '#F0EFEA',
            color: 'black',
            px: '3rem',
            pt: { xs: 3, md: 5 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'left', pb: 2 }}>
            Apa Kata Mereka?
          </Typography>
          <Typography variant="h6" sx={{ pb: '3px', maxWidth: '38rem' }}>
            Berikut testimoni para pengunjung yang telah tinggal dan mengunjungi kostkita.id
          </Typography>

          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            style={{ marginTop: '20px' }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    p: 3,
                  }}
                >
                  <Avatar
                    src={testimonial.image}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '2px solid #FFD700',
                      marginRight: 3,
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {testimonial.position}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      "{testimonial.message}"
                    </Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
      {/* Sekilas */}
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
          sx={{
            padding: 0,
            background: 'white',
            color: 'black',
            px: '3rem',
            pt: { xs: 3, md: 5 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'left', pb: 5 }}>
            Tentang Kami
          </Typography>
          <Box id="about" sx={{ pt: 5, pb: 7 }}>
            <Box>
              <Grid container spacing={4}>
                {/* Bagian Kiri */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h5" color="secondary" fontWeight="bold" gutterBottom>
                    Sekilas Tentang KostKita
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore, nesciunt
                    illo atque id laborum cupiditate adipisci reiciendis quae optio ipsum placeat
                    totam doloremque velit at fugiat. Totam odio at sed, sequi est neque quibusdam,
                    doloremque suscipit velit ab, accusamus nihil? Dignissimos et totam sunt,
                    perspiciatis tenetur voluptas vitae! Nisi, nostrum.
                  </Typography>
                </Grid>

                {/* Bagian Kanan */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h5" color="secondary" fontWeight="bold" gutterBottom>
                    Dimana menemukan Kami?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim culpa ex suscipit
                    ut neque nesciunt quibusdam! Id sit eum fugiat porro, exercitationem ea odit
                    dicta provident. Natus cum quos recusandae. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Dicta, animi?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      color="primary"
                      component="a"
                      href="https://github.com/HapidzGIT"
                      target="_blank"
                    >
                      <GitHub />
                    </IconButton>
                    <IconButton
                      color="primary"
                      component="a"
                      href="https://youtube.com"
                      target="_blank"
                    >
                      <YouTube />
                    </IconButton>
                    <IconButton
                      color="primary"
                      component="a"
                      href="https://linkedin.com"
                      target="_blank"
                    >
                      <LinkedIn />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
