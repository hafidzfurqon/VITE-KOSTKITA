import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';
import { useDeleteBanner, useUpdateBanner } from 'src/hooks/banner';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { Autocomplete, AutocompleteChangeDetails, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FormLabel } from '@mui/material';
import { DialogUpdate } from 'src/component/DialogUpdate';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useFetchPromo } from 'src/hooks/promo';
import { OnValueChange } from 'react-number-format';

// ----------------------------------------------------------------------

export type UserProps = {
  id?: undefined | any | number;
  title: string;
  property: any;
  promo: any;
  // name : string;
  type: string;
  status: string;
  property_id?: number;
  promo_id?: number;
  image_path: string;
  image_url: string;
  url_reference: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: any;
  onSelectRow: () => void;
};

export function BannerTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const { data, isLoading: isLoadingProperty } = useListProperty();
  const { data: dataPromo, isLoading: isLoadingPromo } = useFetchPromo();
  const defaultValues = {
    title: row?.title || '',
    type: row?.promo?.id ? 'reference_to_promo' : 'reference_to_property',
    status:
      row?.promo?.status === 'active' || row?.property?.status === 'active' ? 'active' : 'inactive',
    promo_id: row?.promo?.id || '',
    property_id: row?.property?.id || '',
  };
  const handleClickOpen = () => {
    reset(defaultValues);
    setOpen(true);
  };
  const [isActive, setIsActive] = useState<any>(defaultValues.status === 'active' || 'available');
  const [selectedType, setSelectedType] = useState(defaultValues.type);
  const handleClickOpened = () => {
    setOpened(true);
  };

  const {
    register,
    handleSubmit: handleSubmitForm,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      type: '',
      status: '',
      property_id: '',
      promo_id: '',
    },
  });

  useEffect(() => {
    if (row) {
      const updatedValues = {
        title: row?.title || '',
        type: row?.promo?.id ? 'reference_to_promo' : 'reference_to_property',
        status:
          row?.promo?.status === 'active' || row?.property?.status === 'active'
            ? 'active'
            : 'inactive',
        promo_id: row?.promo?.id || '',
        property_id: row?.property?.id || '',
      };

      reset(updatedValues);

      // Set nilai state agar sesuai dengan default
      setIsActive(updatedValues.status === 'active' || 'available');
      setSelectedType(updatedValues.type);
    }
  }, [row, reset]);

  useEffect(() => {
    setIsActive(watch('status') === 'active' || 'available');
  }, [watch('status')]);

  const handleToggle = (event: any | HTMLInputElement) => {
    const status = event.target.checked ? 'active' : 'non-active';
    setIsActive(event.target.checked);
    setValue('status', status); // Simpan status ke react-hook-form
  };
  const FieldRHF = (
    <>
      <TextField
        {...register('title')}
        autoFocus
        required
        margin="dense"
        id="nama"
        label="Nama Fasilitas"
        type="text"
        fullWidth
        variant="outlined"
      />
      <TextField
        select
        {...register('type', { required: true })}
        label="Banner diambil dari"
        fullWidth
        required
        value={watch('type')} // Pastikan menggunakan watch agar sesuai dengan reset
        onChange={(e) => {
          setSelectedType(e.target.value);
          setValue('type', e.target.value);
        }}
      >
        <MenuItem value="reference_to_property">Property</MenuItem>
        <MenuItem value="reference_to_promo">Promo</MenuItem>
      </TextField>

      <Typography>Status : </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isActive}
            onChange={(e: any) => {
              const newStatus = e.target.checked ? 'active' : 'inactive';
              setIsActive(e.target.checked);
              setValue('status', newStatus);
            }}
            size="medium"
          />
        }
        label={isActive ? 'Active' : 'Inactive'}
      />

      <Autocomplete
        options={selectedType === 'reference_to_promo' ? dataPromo || [] : data || []}
        getOptionLabel={(option) => option?.name ?? ''}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        value={
          selectedType === 'reference_to_promo'
            ? dataPromo?.find((p: any) => p.id === row?.promo?.id) || null
            : data?.find((p: any) => p.id === row?.property?.id) || null
        }
        onChange={(_, value) => {
          setSelectedState(value ? value.id : null);
          setValue(
            selectedType === 'reference_to_promo' ? 'promo_id' : 'property_id',
            value ? value.id : ''
          );
        }}
        renderInput={(params) => <TextField {...params} label="Nama Promo atau Property" />}
      />
    </>
  );
  const { mutate: UpdateBanner, isPending: isLoading } = useUpdateBanner(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['list.banner'] });
        setOpen(false);
        enqueueSnackbar('Banner berhasil diupdate', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('gagal mengupdate banner', { variant: 'error' });
      },
    },
    row.id
  );

  // const handleClose = () => {
  //   setOpened(false);
  // };

  const handleCreate = (data: any) => {
    const { ...rest } = data;
    const formData: any = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // formData.append('image', gambar[0]);
    formData.append('_method', 'PUT');
    UpdateBanner(formData);
    reset(data);
    // handleClose();
  };
  const { mutate: DeleteBanner, isPending } = useDeleteBanner({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      // reset(data)
      setOpen(false);
      enqueueSnackbar('Banner berhasil dihapus', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal menghapus banner', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    DeleteBanner(row.id);
  };
  console.log(row);
  const renderCover = (
    <Box
      component="img"
      alt={row.title}
      src={row.promo?.promo_image_url || row.property?.files?.[0]?.file_url}
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
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center" component="th" scope="row">
          {/* <Box gap={2} display="flex" alignItems="center"> */}

          {renderCover}
          {/* </Box> */}
        </TableCell>

        <TableCell align="center">{row.title}</TableCell>

        <TableCell align="center">
          <Button onClick={handleClickOpened}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </Button>

          <Button onClick={handleClickOpen} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </Button>
        </TableCell>
      </TableRow>

      <DialogDelete
        title="yakin untuk menghapus banner ?"
        description="data yang telah di hapus tidak akan kembali"
        setOpen={setOpen}
        open={open}
        Submit={handleSubmit}
        pending={isPending}
      />

      <DialogUpdate
        pending={isLoading}
        SubmitFormValue={handleCreate}
        open={opened}
        title="Update Banner"
        subTitle="Update Banner yang berada di Halaman Home Page"
        setOpen={setOpened}
        field={FieldRHF}
        SubmitForm={handleSubmitForm}
      />
    </>
  );
}
