import {
  Button,
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  FormLabel,
  Autocomplete,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { Link, useParams } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';
import { InputAdornment } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useDropzone } from 'react-dropzone';
import Loading from 'src/components/loading/loading';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useFetchAllPropertyRoomDetail,
  useMutationUpdatePropertyRoom,
} from 'src/hooks/property_room';
import { useFetchAllRoomFacilities } from 'src/hooks/room-facilities';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllPropertyRoomType } from 'src/hooks/property-room-type';
import { Grid } from '@mui/material';

export const UpdatePropertyRoomCreate = () => {
  const { id } = useParams();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const isOwnerProperty =
    Array.isArray(user?.roles) && user.roles.some((role) => role.name === 'owner_property');
  const {
    data: facilities = [],
    isLoading,
    isFetching,
  } = useFetchAllRoomFacilities(isOwnerProperty);
  const {
    data = [],
    isLoading: isloadingRoomDetail,
    isFetching: isfetchingRoomDetail,
  } = useFetchAllPropertyRoomDetail(id, isOwnerProperty);

  const {
    data: property_room_type,
    isLoading: loadingPropertyType,
    isFetching: FetchingPropertyType,
  } = useFetchAllPropertyRoomType(isOwnerProperty);

  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      capacity: '',
      price: '',
      status: '',
      stock: '',
      area_size: '',
      property_type_id: '',
      // state_id: '',
      // city_id: '',
      // sector_id: '',
      facilities: [],
    },
  });
  useEffect(() => {
    if (data) {
      setValue('name', data.name || '');
      setValue('capacity', data.capacity || '');
      setValue('price', data.price || '');
      setValue('status', data.status || 'unavailable'); // Default status
      setIsActive(data.status === 'available');
      setValue('stock', data.stock || '');
      setValue('area_size', data.area_size || '');
      setValue('property_type_id', data.room_type?.id || '');
      setValue('room_gender_type', data.room_gender_type || ''); // Default untuk gender type
      setValue('facilities', data.room_facilities?.map((f) => f.id) || []);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (data.room_files?.length) {
      const formattedImages = data.room_files.map((file) => ({
        id: file.id,
        url: file.file_url,
        name: file.name,
      }));
      setSelectedImages(formattedImages);
      setValue(
        'existing_files',
        formattedImages.map((file) => file.id)
      );
    }
  }, [data, setValue]);

  const handleRemoveImage = (index, fileId) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (fileId) {
      setValue('existing_files', (prev) => prev.filter((id) => id !== fileId));
    }
  };

  const handleCheckboxChange = (facilityId) => {
    const currentFacilities = watch('facilities') || []; // Ambil value saat ini
    const updatedFacilities = currentFacilities.includes(facilityId)
      ? currentFacilities.filter((id) => id !== facilityId)
      : [...currentFacilities, facilityId];

    setValue('facilities', updatedFacilities); // Update nilai dengan array baru
  };

  // ✅ Handle file selection
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    // Konversi FileList ke array
    const imageFiles = Array.from(files);
    setSelectedImages(imageFiles);

    // Simpan ke react-hook-form
    setValue('files', imageFiles);
  };
  const handleToggle = (event) => {
    const status = event.target.checked ? 'available' : 'unavailable';
    setIsActive(event.target.checked);
    setValue('status', status); // Simpan status ke react-hook-form
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setSelectedImages(acceptedFiles);
      setValue('files', acceptedFiles);
    },
  });
  const dataProperty = data?.property?.id;
  const { mutate, isPending } = useMutationUpdatePropertyRoom({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.property-room', id] });
      routers.push(`/property/property-room/${dataProperty}`);
      enqueueSnackbar('Property Room berhasil di update', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Property Room gagal di update', { variant: 'error' });
    },
  }, isOwnerProperty);

  const Submitted = (data) => {
    console.log(data);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'price') {
        // Hindari duplikasi harga
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      }
    });

    formData.append('price', data.price); // Tambahkan hanya satu price
    formData.append('property_id', dataProperty); // Tambahkan hanya satu price
    formData.append('property_room_id', id); // Tambahkan hanya satu price
    formData.append('_method', 'PUT');
    // formData.append('_method', 'PUT');
    mutate(formData);
  };

  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };
  if (
    isLoading ||
    isFetching ||
    isloadingRoomDetail ||
    isfetchingRoomDetail ||
    loadingPropertyType ||
    FetchingPropertyType
  ) {
    return <Loading />;
  }
  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Update Property Room
      </Typography>
      <CustomBreadcrumbs
        links={[
          { name: 'Property', href: '/property' },
          { name: 'Property Room', href: `/property/property-room/${id}` },
          { name: 'Update Property Room' },
        ]}
        sx={{ mb: { xs: 5, md: 6 } }}
        action={null}
        heading=""
        moreLink={[]}
        activeLast={true}
      />
      <Box component="form" onSubmit={handleSubmit(Submitted)} noValidate>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('name', { required: 'Nama Wajib Diisi' })}
              margin="dense"
              id="name"
              label="Nama Property Room"
              type="text"
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Controller
              name="price"
              control={control}
              defaultValue=""
              rules={{ required: 'Harga wajib diisi' }}
              render={({ field, fieldState }) => (
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  label="Harga"
                  fullWidth
                  required
                  prefix="Rp "
                  thousandSeparator="."
                  decimalSeparator=","
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>
          <TextField
            select
            {...register('room_type_id', { required: true })}
            label="Tipe Properti Ruangan"
            fullWidth
            required
            defaultValue={data.room_type.id || ''}
          >
            {property_room_type.map((property, idx) => {
              return (
                <MenuItem key={idx} value={property.id}>
                  {property.name}
                </MenuItem>
              );
            })}
          </TextField>
          <Typography>Status : </Typography>
          <FormControlLabel
            control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
            label={isActive ? 'Available' : 'Non-Available'}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('area_size', { required: 'Luas Kamar Wajib Diisi' })}
              margin="dense"
              id="area_size"
              label="Luas Kamar" // harus ada 3 min
              type="text"
              inputMode="numeric"
              fullWidth
              variant="outlined"
              error={!!errors.area_size}
              helperText={errors.area_size?.message}
              InputProps={{
                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
              }}
            />

            <TextField
              {...register('stock', { required: 'Stock Wajib Diisi' })}
              margin="dense"
              id="stock"
              label="Stock Kamar"
              type="text"
              inputMode="numeric"
              fullWidth
              variant="outlined"
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />
          </Stack>
          <TextField
            {...register('capacity')}
            margin="dense"
            label="Kapasitas Orang"
            multiline
            // rows={4}
            fullWidth
            variant="outlined"
          />
          {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
          <TextField
            select
            {...register('room_gender_type', { required: true })}
            label="Khusus Untuk"
            fullWidth
            required
            defaultValue={data.room_gender_type || ''}
          >
            <MenuItem value="male">Pria</MenuItem>
            <MenuItem value="female">Wanita</MenuItem>
            <MenuItem value="both">Umum</MenuItem>
          </TextField>
          <FormLabel>Upload Images (Max 5)</FormLabel>
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

          {/* ✅ Preview Gambar */}
          <Stack direction="row" spacing={2}>
            {selectedImages.map((file, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <img
                  src={file.url || URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  width={80}
                  height={80}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                />
                <Button
                  size="small"
                  onClick={() => handleRemoveImage(index, file.id)}
                  sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    minWidth: 34,
                    height: 34,
                    border: '1px solid black',
                  }}
                >
                  X
                </Button>
              </Box>
            ))}
          </Stack>
          <Typography sx={{ mb: 2 }}>Fasilitas Property : </Typography>
          <Grid container spacing="1" columns={{ xs: 4, sm: 8, md: 12 }} sx={{ mb: 3 }}>
            {facilities?.map((facility) => (
              <Grid item xs={2} sm={4} md={5} key={facility.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={watch('facilities')?.includes(facility.id)}
                      onChange={() => handleCheckboxChange(facility.id)}
                    />
                  }
                  label={facility.name}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Button type="submit" disabled={isPending} variant="contained" sx={{ mt: 3, mb: 5, mr: 3 }}>
          Submit
        </Button>
        <Link to={router.property.list}>
          <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
            Kembali
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
