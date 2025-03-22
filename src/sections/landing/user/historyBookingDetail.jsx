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
  Stack,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useGetBookingDetail } from 'src/hooks/users/useGetBookingDetail';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FacilityModal from '../modal-facility';
import { fDate } from 'src/utils/format-time';
import DetailDataPenghuni from './bookingStep/detailDataPenghuni';
import { Button } from '@mui/material';
import ModalDataPenghuni from './modalDataPenghuni';

export default function HistoryBookingDetail() {
  const { bookingCode } = useParams();
  const { data: booking, isLoading, isFetching, error } = useGetBookingDetail(bookingCode);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  const handleOpenModal = (resident) => {
    setSelectedResident(resident);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedResident(null);
  };

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
            { name: 'Riwayat Booking', href: `/history/booking` },
            { name: 'Booking Detail', href: '' },
          ]}
          sx={{ mb: 3 }}
        />

        <Box sx={{ backgroundColor: 'white', p: 3, mb: 2, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
            Data Penghuni
          </Typography>

          <Box>
            {booking.booking_user_information.length > 0 ? (
              booking.booking_user_information.map((resident, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={resident.photo_profile}
                    alt={resident.fullname}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 'medium' }}>Nama: {resident.fullname}</Typography>
                    <Typography sx={{ color: 'grey.800' }}>
                      Nomor Telepon: {resident.phone_number}
                    </Typography>
                    <Typography sx={{ color: 'grey.800' }}>Email: {resident.email}</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{ ml: 'auto' }}
                    onClick={() => handleOpenModal(resident)}
                  >
                    Lihat Selengkapnya
                  </Button>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: 'grey.800' }}>Tidak ada data penghuni.</Typography>
            )}

            {/* Modal Detail Penghuni */}
            <ModalDataPenghuni
              open={openModal}
              onClose={handleCloseModal}
              data={selectedResident}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>Pesanan</Typography>
          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'grey.500', fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.875rem' }}>
              {fDate(booking.check_in)} - {fDate(booking.check_out)}
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 'medium' }}>{booking.property_room.name}</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'grey.600', mb: 1 }}>
            {booking.number_of_guests} Orang
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
            facilities={booking.property.facilities || []}
          />

          <Link
            to={`/property/${booking.property.slug}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <Stack direction="row" spacing={2}>
              {booking.property.files.slice(0, 3).map((file, index) => (
                <img
                  key={index}
                  src={file.file_url}
                  alt={`preview-${index}`}
                  width={80}
                  height={80}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                />
              ))}
            </Stack>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ color: 'black' }}>
                {booking.property.name}
              </Typography>
              <ChevronRightIcon sx={{ color: 'grey.400', fontSize: 20 }} />
            </Box>
          </Link>
          <Typography>{booking.property.address}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Rp{booking.total_price.toLocaleString()} /bulan
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
