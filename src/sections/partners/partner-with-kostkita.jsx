import { Home } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { CardActionArea } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { Box, Container, Typography, Stack, Button, Grid } from '@mui/material';

export function PartnerWithKostKita() {
  const EcoSystemData = [
    {
      name: 'Coliving',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem fuga ducimus expedita eum blanditiis iusto tempora magni, aut deserunt suscipit consectetur illum rerum culpa temporibus dolor excepturi perspiciatis. Magni, voluptatem!',
    },
    {
      name: 'Apartement',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem fuga ducimus expedita eum blanditiis iusto tempora magni, aut deserunt suscipit consectetur illum rerum culpa temporibus dolor excepturi perspiciatis. Magni, voluptatem!',
      svgIcon: '',
    },
    {
      name: 'Coliving',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem fuga ducimus expedita eum blanditiis iusto tempora magni, aut deserunt suscipit consectetur illum rerum culpa temporibus dolor excepturi perspiciatis. Magni, voluptatem!',
    },
    {
      name: 'Coliving',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem fuga ducimus expedita eum blanditiis iusto tempora magni, aut deserunt suscipit consectetur illum rerum culpa temporibus dolor excepturi perspiciatis. Magni, voluptatem!',
    },
    {
      name: 'Coliving',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem fuga ducimus expedita eum blanditiis iusto tempora magni, aut deserunt suscipit consectetur illum rerum culpa temporibus dolor excepturi perspiciatis. Magni, voluptatem!',
    },
  ];
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        maxWidth="xl"
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
          >
            Saya Tertarik
          </Button>
        </Box>
      </Box>
      <Box maxWidth="xl">
        <Box
          maxWidth="xl"
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
            {EcoSystemData.map((data) => (
              <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <Card sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { xs: 'left', md: 'center' },
                      gap: 3,
                      justifyContent: 'center',
                      flexGrow: 1,
                    }}
                  >
                    <Box>
                      <svg
                        fill="currentColor"
                        role="img"
                        width="70"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ pb: 2, fontWeight: 'bold' }}>
                        {data.name}
                      </Typography>
                      <Typography variant="body2">{data.description}</Typography>
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'end',
                      px: 3,
                      pt : 2,
                      pb: {xs : 4, md:3},
                      justifyContent: 'end',
                    }}
                  >
                    {/* {' '} */}
                    <LoadingButton
                      // fullWidth
                      // sx={{ my: { xs: 2, md: 1 } }}
                      size="medium"
                      color="inherit"
                      variant="outlined"
                    >
                      Lihat Selengkapnya
                    </LoadingButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
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
                  <Box>
                    <svg
                      fill="currentColor"
                      role="img"
                      width="50"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Coliving
                    </Typography>
                    <Typography variant="body2">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum velit
                      accusamus.
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
                  <Box>
                    <svg
                      fill="currentColor"
                      role="img"
                      width="50"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Coliving
                    </Typography>
                    <Typography variant="body2">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum velit
                      accusamus.
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
                  <Box>
                    <svg
                      fill="currentColor"
                      role="img"
                      width="50"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ pb: '3px', fontWeight: 'bold' }}>
                      Coliving
                    </Typography>
                    <Typography variant="body2">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum velit
                      accusamus.
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
