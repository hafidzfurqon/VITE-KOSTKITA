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
import { useEffect, useMemo, useRef, useState } from 'react';
import { MenuItem } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { Link } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';
import { InputAdornment } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useGetState, useGetCity } from 'src/hooks/property';
import { useDropzone } from 'react-dropzone';
import { useMutationCreateApartement } from 'src/hooks/apartement';
import { useFetchFacilities } from 'src/hooks/facilities';
import Loading from 'src/components/loading/loading';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
import { useFetchAllPropertyType } from 'src/hooks/property_type';
import { useGetSector } from 'src/hooks/apartement/sector/useFetchAllSector';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllStateOwner } from 'src/hooks/owner/useFetchAllStateOwner';
import { useGetCityOwner } from 'src/hooks/owner/useGetCityOwner';
import { useFetchFacilityPropertyOwner } from 'src/hooks/owner_property/fasilitas';
import { useFetchAllPropertyTypeOwner } from 'src/hooks/owner/useFetchAllTypePropertyOwner';
import { useGetSectorOwner } from 'src/hooks/owner/useGetSectorOwner';
import { useMutationCreatePropertyOwner } from 'src/hooks/owner/property/useMutationCreateProperty';
import { VITE_TINY_KEY } from 'src/config';
import { Editor } from '@tinymce/tinymce-react';
import { InputLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import { Input } from '@mui/material';
import { Card } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { Iconify } from 'src/components/iconify';

export const CreateApartement = () => {
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin');
  const {
    data: facilities = [],
    isLoading,
    isFetching,
  } = isAdmin ? useFetchFacilities() : useFetchFacilityPropertyOwner();
  const {
    data: property_type = [],
    isLoading: loadingPropertyType,
    isFetching: FetchingPropertyType,
  } = isAdmin ? useFetchAllPropertyType() : useFetchAllPropertyTypeOwner();
  console.log(property_type);
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
  const inputRef = useRef();
  const editorRef = useRef(null);
  const editorContentRef = useRef('');

  const handleEditorChange = (content) => {
    editorContentRef.current = content;
  };

  const handleCheckboxChange = (facilityId) => {
    const currentFacilities = watch('facilities') || []; // Ambil value saat ini
    const updatedFacilities = currentFacilities.includes(facilityId)
      ? currentFacilities.filter((id) => id !== facilityId)
      : [...currentFacilities, facilityId];

    setValue('facilities', updatedFacilities); // Update nilai dengan array baru
  };

  // const handleEditorChange = (content, fieldName) => {
  //   setValue(fieldName, content, { shouldValidate: true }); // Tambahkan shouldValidate
  // };

  const handleToggle = (event) => {
    const status = event.target.checked ? 'available' : 'unavailable';
    setIsActive(event.target.checked);
    setValue('status', status); // Simpan status ke react-hook-form
  };

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const { data: states = [], isLoading: isLoadingStates } = isAdmin
    ? useGetState()
    : useFetchAllStateOwner();
  const { data: cities = [], isLoading: loadingCities } = isAdmin
    ? useGetCity(selectedState)
    : useGetCityOwner(selectedState);
  const { data: sector = [], isLoading: LoadingSector } = isAdmin
    ? useGetSector(selectedCity)
    : useGetSectorOwner(selectedCity);

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

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filesWithPreview = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    const newImages = [...selectedImages, ...filesWithPreview].slice(0, 10);
    setSelectedImages(newImages);
    setValue('files', newImages); // jika pakai react-hook-form
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

  const { mutate, isPending } = isAdmin
    ? useMutationCreateApartement({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
          routers.push('/property');
          enqueueSnackbar('Property berhasil dibuat', { variant: 'success' });
        },
        onError: () => {
          enqueueSnackbar('Property gagal dibuat', { variant: 'error' });
        },
      })
    : useMutationCreatePropertyOwner({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['fetch.property.owner'] });
          routers.push('/property');
          enqueueSnackbar('Property berhasil dibuat', { variant: 'success' });
        },
        onError: () => {
          enqueueSnackbar('Property gagal dibuat', { variant: 'error' });
        },
      });
  const Submitted = (data) => {
    const formData = new FormData();
    formData.append('description', editorContentRef.current);
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

    formData.append('price', cleanPrice(data.price)); // Tambahkan hanya satu price

    // mutate(formData);
    console.log(data);
  };

  const selectedType = watch('property_type_id');
  // console.log(selectedType);
  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };
  if (isLoading || isFetching || loadingPropertyType || FetchingPropertyType) {
    return <Loading />;
  }
  return (
    <Box sx={{ px: '2rem' }}>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Tambah Property
      </Typography>
      <Box component="form" onSubmit={handleSubmit(Submitted)}>
        <Card>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Informasi Property
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  {...register('name', { required: 'Nama Wajib Diisi' })}
                  margin="dense"
                  id="name"
                  label="Nama Property"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  select
                  {...register('property_type_id', { required: true })}
                  label="Tipe Properti"
                  fullWidth
                  required
                >
                  {property_type.map((property, idx) => {
                    return (
                      <MenuItem key={idx} value={property.id}>
                        {property.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Stack>
              {selectedType === 3 && (
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      {...register('land_area', { required: 'Luas tanah Wajib Diisi' })}
                      margin="dense"
                      id="land_area"
                      label="Luas tanah" // harus ada 3 min
                      type="text"
                      inputMode="numeric"
                      fullWidth
                      variant="outlined"
                      error={!!errors.land_area}
                      helperText={errors.land_area?.message}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                      }}
                    />

                    <TextField
                      {...register('total_floors', { required: 'Total Lantai Wajib Diisi' })}
                      margin="dense"
                      id="total_floors"
                      label="Total Lantai"
                      type="text"
                      inputMode="numeric"
                      fullWidth
                      variant="outlined"
                      error={!!errors.total_floors}
                      helperText={errors.total_floors?.message}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Lt</InputAdornment>,
                      }}
                    />
                  </Stack>
                </>
              )}
              <Typography>Status : </Typography>
              <FormControlLabel
                control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
                label={isActive ? 'Available' : 'Non-Available'}
              />
            </Stack>
          </Container>
        </Card>
        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Alamat Property
              </Typography>
              <TextField
                {...register('link_googlemaps', { required: 'Link gmaps wajib diisi' })}
                margin="dense"
                id="link_googlemaps"
                label="Link Gmaps"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                error={!!errors.link_googlemaps}
                helperText={errors.link_googlemaps?.message}
              />
              <TextField
                {...register('address')}
                margin="dense"
                label="Alamat"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
              {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
              <Autocomplete
                options={states || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.state_code === value.state_code}
                loading={isLoadingStates}
                onChange={(_, value) => {
                  setSelectedState(value ? value.state_code : null);
                  setValue('state_id', value ? value.state_code : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Provinsi" fullWidth variant="outlined" />
                )}
              />
              {/* Pilih Kota / Kabupaten */}
              <Autocomplete
                options={cities || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.city_code === value.city_code}
                loading={loadingCities}
                disabled={!selectedState} // Hanya aktif jika provinsi sudah dipilih
                onChange={(_, value) => {
                  setSelectedCity(value ? value.city_code : null);
                  setValue('city_id', value ? value.city_code : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Kab / Kota" fullWidth variant="outlined" />
                )}
              />
              <Autocomplete
                options={sector || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.sector_code === value.sector_code}
                loading={LoadingSector}
                disabled={!selectedCity} // Hanya aktif jika provinsi sudah dipilih
                onChange={(_, value) => setValue('sector_id', value ? value.sector_code : '')}
                // onChange={(_, value) => setValue("sector_id", 3201)}
                renderInput={(params) => (
                  <TextField {...params} label="Kecamatan" fullWidth variant="outlined" />
                )}
              />
              <Typography sx={{ mb: 2 }}>Property Dekat Dengan? : </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="near_campus"
                  control={control}
                  rules={{ required: 'Mohon isi nama kampus' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Nama Kampus (Optional)"
                      placeholder="Contoh: IPB Dramaga"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ mt: 1 }}
                    />
                  )}
                />
                <Controller
                  name="near_hospital"
                  control={control}
                  rules={{ required: 'Mohon isi nama rumah sakit' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Nama Rumah Sakit (Optional)"
                      placeholder="Contoh: RSUD Cibinong"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ mt: 1 }}
                    />
                  )}
                />
              </Stack>
            </Stack>
          </Container>
        </Card>

        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Detail Property
              </Typography>
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
              <FormLabel>Deskripsi :</FormLabel>
              <Editor
                apiKey={VITE_TINY_KEY}
                initialValue={editorContentRef.current} // Ambil dari useRef, bukan watch()
                onInit={(evt, editor) => (editorRef.current = editor)}
                onEditorChange={handleEditorChange} // Hanya simpan ke useRef
                init={{
                  height: 250,
                  menubar: false,
                  plugins: ['lists', 'advlist', 'link', 'table', 'paste'],
                  toolbar:
                    'insertfile undo redo  | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                }}
              />
            </Stack>
          </Container>
        </Card>
        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Harga
              </Typography>
              <InputLabel htmlFor="harga-per-hari">Harga Per Hari*</InputLabel>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-coret-per-hari">
                Harga Coret Per Hari (Optional)
              </InputLabel>
              <Controller
                name="price_coret_per_hari"
                control={control}
                defaultValue=""
                // rules={{ required: 'Harga  wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-per-hari">Harga Per 1-2 Bulan*</InputLabel>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-coret-per-hari">
                Harga Coret Per 1-2 Bulan (Optional)
              </InputLabel>
              <Controller
                name="price_coret_per_hari"
                control={control}
                defaultValue=""
                // rules={{ required: 'Harga  wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-per-hari">Harga Per 3-5 Bulan*</InputLabel>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-coret-per-hari">
                Harga Coret Per 3-5 Bulan (Optional)
              </InputLabel>
              <Controller
                name="price_coret_per_hari"
                control={control}
                defaultValue=""
                // rules={{ required: 'Harga  wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-per-hari">Harga Per 6-11 Bulan*</InputLabel>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-coret-per-hari">
                Harga Coret Per 6-11 Bulan (Optional)
              </InputLabel>
              <Controller
                name="price_coret_per_hari"
                control={control}
                defaultValue=""
                // rules={{ required: 'Harga  wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />

              <InputLabel htmlFor="harga-per-hari">Harga Per 12 Bulan atau lebih*</InputLabel>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
              <InputLabel htmlFor="harga-coret-per-hari">
                Harga Coret Per 12 Bulan atau lebih (Optional)
              </InputLabel>
              <Controller
                name="price_coret_per_hari"
                control={control}
                defaultValue=""
                // rules={{ required: 'Harga  wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    fullWidth
                    required
                    prefix="'"
                    suffix="'"
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  />
                )}
              />
            </Stack>
          </Container>
        </Card>
        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Fasilitas
              </Typography>
              <Typography sx={{ mb: 2 }}>Fasilitas Bersama : </Typography>
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
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'end', gap: 2, pb: 3 }}>
          <Link to={router.property.list}>
            <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
              Kembali
            </Button>
          </Link>
          <Button type="submit" disabled={isPending} variant="contained" sx={{ mt: 3, mb: 5 }}>
            Tambah
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
