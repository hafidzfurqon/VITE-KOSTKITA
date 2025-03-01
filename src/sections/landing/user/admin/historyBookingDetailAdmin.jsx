import { useState } from 'react';
import {
  Divider,
  Card,
  Typography,
  CircularProgress,
  Container,
  Box,
  Alert,
  Avatar,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useGetBookingDetail } from 'src/hooks/users/useGetBookingDetail';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// import FacilityModal from '../modal-facility';
import { useFetchBookingDetailProperty } from 'src/hooks/booking_admin';
import { fDate } from 'src/utils/format-time';
import FacilityModal from '../../modal-facility';
import { Stack } from '@mui/material';


export default function HistoryBookingDetailAdmin() {
  const { bookingCode } = useParams();
  const { data: booking, isLoading, isFetching, error } = useFetchBookingDetailProperty(bookingCode);
  // clg
  const [open, setOpen] = useState(false);
console.log(booking)
  if (isLoading || isFetching) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">Terjadi kesalahan saat mengambil data</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg" sx={{ p: 0 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Detail Booking
        </Typography>
        <CustomBreadcrumbs
          links={[
            { name: 'Management Booking', href: `/booked-property` },
            { name: 'Booking Detail', href: '' },
          ]}
          sx={{ mb: 3 }}
        />

        <Box sx={{ backgroundColor: 'white', p: 3, mb: 2, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
            Data Penghuni
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={booking.user_booking.user.photo_profile}
              alt={booking.user_booking.user.name}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography sx={{ fontWeight: 'medium' }}>Nama: {booking.user_booking.user.name}</Typography>
              <Typography sx={{ color: 'grey.800' }}>Nomor Telepon: {booking.user_booking.user.phone_number}</Typography>
              <Typography sx={{ color: 'grey.800' }}>Email: {booking.user_booking.user.email}</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>Pesanan</Typography>
          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'grey.500', fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.875rem' }}>
              {fDate(booking.user_booking.check_in)} - {fDate(booking.user_booking.check_out)}
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 'medium' }}>{booking.user_booking.property_room.name}</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'grey.600', mb: 1 }}>
            {booking?.user_booking?.number_of_guests} Orang 
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setOpen(true)}
            >
              Fasilitas unit <ChevronRightIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Typography>
          </Box>

          {/* Modal Fasilitas */}
          <FacilityModal
            isOpen={open}
            title="Fasilitas Bersama"
            onClose={() => setOpen(false)}
            facilities={booking.user_booking.property.facilities || []}
          />

              <Link 
               to={`/property/${booking.user_booking.property.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}>
                 <Stack direction="row" spacing={2}>
            {booking.user_booking.property.files.map((file, index) => (
              <img
                key={index}
                src={file.file_url}
                alt={`preview-${index}`}
                width={80}
                height={80}
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            ))}
          </Stack>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
          >
           
            <Typography variant='subtitle1' sx={{color : 'black'}}>{booking.user_booking.property.name}</Typography>
            <ChevronRightIcon sx={{ color: 'grey.400', fontSize: 20 }} />
          </Box>
          </Link>
          <Typography>{booking.user_booking.property.address}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Rp{booking.user_booking.total_price.toLocaleString()} /bulan
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
