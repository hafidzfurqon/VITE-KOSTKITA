import { Grid } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { Container } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const PropertyBaseLocation = () => {
    const data = {
        image : 'https://akademiprestasi.com/wp-content/uploads/2022/11/ipb.jpg',
        city_code : 3201,
        title : 'Bogor'
    }
  return (
   <Container sx={{ mb : 5}}>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} sx={{ placeItems: 'center', mt : 3 }}>
    <Grid item xs={12} sm={6} md={4} lg={3} key={data.title}>
    <Link
         to={`/sewa/kost/kota/${data.city_code}`}
         style={{ textDecoration: 'none', display: 'block' }}
       >
                <Box
                sx={{
                    width: '100%',
                    height: 190,
                    overflow: 'hidden',
                    mb: 1,
                    borderRadius: 1,
                }}
                ><img
                src={data.image}
                alt={data.title}
                style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                }}
            />
            </Box>
            <Typography variant='subtitle1' sx={{color : 'black'}}>{data.title}</Typography>
            </Link>
            </Grid>
    </Grid>
   </Container>
  )
}

export default PropertyBaseLocation