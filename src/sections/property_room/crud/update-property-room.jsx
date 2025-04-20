import {
  Button,
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useFetchAllPropertyRoomDetail,
  useMutationUpdatePropertyRoom,
} from 'src/hooks/property_room';
import { useFetchAllRoomFacilities } from 'src/hooks/room-facilities';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllPropertyRoomType } from 'src/hooks/property-room-type';
import { Grid } from '@mui/material';
import { Card } from '@mui/material';
import { IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import ImageIcon from '@mui/icons-material/Image';

const initialRows = [
  { name: 'Harian' },
  { name: '1 Bulan' },
  { name: '3 Bulan' },
  { name: '6 Bulan' },
  { name: '12 Bulan / 1 Tahun' },
];

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
  console.log(data);

  const {
    data: property_room_type = [],
    isLoading: loadingPropertyType,
    isFetching: FetchingPropertyType,
  } = useFetchAllPropertyRoomType(isOwnerProperty);

  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);
  const [rows, setRows] = useState(
    initialRows.map(() => ({
      hargaAsli: '',
      hargaDiskon: '',
      diskonPersen: '',
    }))
  );
  const inputRef = useRef();
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
      area_width: '',
      area_length: '',
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
      setValue('area_width', data.area_width || '');
      setValue('area_length', data.area_length || '');
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
      setDefaultImages(formattedImages);
      setValue(
        'existing_files',
        formattedImages.map((file) => file.id)
      );
    }
  }, [data, setValue]);

  useEffect(() => {
    if (data && data.room_prices) {
      const durationMap = {
        Harian: 'dayly',
        '1 Bulan': '1_month',
        '3 Bulan': '3_month',
        '6 Bulan': '6_month',
        '12 Bulan / 1 Tahun': '1_year', // <- perbaiki di sini!
      };

      const updatedRows = initialRows.map((row) => {
        const matched = data.room_prices.find((price) => price.duration === durationMap[row.name]);

        const hargaAsli = matched ? matched.price.toString() : '';
        const diskonObj = matched?.room_discounts?.[0];

        const diskonPersen = diskonObj?.discount_value || '';
        const hargaDiskon =
          hargaAsli && diskonPersen
            ? ((+matched.price * (100 - +diskonPersen)) / 100).toString()
            : '';
        return {
          hargaAsli,
          hargaDiskon,
          diskonPersen,
        };
      });

      setRows(updatedRows);
    }
  }, [data]);

  const [defaultImages, setDefaultImages] = useState([]);

  const handleHargaAsliChange = (index, value) => {
    const hargaAsli = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    const hargaDiskon = parseFloat(rows[index].hargaDiskon) || 0;
    const diskonPersen = hargaAsli
      ? (((hargaAsli - hargaDiskon) / hargaAsli) * 100).toFixed(0)
      : '';

    updateRow(index, { hargaAsli: value, diskonPersen });
  };

  const handleHargaDiskonChange = (index, value) => {
    const hargaDiskon = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    const hargaAsli = parseFloat(rows[index].hargaAsli.replace(/\./g, '').replace(',', '.')) || 0;
    const diskonPersen = hargaAsli
      ? (((hargaAsli - hargaDiskon) / hargaAsli) * 100).toFixed(0)
      : '';

    updateRow(index, { hargaDiskon: value, diskonPersen });
  };

  const handleDiskonPersenChange = (index, value) => {
    const persen = parseFloat(value) || '';
    const hargaAsli = parseFloat(rows[index].hargaAsli.replace(/\./g, '').replace(',', '.')) || 0;
    const hargaDiskon = hargaAsli ? (hargaAsli - (hargaAsli * persen) / 100).toFixed(0) : '';

    updateRow(index, {
      diskonPersen: value,
      hargaDiskon: hargaDiskon ? hargaDiskon.toString() : '',
    });
  };

  const updateRow = (index, updatedValues) => {
    setRows((prevRows) => {
      const updated = [...prevRows];
      updated[index] = { ...updated[index], ...updatedValues };
      return updated;
    });
  };
  // const existingFileIdss = defaultImages.map((img) => img.id);
  // console.log(defaultImages.map((img) => img.name));
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
  const handleDeleteImage = (index) => {
    const isFromDefault = Boolean(defaultImages[index]);
    const isFromSelected = Boolean(selectedImages[index]);

    if (isFromDefault) {
      const newDefaults = [...defaultImages];
      newDefaults[index] = undefined;
      setDefaultImages(newDefaults);

      // Update form value agar tidak kirim ID gambar yang dihapus
      const filteredIds = newDefaults.filter(Boolean).map((img) => img.id);
      setValue('existing_files', filteredIds);
    }

    if (isFromSelected) {
      const newSelected = [...selectedImages];
      newSelected[index] = undefined;
      setSelectedImages(newSelected);
    }
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      const newSelectedImages = [...selectedImages];

      acceptedFiles.forEach((file) => {
        // Cari index slot kosong (yang bukan selected dan bukan default)
        const nextEmptyIndex = [...Array(10).keys()].find(
          (i) => !selectedImages[i] && !defaultImages[i]
        );

        if (nextEmptyIndex !== undefined) {
          newSelectedImages[nextEmptyIndex] = file;
        }
      });

      setSelectedImages(newSelectedImages);
      setValue('files', newSelectedImages.filter(Boolean)); // hanya yang terisi
    },
  });

  const dataProperty = data?.property?.id;
  const { mutate, isPending } = useMutationUpdatePropertyRoom(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.property-room', id] });
        routers.push(`/property/property-room/${dataProperty}`);
        enqueueSnackbar('Property Room berhasil di update', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Property Room gagal di update', { variant: 'error' });
      },
    },
    isOwnerProperty,
    id
  );

  const Submitted = (data) => {
    console.log(data);
    const formData = new FormData();

    const appendArrayToFormData = (formData, key, array) => {
      array.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    };

    const durations = ['dayly', '1_month', '3_month', '6_month', '1_year'];
    rows.forEach((row, index) => {
      const hargaAsli = row.hargaAsli?.replace(/\./g, '').replace(',', '.') || '';
      const diskonPersen = row.diskonPersen || '';

      formData.append(`prices[${index}][price_name]`, `harga_${index}`);
      formData.append(`prices[${index}][price_type]`, 'per_duration');
      formData.append(`prices[${index}][duration]`, durations[index]);
      formData.append(`prices[${index}][price]`, hargaAsli);

      if (diskonPersen) {
        formData.append(`prices[${index}][discounts][0][discount_type]`, 'percentage');
        formData.append(`prices[${index}][discounts][0][discount_value]`, diskonPersen);
      }
    });

    mutate(formData);
    formData.append('property_id', dataProperty);
    // formData.append('property_room_id', id);
    formData.append('_method', 'PUT');

    // ✅ Gunakan filtered defaultImages
    const existingFileIds = defaultImages.filter(Boolean).map((img) => img.id);

    appendArrayToFormData(formData, 'existing_files', existingFileIds);

    mutate(formData);
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
    <Box sx={{ px: '2rem' }}>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Update Property Room ({data.name})
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
                  label="Nama Property Room"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
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
              </Stack>
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
                Harga
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                  <caption>Harga per tipe (harian & bulanan)</caption>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipe Harga</TableCell>
                      <TableCell align="center">Harga Asli</TableCell>
                      <TableCell align="center">Harga Diskon</TableCell>
                      <TableCell align="center">Diskon (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {initialRows.map((field, index) => (
                      <TableRow key={index}>
                        <TableCell>{field.name}</TableCell>

                        {/* Harga Asli */}
                        <TableCell align="center">
                          <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={rows[index].hargaAsli}
                            onValueChange={(values) => handleHargaAsliChange(index, values.value)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                          />
                        </TableCell>

                        {/* Harga Diskon */}
                        <TableCell align="center">
                          <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={rows[index].hargaDiskon}
                            onValueChange={(values) => handleHargaDiskonChange(index, values.value)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                          />
                        </TableCell>

                        {/* Diskon % */}
                        <TableCell align="center">
                          <Box
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'start',
                            }}
                          >
                            <TextField
                              fullWidth
                              type="number"
                              value={rows[index].diskonPersen}
                              onChange={(e) => handleDiskonPersenChange(index, e.target.value)}
                              InputProps={{
                                endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              }}
                            />

                            {/* Potongan */}
                            <Typography variant="caption" color="textSecondary" mt={1}>
                              {rows[index].hargaAsli && rows[index].hargaDiskon
                                ? `Potongan Rp${(
                                    parseFloat(
                                      rows[index].hargaAsli.replace(/\./g, '').replace(',', '.')
                                    ) -
                                    parseFloat(
                                      rows[index].hargaDiskon.replace(/\./g, '').replace(',', '.')
                                    )
                                  )
                                    .toLocaleString('id-ID')
                                    .replace(',', '.')}`
                                : ''}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Container>
        </Card>
        <Card sx={{ mt: 5 }}>
          <Container>
            <Stack spacing={3} sx={{ px: 3, py: 3 }}>
              <Typography variant="subtitle1" sx={{ py: 2 }}>
                Alamat Property
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  {...register('area_width', { required: 'Panjang kamar wajib diisi' })}
                  margin="dense"
                  id="area_width"
                  label="Lebar Kamar"
                  type="number"
                  inputMode="numeric"
                  fullWidth
                  variant="outlined"
                  error={!!errors.area_width}
                  helperText={errors.area_width?.message}
                />

                <TextField
                  {...register('area_length', { required: 'Lebar kamar wajib diisi' })}
                  margin="dense"
                  id="area_length"
                  label="Panjang Kamar"
                  type="number"
                  inputMode="numeric"
                  fullWidth
                  variant="outlined"
                  error={!!errors.area_length}
                  helperText={errors.area_length?.message}
                />
              </Stack>

              <TextField
                {...register('luas_seluruh_kamar')}
                margin="dense"
                placeholder="Luas kamar diambil dari panjang × Lebar"
                value={data.area_length * data.area_width}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                }}
              />

              <TextField
                {...register('capacity')}
                margin="dense"
                label="Kapasitas Orang"
                multiline
                // rows={4}
                fullWidth
                variant="outlined"
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

                {[...Array(10)].map((_, index) => {
                  const isDefault = defaultImages[index];
                  const isSelected = selectedImages[index];

                  return (
                    <Box
                      key={index}
                      onClick={() => !isSelected && !isDefault && inputRef.current.click()}
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
                      {isSelected || isDefault ? (
                        <>
                          <Box
                            component="img"
                            src={isSelected ? URL.createObjectURL(isSelected) : isDefault.url}
                            alt={`Foto ${index + 1}`}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 2,
                            }}
                          />

                          {/* Tombol Hapus untuk gambar user atau default */}
                          {(isSelected || isDefault) && (
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
                          )}
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
                  );
                })}
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
              <Typography sx={{ mb: 2 }}>Fasilitas Bersama : </Typography>
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
              {/* </Stack> */}
            </Stack>
          </Container>
        </Card>
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
