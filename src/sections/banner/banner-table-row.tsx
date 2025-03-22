import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Box,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Checkbox,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';
import { useUpdateBanner, useDeleteBanner } from 'src/hooks/banner';
import { DialogUpdate } from 'src/component/DialogUpdate';
export type UserProps = {
  id?: undefined | any | number;
  title: string;
  property: any;
  promo: any;
  // name : string;
  type: string;
  status: boolean | any;
  property_id?: number;
  promo_id?: number;
  image_path: any;
  image_url: any;
  url_reference: string;
};

type BannerProps = {
  row: UserProps;
};

export function BannerTableRow({ row }: BannerProps) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isActive, setIsActive] = useState(row?.status === 'active');
  const [image, setImage] = useState(row.image_url || '');

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: row?.title || '',
      status: row?.status || 'inactive',
      image: row?.image_url || '',
    },
  });

  useEffect(() => {
    if (row) {
      reset({
        title: row?.title || '',
        status: row?.status || 'inactive',
        image: row?.image_url || '',
      });
      setIsActive(row?.status === 'active');
    }
  }, [row, reset]);

  const handleToggle = (event: ChangeEvent | HTMLInputElement | any) => {
    const status = event.target.checked ? 'active' : 'inactive';
    setIsActive(event.target.checked);
    setValue('status', status);
  };

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      setValue('image', file);
    },
    [setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const removeImage = () => {
    setImage('');
    setValue('image', '');
  };

  const { mutate: UpdateBanner, isPending: isLoading } = useUpdateBanner(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['list.banner'] });
        setOpen(false);
        enqueueSnackbar('Banner berhasil diupdate', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Gagal mengupdate banner', { variant: 'error' });
      },
    },
    row.id
  );

  const handleCreate = (data: any) => {
    const formData: any = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('_method', 'PUT');
    formData.append('type', 'general');
    UpdateBanner(formData);
    reset(data);
  };

  const { mutate: DeleteBanner, isPending } = useDeleteBanner({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      setOpen(false);
      enqueueSnackbar('Banner berhasil dihapus', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Gagal menghapus banner', { variant: 'error' });
    },
  });

  const handleSubmitDelete = () => {
    DeleteBanner(row.id);
  };
  const renderCover = (
    <Box
      component="img"
      alt={row.title}
      src={row.image_url || ''}
      sx={{
        top: 0,
        width: 100,
        height: 1,
        objectFit: 'cover',
        borderRadius: '10px',
        // position: 'absolute',
      }}
    />
  );

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        {/* <TableRow hover> */}
        <TableCell padding="checkbox">
          <Checkbox disableRipple />
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {/* <Box gap={2} display="flex" alignItems="center"> */}

          {renderCover}
          {/* </Box> */}
        </TableCell>
        <TableCell align="center">{row.title}</TableCell>
        <TableCell align="center">
          <Button onClick={() => setOpened(true)}>
            <Iconify icon="solar:pen-bold" /> Edit
          </Button>
          <Button onClick={() => setOpen(true)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" /> Delete
          </Button>
        </TableCell>
        {/* </TableRow> */}
      </TableRow>

      <DialogDelete
        title="Yakin untuk menghapus banner?"
        description="Data yang telah dihapus tidak akan kembali."
        setOpen={setOpen}
        open={open}
        Submit={handleSubmitDelete}
        pending={isPending}
      />

      <DialogUpdate
        pending={isLoading}
        SubmitFormValue={handleCreate}
        open={opened}
        title="Update Banner"
        subTitle="Update Banner yang berada di Halaman Home Page"
        setOpen={setOpened}
        field={
          <>
            <TextField {...register('title')} required fullWidth label="Judul" variant="outlined" />
            <Typography>Status:</Typography>
            <FormControlLabel
              control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
              label={isActive ? 'Active' : 'Inactive'}
            />
            <Box
              {...getRootProps()}
              sx={{ border: '2px dashed gray', p: 2, textAlign: 'center', cursor: 'pointer' }}
            >
              <input {...getInputProps()} />
              <Typography>Drag & Drop gambar di sini atau klik untuk memilih</Typography>
            </Box>
            {image && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={image}
                  alt="Preview"
                  width="100%"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
                <Button onClick={removeImage} variant="contained" color="error" sx={{ mt: 1 }}>
                  Hapus Gambar
                </Button>
              </Box>
            )}
          </>
        }
        SubmitForm={handleSubmit}
      />
    </>
  );
}
