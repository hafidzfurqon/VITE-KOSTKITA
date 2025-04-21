// import { Button } from '@mui/lab';
import { Card, CardContent } from '@mui/material';
import { Box, Typography, Stack, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

export function PartnerWithKostKita() {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          alignItems: 'center',
          height: '100vh',
          padding: 0,
          background: 'linear-gradient(135deg, #FFCC00, #800000)',
          color: 'white',
          borderTopLeftRadius: '80px',
        }}
      >
        {/* Bagian Kanan (Gambar) */}

        <Box
          component="img"
          loading="lazy"
          alt={`sdsd`}
          src={`https://img.freepik.com/free-photo/business-insurance-communication-ideas-concept-with-asian-attractive-male-casual-tshirt-hand-hold-wooden-house-model-box-smile-happiness-hand-gesture-pose-present-point-show-joyful-moment_609648-1214.jpg?t=st=1743344863~exp=1743348463~hmac=f3649636cdb2abfd97128511d43d217ca979f650ea9331ba5a1c1e75626b589f&w=1380`}
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
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Maksimalkan Profit dari Aset Properti Anda
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '500px', opacity: 0.8 }}>
            Apapun jenis properti Anda, KostKita siap membantu mengubahnya menjadi bisnis yang
            menguntungkan.
          </Typography>
          <Button
            variant="contained"
            // fullWidth
            sx={{
              mt: 3,
              width: { xs: '100%' },
              backgroundColor: 'white',
              color: 'black',
              textTransform: 'none',
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '8px',
              ':hover': { backgroundColor: '#ddd' },
            }}
            onClick={() => {
              document.getElementById('interest')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Saya Tertarik
          </Button>
        </Box>
      </Box>
      <Box id="interest">
        <Box
          sx={{
            padding: 0,
            background: 'white',
            color: 'black',
            px: '2rem',
            pt: 10,
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', pb: 5 }}>
            Ekosistem Menyeluruh untuk Bisnis Properti Anda
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    p: 3,
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ color: '#FFCC00' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="70"
                      role="img"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ py: 1, fontWeight: 'bold' }}>
                      Coliving
                    </Typography>
                    <Typography variant="body1">
                      Pengelolaan bisnis kost dan coliving dari mulai bantuan marketing, pelayanan
                      customer, hingga pengoperasian bisnis rental.
                    </Typography>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'end',
                    px: 3,
                    pb: 5,
                    color: 'black',
                    justifyContent: 'end',
                  }}
                >
                  <Link
                    to="/kerja-sama-coliving"
                    target="_blank"
                    style={{ textDecoration: 'none', color: 'inherit' }} // <= Tambahkan ini
                  >
                    <Button size="medium" color="inherit" variant="outlined">
                      Lihat Selengkapnya
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    p: 3,
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ color: '#FFCC00' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="70"
                      role="img"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ py: 1, fontWeight: 'bold' }}>
                      Apartement
                    </Typography>
                    <Typography variant="body1">
                      Ubah aset pasif Anda menjadi bisnis properti yang menguntungkan.
                    </Typography>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'end',
                    px: 3,
                    pb: 5,
                    justifyContent: 'end',
                  }}
                >
                  {/* {' '} */}
                  <Button
                    // fullWidth
                    // sx={{ my: { xs: 2, md: 1 } }}
                    size="medium"
                    color="inherit"
                    variant="outlined"
                  >
                    Lihat Selengkapnya
                  </Button>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    p: 3,
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ color: '#FFCC00' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="70"
                      role="img"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ py: 1, fontWeight: 'bold' }}>
                      Apartement
                    </Typography>
                    <Typography variant="body1">
                      Ubah aset pasif Anda menjadi bisnis properti yang menguntungkan.
                    </Typography>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'end',
                    px: 3,
                    pb: 5,
                    justifyContent: 'end',
                  }}
                >
                  {/* {' '} */}
                  <Button
                    // fullWidth
                    // sx={{ my: { xs: 2, md: 1 } }}
                    size="medium"
                    color="inherit"
                    variant="outlined"
                  >
                    Lihat Selengkapnya
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box>
        <Box
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
            Solusi Bebas Ribet Dengan Layanan Komplit
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ color: '#FFCC00' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="50"
                      role="img"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Asset Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                      Kami mengelola aset properti Anda dan menjalankannya bisnisnya sebagai
                      properti rental yang menguntungkan.
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

                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ color: '#FFCC00' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="50"
                      role="img"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Hospitality Operator
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                      Staff yang berpengalaman lebih dari 10 tahun dan siap memberi pengalaman
                      positif bagi penghuni properti Anda.
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
                    alignItems: { xs: 'left', md: 'center' },
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ color: '#FFCC00' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="50"
                      role="img"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                      />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Technology
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4D4D4D' }}>
                      Dengan sistem yang terintegrasi teknologi, kami membuat bisnis properti jadi
                      lebih praktis dan canggih.
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            padding: 0,
            backgroundImage: `url('/assets/background/background-property.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopRightRadius: '70px',
            color: 'white',
            px: '2rem',
            pt: { xs: 3, md: 24 },
            pb: 12,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', pb: 5 }}>
            Daftarkan Properti Anda & Rasakan Keuntungannya
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                width: { xs: '100%', md: 'auto' },
                p: 2,
                color: 'black',
                bgcolor: 'white',
                // mx: 3,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                padding: '10px 20px',
                fontSize: '1rem',
                // borderRadius: '8px',
                ':hover': { backgroundColor: '#ddd' },
              }}
              onClick={() => {
                document.getElementById('interest')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Saya Tertarik
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
