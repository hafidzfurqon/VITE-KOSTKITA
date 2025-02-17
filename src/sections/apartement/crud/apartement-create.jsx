  import { Button, Box, Container, Stack, Typography, TextField, FormLabel, Autocomplete } from "@mui/material";
  import { Controller, useForm } from "react-hook-form";
  import ReactQuill from "react-quill";
  import { useEffect, useState } from "react";
  import "react-quill/dist/quill.snow.css";
  import { MenuItem } from "@mui/material";
  import { FormControlLabel } from "@mui/material";
  import { Switch } from "@mui/material";
  import { useQueryClient } from "@tanstack/react-query";
  import { useSnackbar } from "notistack";
  import { useRouter } from "src/routes/hooks";
  import { Link } from "react-router-dom";
  import { router } from "src/hooks/routing/useRouting";
  import { InputAdornment } from "@mui/material";
  import { NumericFormat } from "react-number-format";
  import { useGetState, useGetCity } from "src/hooks/property";
  import { useDropzone } from "react-dropzone";
import { useMutationCreateApartement } from "src/hooks/apartement";


  export const CreateApartement = () => {
    const {
      control,
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      defaultValues: {
        type: "Apartment", // Set default value langsung
      },
    });
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(false);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const routers = useRouter();
    const [selectedImages, setSelectedImages] = useState([]);

    // ✅ Handle file selection
    const handleFileChange = (event) => {
      const files = event.target.files;
      if (!files.length) return;
  
      // Konversi FileList ke array
      const imageFiles = Array.from(files);
      setSelectedImages(imageFiles);
  
      // Simpan ke react-hook-form
      setValue("files", imageFiles);
    };
    const handleToggle = (event) => {
      const status = event.target.checked ? 'available' : 'non-available';
      setIsActive(event.target.checked);
      setValue('status', status); // Simpan status ke react-hook-form
    };
    // Menyimpan value ke state & React Hook Form
    const handleQuillChange = (value) => {
      setDescription(value);
      setValue('description', value); // Update value untuk react-hook-form
    };
    const [selectedState, setSelectedState] = useState(null);
    const { data: states = [], isLoading: isLoadingStates } = useGetState();
    const { data: cities = [], isLoading: loadingCities } = useGetCity(selectedState);

    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
    } = useDropzone({
      accept: "image/*",
      multiple: true,
      maxFiles: 5,
      onDrop: (acceptedFiles) => {
        setSelectedImages(acceptedFiles);
        setValue("files", acceptedFiles);
      },
    });

    const {mutate, isPending} = useMutationCreateApartement({
      onSuccess : () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
        routers.push('/apartement');
        enqueueSnackbar('Apartement berhasil dibuat', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Apartement gagal dibuat', { variant: 'error' });
      },
    })
    const Submitted = (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "files") {
          value.forEach((file) => formData.append("files[]", file)); // ✅ Kirim semua file
        } else {
          formData.append(key, value);
        }
      });
      formData.append('price', cleanPrice(data.price));
      mutate(formData);
    };
    const cleanPrice = (price) => {
      return parseInt(price.replace(/[^\d]/g, ''), 10);
    };
    return (
      <Container>
        <Typography variant="h3" sx={{ mb: 5 }}>
          Tambah Apartement
        </Typography>
        <Box component="form" onSubmit={handleSubmit(Submitted)}>
        <input type="hidden" {...register("type")} />
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                {...register('name', { required: 'Nama Wajib Diisi' })}
                margin="dense"
                id="name"
                label="Nama Apartement"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            <TextField
          {...register("land_area", { required: "Luas tanah Wajib Diisi" })}
          margin="dense"
          id="land_area"
          label="Luas tanah"
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
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
            <TextField
          {...register("total_floors", { required: "Total Lantai Wajib Diisi" })}
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
              type="text"
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
            setValue("state_id", value ? value.state_code : "");
          }}
          renderInput={(params) => <TextField {...params} label="Provinsi" fullWidth variant="outlined" />}
        />

        {/* Pilih Kota / Kabupaten */}
        <Autocomplete
    options={cities || []}
    getOptionLabel={(option) => option.name}
    isOptionEqualToValue={(option, value) => option.city_code === value.city_code}
    loading={loadingCities}
    disabled={!selectedState} // Hanya aktif jika provinsi sudah dipilih
    // onChange={(_, value) => setValue("city_id", value ? value.city_code : "")}
    onChange={(_, value) => setValue("city_id", 3201)}
    renderInput={(params) => <TextField {...params} label="Kab / Kota" fullWidth variant="outlined" />}
  />
        {/* </Stack> */}

     <FormLabel>Upload Images (Max 5)</FormLabel>
<Box
  {...getRootProps()}
  sx={{
    border: "2px dashed #ccc",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    borderRadius: "8px",
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
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            ))}
          </Stack>
            <Typography>Deskripsi : </Typography>
            <ReactQuill theme="snow" value={description} onChange={handleQuillChange} />
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
          </Stack>
          <Button type="submit" disabled={isPending} variant="contained" sx={{ mt: 3, mb:5, mr : 3 }}>
            Submit
          </Button>
          <Link to={router.apartement.list}>
          <Button type="button" variant="outlined" sx={{ mt: 3, mb:5 }}>
            Kembali
          </Button>
          </Link>
        </Box>
      </Container>
    );
  };
