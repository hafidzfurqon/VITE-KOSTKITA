import {
  Button,
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Grid,
  IconButton,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useForm } from 'react-hook-form';
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
import { useDropzone } from 'react-dropzone';
import Loading from 'src/components/loading/loading';
import { Checkbox } from '@mui/material';
// import { useFetchAllPropertyType } from 'src/hooks/property_type';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useMutationCreatePropertyRoom } from 'src/hooks/property_room';
import { useFetchAllRoomFacilities } from 'src/hooks/room-facilities';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllPropertyRoomType } from 'src/hooks/property-room-type';
import { Card } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { Iconify } from 'src/components/iconify';
import { useDebounce } from 'src/hooks/use-debounce';
import { NumericFormat } from 'react-number-format';
// import { useFetchAllPropertyTypeOwner } from 'src/hooks/owner/useFetchAllTypePropertyOwner';

const initialRows = [
  { name: 'Harian' },
  { name: '1 Bulan' },
  { name: '3 Bulan' },
  { name: '6 Bulan' },
  { name: '12 Bulan / 1 Tahun' },
];

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
    data: property_room_type = [],
    isLoading: loadingPropertyType,
    isFetching: FetchingPropertyType,
  } = useFetchAllPropertyRoomType(isOwnerProperty);

  const {
    // control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // console.log(errors)

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

  const handleHargaAsliChange = (index, value) => {
    const hargaAsli = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    const hargaDiskonRaw = rows[index].hargaDiskon;
    const hargaDiskon = hargaDiskonRaw
      ? parseFloat(hargaDiskonRaw.replace(/\./g, '').replace(',', '.')) || 0
      : null;

    const diskonPersen =
      hargaDiskon !== null && hargaAsli
        ? (((hargaAsli - hargaDiskon) / hargaAsli) * 100).toFixed(0)
        : '';

    updateRow(index, {
      hargaAsli: value,
      diskonPersen: hargaDiskon !== null ? diskonPersen : '',
    });
  };

  const handleHargaDiskonChange = (index, value) => {
    const hargaDiskon = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    const hargaAsliRaw = rows[index].hargaAsli;
    const hargaAsli = hargaAsliRaw
      ? parseFloat(hargaAsliRaw.replace(/\./g, '').replace(',', '.')) || 0
      : null;

    const diskonPersen =
      hargaAsli !== null && hargaAsli
        ? (((hargaAsli - hargaDiskon) / hargaAsli) * 100).toFixed(0)
        : '';

    updateRow(index, {
      hargaDiskon: value,
      diskonPersen: hargaAsli !== null ? diskonPersen : '',
    });
  };

  const handleDiskonPersenChange = (index, value) => {
    const persen = parseFloat(value) || '';
    const hargaAsli = parseFloat(rows[index].hargaAsli.replace(/\./g, '').replace(',', '.')) || 0;
    const hargaDiskon = hargaAsli ? hargaAsli - (hargaAsli * persen) / 100 : '';

    updateRow(index, {
      diskonPersen: value,
      hargaDiskon: hargaDiskon ? hargaDiskon.toFixed(0) : '',
    });
  };

  const updateRow = (index, updatedValues) => {
    setRows((prevRows) => {
      const updated = [...prevRows];
      updated[index] = { ...updated[index], ...updatedValues };
      return updated;
    });
  };

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

  const areaSize = watch('area_width');
  const lebar = watch('area_length');

  const debouncedAreaSize = useDebounce(areaSize, 300);
  const debouncedLebar = useDebounce(lebar, 300);

  useEffect(() => {
    const panjangNum = parseFloat((debouncedAreaSize || '').toString().replace(',', '.'));
    const lebarNum = parseFloat((debouncedLebar || '').toString().replace(',', '.'));

    if (!isNaN(panjangNum) && !isNaN(lebarNum) && panjangNum > 0 && lebarNum > 0) {
      const luas = panjangNum * lebarNum;
      setValue('luas_asli_kamar', luas.toFixed(2));
    } else {
      setValue('luas_asli_kamar', '');
    }
  }, [debouncedAreaSize, debouncedLebar, setValue]);

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
    console.log('Data sebelum dikirim:', data);

    const formData = new FormData();

    // Pastikan `property_id` ada
    if (id) {
      formData.append('property_id', id);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    });

    const durations = ['dayly', '1_month', '3_month', '6_month', '1_year'];

    rows.forEach((row, index) => {
      const hargaAsli = parseInt(row.hargaAsli.replace(/\./g, '').replace(',', '.'), 10) || 0;
      const hargaDiskon = parseInt(row.hargaDiskon.replace(/\./g, '').replace(',', '.'), 10) || 0;
      const diskonPersen = parseFloat(row.diskonPersen) || 0;

      formData.append(`prices[${index}][price_name]`, initialRows[index]?.key || `harga_${index}`);
      formData.append(`prices[${index}][price_type]`, 'per_duration');
      formData.append(`prices[${index}][duration]`, durations[index]);
      formData.append(`prices[${index}][price]`, hargaAsli);

      if (diskonPersen > 0) {
        formData.append(`prices[${index}][discounts][0][discount_type]`, 'percentage');
        formData.append(`prices[${index}][discounts][0][discount_value]`, diskonPersen);
      }
    });

    // Debug
    for (const pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    mutate(formData);
  };

  if (isLoading || isFetching || loadingPropertyType || FetchingPropertyType) {
    return <Loading />;
  }
  return (
    <Box sx={{ px: '2rem' }}>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Tambah Ruangan di properti
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
              </Stack>
              <Typography>Status : </Typography>
              <FormControlLabel
                control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
                label={isActive ? 'Aktif' : 'Tidak Aktif'}
              />
              {/* </Stack> */}
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
                      <TableCell align="center">Harga Awal</TableCell>
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
                Detail Ruangan
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

              {/* <TextField
                {...register('luas_seluruh_kamar')}
                margin="dense"
                placeholder="Luas kamar diambil dari panjang × area_length"
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                }}
              /> */}
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
