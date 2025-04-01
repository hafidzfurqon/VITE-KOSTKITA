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
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useMemo, useRef, useState } from 'react';
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

export const CreateApartement = () => {
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin');
  const {
    data: facilities,
    isLoading,
    isFetching,
  } = isAdmin ? useFetchFacilities() : useFetchFacilityPropertyOwner();
  const {
    data: property_type,
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
  const [showCampus, setShowCampus] = useState(false);
  const [showHospital, setShowHospital] = useState(false);
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

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setSelectedImages(acceptedFiles);
      setValue('files', acceptedFiles);
    },
  });

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

    mutate(formData);
    // console.log(data);
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
    <Container>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Tambah Property
      </Typography>
      <Box component="form" onSubmit={handleSubmit(Submitted)}>
        <Stack spacing={3}>
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
          <FormLabel>Upload Images (Max 10)</FormLabel>
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
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                width={80}
                height={80}
                style={{ borderRadius: 8, objectFit: 'cover' }}
              />
            ))}
          </Stack>
          <FormLabel>Deskripsi :</FormLabel>
          <Editor
            apiKey={VITE_TINY_KEY}
            initialValue={editorContentRef.current} // Ambil dari useRef, bukan watch()
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={handleEditorChange} // Hanya simpan ke useRef
            init={{
              height: 250,
              menubar: false,
              plugins: ['lists', 'advlist', 'link', 'image', 'table', 'paste'],
              toolbar:
                'insertfile undo redo | image | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            }}
          />
          <TextField
            select
            {...register('payment_type', { required: true })}
            label="Tipe Pembayaran"
            fullWidth
            required
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>
          <Typography sx={{ mb: 2 }}>Property Dekat Dengan : </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={showCampus}
                onChange={(e) => {
                  setShowCampus(e.target.checked);
                  if (!e.target.checked) setValue('near_campus', '');
                }}
              />
            }
            label="Dekat Dengan Kampus?"
          />

          {showCampus && (
            <Controller
              name="near_campus"
              control={control}
              rules={{ required: 'Mohon isi nama kampus' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nama Kampus"
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
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={showHospital}
                onChange={(e) => {
                  setShowHospital(e.target.checked);
                  if (!e.target.checked) setValue('near_hospital', '');
                }}
              />
            }
            label="Dekat Dengan Rumah Sakit?"
          />

          {showHospital && (
            <Controller
              name="near_hospital"
              control={control}
              rules={{ required: 'Mohon isi nama rumah sakit' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nama Rumah Sakit"
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
          )}

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
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            disabled={isPending}
            variant="contained"
            sx={{ mt: 3, mb: 5, mr: 3 }}
          >
            Submit
          </Button>
          <Link to={router.property.list}>
            <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
              Kembali
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
