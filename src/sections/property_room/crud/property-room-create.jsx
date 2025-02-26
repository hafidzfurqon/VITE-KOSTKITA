  import { Button, Box, Container, Stack, Typography, TextField, FormLabel, Autocomplete } from "@mui/material";
  import { Controller, useForm } from "react-hook-form";
  import { useEffect, useState } from "react";
  import "react-quill/dist/quill.snow.css";
  import { MenuItem } from "@mui/material";
  import { FormControlLabel } from "@mui/material";
  import { Switch } from "@mui/material";
  import { useQueryClient } from "@tanstack/react-query";
  import { useSnackbar } from "notistack";
  import { useRouter } from "src/routes/hooks";
  import { Link, useParams } from "react-router-dom";
  import { router } from "src/hooks/routing/useRouting";
  import { InputAdornment } from "@mui/material";
  import { NumericFormat } from "react-number-format";
  import { useDropzone } from "react-dropzone";
import { useFetchFacilities } from "src/hooks/facilities";
import Loading from "src/components/loading/loading";
import { Checkbox } from "@mui/material";
import { FormGroup } from "@mui/material";
import { useFetchAllPropertyType } from "src/hooks/property_type";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useMutationCreatePropertyRoom } from "src/hooks/property_room";


  export const PropertyRoomCreate = () => {
    const {id} = useParams();
    const {data : facilities, isLoading, isFetching} = useFetchFacilities();
    const {data : property_type, isLoading : loadingPropertyType, isFetching : FetchingPropertyType} = useFetchAllPropertyType();
    
    const {
      control,
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({defaultValues: {
      facilities: [],
    },});
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(false);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const routers = useRouter();
    const [selectedImages, setSelectedImages] = useState([]);

    const handleCheckboxChange = (facilityId) => {
      const currentFacilities = watch('facilities') || []; // Ambil value saat ini
      const updatedFacilities = currentFacilities.includes(facilityId)
        ? currentFacilities.filter(id => id !== facilityId)
        : [...currentFacilities, facilityId];
    
      setValue('facilities', updatedFacilities); // Update nilai dengan array baru
    }

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

    const {mutate, isPending} = useMutationCreatePropertyRoom({
      onSuccess : () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.property-room', id] });
        routers.push(`/property/property-room/${id}`);
        enqueueSnackbar('Property Room berhasil dibuat', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Property Room gagal dibuat', { variant: 'error' });
      },
    })
    const Submitted = (data) => {
      // console.log("Data sebelum dikirim:", data);
    
      const formData = new FormData();
      
      // Pastikan `property_id` ada
      if (id) {
        formData.append("property_id", id);
      }
    
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(`${key}[]`, item));
        } else if (key === "price") {
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
    if ( isLoading||isFetching || loadingPropertyType || FetchingPropertyType) {
      return <Loading/>
    }
    return (
      <Container>
        <Typography variant="h3" sx={{ mb: 5 }}>
          Tambah Property Room
        </Typography>
        <CustomBreadcrumbs 
                          links={[{ name: 'Property', href: '/property' }, { name: 'Property Room',href: `/property/property-room/${id}`}, { name: 'Create Property Room',}]} 
                          sx={{ mb: { xs: 2, md: 3 } }} 
                          action={null} 
                          heading="" 
                          moreLink={[]} 
                          activeLast={true} 
                          />
        <Box component="form" onSubmit={handleSubmit(Submitted)}>
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
            <Typography>Status : </Typography>
            <FormControlLabel
              control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
              label={isActive ? 'Available' : 'Non-Available'}
            />
           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
          {...register("land_area", { required: "Luas tanah Wajib Diisi" })}
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
            <Typography sx={{ mb : 2}}>Fasilitas Property : </Typography>
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
          <Button type="submit" disabled={isPending} variant="contained" sx={{ mt: 3, mb:5, mr : 3 }}>
            Submit
          </Button>
          <Link to={router.property.list}>
          <Button type="button" variant="outlined" sx={{ mt: 3, mb:5 }}>
            Kembali
          </Button>
          </Link>
        </Box>
      </Container>
    );
  };
