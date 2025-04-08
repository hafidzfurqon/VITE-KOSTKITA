import {
  Button,
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  FormLabel,
  Autocomplete,
  Grid,
  IconButton,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
// import "react-quill/dist/quill.snow.css";
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
import { useFetchFacilities } from 'src/hooks/facilities';
import Loading from 'src/components/loading/loading';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
// import { useFetchAllPropertyType } from 'src/hooks/property_type';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useMutationCreatePropertyRoom } from 'src/hooks/property_room';
import { useFetchAllRoomFacilities } from 'src/hooks/room-facilities';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllPropertyRoomType } from 'src/hooks/property-room-type';
import { Card } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { Iconify } from 'src/components/iconify';
// import { useFetchAllPropertyTypeOwner } from 'src/hooks/owner/useFetchAllTypePropertyOwner';

export const PropertyRoomCreate = () => {
  const { id } = useParams();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const inputRef = useRef();
  // Pastikan roles adalah array sebelum memanggil .some()
  const isOwnerProperty =
    Array.isArray(user?.roles) && user.roles.some((role) => role.name === 'owner_property');

  const {
    data: facilities = [],
    isLoading,
    isFetching,
  } = useFetchAllRoomFacilities(isOwnerProperty);
  const {
    data: property_room_type,
    isLoading: loadingPropertyType,
    isFetching: FetchingPropertyType,
  } = useFetchAllPropertyRoomType(isOwnerProperty);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      facilities: [],
    },
  });

  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);

  const handleCheckboxChange = (facilityId) => {
    const currentFacilities = watch('facilities') || []; // Ambil value saat ini
    const updatedFacilities = currentFacilities.includes(facilityId)
      ? currentFacilities.filter((id) => id !== facilityId)
      : [...currentFacilities, facilityId];

    setValue('facilities', updatedFacilities); // Update nilai dengan array baru
  };

  const handleDeleteImage = (index) => {
    const fileToDelete = selectedImages[index];

    // Revoke preview URL hanya untuk file yang dihapus
    if (fileToDelete?.preview) {
      URL.revokeObjectURL(fileToDelete.preview);
    }

    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setValue('files', newImages);
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      const mappedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      const newImages = [...selectedImages, ...mappedFiles].slice(0, 10);
      setSelectedImages(newImages);
      setValue('files', newImages);
    },
  });

  const { mutate, isPending } = useMutationCreatePropertyRoom(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.property-room', id] });
        routers.push(`/property/property-room/${id}`);
        enqueueSnackbar('Property Room berhasil dibuat', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Property Room gagal dibuat', { variant: 'error' });
      },
    },
    isOwnerProperty
  );
  const Submitted = (data) => {
    // console.log("Data sebelum dikirim:", data);

    const formData = new FormData();

    // Pastikan `property_id` ada
    if (id) {
      formData.append('property_id', id);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else if (key === 'price') {
        formData.append(key, cleanPrice(value));
      } else {
        formData.append(key, value);
      }
    });

    // console.log("FormData yang dikirim:", Object.fromEntries(formData.entries()));

    mutate(formData);
  };

  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };
  if (isLoading || isFetching || loadingPropertyType || FetchingPropertyType) {
    return <Loading />;
  }
  return (
    <Box sx={{ px: '2rem' }}>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Tambah Property Room
      </Typography>
      <CustomBreadcrumbs
        links={[
          { name: 'Property', href: '/property' },
          { name: 'Property Room', href: `/property/property-room/${id}` },
          { name: 'Create Property Room' },
        ]}
        sx={{ mb: { xs: 2, md: 3 } }}
        action={null}
        heading=""
        moreLink={[]}
        activeLast={true}
      />
      <Box component="form" onSubmit={handleSubmit(Submitted)}>
        <Card>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Informasi Ruangan
              </Typography>
              {/* <Stack spacing={3}> */}
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
              {/* </Stack> */}
            </Stack>
          </Container>
        </Card>
        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Detail Ruangan
              </Typography>
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
                InputProps={{
                  endAdornment: <InputAdornment position="end">Orang</InputAdornment>,
                }}
              />
              {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
              <TextField
                select
                {...register('room_gender_type', { required: true })}
                label="Khusus Untuk"
                fullWidth
                required
              >
                <MenuItem value="male">Pria</MenuItem>
                <MenuItem value="female">Wanita</MenuItem>
                <MenuItem value="both">Umum</MenuItem>
              </TextField>

              <Box
                {...getRootProps()}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(5, 1fr)',
                }}
                gap={2}
              >
                <input {...getInputProps()} ref={inputRef} />

                {[...Array(10)].map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => !selectedImages[index] && inputRef.current.click()}
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      width: '100%',
                      paddingTop: '100%',
                      position: 'relative',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#fafafa',
                      '&:hover': { backgroundColor: '#f0f0f0' },
                    }}
                  >
                    {selectedImages[index] ? (
                      <>
                        <Box
                          component="img"
                          src={selectedImages[index].preview}
                          alt={`Foto ${index + 1}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 2,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,1)',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(index);
                          }}
                        >
                          <Box sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </Box>
                        </IconButton>
                      </>
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#999',
                          textAlign: 'center',
                        }}
                      >
                        <ImageIcon fontSize="large" />
                        <Typography variant="body2">
                          {index === 0 ? 'Foto Utama' : `Foto ${index + 1}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Stack>
          </Container>
        </Card>

        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Fasilitas
              </Typography>
              <Typography sx={{ mb: 2 }}>Fasilitas Property : </Typography>
              <Grid container spacing="1" columns={{ xs: 4, sm: 8, md: 12 }} sx={{ mb: 3 }}>
                {facilities?.map((facility, index) => (
                  <Grid item xs={2} sm={4} md={5} key={index}>
                    <FormControlLabel
                      key={facility.id}
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
          </Container>
        </Card>
        {/* </Stack> */}
        <Button type="submit" disabled={isPending} variant="contained" sx={{ mt: 3, mb: 5, mr: 3 }}>
          Submit
        </Button>
        <Link to={router.property.list}>
          <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
            Kembali
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
