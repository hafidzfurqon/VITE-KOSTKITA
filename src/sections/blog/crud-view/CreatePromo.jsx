import { Button, Box, Container, Stack, Typography, TextField, FormLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Grid } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';

export const CreatePromo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [description, setDescription] = useState('');
  const [howToUse, sethowToUse] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleToggle = (event) => {
    const status = event.target.checked ? 'active' : 'non-active';
    setIsActive(event.target.checked);
    setValue('status', status); // Simpan status ke react-hook-form
  };
  // Menyimpan value ke state & React Hook Form
  const handleQuillChange = (value) => {
    setDescription(value);
    setValue('description', value); // Update value untuk react-hook-form
  };

  const handleQuillHowToUse = (value) => {
    sethowToUse(value);
    setValue('how_to_use', value); // Update value untuk react-hook-form
  };

  const Submitted = (data) => {
    console.log(data); // Akan mencetak data termasuk "description"
  };

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Tambah Promo
      </Typography>
      <Box component="form" onSubmit={handleSubmit(Submitted)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('name', { required: 'Nama Wajib Diisi' })}
              margin="dense"
              id="name"
              label="Nama Promo"
              type="text"
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('code', { required: 'Kode Promo Wajib Diisi' })}
              margin="dense"
              id="code"
              label="Kode Promo"
              type="text"
              fullWidth
              variant="outlined"
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          </Stack>
          <TextField
            select
            {...register('apply_to')}
            defaultValue=""
            label="Promo untuk"
            fullWidth
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="Coliving">Coliving</MenuItem>
            <MenuItem value="Kostan">Kostan</MenuItem>
            <MenuItem value="Kontrakan">Kontrakan</MenuItem>
          </TextField>
          <Typography>Status : </Typography>
          <FormControlLabel
            control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
            label={isActive ? 'Active' : 'Non-Active'}
          />
          <TextField
            select
            {...register('discount_type')}
            defaultValue=""
            label="Tipe Promo"
            fullWidth
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            <MenuItem value="percentage">Presentase</MenuItem>
            <MenuItem value="fixed">Harga</MenuItem>
          </TextField>
          <TextField
            {...register('discount_value', { required: 'Kode Promo Wajib Diisi' })}
            margin="dense"
            id="code"
            label="Besar Promo"
            type="text"
            fullWidth
            variant="outlined"
            error={!!errors.code}
            helperText={errors.code?.message}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('start_date', { required: 'Mulai Promo Wajib Diisi' })}
              margin="dense"
              id="name"
              label="Mulai Promo"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('end_date', { required: 'Kode Promo Wajib Diisi' })}
              margin="dense"
              id="code"
              label="Akhir Promo"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          </Stack>
          <FormLabel>
            Image
            <TextField
              {...register('image')}
              margin="dense"
              id="image"
              type="file"
              fullWidth
              variant="outlined"
            />
          </FormLabel>
          <Typography>Deskripsi : </Typography>
          <ReactQuill theme="snow" value={description} onChange={handleQuillChange} />
          <Typography>Cara Pakai : </Typography>
          <ReactQuill theme="snow" value={howToUse} onChange={handleQuillHowToUse} />

          <TextField
            {...register('disclaimer')}
            margin="dense"
            label="Disclaimer"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        </Stack>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 5 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
