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
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { format, parseISO } from 'date-fns';
import { useFetchVisitByCode } from 'src/hooks/users/useFetchVisitByCode';
import { useAppContext } from 'src/context/user-context';

export default function VisitDetail() {
  const { visitCode } = useParams();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin');
  const { data: visit, isLoading, isFetching, error } = useFetchVisitByCode(visitCode, isAdmin);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Terkonfirmasi';
      case 'canceled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const visitDate = parseISO(visit.visit_date);
  const formattedVisitDate = format(visitDate, 'dd MMMM yyyy, HH:mm');

  return (
    <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg" sx={{ p: 0 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Detail Visit
        </Typography>
        <CustomBreadcrumbs
          links={[
            { name: 'Riwayat Visit', href: `/history/visit` },
            { name: 'Visit Detail', href: '' },
          ]}
          sx={{ mb: 3 }}
        />

        <Box sx={{ backgroundColor: 'white', p: 3, mb: 2, borderRadius: 1 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Jadwal Visit</Typography>
            <Chip
              label={getStatusText(visit.status)}
              color={getStatusColor(visit.status)}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon sx={{ mr: 1, color: 'grey.500', fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.875rem' }}>{formattedVisitDate}</Typography>
          </Box>

          <Typography sx={{ fontWeight: 'medium', mb: 0.5 }}>
            Kode Visit: {visit.visit_code}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
            Data Pengunjung
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={visit.user?.photo_profile_url || '/default-avatar.png'}
              alt={visit.user?.name}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography sx={{ fontWeight: 'medium' }}>Nama: {visit.user?.name}</Typography>
              <Typography sx={{ color: 'grey.800' }}>
                Nomor Telepon: {visit.user?.phone_number}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>Properti</Typography>

          <Typography sx={{ fontWeight: 'medium' }}>{visit.property?.name}</Typography>

          <Link
            to={`/property/${visit.property?.slug}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <Stack direction="row" spacing={2}>
              {(visit.property?.files || []).slice(0, 3).map((file, index) => (
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
                {visit.property?.name}
              </Typography>
              <ChevronRightIcon sx={{ color: 'grey.400', fontSize: 20 }} />
            </Box>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
            <HomeIcon sx={{ mr: 1, color: 'grey.500', fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.875rem' }}>
              {visit.property?.address || 'Alamat tidak tersedia'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Rp{visit.property?.start_price?.toLocaleString() || '0'} /bulan
          </Typography>

          {visit.status === 'pending' && !isAdmin && (
            <Button variant="outlined" color="error" sx={{ mt: 2 }}>
              Batalkan Visit
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
