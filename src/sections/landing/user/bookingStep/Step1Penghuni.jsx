import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Container,
  MenuItem,
  Box,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function Step1Penghuni({ onNext, user, savedata }) {
  const [occupant, setOccupant] = useState(savedata?.occupant || 'user');
  const [includeUser, setIncludeUser] = useState(savedata?.includeUser || false);
  const { enqueueSnackbar } = useSnackbar();

  const defaultOccupant = {
    fullname: '',
    phone_number: '',
    email: '',
    nomor_ktp: '',
    nik: '',
    gender: '',
    date_of_birth: '',
  };

  const [occupants, setOccupants] = useState(
    savedata?.booking_user_data?.occupants || [defaultOccupant]
  );

  useEffect(() => {
    if (occupant === 'user') {
      setOccupants([
        {
          fullname: user.name || '',
          phone_number: user.phone_number || '',
          email: user.email || '',
          nomor_ktp: user.nomor_ktp || '',
          nik: user.nik || '',
          gender: user.gender === 'Laki-laki' ? 'male' : 'female',
          date_of_birth: user.date_of_birth || '',
        },
      ]);
    }
  }, [occupant, user]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setOccupants((prev) => prev.map((occ, i) => (i === index ? { ...occ, [name]: value } : occ)));
  };

  const handleCheckboxChange = (e) => {
    setIncludeUser(e.target.checked);
  };

  const addOccupant = () => {
    setOccupants((prev) => [...prev, { ...defaultOccupant }]);
  };

  const removeOccupant = (index) => {
    setOccupants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!isFormValid) {
      enqueueSnackbar('Data belum lengkap, harap isi semua kolom.', { variant: 'error' });
      return;
    }

    let bookingUserData = [...occupants];

    if (includeUser) {
      const userData = {
        fullname: user.name || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
        nomor_ktp: user.nomor_ktp || '',
        nik: user.nik || '',
        gender: user.gender === 'Laki-laki' ? 'male' : 'female',
        date_of_birth: user.date_of_birth || '',
      };

      const isUserAlreadyIncluded = bookingUserData.some(
        (occ) => occ.fullname === user.name && occ.phone_number === user.phone_number
      );

      if (!isUserAlreadyIncluded) {
        bookingUserData = [userData, ...bookingUserData];
      }
    }

    const occupantData = {
      occupant,
      includeUser,
      booking_user_data: bookingUserData,
    };

    onNext(occupantData);
  };

  const isFormValid =
    occupant === 'user' ||
    occupants.every((occ) => Object.values(occ).every((value) => value?.trim() !== ''));

  return (
    <Container maxWidth="md">
      <Box textAlign="center" sx={{ display: 'flex' }} mb={2}>
        <Button
          onClick={() => setOccupant('user')}
          variant={occupant === 'user' ? 'contained' : 'outlined'}
          sx={{ mx: 1 }}
        >
          Saya sendiri
        </Button>
        <Button
          onClick={() => setOccupant('guest')}
          variant={occupant === 'guest' ? 'contained' : 'outlined'}
          sx={{ mx: 1 }}
        >
          Pesan untuk orang lain
        </Button>
      </Box>

      {occupant === 'guest' && (
        <>
          {occupants.map((data, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h6" mb={2}>
                {occupants.length > 1 ? `Data Penghuni ${index + 1}` : 'Data Penghuni'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nama Lengkap"
                    fullWidth
                    name="fullname"
                    value={data.fullname}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nomor Telepon"
                    fullWidth
                    name="phone_number"
                    value={data.phone_number}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={data.email}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nomor KTP"
                    fullWidth
                    name="nomor_ktp"
                    value={data.nomor_ktp}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="NIK"
                    fullWidth
                    name="nik"
                    value={data.nik}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Jenis Kelamin"
                    fullWidth
                    name="gender"
                    value={data.gender}
                    onChange={(e) => handleChange(index, e)}
                  >
                    <MenuItem value="male">Laki-laki</MenuItem>
                    <MenuItem value="female">Perempuan</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tanggal Lahir"
                    type="date"
                    fullWidth
                    name="date_of_birth"
                    InputLabelProps={{ shrink: true }}
                    value={data.date_of_birth}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                {occupants.length > 1 && (
                  <Grid item xs={12} textAlign="right">
                    <IconButton onClick={() => removeOccupant(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}
          <Button onClick={addOccupant} variant="outlined" fullWidth sx={{ my: 2 }}>
            + Tambah Penghuni
          </Button>

          <FormControlLabel
            control={<Checkbox checked={includeUser} onChange={handleCheckboxChange} />}
            label="Saya Ikut Booking"
            sx={{ display: 'block', mt: 1 }}
          />
        </>
      )}

      <Button onClick={handleNext} variant="contained" fullWidth disabled={!isFormValid}>
        Next
      </Button>
    </Container>
  );
}
