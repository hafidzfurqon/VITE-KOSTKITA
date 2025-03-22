import {
  Button,
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  FormLabel,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useMutationCreatePromo } from 'src/hooks/promo';
import { Editor } from '@tinymce/tinymce-react';
import { VITE_TINY_KEY } from 'src/config';

export const CreatePromo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [promoValue, setPromoValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const handleEditorChange = (content, fieldName) => {
    setValue(fieldName, content, { shouldValidate: true }); // Tambahkan shouldValidate
  };
  const PromoType = watch('promo_type', 'percentage');
  console.log(PromoType);
  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
  };

  const handleToggle = (event) => {
    const status = event.target.checked ? 'active' : 'non-active';
    setIsActive(event.target.checked);
    setValue('status', status);
  };

  const handleDiscountChange = (event) => {
    let value = event.target.value;
    let formattedValue = '';

    if (PromoType === 'fixed_amount') {
      formattedValue = `${cleanPrice(value).toLocaleString('id-ID')}`;
    } else if (PromoType === 'percentage') {
      formattedValue = `${cleanPrice(value)}%`;
    }

    setPromoValue(formattedValue);
    setValue('promo_value', formattedValue);
  };
  useEffect(() => {
    setPromoValue('');
    setValue('promo_value', '');
  }, [PromoType]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setSelectedImages(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setValue('files', acceptedFiles);
    },
  });

  const { mutate, isPending } = useMutationCreatePromo({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.facilities'] });
      routers.push('/management-promo');
      enqueueSnackbar('Promo berhasil dibuat', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Promo gagal dibuat', { variant: 'error' });
    },
  });
  const Submitted = (data) => {
    const { image: gambar, promo_value, ...rest } = data;
    const formData = new FormData();

    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('promo_value', cleanPrice(promo_value));
    selectedImages.forEach((file) => {
      formData.append('image', file);
    });

    mutate(formData);
  };
  const ApiKey = VITE_TINY_KEY;

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
              label="Nama Promo"
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('code', { required: 'Kode Promo Wajib Diisi' })}
              label="Kode Promo"
              fullWidth
              variant="outlined"
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          </Stack>
          <TextField select {...register('apply_to')} defaultValue="" label="Promo untuk" fullWidth>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="other">Lainnya</MenuItem>
            <MenuItem value="specific_property">Spesifik Property</MenuItem>
            <MenuItem value="specific_apartment">Spesifik Apartement</MenuItem>
          </TextField>
          <FormControlLabel
            control={<Switch checked={isActive} onChange={handleToggle} />}
            label={isActive ? 'Active' : 'Non-Active'}
          />
          <TextField
            select
            {...register('promo_type')}
            defaultValue=""
            label="Tipe Promo"
            fullWidth
          >
            <MenuItem value="percentage">Presentase</MenuItem>
            <MenuItem value="fixed_amount">Harga</MenuItem>
          </TextField>
          <TextField
            select
            {...register('applicable_to_owner_property')}
            defaultValue=""
            label="Apakah Owner Property Boleh Menggunakan Promo?"
            fullWidth
          >
            <MenuItem value="0">Tidak</MenuItem>
            <MenuItem value="1">Ya, Bisa</MenuItem>
          </TextField>
          <TextField
            label="Besar Promos"
            fullWidth
            variant="outlined"
            placeholder={
              PromoType === 'fixed_amount'
                ? 'Masukkan nominal (ex: 100000)'
                : 'Masukkan persentase (ex: 10)'
            }
            value={promoValue}
            onChange={handleDiscountChange}
            error={!!errors.promo_value}
            helperText={errors.promo_value?.message}
            InputProps={{
              startAdornment:
                PromoType === 'fixed_amount' ? (
                  <InputAdornment position="start">Rp</InputAdornment>
                ) : null,
            }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('start_date', { required: 'Mulai Promo Wajib Diisi' })}
              label="Mulai Promo"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
            <TextField
              {...register('end_date', { required: 'Akhir Promo Wajib Diisi' })}
              label="Akhir Promo"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
          </Stack>
          <FormLabel>Upload Images</FormLabel>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
          >
            <input {...getInputProps()} />
            <Typography>Drag & Drop atau Klik untuk Upload</Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {selectedImages.map((file) => (
              <Box
                key={file.name}
                sx={{ width: 100, height: 100, borderRadius: 2, overflow: 'hidden' }}
              >
                <img
                  src={file.preview}
                  alt={file.name}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Stack>
          <FormLabel>Deskripsi :</FormLabel>
          <Editor
            apiKey={ApiKey}
            value={watch('description')}
            onEditorChange={(content) => handleEditorChange(content, 'description')}
            init={{
              height: 250,
              menubar: false,
              plugins: ['lists', 'advlist', 'link', 'image', 'table', 'paste'],
              toolbar:
                'undo redo | bold italic | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
            }}
          />

          <FormLabel>Cara Pakai :</FormLabel>
          <Editor
            apiKey={ApiKey}
            onEditorChange={(content) => handleEditorChange(content, 'how_to_use')}
            value={watch('how_to_use')}
            init={{
              height: 250,
              menubar: false,
              plugins: ['lists', 'advlist', 'link', 'image', 'table', 'paste'],
              toolbar:
                'undo redo | bold italic | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
            }}
          />
          <TextField
            {...register('disclaimer')}
            label="Disclaimer"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        </Stack>
        <Button type="submit" disabled={isPending} variant="contained" sx={{ mt: 3, mb: 5, mr: 3 }}>
          Submit
        </Button>
        <Link to="/management-promo">
          <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
            Kembali
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
