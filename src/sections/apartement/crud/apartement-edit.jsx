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
import { useEffect, useState, useRef } from 'react';
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
import { useGetState, useGetCity } from 'src/hooks/property';
import { useDropzone } from 'react-dropzone';
import { useFetchDetailApartement, useMutationUpdateApartement } from 'src/hooks/apartement';
import { useFetchFacilities } from 'src/hooks/facilities';
import Loading from 'src/components/loading/loading';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
import { useFetchAllPropertyType } from 'src/hooks/property_type';
import { useGetSector } from 'src/hooks/apartement/sector/useFetchAllSector';
import { VITE_TINY_KEY } from 'src/config';
import { Editor } from '@tinymce/tinymce-react';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllStateOwner } from 'src/hooks/owner/useFetchAllStateOwner';
import { useGetCityOwner } from 'src/hooks/owner/useGetCityOwner';
import { useGetSectorOwner } from 'src/hooks/owner/useGetSectorOwner';
import { useFetchFacilityPropertyOwner } from 'src/hooks/owner_property/fasilitas';
import { useFetchAllPropertyTypeOwner } from 'src/hooks/owner/useFetchAllTypePropertyOwner';

export const EditApartement = () => {
  const { id } = useParams();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;

  // Pastikan roles adalah array sebelum memanggil .some()
  const isOwnerProperty =
    Array.isArray(user?.roles) && user.roles.some((role) => role.name === 'owner_property');
  const IsAdmin = Array.isArray(user?.roles) && user.roles.some((role) => role.name === 'admin');
  const {
    data,
    isLoading: loadingData,
    isFetching: FetchinData,
  } = useFetchDetailApartement(id, isOwnerProperty);
  const {
    data: facilities = [],
    isLoading,
    isFetching,
  } = isOwnerProperty ? useFetchFacilityPropertyOwner() : useFetchFacilities();
  const {
    data: property_type = [],
    isLoading: loadingPropertyType,
    isFetching: FetchingPropertyType,
  } = isOwnerProperty ? useFetchAllPropertyTypeOwner() : useFetchAllPropertyType();
  console.log(data);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      start_price: '',
      link_googlemaps: '',
      description: '',
      land_area: '',
      property_type_id: '',
      payment_type: '',
      state_id: '',
      city_id: '',
      sector_id: '',
      facilities: [],
    },
  });

  // useEffect untuk set defaultValues setelah data tersedia
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        price: String(data.start_price || ''),
        address: data.address || '',
        // description: data.description || '',
        facilities: data.facilities?.map((f) => f.id) || [],
        property_type_id: data?.type?.id || '',
        payment_type: data?.payment_type || '',
        state_id: data?.state?.state_code || '',
        city_id: data?.city?.city_code || '',
        sector_id: data?.sector?.sector_code || '',
        link_googlemaps: data?.link_googlemaps || '',
        ...(data?.type?.id === 3
          ? {
              land_area: data.land_area || '',
              total_floors: data.total_floors || '',
            }
          : {}),
      });

      // setDescription(data.description || '');
      setIsActive(data.status === 'available');

      // Set nilai dropdown sesuai data yang di-load
      setSelectedState(data?.state?.state_code || null);
      setSelectedCity(data?.city?.city_code || null);
    }

    if (data?.files) {
      setDefaultImages(data.files.map((file) => file.file_url));
    }
  }, [data, reset]);

  //   console.log(data?.state?.state_code)
  // const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);
  const [defaultImages, setDefaultImages] = useState([]); // Gambar dari API

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
  const editorRef = useRef(null);
  const editorContentRef = useRef('');
  useEffect(() => {
    if (data?.description) {
      editorContentRef.current = data.description;
      if (editorRef.current) {
        editorRef.current.setContent(data.description); // Update tanpa re-render
      }
    }
  }, [data]); // Akan berjalan setiap kali data berubah
  const handleEditorChange = (content) => {
    editorContentRef.current = content;
  };
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch data untuk State, City, dan Sector
  const { data: states = [], isLoading: isLoadingStates } = isOwnerProperty
    ? useFetchAllStateOwner()
    : useGetState();
  const { data: cities = [], isLoading: loadingCities } = IsAdmin
    ? useGetCity(selectedState)
    : useGetCityOwner(selectedState);
  const { data: sector = [], isLoading: LoadingSector } = IsAdmin
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

  const { mutate, isPending } = useMutationUpdateApartement(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
        routers.push('/property');
        enqueueSnackbar('Proeprty berhasil diupdate', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Proeprty gagal diupdate', { variant: 'error' });
      },
    },
    id,
    isOwnerProperty
  );
  const Submitted = (data) => {
    // console.log(data)
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
    formData.append('_method', 'PUT');
    mutate(formData);
  };

  const selectedType = watch('property_type_id');
  console.log(selectedType);
  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };
  if (
    isLoading ||
    isFetching ||
    loadingPropertyType ||
    FetchingPropertyType ||
    loadingData ||
    FetchinData
  ) {
    return <Loading />;
  }
  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Update Property {data.name}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(Submitted)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              {...register('name', { required: 'Nama Wajib Diisi' })}
              //   defaultValue={data.name}
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
            value={watch('property_type_id')} // Pastikan terhubung dengan form
            onChange={(e) => setValue('property_type_id', e.target.value)} // Pastikan perubahan tersimpan
          >
            {property_type.map((property, idx) => (
              <MenuItem key={idx} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
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
            value={states.find((s) => s.state_code === data?.state?.state_code) || null}
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
            //   value={states.find((c) => c.city_code === data?.city?.city_code) || null}
            value={cities.find((city) => city.city_code === selectedCity) || null}
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
            value={sector.find((s) => s.sector_code === watch('sector_id')) || null}
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
          <Stack direction="row" spacing={2}>
            {/* Tampilkan gambar dari API */}
            {defaultImages.map((url, index) => (
              <img
                key={`default-${index}`}
                src={url}
                alt={`default-preview-${index}`}
                width={80}
                height={80}
                style={{ borderRadius: 8, objectFit: 'cover' }}
              />
            ))}

            {/* Tampilkan gambar yang dipilih user */}
            {selectedImages.map((file, index) => (
              <img
                key={`selected-${index}`}
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
                'undo redo | bold italic | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
            }}
          />
          <TextField
            select
            {...register('payment_type', { required: true })}
            label="Tipe Pembayaran"
            fullWidth
            required
            value={watch('payment_type') || ''}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>
          <Typography sx={{ mb: 2 }}>Fasilitas Property : </Typography>
          <FormGroup>
            {facilities?.map((facility) => (
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
            ))}
          </FormGroup>
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
